// app.js
const express = require("express");
const userRouter = require("./routes/userRouter");

const app = express();

// 1. Set EJS as the templating engine
app.set("view engine", "ejs");

// 2. Middleware to parse incoming JSON AND HTML form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Mount routes
app.use("/", userRouter);

module.exports = app;
