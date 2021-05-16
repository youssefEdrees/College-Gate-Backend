const express = require("express");
const {userConrtoller} = require("../../controllers");
const catchAsync = require("../../utils/catchAsync");

const router = express.Router();


router.route("/student/signup")
    .post(catchAsync(userConrtoller.createStudent));


    module.exports= router;