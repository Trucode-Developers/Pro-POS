#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sqlx::postgres::PgPoolOptions;
use sqlx::sqlite::SqlitePool;
use sqlx::PgPool;
use tokio::runtime::Runtime;
mod routes;
use routes::users::{create, delete_user, get_all_users, get_user, greet, update, PgPoolWrapper};

async fn establish_connection() -> PgPool {
    dotenv::dotenv().expect("Unable to load environment variables from .env file");
    let db_url = std::env::var("DATABASE_URL").expect("Unable to read DATABASE_URL env var");
    PgPoolOptions::new()
        .max_connections(100)
        .connect(&db_url)
        .await
        .expect("Unable to connect to Postgres")
}

async fn establish_sqlite_connection() -> Pool<Sqlite> {
    dotenv::dotenv().expect("Unable to load environment variables from .env file");
    let db_url = std::env::var("SQLITE_DATABASE_URL").expect("Unable to read DATABASE_URL env var");
    if !Sqlite::database_exists(&db_url).await.unwrap() {
        Sqlite::create_database(&db_url).await.unwrap();
        match SqlitePool::new().max_connections(5).connect(&db_url).await {
            Ok(pool) => pool,
            Err(e) => {
                panic!("Unable to connect to SQLite: {}", e);
            }
        }
    }
}

async fn run_migrations() {
    let pool: PgPool = establish_connection().await;
    sqlx::migrate!("./migrations").run(&pool).await;
}

// #[tokio::main]
fn main() {
    let pool;

    if std::env::var("DATABASE_URL").is_ok() {
        pool = Runtime::new().unwrap().block_on(establish_connection());
        Runtime::new().unwrap().block_on(run_migrations());
    } else {
        pool = Runtime::new()
            .unwrap()
            .block_on(establish_sqlite_connection());
        Runtime::new().unwrap().block_on(run_migrations());
    }

    tauri::Builder::default()
        .manage(PgPoolWrapper { pool }) // Or SqlitePoolWrapper if using SQLite
        .invoke_handler(tauri::generate_handler![
            greet,
            create,
            update,
            delete_user,
            get_user,
            get_all_users,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // tauri::Builder::default()
    //     .manage(PgPoolWrapper { pool })

    //     .invoke_handler(tauri::generate_handler![
    //         greet, // Export Rust function to be called with invoke [https://tauri.app/v1/guides/features/command/]
    //         create, update, delete_user,get_all_users,get_user
    //     ])
    //     .run(tauri::generate_context!())
    //     .expect("error while running tauri application");
}

// #[tauri::command]
// pub fn greet(name: &str) -> String {
//    format!("Hello, {}!", name)
// }
