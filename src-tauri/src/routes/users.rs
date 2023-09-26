

#[tauri::command]
pub fn greet(name: &str) -> String {
   format!("Hello, {}!", name)
}

#[tauri::command]
pub fn get_user(name: &str) -> String {
   format!("Hello, {}!", name)
}
