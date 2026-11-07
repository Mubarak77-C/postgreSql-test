// routes/userRouter.js
const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();

router.get("/users", userController.getUsers);
router.post("/users", userController.createUser);

module.exports = router;
