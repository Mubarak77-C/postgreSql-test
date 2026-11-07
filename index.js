const { Pool } = require("pg");
// This loads the variables from your .env file
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testEnvSetup() {
  try {
    const result = await pool.query("SELECT * FROM users;");
    console.log("Successfully connected using .env variables!");
    console.log("\n--- Current Users in Database ---");
    console.table(result.rows);
  } catch (err) {
    console.error("Database error:", err.stack);
  } finally {
    await pool.end();
  }
}

testEnvSetup();
