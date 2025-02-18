// use tauri::State;
use sqlx::migrate::MigrateDatabase;
use sqlx::postgres::PgPoolOptions;
use sqlx::{PgPool, Sqlite, SqlitePool};

use std::result::Result;
use std::fs::{self,OpenOptions,File};
use std::io::{self, Read,BufRead, Error,Write,ErrorKind,Seek, SeekFrom,};

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
pub fn set_active_db( db_pool: DbPool) -> DbPool {
    let content = get_active_database_type(&db_pool).to_string();
    // every time the file is written , the app re-renders and the active db is updated
    //so lets read and compare whats their and only write once to re-render this prevents loops 
    let active_db = read_specific_line(2).unwrap();
    if active_db != content {
        //this allows the app to re-render only when active db has changed
        let _ = update_file(&content, 1);
    }
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
    set_active_db(db_pool)
}


// pub async fn establish_database_connection(db_url: &str) -> DbPool {
//     if let Ok(pg_pool) = establish_postgres_connection(db_url).await {
//         let _ = run_postgres_migrations(&pg_pool).await; // Run migrations for PostgreSQL
//         DbPool {
//             pool: PoolType::Postgres(pg_pool),
//         }
//     } else {
//         let sqlite_pool = establish_sqlite_connection()
//             .await
//             .expect("Unable to establish SQLite database connection");
//         let _ = run_sqlite_migrations(&sqlite_pool).await; // Run migrations for SQLite
//         DbPool {
//             pool: PoolType::SQLite(sqlite_pool),
//         }
//     }

// }


async fn establish_postgres_connection(db_url: &str) -> Result<PgPool, sqlx::Error> {
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
        let _ = sqlx::migrate!("./migrations").run(&pool).await;
    }
    Ok(SqlitePool::connect(&db_url).await?)
}

async fn run_postgres_migrations(pool: &PgPool) {
    let _ = sqlx::migrate!("./migrations")
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



pub fn create_new()-> Result<String, Error> {
    let mut file = fs::File::create("local.txt")?;
    // file.write_all(b"sqlite")?;
    // file.write_all(b"\n")?; // Writing a newline character
    // file.write_all(b"custom")?;
    // file.write_all(b"\n")?; // Writing a newline character
    // file.write_all(b"random")?;
    // update_file("sqlite", 1);
    Ok("File created successfully".to_string())
}


pub fn update_file(content: &str,line_to_update: usize) -> Result<String, Error> {
    // Read the contents of the file
    let file_path = "local.txt";
    let file = fs::File::open(file_path)?;
    let reader = io::BufReader::new(file);
    let mut lines = reader.lines().collect::<Result<Vec<String>, _>>()?;
    // Update the lines as needed
    if line_to_update < lines.len() {
        lines[line_to_update] = content.to_string();
    } else {
        return Err(Error::new(ErrorKind::InvalidInput, "Line index out of bounds"));
    }
    // Write the modified contents back to the file
    let mut file = fs::File::create(file_path)?;
    for line in lines {
        file.write_all(line.as_bytes())?;
        file.write_all(b"\n")?; // Add newline after each line
    }

    Ok("File updated successfully".to_string())
}

pub fn read_specific_line(line_number: usize) -> Result<String, Error> {
    // Open the file
    let file = File::open("local.txt")?;
    let reader = io::BufReader::new(file);

    // Iterate through the lines until the desired line
    for (index, line) in reader.lines().enumerate() {
        if index == line_number - 1 {
            // Return the line if found
            return line.map_err(|e| Error::new(ErrorKind::Other, e));
        }
    }
    Err(Error::new(
        ErrorKind::InvalidInput,
        format!("Line {} not found", line_number),
    ))
}

