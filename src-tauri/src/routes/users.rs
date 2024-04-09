use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use bcrypt::{hash, DEFAULT_COST};
// use sqlx::pool;
use tauri::State;
use crate::{db_connections::{DbPool, PoolType}, routes::login::get_user_id};
use uuid::Uuid;
#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct User {
    pub id: Option<i32>,
    pub total_roles: Option<i32>,
    pub name: String,
    pub role: i32,
    pub email: String,
    pub password: String,
    pub is_active: bool,
}

// #[derive(Error, Serialize, Debug)]
// pub enum CustomError {
//     #[error("An error occurred")]
//     GenericError,
// }

#[tauri::command]
pub async fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
pub async fn create(user: User, state: State<'_, DbPool>) -> Result<Value, Value> {
    let hashed_password = hash(user.password.clone(), DEFAULT_COST).unwrap();
    let user_id = get_user_id(state.clone()).await;
    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "INSERT INTO users (serial_number,name, role, email, password, is_active,created_by) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING id";
            let result = sqlx::query(query)
                .bind(Uuid::new_v4())
                .bind(&user.name)
                .bind(&user.role)
                .bind(&user.email)
                .bind(&hashed_password)
                .bind(&user.is_active)
                .bind(user_id)
                .fetch_one(pool)
                .await;

            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "Role created successfully",
                    });
                    Ok(json)
                }
                Err(e) => {
                    let json = json!({
                        "status": 500,
                        "message": e.to_string()
                    });
                    Err(json)
                }
            }
        }
        PoolType::SQLite(pool) => {
            let query =
                "INSERT INTO users (serial_number,name, role, email, password, is_active) VALUES (?,?, ?, ?, ?, ?)";
            let result = sqlx::query(query)
                .bind(Uuid::new_v4())
                .bind(&user.name)
                .bind(&user.role)
                .bind(&user.email)
                .bind(&hashed_password)
                .bind(&user.is_active)
                .execute(pool)
                .await;

            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "Role created successfully",
                    });
                    Ok(json)
                }
                Err(e) => {
                    let json = json!({
                        "status": 500,
                        "data": e.to_string()
                    });
                    Err(json)
                }
            }
        }
    }
}

#[tauri::command]
pub async fn update_user(
    id: i32,
    allocated_roles: Vec<i32>,
    user: User,
    state: State<'_, DbPool>,
) -> Result<Value, Value> {
    let hashed_password = hash(user.password.clone(), DEFAULT_COST).unwrap();
    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "UPDATE users SET name = $1, email = $2, password = $3, is_active = $4 WHERE id = $5";
            let _ = sqlx::query(query)
                .bind(&user.name)
                .bind(&user.email)
                .bind(&hashed_password)
                .bind(&user.is_active)
                .bind(id)
                .execute(pool)
                .await
                .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;

            // Delete existing user_roles
            let delete_query = "DELETE FROM user_roles WHERE user_id = $1";
            sqlx::query(delete_query)
                .bind(&id)
                .execute(pool)
                .await
                .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;

            // Insert new user_roles
            for role_id in allocated_roles {
                let insert_query = "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)";
                sqlx::query(insert_query)
                    .bind(&id)
                    .bind(&role_id)
                    .execute(pool)
                    .await
                    .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;
            }

            let json = json!({ "status": 200, "message": "User updated successfully", });
            Ok(json)
        }
        PoolType::SQLite(pool) => {
            let query =
                "UPDATE users SET name = ?, email = ?, password = ?, is_active = ? WHERE id = ?";
            let _ = sqlx::query(query)
                .bind(&user.name)
                .bind(&user.email)
                .bind(&hashed_password)
                .bind(&user.is_active)
                .bind(id)
                .execute(pool)
                .await
                .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;

            // Delete existing user_roles
            let delete_query = "DELETE FROM user_roles WHERE user_id = ?";
            sqlx::query(delete_query)
                .bind(&id)
                .execute(pool)
                .await
                .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;

            // Insert new user_roles
            for role_id in allocated_roles {
                let insert_query = "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)";
                sqlx::query(insert_query)
                    .bind(&id)
                    .bind(&role_id)
                    .execute(pool)
                    .await
                    .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;
            }

            let json = json!({ "status": 200, "message": "User updated successfully", });
            Ok(json)
        }
    }
}

#[tauri::command]
pub async fn get_all_users(state: State<'_, DbPool>) -> Result<Value, Value> {
    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "
                SELECT users.*, CAST(COUNT(user_roles.*) AS INTEGER) AS total_roles
                FROM users
                LEFT JOIN user_roles ON user_roles.user_id = users.id
                GROUP BY users.id
                ORDER BY users.id DESC";

            let result = sqlx::query_as::<_, User>(query).fetch_all(pool).await;

            match result {
                Ok(users) => {
                    let json = json!({
                        "status": 200,
                        "data": users
                    });
                    Ok(json)
                }
                Err(e) => {
                    let json = json!({
                        "status": 500,
                        "message": e.to_string()
                    });
                    Err(json)
                }
            }
        }
        PoolType::SQLite(pool) => {
            let query = "
                SELECT users.*, CAST(COUNT(user_roles.*) AS INTEGER) AS total_roles
                FROM users
                LEFT JOIN user_roles ON user_roles.user_id = users.id
                GROUP BY users.id
                ORDER BY users.id DESC";
            let result = sqlx::query_as::<_, User>(query).fetch_all(pool).await;

            match result {
                Ok(users) => {
                    let json = json!({
                        "status": 200,
                        "data": users
                    });
                    Ok(json)
                }
                Err(e) => {
                    let json = json!({
                        "status": 500,
                        "message": e.to_string()
                    });
                    Err(json)
                }
            }
        }
    }
}

#[tauri::command]
pub async fn get_user(id: i32, state: State<'_, DbPool>) -> Result<Value, Value> {
    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "SELECT * FROM users WHERE id = $1";
            let result = sqlx::query_as::<_, User>(query)
                .bind(&id)
                .fetch_optional(pool)
                .await;

            match result {
                Ok(user) => {
                    let json = json!({
                        "status": 200,
                        "data": user
                    });
                    Ok(json)
                }
                Err(e) => {
                    let json = json!({
                        "status": 500,
                        "message": e.to_string()
                    });
                    Err(json)
                }
            }
        }
        PoolType::SQLite(pool) => {
            let query = "SELECT * FROM users WHERE id = ?";
            let result = sqlx::query_as::<_, User>(query)
                .bind(&id)
                .fetch_optional(pool)
                .await;

            match result {
                Ok(user) => {
                    let json = json!({
                        "status": 200,
                        "data": user
                    });
                    Ok(json)
                }
                Err(e) => {
                    let json = json!({
                        "status": 500,
                        "message": e.to_string()
                    });
                    Err(json)
                }
            }
        }
    }
}

#[tauri::command]
pub async fn delete_user(id: i32, state: State<'_, DbPool>) -> Result<Value, Value> {
    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "DELETE FROM users WHERE id = $1";
            let result = sqlx::query(query).bind(&id).execute(pool).await;

            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "User deleted successfully"
                    });
                    Ok(json)
                }
                Err(e) => {
                    let json = json!({
                        "status": 500,
                        "message": e.to_string()
                    });
                    Err(json)
                }
            }
        }
        PoolType::SQLite(pool) => {
            let query = "DELETE FROM users WHERE id = ?";
            let result = sqlx::query(query).bind(&id).execute(pool).await;

            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "User deleted successfully"
                    });
                    Ok(json)
                }
                Err(e) => {
                    let json = json!({
                        "status": 500,
                        "message": e.to_string()
                    });
                    Err(json)
                }
            }
        }
    }
}
