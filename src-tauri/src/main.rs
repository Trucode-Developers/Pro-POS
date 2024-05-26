#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod routes;
use routes::branches::{create_branch, delete_branch, get_all_branches, update_branch};
use routes::login::login;
use routes::permissions::get_all_permissions;
use routes::roles::{
    create_role, delete_role, get_all_roles, get_allocated_permission_slugs, get_assigned_roles,
    get_role_permissions, update_role,
};
use routes::users::{create, delete_user, get_all_users, get_user, greet, update_user};
mod settings;
use settings::global::{get_store_value, save_store_value, update_storage_path, upload_file};
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
            start_server,
            scan_for_servers,
            stop_broadcast,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use std::sync::{
    mpsc::{self, Sender},
    Mutex,
};
use std::thread;
// use std::time::Duration;

use settings::server::{broadcast_server_info, scan_for_servers};
use std::net::{IpAddr, TcpListener, UdpSocket};

use lazy_static::lazy_static;

lazy_static! {
    static ref STOP_TX: Mutex<Option<Sender<()>>> = Mutex::new(None);
}

fn get_local_ip() -> Option<IpAddr> {
    let socket = UdpSocket::bind("0.0.0.0:0").unwrap();
    socket.connect("8.8.8.8:80").unwrap(); // Connecting to a public IP to determine the local IP
    socket.local_addr().ok().map(|addr| addr.ip())
}

#[tauri::command]
fn start_server(db_url: String, storage_path: String) -> Result<String, String> {
    // Get the local IP address
    let local_ip = get_local_ip().expect("Unable to determine local IP address");
    let server_addr = format!("{}:0", local_ip); // Bind to a random available port

    // Bind the server to the local IP and a random port
    let listener = TcpListener::bind(&server_addr).unwrap();
    let server_addr = listener.local_addr().unwrap();

    let (stop_tx, stop_rx) = mpsc::channel();

    // Store the stop_tx in the global variable
    {
        let mut stop_tx_guard = STOP_TX.lock().unwrap();
        *stop_tx_guard = Some(stop_tx);
    }

    // Spawn a thread to run the broadcast loop
    thread::spawn(move || {
        broadcast_server_info(&server_addr.to_string(), &db_url, &storage_path, stop_rx);
        println!("Broadcast thread stopped");
    });

    Ok(server_addr.to_string())
}

#[tauri::command]
fn stop_broadcast() {
    // Retrieve the stop_tx from the global variable and send the stop signal
    let stop_tx_guard = STOP_TX.lock().unwrap();
    if let Some(ref stop_tx) = *stop_tx_guard {
        stop_tx.send(()).unwrap();
    }
}
