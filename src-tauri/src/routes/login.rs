// use bcrypt::{hash, verify, DEFAULT_COST};
use tauri::State;
use bcrypt::verify;
use serde_json::{json, Value};
use serde::{Deserialize, Serialize};
use crate::db_connections::{DbPool, PoolType};
use crate::routes::roles::get_allocated_permission_slugs;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct Credentials {
    pub email: String,
    pub password: String,
}


#[tauri::command]
pub async fn login(credentials: Credentials, state: State<'_, DbPool>) -> Result<Value, Value> {
    let email = credentials.email;
    let password = credentials.password;

    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "SELECT id, password FROM users WHERE email = $1";
            let result = sqlx::query_as::<_, (i32, String)>(query)
                .bind(&email)
                .fetch_one(pool)
                .await;
            match result {
                Ok((user_id, db_password)) => {
                    if verify(&password, &db_password).unwrap() {
                        let permissions = get_allocated_permission_slugs(user_id, state.clone()).await;
                        let json = json!({ "status": 200, "user_id": user_id, "permissions": permissions });
                        Ok(json)
                    } else {
                        let json = json!({ "status": 201, "user_id": null, "permissions": [] });
                        Ok(json)
                    }
                }
                Err(_) => {
                    let json = json!({ "status": 201, "user_id": null, "permissions": [] });
                    Ok(json)
                }
            }
        }
        PoolType::SQLite(pool) => {
            let query = "SELECT id, password FROM users WHERE email = ?";
            let result = sqlx::query_as::<_, (i32, String)>(query)
                .bind(&email)
                .fetch_one(pool)
                .await;
            match result {
                Ok((user_id, db_password)) => {
                    if verify(&password, &db_password).unwrap() {
                        let permissions = get_allocated_permission_slugs(user_id, state.clone()).await;
                        let json = json!({ "status": 200, "user_id": user_id, "permissions": permissions });
                        Ok(json)
                    } else {
                        let json = json!({ "status": 201, "user_id": null, "permissions": [] });
                        Ok(json)
                    }
                }
                Err(_) => {
                    let json = json!({ "status": 201, "user_id": null, "permissions": [] });
                    Ok(json)
                }
            }
        }
    }
}



// #[tauri::command]
// pub async fn login(credentials: Credentials, state: State<'_, DbPool>) -> Result<Value, Value> {
//     let email = credentials.email;
//     let password = credentials.password;
//     // let hashed_password = hash(&password, DEFAULT_COST).unwrap();

//     match &state.pool {
//         PoolType::Postgres(pool) => {
//             let query = "SELECT id, password FROM users WHERE email = $1";
//             let result = sqlx::query_as::<_, (i32, String)>(query)
//                 .bind(&email)
//                 .fetch_one(pool)
//                 .await;

//             match result {
//                 Ok((user_id, db_password)) => {
//                     // println!("user_id: {}, db_password: {}", user_id, db_password);
//                     if verify(&password, &db_password).unwrap() {
//                         //call get_allocated_permission_slugs with a cloned user_id
//                         let permissions = get_allocated_permission_slugs(user_id, state.clone()).await;
//                         let json = json!({
//                             "status": 200,
//                             "user_id": user_id,
//                             "permissions": permissions
//                         });
//                         Ok(json)
//                     } else {
//                         let json = json!({
//                             "status": 201,
//                             "user_id": null,
//                             "permissions": []
//                         });
//                         Ok(json)
//                     }
//                 }
//                 Err(e) => {
//                     let json = json!({
//                         "status": 500,
//                         "message": e.to_string()
//                     });
//                     Err(json)
//                 }
//             }
//         }
//         PoolType::SQLite(pool) => {
//             let query = "SELECT id, password FROM users WHERE email = ?";
//             let result = sqlx::query_as::<_, (i32, String)>(query)
//                 .bind(&email)
//                 .fetch_one(pool)
//                 .await;

//             match result {
//                 Ok((user_id, db_password)) => {
//                     if verify(&password, &db_password).unwrap() {
//                         let permissions = get_allocated_permission_slugs(user_id, state.clone()).await;
//                         let json = json!({
//                             "status": 200,
//                             "user_id": user_id,
//                             "permissions": permissions
//                         });
//                         Ok(json)
//                     } else {
//                         let json = json!({
//                             "status": 201,
//                             "user_id": null,
//                             "permissions": []
//                         });
//                         Ok(json)
//                     }
//                 }
//                 Err(e) => {
//                     let json = json!({
//                         "status": 500,
//                         "message": e.to_string()
//                     });
//                     Err(json)
//                 }
//             }
//         }
//     }
// }