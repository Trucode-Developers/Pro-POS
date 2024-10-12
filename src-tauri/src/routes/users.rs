use bcrypt::{hash, DEFAULT_COST};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
// use sqlx::pool;
use crate::{
    db_connections::{DbPool, PoolType},
    routes::login::verify_session,
};
use tauri::State;
use uuid::Uuid;
#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct User {
    pub id: Option<i32>,
    pub serial_number: String,
    pub staff_number: String,
    pub branch_slug: String,
    pub profile_picture: Option<String>,
    pub name: String,
    pub email: String,
    pub password: String,
    pub phone_no: Option<String>,
    pub id_no: Option<String>,
    pub date_of_birth: Option<String>,
    pub gender: Option<String>,
    pub country: Option<i32>,
    pub location: Option<String>,
    pub email_verified: bool,
    pub phone_verified: bool,
    pub status: bool,
    pub description: Option<String>,
    pub created_by: Option<String>,
    pub created_at: Option<String>,
    pub updated_by: Option<i32>,
}

#[tauri::command]
pub async fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
pub async fn create(user: User, state: State<'_, DbPool>) -> Result<Value, Value> {
    let staff_number = verify_session(state.clone()).await;
    let hashed_password = hash(user.password.clone(), DEFAULT_COST).unwrap();

    if staff_number.clone() == "not-authed" {
        return Err(json!({
            "status": 401,
            "message":"Unauthorized: Invalid session, Kindly login again"
        }));
    }

    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "INSERT INTO users (serial_number, staff_number, branch_slug, profile_picture, name, email, password, phone_no, id_no, date_of_birth, gender, country, location, email_verified, phone_verified, status, description, created_by) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING id";
            let result = sqlx::query(query)
                .bind(Uuid::new_v4().to_string())
                .bind(&user.staff_number)
                .bind(&user.branch_slug)
                .bind(&user.profile_picture)
                .bind(&user.name)
                .bind(&user.email)
                .bind(&hashed_password)
                .bind(&user.phone_no)
                .bind(&user.id_no)
                .bind(&user.date_of_birth)
                .bind(&user.gender)
                .bind(&user.country)
                .bind(&user.location)
                .bind(&user.email_verified)
                .bind(&user.phone_verified)
                .bind(&user.status)
                .bind(&user.description)
                .bind(staff_number)
                .fetch_one(pool)
                .await;

            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "User created successfully",
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
        PoolType::SQLite(_) => {
            // Implement SQLite version if needed
            Err(json!({
                "status": 501,
                "message": "SQLite implementation not available"
            }))
        }
    }
}

#[tauri::command]
pub async fn update_user(id: i32, user: User, state: State<'_, DbPool>) -> Result<Value, Value> {
    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "UPDATE users SET 
                staff_number = $1, branch_slug = $2, profile_picture = $3, name = $4, 
                email = $5, phone_no = $6, id_no = $7, date_of_birth = $8, gender = $9, 
                country = $10, location = $11, email_verified = $12, phone_verified = $13, 
                status = $14, description = $15, updated_by = $16
                WHERE id = $17";

            let result = sqlx::query(query)
                .bind(&user.staff_number)
                .bind(&user.branch_slug)
                .bind(&user.profile_picture)
                .bind(&user.name)
                .bind(&user.email)
                .bind(&user.phone_no)
                .bind(&user.id_no)
                .bind(&user.date_of_birth)
                .bind(&user.gender)
                .bind(&user.country)
                .bind(&user.location)
                .bind(&user.email_verified)
                .bind(&user.phone_verified)
                .bind(&user.status)
                .bind(&user.description)
                .bind(&user.updated_by)
                .bind(id)
                .execute(pool)
                .await;

            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "User updated successfully",
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
        PoolType::SQLite(_) => {
            // Implement SQLite version if needed
            Err(json!({
                "status": 501,
                "message": "SQLite implementation not available"
            }))
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
                SELECT users.*, COUNT(user_roles.user_id) AS total_roles
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
