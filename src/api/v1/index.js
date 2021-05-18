const express = require('express');

const quizRoute = require("./quiz.route");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");

const router = express.Router();


router.use("/quiz",quizRoute);
router.use("/auth",authRoute);
router.use("/user",userRoute);

module.exports= router;