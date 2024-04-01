use serde::{Deserialize, Serialize};
use sqlx::{PgPool, SqlitePool};
use thiserror::Error;
use tauri::State;

use crate::db_connections::{DbPool, PoolType};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct Permission {
    pub id: Option<i32>,
    pub name: String,
    pub slug: String
}

#[derive(Error, Serialize, Debug)]
pub enum CustomError {
    #[error("An error occurred")]
    GenericError,
}

async fn get_all_permissions_postgres(pool: &PgPool) -> Result<Vec<Permission>, CustomError> {
    let query = "SELECT * FROM permissions";
    let result = sqlx::query_as::<_, Permission>(query).fetch_all(pool).await;
    result.map_err(|_| CustomError::GenericError)
}

async fn get_all_permissions_sqlite(pool: &SqlitePool) -> Result<Vec<Permission>, CustomError> {
    let query = "SELECT * FROM permissions";
    let result = sqlx::query_as::<_, Permission>(query).fetch_all(pool).await;
    match result {
        Ok(permissions) => Ok(permissions),
        Err(_) => Err(CustomError::GenericError),
    }
}

async fn create_permissions_in_pool(permission: Permission, db_pool: &DbPool) -> Result<(), CustomError> {
    match &db_pool.pool {
        PoolType::Postgres(pool) => {
            let query = "INSERT INTO permissions (name, slug) VALUES ($1, $2)";
            let result = sqlx::query(query)
                .bind(&permission.name)
                .bind(&permission.slug)
                .execute(pool)
                .await;
            result.map_err(|_| CustomError::GenericError)?;
        }
        PoolType::SQLite(pool) => {
            let query =
                "INSERT INTO permissions (name, slug) VALUES (?, ?)";
            let result = sqlx::query(query)
                .bind(&permission.name)
                .bind(&permission.slug)
                .execute(pool)
                .await;
            result.map_err(|_| CustomError::GenericError)?;
        }
    }
    Ok(())
}

pub async fn compare_and_add_permissions(db_pool: &DbPool) -> Result<(), CustomError> {
    let permissions = vec![
        Permission {
            id: None,
            slug: String::from("can-view-user"),
            name: String::from("View User")
        },
        Permission {
            id: None,
            slug: String::from("can-delete-user"),
            name: String::from("Delete User")
        },
        Permission {
            id: None,
            slug: String::from("can-create-user"),
            name: String::from("Create User")
        },
        Permission {
            id: None,
            slug: String::from("can-view-dashboard"),
            name: String::from("View Dashboard")
        },
        Permission {
            id: None,
            slug: String::from("can-manage-settings"),
            name: String::from("Manage Settings")
        },
        Permission {
            id: None,
            slug: String::from("can-new-settings"),
            name: String::from("New Settings")
        },
        Permission {
            id: None,
            slug: String::from("can-view-roles"),
            name: String::from("View System Roles")
        },
    ];

    let existing_permissions = get_permissions_from_pool(&db_pool).await?;

    for permission in permissions {
        // println!("Checking permission: {:?}", permission);
        if !existing_permissions.iter().any(|p| p.slug == permission.slug) {
            println!("Adding permission : {:?}", permission);
            create_permissions_in_pool(permission, &db_pool).await?;
        }
    }

    Ok(())
}



pub async fn get_permissions_from_pool(db_pool: &DbPool) -> Result<Vec<Permission>, CustomError> {
    match &db_pool.pool {
        PoolType::Postgres(pool) => get_all_permissions_postgres(pool).await,
        PoolType::SQLite(pool) => get_all_permissions_sqlite(pool).await,
    }
}

//get all permissions
#[tauri::command]
pub async fn get_all_permissions(state: State<'_, DbPool>) -> Result<Vec<Permission>, CustomError> {
    get_permissions_from_pool(&state).await
}


