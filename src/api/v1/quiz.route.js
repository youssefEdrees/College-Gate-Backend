const express = require("express");
const {quizConrtoller} = require("../../controllers");
const catchAsync = require("../../utils/catchAsync");
const {authenticate} = require("../../midllewares/auth");

const router = express.Router();


router
    .route("/course/:id")
    .post(catchAsync(authenticate), catchAsync(quizConrtoller.createQuiz));
    


router
    .route("/:id")
    .get(catchAsync(authenticate), catchAsync(quizConrtoller.getQuiz));
    
router
    .route("/all/course/:id")
    .get(catchAsync(authenticate), catchAsync(quizConrtoller.getQuizzes));

module.exports= router;