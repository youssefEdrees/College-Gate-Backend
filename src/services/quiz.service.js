const {Quiz} = require("../models/quiz.model");

const mongoose = require("mongoose");

exports.createQuiz = async (newQuiz) =>{

    let quiz1 = await(await Quiz.create(newQuiz))
    .populate("students","_id name imgUrl")
    .populate("course", "name imgUrl")
    .execPopulate();
    
    quiz1 = quiz1.toJSON();
    return quiz1;
};
exports.getQuizzes = async (courseId) =>{

    // there are no quizzes for this course
    // course Invalid
    // user enroll or create this course 
    // if prof return name full_mark id of quizzess
    // if stud (i have auth id) i have students for each quiz check id = quiz.students(id)
    // return index this so now i can return grade return list of grades and quiz id 
    // and name and full_mark and stud info
    let result = Quiz.find({course: courseId})
    .select("_id full_mark name")
    .populate("students", "name imgUrl");

    [result] = await Promise.all([result]);
    return result;
   
};

exports.getQuiz = async (quizId) =>{
    let quiz1 = await(await Quiz.findById(quizId))
    .populate({path : "students",select:"_id name imgUrl"})
    .populate("course", "name imgUrl")
    .execPopulate();
    
    quiz1 = quiz1.toJSON();
    return quiz1;
};
/*exports.getQuizStudentsAndGrades = async(courseId) => {


}*/