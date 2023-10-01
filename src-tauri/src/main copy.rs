#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod routes;
// mod models;
use sqlx::PgPool;
// use sqlx::Connection;
use std::{error::Error, sync::Arc};
use dotenv::dotenv;

use routes::users::{greet, create, update};

pub struct AppState {
    pub db_pool: Arc<PgPool>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    dotenv().ok();
    let url: String = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = sqlx::postgres::PgPool::connect(&url).await?;

    //call the migrate macro
    sqlx::migrate!("./migrations").run(&pool).await?;
     let app_state = AppState {
        db_pool: Arc::new(pool),
    };

    
    tauri::Builder::default() 
    // .invoke_handler(tauri::generate_handler![greet, create, update])
        .invoke_handler(tauri::generate_handler![greet,update,create])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
