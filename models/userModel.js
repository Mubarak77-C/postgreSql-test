// models/userModel.js
const pool = require("../db/pool");

const User = {
  async getAll() {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC;");
    return result.rows;
  },

  async create(name, email) {
    const query =
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *;";
    const result = await pool.query(query, [name, email]);
    return result.rows[0];
  },
};

module.exports = User;
