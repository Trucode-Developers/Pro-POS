// // src/db.rs

// use sqlx::{Pool, Postgres, sqlite::SqliteConnectOptions, postgres::PgConnectOptions, Error};
// use std::env;

// pub enum DatabaseType {
//     SQLite,
//     PostgreSQL,
// }

// pub fn establish_connection(database_type: DatabaseType) -> Result<Pool<sqlx::Any>, Error> {
//     match database_type {
//         DatabaseType::SQLite => {
//             let sqlite_url = "sqlite:mydatabase.db";
//             let options = SqliteConnectOptions::new().filename(sqlite_url);
//             Pool::connect_with(options)
//         }
//         DatabaseType::PostgreSQL => {
//             let postgres_url = env::var("DATABASE_URL")
//                 .expect("DATABASE_URL must be set for PostgreSQL");
//             let options = PgConnectOptions::new().connect(&postgres_url);
//             Pool::connect_with(options)
//         }
//     }
// }
