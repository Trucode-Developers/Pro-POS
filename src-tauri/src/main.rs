#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sqlx::migrate::MigrateDatabase;
use sqlx::postgres::PgPoolOptions;
use sqlx::{PgPool, Sqlite, SqlitePool};
use std::env;
use std::result::Result;
use tokio::runtime::Runtime;
mod routes;
use routes::users::{create, delete_user, get_all_users, get_user, greet, update};

pub enum DbPool {
    Postgres(PgPool),
    SQLite(SqlitePool),
}

pub struct PgPoolWrapper {
    pub pool: DbPool,
}

async fn establish_connection() -> Result<PgPool, sqlx::Error> {
    dotenv::dotenv().expect("Unable to load environment variables from .env file");
    let db_url = env::var("DATABASE_URL").expect("Unable to read DATABASE_URL env var");
    PgPoolOptions::new()
        .max_connections(100)
        .connect(&db_url)
        .await
}

async fn establish_sqlite_connection() -> Result<SqlitePool, sqlx::Error> {
    let db_url = String::from("sqlite://sqlite.db");
    if !Sqlite::database_exists(&db_url).await.unwrap() {
        Sqlite::create_database(&db_url).await.unwrap();
        let pool = SqlitePool::connect(&db_url).await.unwrap();
        sqlx::migrate!("./migrations").run(&pool).await;
    }
    Ok(SqlitePool::connect(&db_url).await?)
}

async fn run_postgres_migrations(pool: &PgPool) {
    sqlx::migrate!("./migrations")
        .run(pool)
        .await
        .expect("PostgreSQL migration failed");
    if let Err(err) = sqlx::migrate!("./migrations").run(pool).await {
        eprintln!("PostgreSQL migration failed: {:?}", err);
    }
}

async fn run_sqlite_migrations(pool: &SqlitePool) {
    let _ = sqlx::migrate!("./migrations")
        .run(pool)
        .await
        .expect("SQLite migration failed");
    if let Err(err) = sqlx::migrate!("./migrations").run(pool).await {
        eprintln!("SQLite migration failed: {:?}", err);
    }
}
#[tokio::main]
async fn main() {
    let use_postgres = false; // Set to true to use PostgreSQL, false to use SQLite

  
   let pool = if use_postgres {
        let pg_pool = establish_connection().await.expect("Unable to establish PostgreSQL database connection");
        run_postgres_migrations(&pg_pool).await;
        PgPoolWrapper { pool: DbPool::Postgres(pg_pool) }
    } else {
        let sqlite_pool = establish_sqlite_connection().await.expect("Unable to establish SQLite database connection");
        run_sqlite_migrations(&sqlite_pool).await;
        PgPoolWrapper { pool: DbPool::SQLite(sqlite_pool) }
    };


    tauri::Builder::default()
        .manage(pool)
        .invoke_handler(tauri::generate_handler![
            greet,
            create,
            update,
            delete_user,
            get_all_users,
            get_user
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
