// use tauri::State;
use sqlx::migrate::MigrateDatabase;
use sqlx::postgres::PgPoolOptions;
use sqlx::{PgPool, Sqlite, SqlitePool};

use std::fs::{self, File, OpenOptions};
use std::io::{self, BufRead, Error, ErrorKind, Read, Seek, SeekFrom, Write};
use std::path::{Path, PathBuf};
use std::result::Result;
use dirs;
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
pub fn set_active_db(db_pool: DbPool) -> DbPool {
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

async fn establish_postgres_connection(db_url: &str) -> Result<PgPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(100)
        .connect(&db_url)
        .await
}

// async fn establish_sqlite_connection() -> Result<SqlitePool, sqlx::Error> {
//     let db_url = String::from("sqlite://sqlite.db");
//     if !Sqlite::database_exists(&db_url).await.unwrap() {
//         Sqlite::create_database(&db_url).await.unwrap();
//         let pool = SqlitePool::connect(&db_url).await.unwrap();
//         let _ = sqlx::migrate!("./migrations").run(&pool).await;
//     }
//     Ok(SqlitePool::connect(&db_url).await?)
// }
async fn establish_sqlite_connection() -> Result<SqlitePool, sqlx::Error> {
    // Get the AppData directory
    let mut appdata_dir = match dirs::data_dir() {
        Some(dir) => dir,
        None => {
            return Err(sqlx::Error::Io(io::Error::new(
                io::ErrorKind::NotFound,
                "AppData directory not found",
            )));
        }
    };

    // Append the folder name "truepos" to the AppData directory
    appdata_dir.push("truepos");

    // Check if the directory exists, create it if it doesn't
    if !appdata_dir.exists() {
        fs::create_dir_all(&appdata_dir)?;
    }

    // Append the database file name to the folder path
    appdata_dir.push("sqlite.db");

    // Convert the path to a string
    let db_path = appdata_dir.to_string_lossy().to_owned();

    // Database URL with the path to the SQLite file
    let db_url = format!("sqlite://{}", db_path);

    // Check if the database exists, create it if it doesn't
    if !Sqlite::database_exists(&db_url).await.unwrap() {
        Sqlite::create_database(&db_url).await.unwrap();
        let pool = SqlitePool::connect(&db_url).await.unwrap();
        let _ = sqlx::migrate!("./migrations").run(&pool).await;
    }

    // Connect to the SQLite database
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

// pub fn create_new() -> Result<String, Error> {
//     let file_path = "local.txt";
//     // Check if the file exists
//     if !file_exists(&file_path)? {
//         // File doesn't exist, create it and write default content
//         let mut file = fs::File::create(&file_path)?;
//         file.write_all(b"sqlite")?;
//         file.write_all(b"\n")?; // Writing a newline character
//         file.write_all(b"sqlite ")?;
//         file.write_all(b"\n")?; // Writing a newline character
//         file.write_all(b"third line")?;
//         file.write_all(b"\n")?; // Writing a newline character
//         file.write_all(b"fourth line")?;
//         file.write_all(b"\n")?; // Writing a newline character
//         file.write_all(b"fifth line")?;
//         Ok("File created successfully".to_string())
//     } else {
//         // File exists, no need to update
//         Ok("File already exists".to_string())
//     }
// }

// fn file_exists(file_path: &str) -> Result<bool, Error> {
//     match fs::metadata(file_path) {
//         Ok(metadata) => Ok(metadata.is_file()),
//         Err(_) => Ok(false), // File doesn't exist
//     }
// }
pub fn create_new() -> Result<String, io::Error> {
    // Get the AppData directory
    let mut appdata_dir = match dirs::data_dir() {
        Some(dir) => dir,
        None => {
            return Err(io::Error::new(
                io::ErrorKind::NotFound,
                "AppData directory not found",
            ));
        }
    };

    // Append the folder name "truepos" to the AppData directory
    appdata_dir.push("truepos");

    // Check if the directory exists, create it if it doesn't
    if !appdata_dir.exists() {
        fs::create_dir_all(&appdata_dir)?;
    }

    // Append the file name "local.txt" to the folder path
    appdata_dir.push("local.txt");

    // Convert the path to a string
    let file_path = appdata_dir.to_string_lossy().to_owned();

    // Check if the file exists
    if !file_exists(&file_path)? {
        // File doesn't exist, create it and write default content
        let mut file = fs::File::create(&*file_path)?;
        file.write_all(b"sqlite\n")?;
        file.write_all(b"sqlite\n")?;
        file.write_all(b"third line\n")?;
        file.write_all(b"fourth line\n")?;
        file.write_all(b"fifth line\n")?;
        Ok("File created successfully".to_string())
    } else {
        // File exists, no need to update
        Ok("File already exists".to_string())
    }
}

fn file_exists(file_path: &str) -> io::Result<bool> {
    let path = Path::new(file_path);
    Ok(path.exists())
}

fn get_file_path(file_name: &str) -> Option<PathBuf> {
    // Get the AppData directory
    let mut appdata_dir = match dirs::data_dir() {
        Some(dir) => dir,
        None => return None, // Unable to get the AppData directory
    };

    // Append the folder name "truepos" to the AppData directory
    appdata_dir.push("truepos");

    // Append the file name to the folder path
    appdata_dir.push(file_name);

    Some(appdata_dir)
}

pub fn update_file(content: &str, line_to_update: usize) -> Result<String, Error> {
    // Read the contents of the file
    let file_path = get_file_path("local.txt").unwrap();
    let file = fs::File::open(file_path.clone())?;
    let reader = io::BufReader::new(file);
    let mut lines = reader.lines().collect::<Result<Vec<String>, _>>()?;
    // Update the lines as needed
    if line_to_update < lines.len() {
        lines[line_to_update] = content.to_string();
    } else {
        return Err(Error::new(
            ErrorKind::InvalidInput,
            "Line index out of bounds",
        ));
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
    let file_path = get_file_path("local.txt").unwrap();
    let file = File::open(file_path)?;
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
