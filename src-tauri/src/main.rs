#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod routes;
use routes::branches::{create_branch,get_all_branches,update_branch,delete_branch};
use routes::roles::{create_role,delete_role,get_all_roles,update_role,get_role_permissions,get_assigned_roles,get_allocated_permission_slugs};
use routes::users::{create, delete_user, get_all_users, get_user, greet, update_user};
use routes::permissions::get_all_permissions;
use routes::login::login;
mod settings;
use settings::global::{upload_file,update_storage_path,save_store_value,get_store_value};
pub mod db_connections;
use db_connections::establish_database_connection;

#[tauri::command]
async fn change_db(url: String) -> String {
    let _ = establish_database_connection(&url).await;
    let _ = save_store_value("db_url".to_string(), url.clone());
    url
}
#[tauri::command]
async fn current_active_db() -> String {
    let active_db = get_store_value("active_db".to_string()).unwrap_or_default();
    active_db
}

#[tokio::main]
async fn main() {
    // let _ = save_store_value("initialize".to_string(), "app running".to_string());
    // let _ = get_store_file_path(); //create the storage path and initialize the local store
    let db_url = get_store_value("db_url".to_string()).unwrap_or_default();
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
            login,

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

            upload_file,
            update_storage_path,
            get_store_value,
            save_store_value,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
