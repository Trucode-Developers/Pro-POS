#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use fix_path_env;
mod routes;
use routes::branches::{create_branch,get_all_branches,update_branch,delete_branch};
use routes::roles::{create_role,delete_role,get_all_roles,update_role,get_role_permissions,get_assigned_roles,get_allocated_permission_slugs};
use routes::users::{create, delete_user, get_all_users, get_user, greet, update_user};
use routes::permissions::get_all_permissions;
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
            update_user,
            delete_user,
            get_all_users,
            get_user, ////not used
            change_db,
            current_active_db,

            //branches
            get_all_branches,
            create_branch,
            update_branch,
            delete_branch,
            //roles and permissions
            get_all_roles,
            create_role,
            update_role,
            delete_role,
            get_all_permissions,
            get_role_permissions,
            get_allocated_permission_slugs,
            get_assigned_roles,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
