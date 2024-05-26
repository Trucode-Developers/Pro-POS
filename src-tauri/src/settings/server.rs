use std::net::{Ipv4Addr, SocketAddr, UdpSocket};
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

pub fn broadcast_server_info(
    server_addr: &str,
    db_url: &str,
    storage_path: &str,
    stop_rx: mpsc::Receiver<()>,
) {
    // Create the UDP socket
    let socket = UdpSocket::bind("0.0.0.0:0").expect("Failed to bind socket");
    socket
        .set_broadcast(true)
        .expect("Failed to enable broadcast");

    // Prepare the message
    let message = format!("{}|{}|{}", server_addr, db_url, storage_path);

    // Parse the server address to get the port
    let parts: Vec<&str> = server_addr.split(':').collect();
    let port: u16 = parts[1].parse().expect("Failed to parse port number");

    // Define the list of subnets to broadcast to
    let subnets = vec![
        Ipv4Addr::new(192, 168, 0, 103),
        Ipv4Addr::new(192, 168, 1, 103),
        Ipv4Addr::new(192, 168, 2, 103),
        Ipv4Addr::new(10, 0, 0, 255),
        // Add more subnets as needed
    ];

    loop {
        // Send the broadcast message to each subnet
        for subnet in &subnets {
            let broadcast_addr: SocketAddr = SocketAddr::new((*subnet).into(), port + 1);
            match socket.send_to(message.as_bytes(), &broadcast_addr) {
                Ok(_) => println!(
                    "Broadcasted server info: {} to address {}",
                    message, broadcast_addr
                ),
                Err(e) => eprintln!("Failed to broadcast server info: {}", e),
            }
        }

        // Check if a stop signal has been received
        match stop_rx.try_recv() {
            Ok(_) | Err(mpsc::TryRecvError::Disconnected) => {
                println!("Stop signal received. Exiting broadcast loop.");
                break;
            }
            Err(mpsc::TryRecvError::Empty) => {} // No stop signal received, continue broadcasting
        }

        // Sleep for a specified duration before sending the next broadcast
        thread::sleep(Duration::from_secs(1));
    }
}

#[tauri::command]
pub fn scan_for_servers(ip: String, broadcast_port: u16) -> Option<(String, String, String)> {
    // Parse the provided IP address and port
    let broadcast_port = broadcast_port + 1;
    let target_addr: SocketAddr = format!("{}:{}", ip, broadcast_port).parse().unwrap();

    // Bind the socket once to listen for incoming responses
    let socket = UdpSocket::bind("0.0.0.0:0").unwrap();
    socket.set_broadcast(true).unwrap();
    socket
        .set_read_timeout(Some(Duration::from_secs(5)))
        .unwrap();

    // Send a discovery packet to the specified address
    match socket.send_to(&[0], &target_addr) {
        Ok(_) => println!("Sent discovery packet to {}", target_addr),
        Err(e) => {
            eprintln!("Failed to send discovery packet: {}", e);
            return None;
        }
    }

    // Introduce a delay to allow the broadcast to propagate and the server to respond
    thread::sleep(Duration::from_millis(6000)); // Adjust this delay as needed

    // Listen for a response
    let mut buf = [0; 1024];
    match socket.recv_from(&mut buf) {
        Ok((amt, _src)) => {
            let message = std::str::from_utf8(&buf[..amt]).unwrap();
            let parts: Vec<&str> = message.split('|').collect();

            if parts.len() == 3 {
                let server_addr = parts[0].to_string();
                let db_url = parts[1].to_string();
                let storage_path = parts[2].to_string();

                println!(
                    "Discovered server: {}|{}|{}",
                    server_addr, db_url, storage_path
                );
                return Some((server_addr, db_url, storage_path));
            }
        }
        Err(_) => {
            eprintln!("No response received from {}", target_addr);
        }
    }

    None
}
