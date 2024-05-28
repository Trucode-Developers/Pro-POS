use base64::Engine;
use dirs::{config_dir, home_dir};
use serde::{Deserialize, Serialize};
// use sqlx::encode;
use std::fs::{File, OpenOptions};
use std::io::{BufReader, BufWriter, Write};
use std::path::PathBuf;

use data_encoding::HEXLOWER;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
// dirs::home_dir(); stands for the home directory of the current user.
// Lin: Some(/home/alice)
// Win: Some(C:\Users\Alice)
// Mac: Some(/Users/Alice)

// dirs::config_dir();
// Lin: Some(/home/alice/.config)
// Win: Some(C:\Users\Alice\AppData\Roaming)
// Mac: Some(/Users/Alice/Library/Application Support)

#[tauri::command]
pub fn upload_file(file_data: String, name: String) -> Result<String, String> {
    let uploads_dir = get_path("user/test");

    std::fs::create_dir_all(&uploads_dir).map_err(|err| err.to_string())?;

    let file_path = uploads_dir.join(name);
    let mut file = File::create(&file_path).map_err(|err| err.to_string())?;

    let decoded_file = base64::prelude::BASE64_STANDARD
        .decode(&file_data)
        .expect("Failed to decode base64 data.");

    file.write_all(&decoded_file)
        .map_err(|err| err.to_string())?;

    Ok(file_path.to_string_lossy().to_string())
}

pub fn get_path(path: &str) -> PathBuf {
    let set_path = get_store_value("storage_path".to_string()).unwrap_or_default();
    if set_path.is_empty() || set_path == "" || set_path == " " {
        let uploads_dir = local_home_path().join(path);
        uploads_dir
    } else {
        PathBuf::from(set_path).join(path)
    }
}
pub fn local_home_path() -> PathBuf {
    let home_dir = home_dir().unwrap_or_else(|| PathBuf::from("."));
    let default_dir = home_dir.join("truepos/");
    default_dir
}

#[tauri::command]
pub async fn update_storage_path(path: String) -> Result<String, String> {
    if path.is_empty() || path == "" || path == " " {
        let _ = save_store_value(
            "storage_path".to_string(),
            local_home_path().to_string_lossy().to_string(),
        );
        Ok(local_home_path().to_string_lossy().to_string())
    } else {
        let _ = save_store_value("storage_path".to_string(), path.clone());
        Ok(path)
    }
}

//storing key value pairs

#[derive(Default, Serialize, Deserialize)]
struct StoreData(HashMap<String, String>);
type Store = Arc<Mutex<StoreData>>;

#[tauri::command]
pub fn save_store_value(key: String, value: String) {
    let encoded_value = encrypt_secrets(&value).unwrap();
    let store = load_store();
    store.lock().unwrap().0.insert(key, encoded_value);
    save_store(&store.lock().unwrap());
}

#[tauri::command]
pub fn get_store_value(key: String) -> Option<String> {
    let store = load_store();
    let x = store.lock().unwrap().0.get(&key).cloned();
    let decoded_value = x.and_then(|v| retrieve_secrets(&v));
    decoded_value
}

#[tauri::command]
pub fn get_store_file_path() -> PathBuf {
    let files_dir = local_data_path();
    std::fs::create_dir_all(&files_dir).unwrap_or_default(); // create the directory if it doesn't exist
    let file_name = "store.tr";
    files_dir.join(file_name)
}

pub fn local_data_path() -> PathBuf {
    let config_dir = config_dir().unwrap_or_else(|| PathBuf::from("."));
    let data_dir_path = config_dir.join("truepos/");
    data_dir_path
}

fn load_store() -> Store {
    let file_path = get_store_file_path();
    if file_path.exists() {
        let file = File::open(file_path).unwrap();
        let reader = BufReader::new(file);
        let store_data: StoreData = serde_json::from_reader(reader).unwrap_or_default();
        Arc::new(Mutex::new(store_data))
    } else {
        Arc::new(Mutex::new(StoreData::default()))
    }
}

fn save_store(store: &StoreData) {
    let mut file = BufWriter::new(
        OpenOptions::new()
            .create(true)
            .write(true)
            .truncate(true)
            .open(get_store_file_path())
            .unwrap(),
    );
    println!("store");
    serde_json::to_writer(&mut file, store).unwrap();
}

//end of storing key value pairs

fn encrypt_secrets(secret: &str) -> Result<String, String> {
    let encrypted_value = HEXLOWER.encode(secret.as_bytes());
    // println!("Encrypted value: {}", encrypted_value);
    let _ = retrieve_secrets(&encrypted_value);
    Ok(encrypted_value)
}

fn retrieve_secrets(encrypted_secret: &str) -> Option<String> {
    let decoded = match HEXLOWER.decode(encrypted_secret.as_bytes()) {
        Ok(decoded) => decoded,
        Err(e) => {
            println!("Error decoding value: {}", e);
            return None;
        }
    };
    let decrypted_value = match String::from_utf8(decoded) {
        Ok(value) => value,
        Err(err) => {
            println!("Error decrypting value: {}", err);
            return None;
        }
    };
    // println!("Decrypted value: {}", decrypted_value);
    Some(decrypted_value)
}
