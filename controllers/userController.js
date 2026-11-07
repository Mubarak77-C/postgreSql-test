// controllers/userController.js
const User = require("../models/userModel");

const userController = {
  async getUsers(req, res) {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async createUser(req, res) {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    try {
      const newUser = await User.create(name, email);
      res.status(201).json({ message: "User created!", user: newUser });
    } catch (err) {
      if (err.code === "23505") {
        return res.status(409).json({ error: "Email already exists." });
      }
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = userController;
