const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON data in request bodies
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 1. GET route to view all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users;");
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err.stack);
    res.status(500).send("Server Error");
  }
});

// 2. POST route to create a new user dynamically
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  try {
    const insertQuery = `
      INSERT INTO users (name, email) 
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [name, email];
    const result = await pool.query(insertQuery, values);

    // Send back the newly created user record with a 201 Created status
    res.status(201).json({
      message: "User created successfully!",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Database error:", err.stack);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running! Open http://localhost:${PORT}/users`);
});
