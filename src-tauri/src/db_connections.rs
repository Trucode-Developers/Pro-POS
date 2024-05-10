// use tauri::State;
use sqlx::migrate::MigrateDatabase;
use sqlx::postgres::PgPoolOptions;
use sqlx::{PgPool, Sqlite, SqlitePool};
use std::result::Result;

use crate::routes::permissions::compare_and_add_permissions;
use crate::routes::users::User;
use crate::settings::global::{local_data_path, get_store_value, save_store_value};
use bcrypt::{hash, DEFAULT_COST};
use uuid::Uuid;
pub struct DbPool {
    pub pool: PoolType,
}

pub enum PoolType {
    Postgres(PgPool),
    SQLite(SqlitePool),
}

pub fn get_active_database_type(db_pool: &DbPool) -> &'static str {
    match &db_pool.pool {
        PoolType::Postgres(_) => "postgres",
        PoolType::SQLite(_) => "sqlite",
    }
}
pub async fn set_active_db(db_pool: DbPool) -> DbPool {
    let content = get_active_database_type(&db_pool).to_string();
    // every time the file is written , the app re-renders and the active db is updated
    //so lets read and compare whats their and only write once to re-render this prevents loops
    let active_db = get_store_value("active_db".to_string()).unwrap_or_default();
    if active_db != content {
        //this allows the app to re-render only when active db has changed
        let _ = save_store_value("active_db".to_string(), content);
    }
    seed_admin_user(&db_pool).await;
    db_pool
}

pub async fn establish_database_connection(db_url: &str) -> DbPool {
    let db_pool = if let Ok(pg_pool) = establish_postgres_connection(db_url).await {
        let _ = run_postgres_migrations(&pg_pool).await; // Run migrations for PostgreSQL
        DbPool {
            pool: PoolType::Postgres(pg_pool),
        }
    } else {
        let sqlite_pool = establish_sqlite_connection()
            .await
            .expect("Unable to establish SQLite database connection");
        let _ = run_sqlite_migrations(&sqlite_pool).await; // Run migrations for SQLite
        DbPool {
            pool: PoolType::SQLite(sqlite_pool),
        }
    };
    // Call set_active_db with the DbPool object
    _ = compare_and_add_permissions(&db_pool).await;
    set_active_db(db_pool).await
}

async fn establish_postgres_connection(db_url: &str) -> Result<PgPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(100)
        .connect(&db_url)
        .await
}

async fn establish_sqlite_connection() -> Result<SqlitePool, sqlx::Error> {
    // Get the AppData directory
    let mut appdata_dir = local_data_path();

    // Append the database file name to the folder path
    appdata_dir.push("sqlite.db");

    // Convert the path to a string
    let db_path = appdata_dir.to_string_lossy().to_owned();

    // Database URL with the path to the SQLite file
    let db_url = format!("sqlite://{}", db_path);
    // println!("Database URL: {}", db_url);

    // Check if the database exists, create it if it doesn't
    if !Sqlite::database_exists(&db_url).await.unwrap() {
        Sqlite::create_database(&db_url).await.unwrap();
        let pool = SqlitePool::connect(&db_url).await.unwrap();
        let _ = sqlx::migrate!("./migrations/sqlite").run(&pool).await;
    }

    // Connect to the SQLite database
    Ok(SqlitePool::connect(&db_url).await?)
}

async fn run_postgres_migrations(pool: &PgPool) {
    let _ = sqlx::migrate!("./migrations/postgres")
        .run(pool)
        .await
        .expect("PostgreSQL migration failed");
    if let Err(err) = sqlx::migrate!("./migrations/postgres").run(pool).await {
        eprintln!("PostgreSQL migration failed: {:?}", err);
    }
}

async fn run_sqlite_migrations(pool: &SqlitePool) {
    let _ = sqlx::migrate!("./migrations/sqlite")
        .run(pool)
        .await
        .expect("SQLite migration failed");
    if let Err(err) = sqlx::migrate!("./migrations/sqlite").run(pool).await {
        eprintln!("SQLite migration failed: {:?}", err);
    }
}


//seed the admin user
pub async fn seed_admin_user(db_pool: &DbPool) {
    match &db_pool.pool {
        PoolType::Postgres(pool) => {
            let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM users")
                .fetch_one(pool)
                .await
                .unwrap_or((0,));

            if count.0 == 0 {
                let user = User {
                    id: Some(0),
                    total_roles: Some(0),
                    staff_number: "0000".to_string(),
                    name: "admin".to_string(),
                    role: 0,
                    email: "admin@admin.com".to_string(),
                    password: "admin".to_string(),
                    is_active: true,
                };

                let hashed_password = hash(user.password.clone(), DEFAULT_COST).unwrap();

                let _ = sqlx::query("INSERT INTO users (serial_number, name, role, email, password, is_active) VALUES ($1, $2, $3, $4, $5, $6)")
                    .bind(Uuid::new_v4().to_string())
                    .bind(&user.name)
                    .bind(&user.role)
                    .bind(&user.email)
                    .bind(&hashed_password)
                    .bind(&user.is_active)
                    .execute(pool)
                    .await;
            }
        }
        PoolType::SQLite(pool) => {
            let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM users")
                .fetch_one(pool)
                .await
                .unwrap_or((0,));

            if count.0 == 0 {
                let user = User {
                    id: Some(0),
                    total_roles: Some(0),
                    staff_number: "0000".to_string(),
                    name: "admin".to_string(),
                    role: 0,
                    email: "admin@admin.com".to_string(),
                    password: "admin".to_string(),
                    is_active: true,
                };

                // let serial_number = Uuid::new_v4().to_string();

                let hashed_password = hash(user.password.clone(), DEFAULT_COST).unwrap();

                let _ = sqlx::query("INSERT INTO users (serial_number, name, role, email, password, is_active) VALUES (?, ?, ?, ?, ?, ?)")
                    .bind(Uuid::new_v4().to_string())
                    .bind(&user.name)
                    .bind(&user.role)
                    .bind(&user.email)
                    .bind(&hashed_password)
                    .bind(&user.is_active)
                    .execute(pool)
                    .await;
            }
        }
    }
}
