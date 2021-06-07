const {quizService} = require("../services");



exports.createQuiz = async (req,res,next)=>{

    if(req.user.type !== "Professor"){
        return next (new statusMessageError(403,
            "You do not have the permission to perform this action"));
    }
    if(String(req.user.course._id) !== String(req.params.id)){
        return next (new statusMessageError(403,
            "professor doesn't create this course"));
    }
    fillGrades
    let newQuiz = createQuizHelper(req.body, req.params);
    const quiz = await quizService.createQuiz(newQuiz);
    res.status(200).json(quiz);
};

exports.getQuiz = async (req,res,next)=>{
    const quiz = await quizService.getQuiz(req.params.id);
    res.status(200).json(quiz);
};

function createQuizHelper(body, params){

    let students = [];
    let grades = [];
    req.body.students.forEach(stud => {

        students.push[stud.id];
        grades.push[stud.grade];
    });
    let newQuiz = {
        name: req.body.name,
        course: req.params.id,
        full_mark: req.body.full_mark,
        students,
        grades
    }

    return newQuiz;

}
