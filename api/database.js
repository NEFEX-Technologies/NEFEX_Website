const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Initialize Database
async function initDb() {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT
        )`);

        await pool.query(`CREATE TABLE IF NOT EXISTS jobs (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            location TEXT,
            experience TEXT,
            description TEXT,
            skills_data TEXT,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        // Add skills_data column silently if it doesn't exist (it will throw error if exists, which we catch)
        try {
            await pool.query(`ALTER TABLE jobs ADD COLUMN skills_data TEXT`);
        } catch (err) {
            // Ignore error if column already exists
        }

        // Create a default Admin user if none exists
        const res = await pool.query("SELECT COUNT(*) as count FROM users");
        if (parseInt(res.rows[0].count) === 0) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            await pool.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, ['admin', hashedPassword]);
            console.log("Default admin account created. (admin / password123)");
        }
    } catch (error) {
        console.error("Database initialization error:", error);
    }
}

initDb();

module.exports = {
    query: (text, params) => pool.query(text, params),
};
