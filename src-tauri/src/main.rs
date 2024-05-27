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
    mpsc::{channel, Sender},
    Mutex,
};
use std::thread;
// use std::time::Duration;

use settings::server::{broadcast_server_info, scan_for_servers};
use std::net::{IpAddr, SocketAddr, UdpSocket};

// use std::sync::mpsc::{channel, Sender};
use jsonrpc_core::{IoHandler, Params};
use jsonrpc_http_server::ServerBuilder;
use serde_json::Value;

// Global variable to hold the stop signal Sender
static STOP_TX: Mutex<Option<Sender<()>>> = Mutex::new(None);

// Function to get the local IP address
fn get_local_ip() -> Option<IpAddr> {
    let socket = UdpSocket::bind("0.0.0.0:0").ok()?;
    socket.connect("8.8.8.8:80").ok()?;
    socket.local_addr().ok().map(|addr| addr.ip())
}

#[tauri::command]
fn start_server(db_url: String, storage_path: String) -> Result<String, String> {
    let (stop_tx, stop_rx) = channel();
    *STOP_TX.lock().unwrap() = Some(stop_tx);

    let server_addr = format!("{}:3030", get_local_ip().unwrap_or(IpAddr::from([127, 0, 0, 1])));

    let server_addr_cloned = server_addr.clone();

    thread::spawn(move || {
        let mut io: IoHandler = IoHandler::default();
        io.add_method("say_hello", |_params: Params| async {
            Ok(Value::String("hello".to_string()))
        });
        io.add_method("add", |params: Params| async {
            let tuple: (i64, i64) = params.parse::<(i64, i64)>()?;
            Ok(Value::Number(serde_json::Number::from(tuple.0 + tuple.1)))
        });

        let server = ServerBuilder::new(io)
            .threads(3)
            .start_http(&server_addr_cloned.parse::<SocketAddr>().unwrap())
            .unwrap();

        println!("Server started on {}", server.address());

        // Listen for stop signal
        let _ = stop_rx.recv();
        println!("Stopping server...");
    });

    Ok(server_addr)
}

#[tauri::command]
fn stop_broadcast() {
    let stop_tx_guard = STOP_TX.lock().unwrap();
    if let Some(ref stop_tx) = *stop_tx_guard {
        stop_tx.send(()).unwrap();
    }
}