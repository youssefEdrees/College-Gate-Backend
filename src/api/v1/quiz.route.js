const express = require("express");
const {quizConrtoller} = require("../../controllers");
const catchAsync = require("../../utils/catchAsync");
//const { route } = require("../api/v1");

const router = express.Router();


router
    .route("/")
    .post(catchAsync(quizConrtoller.createQuiz));
    


router
    .route("/:id")
    .get(catchAsync(quizConrtoller.getQuiz));
    
router.route("/")
    .get((req,res)=>{
        res.end("adad");
    }
    );
module.exports= router;