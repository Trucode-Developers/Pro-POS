use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::{PgPool, SqlitePool};
use tauri::State;

use crate::db_connections::{DbPool, PoolType};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct Branch {
    pub code: String,
    pub name: String,
    pub address: String,
    pub phone: String,
    pub email: String,
    pub description: String,
    pub status: bool,
}

#[tauri::command]
pub async fn create_branch(branch: Branch, state: State<'_, DbPool>) -> Result<Value, Value> {
    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "INSERT INTO branches (code,name, address, phone, email, description,status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id";
            let result = sqlx::query(query)
                .bind(&branch.code)
                .bind(&branch.name)
                .bind(&branch.address)
                .bind(&branch.phone)
                .bind(&branch.email)
                .bind(&branch.description)
                .bind(&branch.status)
                .fetch_one(pool)
                .await;

            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "Branch created successfully",
                    });
                    Ok(json)
                }
                Err(e) => {
                    let json = json!({
                        "status": 500,
                        "message": e.to_string()
                    });
                    Err(json)
                }
            }
        }
        PoolType::SQLite(pool) => {
            let query = "INSERT INTO branches (code,name, address, phone, email, description,status) VALUES (?, ?, ?, ?, ?, ?)";
            let result = sqlx::query(query)
                .bind(&branch.code)
                .bind(&branch.name)
                .bind(&branch.address)
                .bind(&branch.phone)
                .bind(&branch.email)
                .bind(&branch.description)
                .bind(&branch.status)
                .execute(pool)
                .await;

            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "Branch created successfully",
                    });
                    Ok(json)
                }
                Err(e) => {
                    let json = json!({
                        "status": 500,
                        "data": e.to_string()
                    });
                    Err(json)
                }
            }
        }
    }
}

//get data from the db
#[tauri::command]
pub async fn get_all_branches(state: State<'_, DbPool>) -> Result<Value, Value> {
    match &state.pool {
        PoolType::Postgres(pool) => get_all_branches_postgres(pool).await.map(|branches| {
            let json = json!({
                "status": 200,
                "data": branches,
            });
            json
        }),
        PoolType::SQLite(pool) => get_all_branches_sqlite(pool).await.map(|branches| {
            let json = json!({
                "status": 200,
                "data": branches,
            });
            json
        }),
    }
}

async fn get_all_branches_postgres(pool: &PgPool) -> Result<Vec<Branch>, Value> {
    let query = "SELECT * FROM branches ORDER BY id DESC";
    let result = sqlx::query_as::<_, Branch>(query).fetch_all(pool).await;
    result.map_err(|e| {
        let json = json!({
            "status": 500,
            "message": e.to_string()
        });
        json
    })
}

async fn get_all_branches_sqlite(pool: &SqlitePool) -> Result<Vec<Branch>, Value> {
    let query = "SELECT * FROM branches ORDER BY id DESC";
    let result = sqlx::query_as::<_, Branch>(query).fetch_all(pool).await;
    result.map_err(|e| {
        let json = json!({
            "status": 500,
            "message": e.to_string()
        });
        json
    })
}
//get data from the db

#[tauri::command]
pub async fn update_branch(
    code: String,
    branch: Branch,
    state: State<'_, DbPool>,
) -> Result<Value, Value> {
    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "UPDATE branches SET name = $2, address = $3, phone = $4, email = $5, description = $6, status = $7 WHERE code = $1";
            let result = sqlx::query(query)
                .bind(&code)
                .bind(&branch.name)
                .bind(&branch.address)
                .bind(&branch.phone)
                .bind(&branch.email)
                .bind(&branch.description)
                .bind(&branch.status)
                .execute(pool)
                .await;
            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "Branch updated successfully",
                    });
                    Ok(json)
                }
                Err(e) => {
                    let json = json!({
                        "status": 500,
                        "message": e.to_string()
                    });
                    Err(json)
                }
            }
        }
        PoolType::SQLite(pool) => {
            let query = "UPDATE branches SET name = ?, address = ?, phone = ?, email = ?, description = ?, status = ? WHERE code = ?";
            let result = sqlx::query(query)
                .bind(&branch.name)
                .bind(&branch.address)
                .bind(&branch.phone)
                .bind(&branch.email)
                .bind(&branch.description)
                .bind(&branch.status)
                .bind(&code)
                .execute(pool)
                .await;
            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "Branch updated successfully",
                    });
                    Ok(json)
                }
                Err(e) => {
                    let json = json!({
                        "status": 500,
                        "data": e.to_string()
                    });
                    Err(json)
                }
            }
        }
    }
}

#[tauri::command]
pub async fn delete_branch(code: String, state: State<'_, DbPool>) -> Result<Value, Value> {
    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "DELETE FROM branches WHERE code = $1";
            let result = sqlx::query(query).bind(&code).execute(pool).await;
            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "Branch deleted successfully",
                    });
                    Ok(json)
                }
                Err(e) => {
                    let json = json!({
                        "status": 500,
                        "message": e.to_string()
                    });
                    Err(json)
                }
            }
        }
        PoolType::SQLite(pool) => {
            let query = "DELETE FROM branches WHERE code = ?";
            let result = sqlx::query(query).bind(&code).execute(pool).await;
            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "Branch deleted successfully",
                    });
                    Ok(json)
                }
                Err(e) => {
                    let json = json!({
                        "status": 500,
                        "data": e.to_string()
                    });
                    Err(json)
                }
            }
        }
    }
}
