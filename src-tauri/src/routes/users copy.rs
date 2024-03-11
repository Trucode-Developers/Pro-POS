use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use sqlx::PgPool;
use tauri::State;
use thiserror::Error;


pub struct PgPoolWrapper {
    pub pool: PgPool,
}

// #[derive(Serialize, Deserialize, Debug)]
#[derive(Serialize, Deserialize, Debug, FromRow)]
pub struct User {
    pub name: String,
    pub role: i32,
    pub email: String,
    pub password: String,
    pub is_active: bool,
}



#[derive(Error, Serialize, Debug)]
pub enum CustomError {
    #[error("An error occurred")]
    GenericError,
    // Add other error variants as needed
}

#[tauri::command]
pub async fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
pub async fn create(user: User, state: State<'_, PgPoolWrapper>) -> Result<(), CustomError> {
    let query =
        "INSERT INTO users (name, role, email, password, is_active) VALUES ($1, $2, $3, $4, $5)";

    let result = sqlx::query(query)
        .bind(&user.name)
        .bind(&user.role)
        .bind(&user.email)
        .bind(&user.password)
        .bind(&user.is_active)
        .execute(&state.pool)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(_) => Err(CustomError::GenericError),
    }
}

#[tauri::command]
pub async fn update(
    id: i32,
    user: User,
    state: State<'_, PgPoolWrapper>,
) -> Result<(), CustomError> {
    let query = "UPDATE users SET name = $1, role = $2, email = $3, password = $4, is_active = $5 WHERE id = $6";

    let result = sqlx::query(query)
        .bind(&user.name)
        .bind(&user.role)
        .bind(&user.email)
        .bind(&user.password)
        .bind(&user.is_active)
        .bind(&id)
        .execute(&state.pool)
        .await;
    match result {
        Ok(_) => Ok(()),
        Err(_) => Err(CustomError::GenericError),
    }
}

#[tauri::command]
pub async fn get_all_users(state: State<'_, PgPoolWrapper>) -> Result<Vec<User>, CustomError> {
    let query = "SELECT * FROM users";

    let result = sqlx::query_as::<_, User>(query)
        .fetch_all(&state.pool)
        .await;

    match result {
        Ok(users) => Ok(users),
        Err(_) => Err(CustomError::GenericError),
    }
}

#[tauri::command]
pub async fn get_user(
    id: i32,
    state: State<'_, PgPoolWrapper>,
) -> Result<Option<User>, CustomError> {
    let query = "SELECT * FROM users WHERE id = $1";

    let result = sqlx::query_as::<_, User>(query)
        .bind(&id)
        .fetch_optional(&state.pool)
        .await;

    match result {
        Ok(user) => Ok(user),
        Err(_) => Err(CustomError::GenericError),
    }
}

#[tauri::command]
pub async fn delete_user(
    email: String,
    state: State<'_, PgPoolWrapper>,
) -> Result<(), CustomError> {
    let query = "DELETE FROM users WHERE email = $1";

    let result = sqlx::query(query).bind(&email).execute(&state.pool).await;

    match result {
        Ok(_) => Ok(()),
        Err(_) => Err(CustomError::GenericError),
    }
}
