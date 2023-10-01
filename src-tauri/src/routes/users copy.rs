
#[tauri::command]
pub fn greet(name: &str) -> String {
   format!("Hello, {}!", name)
}



use std::error::Error;
use std::sync::Arc;
use tauri::State;
use sqlx::PgPool;
use serde::Deserialize;
use serde::Serialize;

use crate::AppState;

#[derive(Debug, Deserialize)]
pub struct User {
    pub name: String,
    pub role: i32,
    pub email: String,
    pub password: String,
    pub is_active: bool,
}

#[derive(Serialize)]
pub struct CommandResult {
    success: bool,
    // You can add more fields if needed
}

// Create a new user
#[tauri::command]
pub async fn create(user: User, state: State<'_, Arc<AppState>>) -> Result<CommandResult, Box<dyn Error>> {
    let query = "INSERT INTO users (name, role, email, password, is_active) VALUES ($1, $2, $3, $4, $5)";

    // Bind user data to the SQL query and execute it
    sqlx::query(query)
        .bind(&user.name)
        .bind(&user.role)
        .bind(&user.email)
        .bind(&user.password)
        .bind(&user.is_active)
        .execute(&*state.db_pool)
        .await?;

    // Return a success result
    Ok(CommandResult { success: true })
}

// Update an existing user by ID
#[tauri::command]
pub async fn update(id: i32, user: User, state: State<'_, Arc<AppState>>) -> Result<CommandResult, Box<dyn Error>> {
    let query = "UPDATE users SET name = $1, role = $2, email = $3, password = $4, is_active = $5 WHERE id = $6";

    // Bind user data and ID to the SQL query and execute it
    sqlx::query(query)
        .bind(&user.name)
        .bind(&user.role)
        .bind(&user.email)
        .bind(&user.password)
        .bind(&user.is_active)
        .bind(&id)
        .execute(&*state.db_pool)
        .await?;

    // Return a success result
    Ok(CommandResult { success: true })
}
