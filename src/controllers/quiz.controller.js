const {quizService} = require("../services");
const {announcementService} = require("../services");
const {validationOnCourse} = require("../utils/helperFunctions");
const statusMessageError = require("../utils/statusMessageError");

const sum = (accumulator, currentValue) => accumulator + currentValue;
const max_grade = (accumulator, currentValue) => 
    (accumulator > currentValue) ? accumulator: currentValue;

exports.createQuiz = async (req,res,next)=>{

    if(req.user.type !== "Professor"){
        return next (new statusMessageError(403,
            "You do not have the permission to perform this action"));
    }
    const course = await announcementService.checkCourseExist(req.params.id);
    if(!course){
        return next (new statusMessageError(400,"Invalid course ID"));
    }
    
    if(String(req.user._id) !== String(course.professor._id)){
        return next (new statusMessageError(403,
            "professor doesn't create this course"));
    }

    let sumResult = req.body.grades.reduce(sum);
    const totalGrades = req.body.grades.length;

    if(totalGrades === 0)
        return next (new statusMessageError(400,
            "Length of grades = 0"));

    const avg = sumResult/totalGrades; 
    console.log(avg);
    const maxGrade = req.body.grades.reduce(max_grade);
    console.log(maxGrade);
    //let newQuiz = createQuizHelper(req.body, req.params);
    let newQuiz = {
        name: req.body.name,
        course: req.params.id,
        full_mark: req.body.full_mark,
        avg: avg,
        max: maxGrade,
        students : req.body.students,
        grades :  req.body.grades
       
    }
    const quiz = await quizService.createQuiz(newQuiz);
    res.status(200).json({
        id: quiz._id,
        name: quiz.name,
        full_mark: quiz.full_mark,
        avg: quiz.avg,
        max: quiz.max
    });
};

exports.getQuiz = async (req,res,next)=>{

    if(req.user.type !== "Department")
        return next (new statusMessageError(403,
            "You do not have the permission to perform this action"));         
    const quiz = await quizService.getQuiz(req.params.id);
    if(!quiz){
        return next (new statusMessageError(400,"Invalid quiz id"));
    }
    res.status(200).json({
        id: quiz._id,
        name: quiz.name,
        full_mark: quiz.full_mark,
        avg: quiz.avg,
        max: quiz.max
    });
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
exports.getQuizzes = async (req, res, next) => {

    const course = await announcementService.checkCourseExist(req.params.id);
    if(!course){
        return next (new statusMessageError(400,"Invalid course ID"));
    }
    const check = validationOnCourse(req.user, course);
    if(check instanceof statusMessageError) return next(check);

    let quizzes = await quizService.getQuizzes(req.params.id, req.user.type);
    console.log("quizzes", quizzes);
    console.log("quiz", quizzes[0]);
    if(!quizzes){
        return next (new statusMessageError(400,
            "There are no quizzes"));
    }
    if(req.user.type === "Student"){
        const grades = getGrade(req.user, quizzes);
        res.status(200).json({
            items: quizzes.map((quiz, index) =>{
                
                return {
                    id: quiz._id,
                    name: quiz.name,
                    full_mark: quiz.full_mark,
                    student:{
                        id: req.user._id,
                        name: req.user.name,
                        imgUrl: req.user.imgUrl,
                        grade: grades[index]
                    }
                }
            })

        })
    }
    else{
        res.status(200).json({
            items: quizzes.map((quiz) => {
                return {
                    id: quiz._id,
                    name: quiz.name,
                    full_mark: quiz.full_mark,
                    avg: quiz.avg,
                    max: quiz.max
                }
            })
        })
    }
}
function getGrade(user, quizzes){

    let studIndex =  quizzes[0].students.findIndex((student, index) => {
        //console.log(course.name);   
        if(String(student._id) === String(user._id)){
            
            return true;
        }      
    });
    if(studIndex === -1){
        return new statusMessageError(403, "Student is not enrolled in this course");
    }
    //console.log(quizzes);
    //console.log(quizzes[0]);
    let grades = [];
    //let index = 0;
   
    quizzes.forEach(quiz => {

        grades.push(quiz.grades[studIndex])
    })
    
    return grades;
}