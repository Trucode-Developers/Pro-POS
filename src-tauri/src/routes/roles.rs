use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::{PgPool, SqlitePool};
use tauri::State;

use crate::db_connections::{DbPool, PoolType};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct Role {
    pub id: Option<i32>,
    pub total_permissions: Option<i32>, //only used on getting all roles with total permissions
    pub code: String,
    pub name: String,
}

// Create a new role
#[tauri::command]
pub async fn create_role(role: Role, state: State<'_, DbPool>) -> Result<Value, Value> {
    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "INSERT INTO roles (code, name) VALUES ($1, $2) RETURNING id";
            let result = sqlx::query(query)
                .bind(&role.code)
                .bind(&role.name)
                .fetch_one(pool)
                .await;

            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "Role created successfully",
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
            let query = "INSERT INTO roles (code, name) VALUES (?, ?)";
            let result = sqlx::query(query)
                .bind(&role.code)
                .bind(&role.name)
                .execute(pool)
                .await;

            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "Role created successfully",
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

// Get all roles
#[tauri::command]
pub async fn get_all_roles(state: State<'_, DbPool>) -> Result<Value, Value> {
    match &state.pool {
        PoolType::Postgres(pool) => get_all_roles_postgres(pool).await.map(|roles| {
            let json = json!({
                "status": 200,
                "data": roles,
            });
            // println!("roles: {:?}", roles);
            json
        }),
        PoolType::SQLite(pool) => get_all_roles_sqlite(pool).await.map(|roles| {
            let json = json!({
                "status": 200,
                "data": roles,
            });
            json
        }),
    }
}

async fn get_all_roles_postgres(pool: &PgPool) -> Result<Vec<Role>, Value> {
    let query = "
        SELECT roles.*, CAST(COUNT(role_permissions.*) AS INTEGER) AS total_permissions
        FROM roles
        LEFT JOIN role_permissions ON role_permissions.role_id = roles.id
        GROUP BY roles.id
        ORDER BY roles.id DESC";

    let result = sqlx::query_as::<_, Role>(query).fetch_all(pool).await;

    result.map_err(|e| {
        let json = json!({
            "status": 500,
            "message": e.to_string()
        });
        json
    })
}

async fn get_all_roles_sqlite(pool: &SqlitePool) -> Result<Vec<Role>, Value> {
    let query = "
        SELECT roles.*, CAST(COUNT(role_permissions.*) AS INTEGER) AS total_permissions
        FROM roles
        LEFT JOIN role_permissions ON role_permissions.role_id = roles.id
        GROUP BY roles.id
        ORDER BY roles.id DESC";

    let result = sqlx::query_as::<_, Role>(query).fetch_all(pool).await;

    result.map_err(|e| {
        let json = json!({
            "status": 500,
            "message": e.to_string()
        });
        json
    })
}

#[tauri::command]
pub async fn update_role(
    id: i32,
    allocated_permissions: Vec<i32>,
    role: Role,
    state: State<'_, DbPool>,
) -> Result<Value, Value> {
    match &state.pool {
        PoolType::Postgres(pool) => {
            // Update role name and code
            let query = "UPDATE roles SET name = $1, code = $2 WHERE id = $3";
            let _ = sqlx::query(query)
                .bind(&role.name)
                .bind(&role.code)
                .bind(&id)
                .execute(pool)
                .await
                .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;

            // Delete existing role_permissions
            let delete_query = "DELETE FROM role_permissions WHERE role_id = $1";
            sqlx::query(delete_query)
                .bind(&id)
                .execute(pool)
                .await
                .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;

            // Insert new role_permissions
            for permission_id in allocated_permissions {
                let insert_query =
                    "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)";
                sqlx::query(insert_query)
                    .bind(&id)
                    .bind(&permission_id)
                    .execute(pool)
                    .await
                    .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;
            }

            let json = json!({ "status": 200, "message": "Role updated successfully", });
            Ok(json)
        }
        PoolType::SQLite(pool) => {
            // Update role name and code
            let query = "UPDATE roles SET name = ?, code = ? WHERE id = ?";
            let _ = sqlx::query(query)
                .bind(&role.name)
                .bind(&role.code)
                .bind(&id)
                .execute(pool)
                .await
                .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;

            // Delete existing role_permissions
            let delete_query = "DELETE FROM role_permissions WHERE role_id = ?";
            let _ = sqlx::query(delete_query)
                .bind(&id)
                .execute(pool)
                .await
                .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;

            // Insert new role_permissions
            for permission_id in allocated_permissions {
                let insert_query =
                    "INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)";
                sqlx::query(insert_query)
                    .bind(&id)
                    .bind(&permission_id)
                    .execute(pool)
                    .await
                    .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;
            }

            let json = json!({ "status": 200, "message": "Role updated successfully", });
            Ok(json)
        }
    }
}

//get assigned permissions to a role
#[tauri::command]
pub async fn get_role_permissions(role_id: i32, state: State<'_, DbPool>) -> Result<Value, Value> {
    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "SELECT permission_id FROM role_permissions WHERE role_id = $1";
            let permissions: Vec<(i32,)> = sqlx::query_as(query)
                .bind(&role_id)
                .fetch_all(pool)
                .await
                .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;

            let permissions: Vec<i32> = permissions.iter().map(|(id,)| *id).collect();

            let json = json!({ "status": 200, "data": permissions });
            Ok(json)
        }
        PoolType::SQLite(pool) => {
            let query = "SELECT permission_id FROM role_permissions WHERE role_id = ?";
            let permissions: Vec<(i32,)> = sqlx::query_as(query)
                .bind(&role_id)
                .fetch_all(pool)
                .await
                .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;

            let permissions: Vec<i32> = permissions.iter().map(|(id,)| *id).collect();

            let json = json!({ "status": 200, "data": permissions });
            Ok(json)
        }
    }
}

//get assigned roles to a role
#[tauri::command]
pub async fn get_assigned_roles(user_id: i32, state: State<'_, DbPool>) -> Result<Value, Value> {
    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "SELECT role_id FROM user_roles WHERE user_id = $1";
            let roles: Vec<(i32,)> = sqlx::query_as(query)
                .bind(&user_id)
                .fetch_all(pool)
                .await
                .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;

            let roles: Vec<i32> = roles.iter().map(|(id,)| *id).collect();

            let json = json!({ "status": 200, "data": roles });
            Ok(json)
        }
        PoolType::SQLite(pool) => {
            let query = "SELECT role_i FROM user_roles WHERE user_id = ?";
            let roles: Vec<(i32,)> = sqlx::query_as(query)
                .bind(&user_id)
                .fetch_all(pool)
                .await
                .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;

            let roles: Vec<i32> = roles.iter().map(|(id,)| *id).collect();

            let json = json!({ "status": 200, "data": roles });
            Ok(json)
        }
    }
}

#[tauri::command]
pub async fn get_allocated_permission_slugs(
    user_id: i32,
    state: State<'_, DbPool>,
) -> Result<Value, Value> {
    // Get the allocated role IDs for the user
    let role_ids: Vec<i32> = match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "SELECT role_id FROM user_roles WHERE user_id = $1";
            let roles: Vec<(i32,)> = sqlx::query_as(query)
                .bind(&user_id)
                .fetch_all(pool)
                .await
                .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;
            roles.iter().map(|(id,)| *id).collect()
        }
        PoolType::SQLite(pool) => {
            let query = "SELECT role_id FROM user_roles WHERE user_id = ?";
            let roles: Vec<(i32,)> = sqlx::query_as(query)
                .bind(&user_id)
                .fetch_all(pool)
                .await
                .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;
            roles.iter().map(|(id,)| *id).collect()
        }
    };

    // Get the unique permission slugs for the allocated role IDs
    let mut unique_slugs = Vec::new();
    for role_id in &role_ids {
        // Clone the state to avoid borrowing issues
        let cloned_state = state.clone();

        // Get a vector of allocated permission IDs from get_role_permissions
        let permissions = get_role_permissions(*role_id, cloned_state).await?;
        let permissions = permissions.get("data").unwrap().as_array().unwrap();
        let permission_ids: Vec<i32> = permissions
            .iter()
            .map(|id| id.as_i64().unwrap() as i32)
            .collect();

        // Define the query string for both Postgres and SQLite
        let query = match &state.pool {
            PoolType::Postgres(_) => {
                format!("SELECT slug FROM permissions WHERE id = ANY($1)")
            }
            PoolType::SQLite(_) => {
                let placeholders = (1..=permission_ids.len())
                    .map(|_| "?")
                    .collect::<Vec<_>>()
                    .join(",");
                format!(
                    "SELECT slug FROM permissions WHERE id IN ({})",
                    placeholders
                )
            }
        };

        // Execute the query based on the database type
        let slugs: Vec<(String,)> = match &state.pool {
            PoolType::Postgres(pool) => {
                sqlx::query_as(&query)
                    .bind(&permission_ids)
                    .fetch_all(pool)
                    .await
            }
            PoolType::SQLite(pool) => {
                let mut query = sqlx::query_as(&query);
                for id in &permission_ids {
                    query = query.bind(id);
                }
                query.fetch_all(pool).await
            }
        }
        .map_err(|e| json!({ "status": 500, "message": e.to_string() }))?;

        // Extract slugs from the result and add them to the unique_slugs vector
        let new_slugs: Vec<_> = slugs
            .into_iter()
            .filter(|slug| !unique_slugs.contains(slug))
            .collect();
        unique_slugs.extend(new_slugs);
    }

    // let json = json!({ "status": 200, "data": unique_slugs.iter().map(|(s,)| s.as_str()).collect::<Vec<_>>() });
    // Ok(json)
    Ok(unique_slugs.iter().map(|(s,)| s.to_string()).collect())
}

// Delete a role
#[tauri::command]
pub async fn delete_role(id: i32, state: State<'_, DbPool>) -> Result<Value, Value> {
    match &state.pool {
        PoolType::Postgres(pool) => {
            let query = "DELETE FROM roles WHERE id = $1";
            let result = sqlx::query(query).bind(&id).execute(pool).await;
            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "Role deleted successfully",
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
            let query = "DELETE FROM roles WHERE id = ?";
            let result = sqlx::query(query).bind(&id).execute(pool).await;
            match result {
                Ok(_) => {
                    let json = json!({
                        "status": 200,
                        "message": "Role deleted successfully",
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
