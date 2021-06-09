const {userService, authService} =  require('./../services');
const config = require('config');
const statusMessageError = require("../utils/statusMessageError");
const multer = require('multer');
const fs = require('fs').promises;

const multerStorage = multer.diskStorage({

    destination : (req, file, cb) => {
        cb(null, "uploads/users");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null,`${new Date().toISOString()}-${file.originalname}`);
    }

});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[1].match(/(png|jpg|jpeg)/)) {
        cb(null, true);
    } else {
        cb(new statusMessageError(400, 'Not an image! Please upload only images.'), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadImage = upload.single('image');

exports.createStudent = async (req,res,next)=> {
    const student = await userService.createStudent(req.body);
    res.status(200).json(student);
};

exports.createDepartment = async (req,res,next)=> {
    const key = config.get('MASTER_KEY');
    var receivedKey = req.body.key;
    var data = req.body.department;
    if (Number(key)!= Number(receivedKey)){
        return next(new statusMessageError(401," Wrong key "));
    }
    if (data.password != data.passwordConfirm){
        return next(new statusMessageError(400," Password and password confirm don't match "));
    }
    const check = await userService.checkDepartmentName(data);
    if(check) return next(new statusMessageError(400," Department name already exists "));

    const newDepartment = await userService.createDepartment(data);
    
    res.status(200).json({
        id: newDepartment._id,
        departmentName: newDepartment.departmentName,
        email: newDepartment.email,
        name: newDepartment.name,
        imgUrl: newDepartment.imgUrl,
        professorKey: newDepartment.professorKey,
        studentKey: newDepartment.studentKey,
        type: newDepartment.type

    });
};



exports.createStudent = async (req,res,next)=> {
    
    var receivedKey = req.body.key;
    var data = req.body.user;
    //data.department = data.departmentId;
    dep = await userService.checkDepartmentKey(receivedKey,"Student");
    if (!dep){
        return next(new statusMessageError(401," Wrong key"));
    }
    if (data.password != data.passwordConfirm){
        return next(new statusMessageError(400," Password and password confirm don't match "));
    }
    data.department = dep._id;
    const newStudent = await userService.createStudent(data);
    
    res.status(200).json(newStudent);
};

exports.createProfessor = async (req,res,next)=> {
    var receivedKey = req.body.key;
    var data = req.body.user;
    //data.department = data.departmentId;
    dep = await userService.checkDepartmentKey(receivedKey,"Professor");
    if (!dep){
        return next(new statusMessageError(401," Wrong key"));
    }
    if (data.password != data.passwordConfirm){
        return next(new statusMessageError(400," Password and password confirm don't match "));
    }
    data.department = dep._id;
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
        return next (new statusMessageError(401,"Incorrect username or password or different user type"));
    }
    const token = authService.createToken(requestedUser._id);
    res.status(200).json({
        token : token,
        user : requestedUser });
};


exports.StudentLogin = async (req,res,next)=>{
    loggedUser = await userService.getStudentLogin(req.body.email,req.body.password);
    if(loggedUser == null){
        return next (new statusMessageError(401,"incorrect username or password or different user type"));
    }
    const myToken = authService.createToken(loggedUser._id);
    res.status(200).json({
        token : myToken,
        user : loggedUser });
};


exports.professorLogin = async (req,res,next)=>{
    loggedUser = await userService.getProfessorLogin(req.body.email,req.body.password);
    if(loggedUser == null){
        return next (new statusMessageError(401,"incorrect username or password or different user type"));
    }
    const myToken = authService.createToken(loggedUser._id);
    res.status(200).json({
        token : myToken,
        user : loggedUser });
};

exports.setImage = async (req, res, next) =>{
    
    if(!req.file){ return next (new statusMessageError(400, "No files were uploaded"))}
    //if(he doesn't put token)
    let user = req.user;

    await userService.deleteImage(user.imgUrl);
    user = await userService.setImage(user, req.file.path);
    res.status(200).json(
        {
          id : user._id,
          type: user.type,
          name: user.name,
          imgUrl: user.imgUrl

        }
    )
}