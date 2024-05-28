use reqwest::Client;
use serde_json::{Map, Value};
use std::sync::{
    mpsc::{channel, Sender},
    Mutex,
};
use std::thread;
use tokio::time::Duration;

use std::net::{IpAddr, SocketAddr, UdpSocket};
use jsonrpc_core::{IoHandler, Params};
use jsonrpc_http_server::ServerBuilder;

use super::global::get_store_value;

// Global variable to hold the stop signal Sender
static STOP_TX: Mutex<Option<Sender<()>>> = Mutex::new(None);

// Function to get the local IP address
fn get_local_ip() -> Option<IpAddr> {
    let socket = UdpSocket::bind("0.0.0.0:0").ok()?;
    socket.connect("8.8.8.8:80").ok()?;
    socket.local_addr().ok().map(|addr| addr.ip())
}

#[tauri::command]
pub fn start_server() -> Result<String, String> {
    let (stop_tx, stop_rx) = channel();
    *STOP_TX.lock().unwrap() = Some(stop_tx);

    let server_addr = format!(
        "{}:3030",
        get_local_ip().unwrap_or(IpAddr::from([127, 0, 0, 1]))
    );

    let server_addr_cloned = server_addr.clone();

    //  https://www.youtube.com/watch?v=FaPrnPMY_po
    thread::spawn(move || {
        let mut io: IoHandler = IoHandler::default();
        io.add_method("say_hello", |_params: Params| async {
            Ok(Value::String("hello".to_string()))
        });
        io.add_method("add", |params: Params| async {
            let tuple: (i64, i64) = params.parse::<(i64, i64)>()?;
            Ok(Value::Number(serde_json::Number::from(tuple.0 + tuple.1)))
        });
        //establish_connection
        io.add_method("establish_connection", |params: Params| async {
            let tuple: (String, i64) = params.parse::<(String, i64)>()?;
            //check if tuple.0 == D7xv4tMjwG7mJIsGtWTQIA==
            if tuple.0 == "D7xv4tMjwG7mJIsGtWTQIA==" {
                let db_url = get_store_value("db_url".to_string()).unwrap_or_default();
                let storage_path = get_store_value("storage_path".to_string()).unwrap_or_default();
                //return a json object with the db_url and storage path
                let mut response = serde_json::Map::new();
                response.insert("db_url".to_string(), Value::String(db_url));
                response.insert(
                    "storage_path".to_string(),
                    // Value::String("C:\\Users\\user\\Desktop\\".to_string()),
                    Value::String(storage_path),
                );
                Ok(Value::Object(response))
            } else {
                //return an object with an error message
                Ok(Value::Object(serde_json::Map::new()))
            }
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
pub fn stop_broadcast() {
    let stop_tx_guard = STOP_TX.lock().unwrap();
    if let Some(ref stop_tx) = *stop_tx_guard {
        stop_tx.send(()).unwrap();
    }
}

#[tauri::command]
pub async fn scan_for_servers(ip: String, broadcast_port: u16) -> Result<Value, String> {
    println!("Scanning for servers at {}:{}", ip, broadcast_port);

    let url = format!("http://{}:{}", ip, broadcast_port);
    let client = Client::new();

    let body = serde_json::json!({
        "jsonrpc": "2.0",
        "method": "establish_connection",
        "params": ["D7xv4tMjwG7mJIsGtWTQIA==", 2024],
        "id": 1
    });

    let response = client
        .post(&url)
        .json(&body)
        .timeout(Duration::from_secs(10))
        .send()
        .await
        .map_err(|e| format!("Failed to send request: {}", e))?;

    let json_response: Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse JSON response: {}", e))?;

    let result = json_response
        .get("result")
        .ok_or_else(|| "No 'result' field found in the response".to_string())?;

    if let Value::Object(result_obj) = result {
        let db_url = result_obj
            .get("db_url")
            .and_then(|v| v.as_str())
            .unwrap_or_default()
            .to_string();
        let storage_path = result_obj
            .get("storage_path")
            .and_then(|v| v.as_str())
            .unwrap_or_default()
            .to_string();

        let mut response_obj = Map::new();
        response_obj.insert("db_url".to_string(), Value::String(db_url));
        response_obj.insert("storage_path".to_string(), Value::String(storage_path));
        println!("response_obj: {:?}", response_obj);
        Ok(Value::Object(response_obj))
    } else {
        println!("Unexpected response format: {:?}", json_response);
        Err("Unexpected response format".to_string())
    }
}
