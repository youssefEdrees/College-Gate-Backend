const {quizService} = require("../services");



exports.createQuiz = async (req,res,next)=>{
    const quiz = await quizService.createQuiz(req.body);
    res.status(200).json(quiz);
};



exports.getQuiz = async (req,res,next)=>{
    const quiz = await quizService.getQuiz(req.params.id);
    res.status(200).json(quiz);
};
