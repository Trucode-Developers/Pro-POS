#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod routes;
// mod models;
use sqlx::Row;
// use sqlx::Connection;
use std::error::Error;
use dotenv::dotenv;

use routes::users::{greet, create, update, User};



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
        name: "John".to_string(),
        role: 1,
        email: "john@yahoo.com".to_string(),
        password: "john@yahoo.com".to_string(),
        is_active: true,
    };

    // create(&user, &pool).await?;
    update(2, &user, &pool).await?;


    tauri::Builder::default() 
    // .invoke_handler(tauri::generate_handler![greet, create, update])
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
