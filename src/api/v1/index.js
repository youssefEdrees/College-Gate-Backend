const express = require('express');

const quizRoute = require("./quiz.route");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const announcementRoute = require("./announcement.route");
const messageRoute = require("./message.route");
const complaintRoute = require("./complaint.route");
const warningRoute = require("./warning.route");
const courseRoute = require("./course.route");

const router = express.Router();


router.use("/quiz",quizRoute);
router.use("/auth",authRoute);
router.use("/user",userRoute);
router.use("/announcement", announcementRoute);
router.use("/message", messageRoute);
router.use("/complaintMessage", complaintRoute);
router.use("/warningMessage", warningRoute);
router.use("/course", courseRoute);

module.exports= router;