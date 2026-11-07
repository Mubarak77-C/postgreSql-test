const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Helper function to auto-initialize table with constraints on startup
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(50) UNIQUE NOT NULL
    );
  `);
}
initDB();

// --- 1. READ (GET all users) ---
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC;");
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- 2. CREATE (POST user with duplicate error handling) ---
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  // Brutal truth: Never trust client data. Validate first.
  if (!name || !email) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: "Name and email are required." });
  }

  try {
    const insertQuery = `
      INSERT INTO users (name, email) 
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [name, email]);

    res.status(201).json({
      message: "User created successfully!",
      user: result.rows[0],
    });
  } catch (err) {
    // BRUTAL TRUTH: Postgres error code 23505 means a UNIQUE constraint violation (Duplicate Email)
    if (err.code === "23505") {
      return res.status(409).json({
        error: "Conflict",
        message: "A user with this email address already exists.",
      });
    }

    console.error("Database error:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- 3. UPDATE (PUT user by ID) ---
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const updateQuery = `
      UPDATE users 
      SET name = COALESCE($1, name), email = COALESCE($2, email)
      WHERE id = $3
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [name, email, id]);

    // If no row was updated, the user ID didn't exist
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Not Found", message: `User with ID ${id} not found.` });
    }

    res.json({
      message: "User updated successfully!",
      user: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res
        .status(409)
        .json({
          error: "Conflict",
          message: "Email is already taken by another user.",
        });
    }
    console.error("Database error:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- 4. DELETE (DELETE user by ID) ---
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleteQuery = "DELETE FROM users WHERE id = $1 RETURNING *;";
    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Not Found", message: `User with ID ${id} not found.` });
    }

    res.json({
      message: "User deleted successfully!",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Database error:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Production-ready server running on http://localhost:${PORT}`);
});
