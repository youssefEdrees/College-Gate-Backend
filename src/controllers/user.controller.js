const {userService, authService} =  require('./../services');
const config = require('config');
const statusMessageError = require("../utils/statusMessageError");


exports.createStudent = async (req,res,next)=> {
    const student = await userService.createStudent(req.body);
    res.status(200).json(student);
};

exports.createDepartment = async (req,res,next)=> {
    const key = config.get('MASTER_KEY');
    var receivedKey = req.body.key;
    var data = req.body.department;
    if (Number(key)!= Number(receivedKey)){
        next(new statusMessageError(401," Wrong key "));
    }
    if (data.password != data.passwordConfirm){
        next(new statusMessageError(400," Password and password confirm don't match "));
    }
    const newDepartment = await userService.createDepartment(data);
    
    res.status(200).json(newDepartment);
};



exports.createStudent = async (req,res,next)=> {
    
    var receivedKey = req.body.key;
    var data = req.body.user;
    data.department = data.departmentId;
    if (await userService.checkDepartmentKey(data.departmentId,receivedKey,"Student")){
        next(new statusMessageError(401," Wrong key "));
    }
    if (data.password != data.passwordConfirm){
        next(new statusMessageError(400," Password and password confirm don't match "));
    }
    const newStudent = await userService.createStudent(data);
    
    res.status(200).json(newStudent);
};

exports.createProfessor = async (req,res,next)=> {
    var receivedKey = req.body.key;
    var data = req.body.user;
    data.department = data.departmentId;
    if (await userService.checkDepartmentKey(data.departmentId,receivedKey,"Professor")){
        next(new statusMessageError(401," Wrong key "));
    }
    if (data.password != data.passwordConfirm){
        next(new statusMessageError(400," Password and password confirm don't match "));
    }
    const newProfessor = await userService.createProfessor(data);
    
    res.status(200).json(newProfessor);

};






exports.getDepartmentNames = async(req,res,next)=>{
    const departmentNames = await userService.getDepartmentList();
    res.status(200).json(departmentNames);
};

exports.getUser = async (req,res,next)=>{
    const user = req.user;
    res.status(200).json(user);
};

exports.departmentLogin = async (req,res,next)=>{
    requestedUser = await userService.getDepartmentLogin(req.body.email,req.body.password);
    if(requestedUser == null){
        next (new statusMessageError(401,"incorrect username or password"));
    }
    const token = authService.createToken(requestedUser._id);
    res.status(200).json({
        token : token,
        user : requestedUser });
};


exports.StudentLogin = async (req,res,next)=>{
    loggedUser = await userService.getStudentLogin(req.body.email,req.body.password);
    if(loggedUser == null){
        next (new statusMessageError(401,"incorrect username or password"));
    }
    const myToken = authService.createToken(loggedUser._id);
    res.status(200).json({
        token : myToken,
        user : loggedUser });
};


exports.professorLogin = async (req,res,next)=>{
    loggedUser = await userService.getProfessorLogin(req.body.email,req.body.password);
    if(loggedUser == null){
        next (new statusMessageError(401,"incorrect username or password"));
    }
    const myToken = authService.createToken(loggedUser._id);
    res.status(200).json({
        token : myToken,
        user : loggedUser });
};