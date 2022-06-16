const express = require("express");
const userRouter = express.Router();
const { registerUser, authUser } = require('../controllers/userController')

userRouter.route("/").post(registerUser);
userRouter.route("/login").post(authUser);



module.exports = userRouter;