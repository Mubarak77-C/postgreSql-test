const { Pool } = require("pg");

const pool = new Pool({
  user: "ubuntu",
  host: "localhost",
  database: "ubuntu",
  password: "ubuntu",
  port: 5432,
});

async function runSafeInsert() {
  try {
    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        email VARCHAR(50)
      );
    `);

    // We want to insert a new user dynamically and safely
    const inputName = "Bob";
    const inputEmail = "bob@example.com";

    // $1 and $2 are placeholders for the array elements below
    const insertQuery = `
      INSERT INTO users (name, email) 
      VALUES ($1, $2)
      RETURNING *;
    `;

    const values = [inputName, inputEmail];

    const res = await pool.query(insertQuery, values);
    console.log("Successfully inserted user safely:");
    console.log(res.rows[0]);

    // Query all users to see everyone (Alice and Bob)
    const result = await pool.query("SELECT * FROM users;");
    console.log("\n--- All Users in Database ---");
    console.table(result.rows);
  } catch (err) {
    console.error("Database error:", err.stack);
  } finally {
    await pool.end();
  }
}

runSafeInsert();
