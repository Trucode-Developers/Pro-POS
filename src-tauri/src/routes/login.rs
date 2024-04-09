// use bcrypt::{hash, verify, DEFAULT_COST};
use crate::db_connections::{read_specific_line, update_file, DbPool, PoolType};
use crate::routes::roles::get_allocated_permission_slugs;
use bcrypt::verify;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use tauri::State;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct Credentials {
    pub email: String,
    pub password: String,
}

#[derive(sqlx::FromRow)]
struct UserRow {
    id: i32,
}

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
            match result {
                Ok((serial_number, db_password)) => {
                    if verify(&password, &db_password).unwrap() {
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
                    let json = json!({ "status": 201, "serial_number": null, "permissions": [] });
                    Ok(json)
                }
            }
        }
    }
}





pub async fn get_user_id(state: State<'_, DbPool>) -> i32 {
    let serial_number = read_specific_line(2).unwrap();
    print!("Serial Number: {}", serial_number);
    //check is postgres or sqlite in users table where serial_number = serial_number return user.id else return 0
    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "SELECT id FROM users WHERE serial_number = $1";
            let result = sqlx::query_as::<_, UserRow>(query)
                .bind(&serial_number)
                .fetch_one(pool)
                .await;
            match result {
                Ok(user) => user.id,
                Err(_) => 0,
            }
        }
        PoolType::SQLite(pool) => {
            let query = "SELECT id FROM users WHERE serial_number = ?";
            let result = sqlx::query_as::<_, UserRow>(query)
                .bind(&serial_number)
                .fetch_one(pool)
                .await;
            match result {
                Ok(user) => user.id,
                Err(_) => 0,
            }
        }
    }
}
