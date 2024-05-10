use crate::db_connections::{read_specific_line, update_file};
use base64::Engine;
use dirs::home_dir;
use std::fs::File;
use std::io::Write;
use std::path::PathBuf;

// dirs::home_dir(); stands for the home directory of the current user.
// Lin: Some(/home/alice)
// Win: Some(C:\Users\Alice)
// Mac: Some(/Users/Alice)


pub fn get_path(path: &str) -> PathBuf {
    // the storage_path is stored on txt line 3
    // let set_path = read_specific_line(3).unwrap();
    // //    if path is set return it else return uploads_dir or if = "" return uploads_dir
    // println!("Path: {}", set_path);
    // if set_path.is_empty() || set_path == "" || set_path == "local-storage" {
        let home_dir = home_dir().unwrap_or_else(|| PathBuf::from("."));
        let uploads_dir = home_dir.join("truepos/").join(path);
        uploads_dir
    // } else {
    //     PathBuf::from(set_path).join(path)
    // }

}

#[tauri::command]
pub fn upload_file(
    file_data: String,
    name: String,
) -> Result<String, String> {
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

#[tauri::command]
pub async fn update_storage_path(path: String) -> Result<String, String> {
    // println!("Path: {}", path);
    let _ = update_file(&path, 3);
    Ok("Path updated successfully".to_string())
}
