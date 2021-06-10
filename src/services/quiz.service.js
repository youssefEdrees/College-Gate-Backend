const {Quiz} = require("../models/quiz.model");

const mongoose = require("mongoose");

exports.createQuiz = async (newQuiz) =>{

    let quiz1 = await Quiz.create(newQuiz);
    //.populate("students"," name imgUrl")
    //.populate("course", "name imgUrl");
    
    quiz1 = quiz1.toJSON();
    return quiz1;
};
exports.getQuizzes = async (courseId, type) =>{

    // there are no quizzes for this course
    // course Invalid
    // user enroll or create this course 
    // if prof return name full_mark id of quizzess
    // if stud (i have auth id) i have students for each quiz check id = quiz.students(id)
    // return index this so now i can return grade return list of grades and quiz id 
    // and name and full_mark and stud info
    let result;
    if(type === "Student"){
        result = Quiz.find({course: courseId})
        .select("_id full_mark name students grades avg max")
        .populate("students", "name imgUrl");
    }
    else{
        result = Quiz.find({course: courseId})
        .select("_id full_mark name max avg");
        
    }

    [result] = await Promise.all([result]);
    return result;
   
};

exports.getQuiz = async (quizId) =>{

    let quiz1 =  Quiz.findById(quizId)
    .select( "name _id full_mark avg max");
    //.populate({path : "students",select:"_id name imgUrl"})
    //.populate("course", "name imgUrl");
    //.execPopulate();
    [quiz1] = await Promise.all([quiz1]);
    //quiz1 = quiz1.toJSON();
    return quiz1;
};
/*exports.getQuizStudentsAndGrades = async(courseId) => {


}*/