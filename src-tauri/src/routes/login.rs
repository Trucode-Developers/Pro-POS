// use bcrypt::{hash, verify, DEFAULT_COST};
use crate::db_connections::{update_file, DbPool, PoolType};
use crate::routes::roles::get_allocated_permission_slugs;
use bcrypt::verify;
use bcrypt::{hash, DEFAULT_COST};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use tauri::State;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct Credentials {
    pub email: String,
    pub password: String,
}

// #[derive(sqlx::FromRow)]
// struct UserRow {
//     id: i32,
// }

#[tauri::command]
pub async fn login(credentials: Credentials, state: State<'_, DbPool>) -> Result<Value, Value> {
    let email = credentials.email;
    let password = credentials.password;

    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "SELECT serial_number, password FROM users WHERE email = $1";
            let result = sqlx::query_as::<_, (String, String)>(query)
                .bind(&email)
                .fetch_one(pool)
                .await;
            match result {
                Ok((serial_number, db_password)) => {
                    if verify(&password, &db_password).unwrap() {
                        _ = create_user_session(serial_number.clone(), state.clone()).await;
                        let permissions =
                            get_allocated_permission_slugs(serial_number.clone(), state.clone())
                                .await;
                        let _ = update_file(&serial_number.clone(), 2);
                        let json = json!({ "status": 200, "serial_number": serial_number, "permissions": permissions });
                        Ok(json)
                    } else {
                        let json =
                            json!({ "status": 201, "serial_number": null, "permissions": [] });
                        Ok(json)
                    }
                }
                Err(_) => {
                    let json = json!({ "status": 201, "serial_number": null, "permissions": [] });
                    Ok(json)
                }
            }
        }
        PoolType::SQLite(pool) => {
            let query = "SELECT serial_number, password FROM users WHERE email = ?";
            let result = sqlx::query_as::<_, (String, String)>(query)
                .bind(&email)
                .fetch_one(pool)
                .await;
            println!("{:?}", result);
            match result {
                Ok((serial_number, db_password)) => {
                    println!("Serial Number: {}", serial_number);
                    if verify(&password, &db_password).unwrap() {
                        _ = create_user_session(serial_number.clone(), state.clone()).await;
                        let permissions =
                            get_allocated_permission_slugs(serial_number.clone(), state.clone())
                                .await;
                        let json = json!({ "status": 200, "serial_number": serial_number, "permissions": permissions });
                        Ok(json)
                    } else {
                        let json =
                            json!({ "status": 201, "serial_number": null, "permissions": [] });
                        Ok(json)
                    }
                }
                Err(_) => {
                    let error = "User not found";
                    println!("{:?}", error);
                    let json = json!({ "status": 201, "serial_number": null, "permissions": [] });
                    Ok(json)
                }
            }
        }
    }
}

pub async fn create_user_session(
    serial_number: String,
    state: State<'_, DbPool>,
) -> Result<Value, Value> {
    let token = hash(serial_number.clone(), DEFAULT_COST).unwrap();

    match &state.pool {
        PoolType::Postgres(pool) => {
            let count: (i64,) =
                sqlx::query_as("SELECT COUNT(*) FROM users WHERE serial_number = $1")
                    .bind(&serial_number)
                    .fetch_one(pool)
                    .await
                    .unwrap_or((0,));

            if count.0 > 0 {
                let query = "INSERT INTO sessions (user_serial_number, token) VALUES ($1, $2) ON CONFLICT (user_serial_number) DO UPDATE SET token = $2";
                let _ = sqlx::query(query)
                    .bind(&serial_number)
                    .bind(&token)
                    .execute(pool)
                    .await;

                Ok(json!({ "status": 200, "token": token }))
            } else {
                Err(json!({ "status": 404, "message": "User not found" }))
            }
        }
        PoolType::SQLite(pool) => {
            let count: (i64,) =
                sqlx::query_as("SELECT COUNT(*) FROM users WHERE serial_number = ?")
                    .bind(&serial_number)
                    .fetch_one(pool)
                    .await
                    .unwrap_or((0,));

            if count.0 > 0 {
                let query =
                    "INSERT OR REPLACE INTO sessions (user_serial_number, token) VALUES (?, ?)";
                let _ = sqlx::query(query)
                    .bind(&serial_number)
                    .bind(&token)
                    .execute(pool)
                    .await;

                Ok(json!({ "status": 200, "token": token }))
            } else {
                Err(json!({ "status": 404, "message": "User not found" }))
            }
        }
    }
}

// pub async fn get_user_id(state: State<'_, DbPool>) -> i32 {
//     let serial_number = read_specific_line(2).unwrap();
//     print!("Serial Number: {}", serial_number);
//     //check is postgres or sqlite in users table where serial_number = serial_number return user.id else return 0
//     match &state.pool {
//         PoolType::Postgres(pool) => {
//             let query = "SELECT id FROM users WHERE serial_number = $1";
//             let result = sqlx::query_as::<_, UserRow>(query)
//                 .bind(&serial_number)
//                 .fetch_one(pool)
//                 .await;
//             match result {
//                 Ok(user) => user.id,
//                 Err(_) => 0,
//             }
//         }
//         PoolType::SQLite(pool) => {
//             let query = "SELECT id FROM users WHERE serial_number = ?";
//             let result = sqlx::query_as::<_, UserRow>(query)
//                 .bind(&serial_number)
//                 .fetch_one(pool)
//                 .await;
//             match result {
//                 Ok(user) => user.id,
//                 Err(_) => 0,
//             }
//         }
//     }
// }

//token is passed here as serial_number which is the user's serial number stored in cookies and encrypted by bcrypt hash before storing to db
pub async fn verify_session(serial_number: &str, state: State<'_, DbPool>) -> Option<String> {
    match &state.pool {
        PoolType::Postgres(pool) => {
            let session_query = "SELECT token FROM sessions WHERE user_serial_number = $1";
            let session_result = sqlx::query_as::<_, (String,)>(session_query)
                .bind(serial_number)
                .fetch_one(pool)
                .await;

            if let Ok((token,)) = session_result {
                if verify(&serial_number, &token).unwrap_or(false) {
                    let user_query = "SELECT staff_number FROM users WHERE serial_number = $1";
                    let user_result = sqlx::query_as::<_, (String,)>(user_query)
                        .bind(serial_number)
                        .fetch_one(pool)
                        .await;

                    if let Ok((staff_number,)) = user_result {
                        return Some(staff_number);
                    }
                }
            }

            None
        }
        PoolType::SQLite(pool) => {
            let session_query = "SELECT token FROM sessions WHERE user_serial_number = ?";
            let session_result = sqlx::query_as::<_, (String,)>(session_query)
                .bind(serial_number)
                .fetch_one(pool)
                .await;

            if let Ok((token,)) = session_result {
                if verify(&serial_number, &token).unwrap_or(false) {
                    let user_query = "SELECT staff_number FROM users WHERE serial_number = ?";
                    let user_result = sqlx::query_as::<_, (String,)>(user_query)
                        .bind(serial_number)
                        .fetch_one(pool)
                        .await;

                    if let Ok((staff_number,)) = user_result {
                        return Some(staff_number);
                    }
                }
            }

            None
        }
    }
}

// fn verify(serial_number: &str, token: &str) -> Result<bool, bcrypt::BcryptError> {
//     verify(serial_number, token)
// }
