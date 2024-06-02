use sqlx::Error;

// use bcrypt::{hash, verify, DEFAULT_COST};
use crate::db_connections::{DbPool, PoolType};
use crate::routes::roles::get_allocated_permission_slugs;
use crate::settings::global::{get_store_value, save_store_value};
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
                        let token = hash(serial_number.clone(), DEFAULT_COST).unwrap();
                        _ = create_user_session(
                            serial_number.clone(),
                            token.clone(),
                            state.clone(),
                        )
                        .await;
                        let permissions =
                            get_allocated_permission_slugs(serial_number.clone(), state.clone())
                                .await;
                        let _ = save_store_value("user_hashed_token".to_string(), token.clone());
                        let _ = save_store_value(
                            "user_serial_number".to_string(),
                            serial_number.clone(),
                        );

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
                    // println!("Serial Number: {}", serial_number);
                    if verify(&password, &db_password).unwrap() {
                        let token = hash(serial_number.clone(), DEFAULT_COST).unwrap();
                        _ = create_user_session(
                            serial_number.clone(),
                            token.clone(),
                            state.clone(),
                        )
                        .await;
                        let permissions =
                            get_allocated_permission_slugs(serial_number.clone(), state.clone())
                                .await;
                        let _ = save_store_value("user_hashed_token".to_string(), token.clone());
                        let _ = save_store_value(
                            "user_serial_number".to_string(),
                            serial_number.clone(),
                        );
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
    token: String,
    state: State<'_, DbPool>,
) -> Result<Value, Value> {
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

pub async fn verify_session(state: State<'_, DbPool>) -> String {
    let user_token_from_file = get_store_value("user_hashed_token".to_string()).unwrap_or_default();
    let serial_number = get_store_value("user_serial_number".to_string()).unwrap_or_default();
    let result: Result<String, Error> = match &state.pool {
        PoolType::Postgres(pool) => {
            let session_query = "SELECT token FROM sessions WHERE user_serial_number = $1";
            let token_result = sqlx::query_as::<_, (String,)>(session_query)
                .bind(&serial_number)
                .fetch_one(pool)
                .await;
            match token_result {
                Ok((token,)) => {
                    if user_token_from_file == token {
                        let user_query = "SELECT staff_number FROM users WHERE serial_number = $1";
                        sqlx::query_as::<_, (String,)>(user_query)
                            .bind(&serial_number)
                            .fetch_one(pool)
                            .await
                            .map(|(staff_number,)| staff_number)
                    } else {
                        println!("Postgres: Hashes do not match");
                        Err(Error::RowNotFound)
                    }
                }
                Err(e) => {
                    println!("Postgres session_query error: {:?}", e);
                    Err(e)
                }
            }
        }
        PoolType::SQLite(pool) => {
            let session_query = "SELECT token FROM sessions WHERE user_serial_number = ?";
            let token_result = sqlx::query_as::<_, (String,)>(session_query)
                .bind(&serial_number)
                .fetch_one(pool)
                .await;
            match token_result {
                Ok((token,)) => {
                    if user_token_from_file == token {
                        let user_query = "SELECT staff_number FROM users WHERE serial_number = ?";
                        sqlx::query_as::<_, (String,)>(user_query)
                            .bind(&serial_number)
                            .fetch_one(pool)
                            .await
                            .map(|(staff_number,)| staff_number)
                    } else {
                        println!("SQLite: Hashes do not match");
                        Err(Error::RowNotFound)
                    }
                }
                Err(e) => {
                    println!("SQLite session_query error: {:?}", e);
                    Err(e)
                }
            }
        }
    };

    result.unwrap_or_else(|_| "not-authed".to_string())
}

// pub async fn verify_session(state: State<'_, DbPool>) -> Option<String> {
//     let user_token_from_file = get_store_value("user_hashed_token".to_string()).unwrap_or_default();
//     let serial_number = get_store_value("user_serial_number".to_string()).unwrap_or_default();

//     let result: Result<Option<String>, Error> = match &state.pool {
//         PoolType::Postgres(pool) => {
//             let session_query = "SELECT token FROM sessions WHERE user_serial_number = $1";
//             let token_result = sqlx::query_as::<_, (String,)>(session_query)
//                 .bind(&serial_number)
//                 .fetch_one(pool)
//                 .await;

//             match token_result {
//                 Ok((token,)) => {
//                     if user_token_from_file == token {
//                         let user_query = "SELECT staff_number FROM users WHERE serial_number = $1";
//                         sqlx::query_as::<_, (Option<String>,)>(user_query)
//                             .bind(&serial_number)
//                             .fetch_one(pool)
//                             .await
//                             .map(|(staff_number,)| staff_number)
//                     } else {
//                         println!("Postgres: Hashes do not match");
//                         Ok(None)
//                     }
//                 }
//                 Err(e) => {
//                     println!("Postgres session_query error: {:?}", e);
//                     Err(e)
//                 }
//             }
//         }
//         PoolType::SQLite(pool) => {
//             let session_query = "SELECT token FROM sessions WHERE user_serial_number = ?";
//             let token_result = sqlx::query_as::<_, (String,)>(session_query)
//                 .bind(&serial_number)
//                 .fetch_one(pool)
//                 .await;

//             match token_result {
//                 Ok((token,)) => {
//                     if user_token_from_file == token {
//                         let user_query = "SELECT staff_number FROM users WHERE serial_number = ?";
//                         sqlx::query_as::<_, (Option<String>,)>(user_query)
//                             .bind(&serial_number)
//                             .fetch_one(pool)
//                             .await
//                             .map(|(staff_number,)| staff_number)
//                     } else {
//                         println!("SQLite: Hashes do not match");
//                         Ok(None)
//                     }
//                 }
//                 Err(e) => {
//                     println!("SQLite session_query error: {:?}", e);
//                     Err(e)
//                 }
//             }
//         }
//     };

//     result.unwrap_or(None)
// }

#[tauri::command]
pub fn unload_resources() {
    // remove the user_serial_number(token) from the store
    let _ = save_store_value("user_serial_number".to_string(), "".to_string());
    println!("Unloading resources...");
}
