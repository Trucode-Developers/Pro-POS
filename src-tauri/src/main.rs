#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// use routes::users::{create, delete_user, get_all_users, get_user, greet, update,DbPool,PoolType};
// use fix_path_env;
mod routes;
use routes::users::{create, delete_user, get_all_users, get_user, greet, update};
pub mod db_connections;
use db_connections::{ create_new, establish_database_connection, read_specific_line, update_file};

#[tauri::command]
async fn change_db(url: String) -> String {
    let _ = establish_database_connection(&url).await;
    let _ = update_file(&url, 0);
    format!("Hello {}", url)
}
#[tauri::command]
async fn current_active_db() -> String {
    let active_db = read_specific_line(2).unwrap();
    active_db
}

#[tokio::main]
async fn main() {
    let _ = fix_path_env::fix();
    let _ = create_new();
    let db_url = read_specific_line(1).unwrap();

    //if the file reads has a right url it will connect to postgres else it will default to sqlite
    let pool = establish_database_connection(&db_url).await;

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
            current_active_db,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
