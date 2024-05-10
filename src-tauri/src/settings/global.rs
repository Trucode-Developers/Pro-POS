use base64::Engine;
use dirs::{home_dir,data_dir};
use serde::{Deserialize, Serialize};
use std::fs::{File, OpenOptions};
use std::io::{BufReader, BufWriter, Write};
use std::path::PathBuf;

use std::collections::HashMap;
use std::sync::{Arc, Mutex};

// dirs::home_dir(); stands for the home directory of the current user.
// Lin: Some(/home/alice)
// Win: Some(C:\Users\Alice)
// Mac: Some(/Users/Alice)


#[tauri::command]
pub fn upload_file(file_data: String, name: String) -> Result<String, String> {
    let uploads_dir = get_path("user/folder");

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
        let uploads_dir = local_path().join(path);
        uploads_dir
    } else {
        PathBuf::from(set_path).join(path)
    }
}
pub fn local_path() -> PathBuf {
    let home_dir = home_dir().unwrap_or_else(|| PathBuf::from("."));
    let default_dir = home_dir.join("truepos/");
    default_dir
}


#[tauri::command]
pub async fn update_storage_path(path: String) -> Result<String, String> {
    if path.is_empty() || path == "" || path == " " {
       let _ = save_store_value("storage_path".to_string(), local_path().to_string_lossy().to_string());
         Ok(local_path().to_string_lossy().to_string())
    }else{
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
    let store = load_store();
    store.lock().unwrap().0.insert(key, value);
    save_store(&store.lock().unwrap());
}

#[tauri::command]
pub fn get_store_value(key: String) -> Option<String> {
    let store = load_store();
    let x = store.lock().unwrap().0.get(&key).cloned();
    x
}
fn get_store_file_path() -> PathBuf {
    // use data_dir() instead of home_dir() to get the data directory for the current user
    let data_dir = data_dir().unwrap_or_else(|| PathBuf::from("."));
    let files_dir = data_dir.join("truepos/");
    std::fs::create_dir_all(&files_dir).unwrap_or_default(); // create the directory if it doesn't exist
    let file_name = "store.tr";
    files_dir.join(file_name)
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
