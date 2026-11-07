const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Create an API route to fetch all users from the database
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users;");
    res.json(result.rows); // Send the database rows back as JSON data
  } catch (err) {
    console.error("Database error:", err.stack);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(
    `Server is running! Open http://localhost:${PORT}/users in your browser.`,
  );
});
