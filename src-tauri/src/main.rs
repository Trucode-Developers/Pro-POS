#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod routes;
use routes::branches::{create_branch, delete_branch, get_all_branches, update_branch};
use routes::login::{login, unload_resources};
use routes::permissions::get_all_permissions;
use routes::roles::{
    create_role, delete_role, get_all_roles, get_allocated_permission_slugs, get_assigned_roles,
    get_role_permissions, update_role,
};
use routes::users::{create, delete_user, get_all_users, get_user, greet, update_user};
mod settings;
use settings::global::{get_store_value, save_store_value, update_storage_path, upload_file};
use settings::server::{scan_for_servers, start_server, stop_broadcast};

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
            // get_store_value,

            // managing the server,
            start_server,
            scan_for_servers, //pass the ip and port to scan for servers
            stop_broadcast,
            unload_resources,
        ])
           .on_window_event(|event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event.event() {
                api.prevent_close();
                let window = event.window().clone();
                std::thread::spawn(move || {
                    // Call the unload_resources function here
                    window.emit("before-close", {}).unwrap();
                    // Delay for a short period to ensure resources are unloaded
                    std::thread::sleep(std::time::Duration::from_millis(100));
                    window.close().unwrap();
                });
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

