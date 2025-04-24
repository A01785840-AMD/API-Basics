import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';


dotenv.config();

const queryUsers = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT
);`;

const queryItems = `CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  type TEXT,
  effect TEXT
);`;

const queryUsersItems = `CREATE TABLE IF NOT EXISTS usersItem (
  user_id INTEGER,
  item_id INTEGER,
  PRIMARY KEY (user_id, item_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);`;


const db = new sqlite3.Database(process.env.DB_PATH || './db.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to database', err.message);
    } else {
        console.log('Connected to database');

        db.run(queryUsers);
        db.run(queryItems);
        db.run(queryUsersItems);
    }
});


export default db;