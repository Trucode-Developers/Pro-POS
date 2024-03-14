#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use sqlx::migrate::MigrateDatabase;
// use sqlx::postgres::PgPoolOptions;
// use sqlx::{PgPool, Sqlite, SqlitePool};
// use routes::users::{create, delete_user, get_all_users, get_user, greet, update,DbPool,PoolType};
mod routes;
use routes::users::{create, delete_user, get_all_users, get_user, greet, update};

pub mod db_connections;
use db_connections::{establish_database_connection,read_active_db, read_file_content, write_to_file, DbPool};
// use sqlx::{PgPool, SqlitePool};

#[tauri::command]
async fn change_db(url: String) -> String {
    _ = establish_database_connection(&url).await;
    _ = write_to_file("postgres.txt", &url);
    format!("Hello {}", url)
}
// #[tauri::command]
// pub fn get_active_database_type(db_pool: &DbPool) -> &'static str {
//     match &db_pool.pool {
//         PoolType::Postgres(_) => "postgres",
//         PoolType::SQLite(_) => "sqlite",
//     }
// }

#[tokio::main]
async fn main() {

    //  _ = write_to_file("postgres.txt", "postgres://postgres:Server@2244@localhost/pos");
    //   match write_to_file("postgres.txt", "postgres://postgres:Server@2244@localhost/pos") {
    //     Some(err) => println!("Error: {}", err),
    //     None => println!("File written successfully."),
    // }
    // let db_url = "postgres://postgres:Server@2244@localhost/pos";
    let file_path = "./docs/postgres.txt";
    let content = match read_file_content(file_path) {
        Ok(content) => content,
        Err(e) => {
            eprintln!("Error reading file: {:?}", e);
            return;
        }
    };

    let read_active_db = read_active_db();
    println!("Active database: {:?}", read_active_db);

    //if the file reads has a right url it will connect to postgres else it will default to sqlite
    let pool = establish_database_connection(&content).await;

    tauri::Builder::default()
        .manage(pool)
        .invoke_handler(tauri::generate_handler![
            greet,
            create,
            update,
            delete_user,
            get_all_users,
            get_user,
            change_db,
            // read_active_db,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
