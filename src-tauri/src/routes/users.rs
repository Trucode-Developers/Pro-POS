use serde::{Deserialize, Serialize};
use sqlx::{sqlite::SqlitePool, FromRow, PgPool};
use tauri::State;
use thiserror::Error;

pub enum Database {
    Postgres(PgPool),
    SQLite(SqlitePool),
}

pub struct DatabasePool {
    pub pool: Database,
}

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
}

#[tauri::command]
pub async fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
pub async fn create(user: User, state: State<'_, DatabasePool>) -> Result<(), CustomError> {
    match &state.pool {
        Database::Postgres(pool) => {
            let query = "INSERT INTO users (name, role, email, password, is_active) VALUES ($1, $2, $3, $4, $5)";
            let result = sqlx::query(query)
                .bind(&user.name)
                .bind(&user.role)
                .bind(&user.email)
                .bind(&user.password)
                .bind(&user.is_active)
                .execute(pool)
                .await;
            result.map_err(|_| CustomError::GenericError)?;
        }
        Database::SQLite(pool) => {
            let query =
                "INSERT INTO users (name, role, email, password, is_active) VALUES (?, ?, ?, ?, ?)";
            let result = sqlx::query(query)
                .bind(&user.name)
                .bind(&user.role)
                .bind(&user.email)
                .bind(&user.password)
                .bind(&user.is_active)
                .execute(pool)
                .await;
            result.map_err(|_| CustomError::GenericError)?;
        }
    }
    Ok(())
}

#[tauri::command]
pub async fn update(
    id: i32,
    user: User,
    state: State<'_, DatabasePool>,
) -> Result<(), CustomError> {
    match &state.pool {
        Database::Postgres(pool) => {
            let query = "UPDATE users SET name = $1, role = $2, email = $3, password = $4, is_active = $5 WHERE id = $6";
            let result = sqlx::query(query)
                .bind(&user.name)
                .bind(&user.role)
                .bind(&user.email)
                .bind(&user.password)
                .bind(&user.is_active)
                .bind(&id)
                .execute(pool)
                .await;
            result.map_err(|_| CustomError::GenericError)?;
        }
        Database::SQLite(pool) => {
            // SQLite specific code for update
        }
    }
    Ok(())
}

#[tauri::command]
pub async fn get_all_users(state: State<'_, DatabasePool>) -> Result<Vec<User>, CustomError> {
    match &state.pool {
        Database::Postgres(pool) => {
            let query = "SELECT * FROM users";
            let result = sqlx::query_as::<_, User>(query).fetch_all(pool).await;
            result.map_err(|_| CustomError::GenericError)
        }
        Database::SQLite(pool) => {
            // SQLite specific code for fetching all users
            unimplemented!("SQLite specific code for fetching all users")
        }
    }
}

#[tauri::command]
pub async fn get_user(
    id: i32,
    state: State<'_, DatabasePool>,
) -> Result<Option<User>, CustomError> {
    match &state.pool {
        Database::Postgres(pool) => {
            let query = "SELECT * FROM users WHERE id = $1";
            let result = sqlx::query_as::<_, User>(query)
                .bind(&id)
                .fetch_optional(pool)
                .await;
            result.map_err(|_| CustomError::GenericError)
        }
        Database::SQLite(pool) => {
            // SQLite specific code for fetching a user
            unimplemented!("SQLite specific code for fetching a user")
        }
    }
}

#[tauri::command]
pub async fn delete_user(email: String, state: State<'_, DatabasePool>) -> Result<(), CustomError> {
    match &state.pool {
        Database::Postgres(pool) => {
            let query = "DELETE FROM users WHERE email = $1";
            let result = sqlx::query(query).bind(&email).execute(pool).await;
            result.map_err(|_| CustomError::GenericError)?;
        }
        Database::SQLite(pool) => {
            // SQLite specific code for deleting a user
            unimplemented!("SQLite specific code for deleting a user")
        }
    }
    Ok(())
}
