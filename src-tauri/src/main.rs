#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod routes;
// mod models;

use sqlx::Row;
// use sqlx::Connection;
use std::error::Error;
use dotenv::dotenv;

// use routes::users::{greet, get_user};
use routes::users::greet;
// use tauri::Manager;


struct User {
    // id: i32,
    name: String,
    role: i32,
    email: String,
    password: String,
    is_active: bool,
    // created_at: String,
}

async fn create(user: &User, pool: &sqlx::PgPool)->Result<(), Box <dyn Error>>{
    let query = "INSERT INTO users (name, role, email, password, is_active) VALUES ($1, $2, $3, $4, $5)";

    sqlx::query(query)
        .bind(&user.name)
        .bind(&user.role)
        .bind(&user.email)
        .bind(&user.password)
        .bind(&user.is_active)
        .execute(pool)
        .await?;

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    dotenv().ok();
    let url: String = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = sqlx::postgres::PgPool::connect(&url).await?;
    //call the migrate macro
    sqlx::migrate!("./migrations").run(&pool).await?;

    let res = sqlx::query("SELECT 1+1 as sum").fetch_one(&pool).await?;

    let sum: i32 = res.get("sum");
    println!("sum: {}", sum);

    let user =User{
        name: "John the second".to_string(),
        role: 1,
        email: "john2@yahoo.com".to_string(),
        password: "john2@yahoo.com".to_string(),
        is_active: true,
    };

    create(&user, &pool).await?;


    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        // .invoke_handler(tauri::generate_handler![get_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
