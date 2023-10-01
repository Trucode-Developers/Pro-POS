#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use tokio::runtime::Runtime;
mod routes;
use routes::users::{create, greet, update, delete_user,get_user, get_all_users, PgPoolWrapper};

async fn establish_connection() -> PgPool {
    dotenv::dotenv().expect("Unable to load environment variables from .env file");
    let db_url = std::env::var("DATABASE_URL").expect("Unable to read DATABASE_URL env var");
    PgPoolOptions::new()
        .max_connections(100)
        .connect(&db_url)
        .await
        .expect("Unable to connect to Postgres")
}

// #[tokio::main]
fn main() {
    let pool: PgPool = Runtime::new().unwrap().block_on(establish_connection());

    tauri::Builder::default()
        .manage(PgPoolWrapper { pool }) // Add PgPoolWrapper State.
        .invoke_handler(tauri::generate_handler![
            greet, // Export Rust function to be called with invoke [https://tauri.app/v1/guides/features/command/]
            create, update, delete_user,get_all_users,get_user
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// #[tauri::command]
// pub fn greet(name: &str) -> String {
//    format!("Hello, {}!", name)
// }
