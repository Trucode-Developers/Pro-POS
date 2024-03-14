
// use tauri::State;
use sqlx::migrate::MigrateDatabase;
use sqlx::postgres::PgPoolOptions;
use sqlx::{PgPool, Sqlite, SqlitePool};
use std::env;
use std::result::Result;
use std::fs;


pub struct DbPool {
    pub pool: PoolType,
}

pub enum PoolType {
    Postgres(PgPool),
    SQLite(SqlitePool),
}


pub async fn establish_postgres_connection() -> Result<PgPool, sqlx::Error> {
    dotenv::dotenv().expect("Unable to load environment variables from .env file");
    let db_url = env::var("DATABASE_URL").expect("Unable to read DATABASE_URL env var");
    PgPoolOptions::new()
        .max_connections(100)
        .connect(&db_url)
        .await
}

pub async fn establish_sqlite_connection() -> Result<SqlitePool, sqlx::Error> {
    let db_url = String::from("sqlite://sqlite.db");
    if !Sqlite::database_exists(&db_url).await.unwrap() {
        Sqlite::create_database(&db_url).await.unwrap();
        let pool = SqlitePool::connect(&db_url).await.unwrap();
        let _ =sqlx::migrate!("./migrations").run(&pool).await;
    }
    Ok(SqlitePool::connect(&db_url).await?)
}

pub async fn run_postgres_migrations(pool: &PgPool) {
   let _ = sqlx::migrate!("./migrations")
        .run(pool)
        .await
        .expect("PostgreSQL migration failed");
    if let Err(err) = sqlx::migrate!("./migrations").run(pool).await {
        eprintln!("PostgreSQL migration failed: {:?}", err);
    }
}

pub async fn run_sqlite_migrations(pool: &SqlitePool) {
    let _ = sqlx::migrate!("./migrations")
        .run(pool)
        .await
        .expect("SQLite migration failed");
    if let Err(err) = sqlx::migrate!("./migrations").run(pool).await {
        eprintln!("SQLite migration failed: {:?}", err);
    }
}

//creating and managing local docs to handle db_url, logged in user, and other state
pub fn create_local_docs()->bool{
    let path: &str = "./docs";
    let create_dir_result: Result<(), Error> = fs::create_dir(path);
    match create_dir_result {
        Ok(_) => {
            println!("Directory created");
            true 
        } ,
        Err(e) => {
            println!("Error creating directory: {:?}", e);
            false
        } 
    }
}

pub fn write_to_file(file_name: &str, content: &str) -> bool {
    let path = format!("./docs/{}", file_name);
    let write_result = fs::write(&path, content);
    match write_result {
        Ok(_) => {
            println!("File written");
            true
        },
        Err(e) => {
            println!("Error writing to file: {:?}", e);
            false
        },
    }
}