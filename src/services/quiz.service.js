const {Quiz} = require("../models/quiz.model");

const mongoose = require("mongoose");

exports.createQuiz = async (newQuiz) =>{
    let quiz1 = await(await Quiz.create(newQuiz))
    .populate("student","_id name imgUrl")
    .execPopulate();
    
    quiz1 = quiz1.toJSON();
    return quiz1;
};


exports.getQuiz = async (quizId) =>{
    let quiz1 = await(await Quiz.findById(quizId))
    .populate({path : "students",select:"_id name imgUrl"})
    .execPopulate();
    
    quiz1 = quiz1.toJSON();
    return quiz1;
};