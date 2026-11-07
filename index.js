const { Pool } = require("pg");

const pool = new Pool({
  user: "ubuntu",
  host: "localhost",
  database: "ubuntu",
  password: "ubuntu",
  port: 5432,
});

async function runDatabaseDemo() {
  try {
    // 1. Create a table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        email VARCHAR(50)
      );
    `);
    console.log('Table "users" is ready!');

    // 2. Insert a new user
    await pool.query(`
      INSERT INTO users (name, email) 
      VALUES ('Alice', 'alice@example.com');
    `);
    console.log("Inserted a new user: Alice");

    // 3. Query all users from the table
    const result = await pool.query("SELECT * FROM users;");
    console.log("\n--- Current Users in Database ---");
    console.table(result.rows);
  } catch (err) {
    console.error("Database error:", err.stack);
  } finally {
    await pool.end();
  }
}

runDatabaseDemo();
