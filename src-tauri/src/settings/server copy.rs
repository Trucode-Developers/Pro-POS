use std::net::{IpAddr, Ipv4Addr, SocketAddr, TcpListener, TcpStream, UdpSocket};
use std::io::{Read, Write};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant};
use ipnet::IpNet;
use std::str::FromStr;
use tauri::command;

const BROADCAST_PORT: u16 = 8888; // Define a common broadcast port
const BROADCAST_ADDR: &str = "255.255.255.255:8888"; // General broadcast address

// Function to broadcast server information
pub fn broadcast_server_info(server_addr: &str, db_url: &str, storage_path: &str) {
    let socket = UdpSocket::bind("0.0.0.0:0").unwrap();
    socket.set_broadcast(true).unwrap();
    let message = format!("{}|{}|{}", server_addr, db_url, storage_path);
    let broadcast_addr: SocketAddr = BROADCAST_ADDR.parse().unwrap();

    loop {
        match socket.send_to(message.as_bytes(), &broadcast_addr) {
            Ok(_) => println!("Broadcasted server info: {}", message),
            Err(e) => eprintln!("Failed to broadcast server info: {}", e),
        }
        thread::sleep(Duration::from_secs(5));
    }
}

// Function to handle client connections
pub fn handle_client(mut stream: TcpStream, clients: Arc<Mutex<Vec<TcpStream>>>) {
    clients.lock().unwrap().push(stream.try_clone().unwrap());

    let mut buffer = [0; 1024];

    loop {
        let bytes_read = match stream.read(&mut buffer) {
            Ok(bytes) => bytes,
            Err(e) => {
                eprintln!("Failed to read from client: {}", e);
                break;
            },
        };

        if bytes_read == 0 {
            // Client disconnected
            break;
        }

        let request = String::from_utf8_lossy(&buffer[..bytes_read]);
        println!("Received request: {}", request);

        // Handle the request (database queries, file operations, etc.)
        let response = "Response from server".to_string();
        match stream.write_all(response.as_bytes()) {
            Ok(_) => println!("Sent response to client"),
            Err(e) => eprintln!("Failed to send response: {}", e),
        }
    }
}

// Function to start the server
pub fn start_server_fn(server_addr: &str) {
    let listener = TcpListener::bind(server_addr).unwrap();
    let clients = Arc::new(Mutex::new(Vec::new()));

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                let clients = Arc::clone(&clients);
                thread::spawn(move || {
                    handle_client(stream, clients);
                    println!("Client disconnected");
                });
            }
            Err(e) => eprintln!("Failed to accept client: {}", e),
        }
    }
}

// Tauri command to scan for servers
#[tauri::command]
pub fn scan_for_servers() -> Option<Vec<(String, String, String)>> {
    let port = BROADCAST_PORT;
    let mut available_servers = Vec::new();
    let start_time = Instant::now();

    // Iterate over the possible IP ranges (e.g., 192.168.0.0/16 and 10.0.0.0/8)
    for ip_range in &["192.168.0.0/16", "10.0.0.0/8"] {
        let network = IpNet::from_str(ip_range).unwrap();

        // Iterate over the subnet addresses within the IP range
        for subnet in network.subnets(24).unwrap() {
            let broadcast_addr = SocketAddr::new(subnet.broadcast(), port);

            let socket = UdpSocket::bind("0.0.0.0:0").unwrap();
            socket.set_broadcast(true).unwrap();
            match socket.send_to(&[0], &broadcast_addr) {
                Ok(_) => println!("Sent discovery packet to {}", broadcast_addr),
                Err(e) => eprintln!("Failed to send discovery packet: {}", e),
            }

            let mut buf = [0; 1024];
            socket.set_read_timeout(Some(Duration::from_secs(1))).unwrap();

            match socket.recv_from(&mut buf) {
                Ok((amt, _src)) => {
                    let message = std::str::from_utf8(&buf[..amt]).unwrap();
                    let parts: Vec<&str> = message.split('|').collect();

                    if parts.len() == 3 {
                        let server_addr = parts[0].to_string();
                        let db_url = parts[1].to_string();
                        let storage_path = parts[2].to_string();

                        available_servers.push((server_addr, db_url, storage_path));
                    }
                }
                Err(_) => {}
            }

            // Check if 5 seconds have elapsed
            if start_time.elapsed() >= Duration::from_secs(5) {
                return if available_servers.is_empty() {
                    None
                } else {
                    Some(available_servers)
                };
            }
        }
    }

    if available_servers.is_empty() {
        None
    } else {
        Some(available_servers)
    }
}

