const express = require('express');

const quizRoute = require("./quiz.route");
const authRoute = require("./quiz.route");

const router = express.Router();


router.use("/quiz",quizRoute);
router.use("/auth",authRoute);

module.exports= router;