// src/models/user.rs

use sqlx::FromRow;

#[derive(FromRow)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub age: i32,
    pub email: String,
    pub password: String,
    pub is_active: bool,
    // pub date: chrono::Date<chrono::Utc>,
}
