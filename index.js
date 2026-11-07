const { Pool } = require("pg");

// Create a pool to connect to your local PostgreSQL database
const pool = new Pool({
  user: "ubuntu",
  host: "localhost",
  database: "ubuntu",
  password: "ubuntu",
  port: 5432,
});

async function testConnection() {
  try {
    // Ask PostgreSQL for the current database time
    const res = await pool.query("SELECT NOW()");
    console.log("Successfully connected to PostgreSQL!");
    console.log("Current Database Time:", res.rows[0].now);
  } catch (err) {
    console.error("Connection error:", err.stack);
  } finally {
    // Close the database pool connection
    await pool.end();
  }
}

testConnection();
