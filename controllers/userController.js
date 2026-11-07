// controllers/userController.js
const User = require("../models/userModel");

const userController = {
  // Render the HTML page with users
  async getUsers(req, res) {
    try {
      const users = await User.getAll();
      // 'users' corresponds to views/users.ejs, passing the users array object
      res.render("users", { users });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },

  // Handle form submission and redirect back to the page
  async createUser(req, res) {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).send("Name and email are required.");
    }

    try {
      await User.create(name, email);
      // Redirect back to the users list page so the user sees the new entry instantly
      res.redirect("/users");
    } catch (err) {
      if (err.code === "23505") {
        return res.status(409).send("Error: Email already exists.");
      }
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = userController;
