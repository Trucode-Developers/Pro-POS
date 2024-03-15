// use tauri::State;
use sqlx::migrate::MigrateDatabase;
use sqlx::postgres::PgPoolOptions;
use sqlx::{PgPool, Sqlite, SqlitePool};

use std::result::Result;

use std::fs::{self,OpenOptions,File};
use std::io::{self, Read,BufRead, Error,Write,ErrorKind};

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

pub async fn establish_database_connection(db_url: &str) -> DbPool {
    if let Ok(pg_pool) = establish_postgres_connection(db_url).await {
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
    }

}
// pub async fn establish_database_connection(db_url: &str) -> DbPool {
//     let db_pool = if let Ok(pg_pool) = establish_postgres_connection(db_url).await {
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
//     };

//     // Call set_active_db with the DbPool object
//     set_active_db(db_pool)

//     // db_pool // Return the DbPool object
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

//postgress url
pub fn write_to_file(file_name: &str, content: &str) -> Option<String> {
    let path = format!("./docs/{}", file_name);

    // Truncate the file if it exists
    if path_exists(&path) {
        if let Err(err) = OpenOptions::new().write(true).truncate(true).open(&path) {
            return Some(format!("Error truncating file: {}", err));
        }
    }

    // Write content to the file
    match fs::write(&path, content) {
        Ok(_) => None,
        Err(err) => Some(format!("Error writing to file: {}", err)),
    }
}

// Function to check if a file exists
fn path_exists(path: &str) -> bool {
    fs::metadata(path).is_ok()
}

pub fn read_file_content(file_path: &str) -> Result<String, Error> {
    fs::read_to_string(file_path).map_err(|e| e.into())
}
//postgress url

//active database
//get the value of get_active_database_type and write it to a file
pub fn set_active_db( db_pool: DbPool) -> DbPool {
    let content = get_active_database_type(&db_pool).to_string();

    if let Some(err) = write_to_file("active_db.txt", &content) {
        eprintln!("Error: {}", err);
    }
    db_pool


}

pub fn create_new()-> Result<String, Error> {
    let mut file = fs::File::create("test_db.txt")?;
    file.write_all(b"sqlite custom random")?;
     file.write_all(b"sqlite")?;
    file.write_all(b"\n")?; // Writing a newline character
    file.write_all(b"custom")?;
    file.write_all(b"\n")?; // Writing a newline character
    file.write_all(b"random")?;
    update_file("sqlite", 1);
    Ok("File created successfully".to_string())
}

pub fn update_file(content: &str,line_to_update: usize) -> Result<String, Error> {
    // Read the contents of the file
    let file_path = "test_db.txt";
    let file = fs::File::open(file_path)?;
    let reader = io::BufReader::new(file);
    let mut lines = reader.lines().collect::<Result<Vec<String>, _>>()?;

    // Update the lines as needed
    // let line_to_update = 2; // For example, let's say we want to update the third line
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
    let file = File::open("test_db.txt")?;
    let reader = io::BufReader::new(file);

    // Iterate through the lines until the desired line
    for (index, line) in reader.lines().enumerate() {
        if index == line_number - 1 {
            // Return the line if found
            return line.map_err(|e| Error::new(ErrorKind::Other, e));
        }
    }

    // If the line is not found
    Err(Error::new(
        ErrorKind::InvalidInput,
        format!("Line {} not found", line_number),
    ))
}




pub fn read_file_contents() -> Result<String, Error> {
    let mut file = fs::File::open("test_db.txt")?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

// read the active_db
// #[tauri::command]
pub fn read_active_db() -> Result<String, Error> {
    let path = "./docs/active_db.txt";
    read_file_content(path)

}
