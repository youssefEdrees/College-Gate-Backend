const {Student} = require('./../models/student.model');
const config = require('config');
const { Department } = require('../models/department.model');
const { User } = require('../models/user.model');
const { Professor } = require('../models/professor.model');
const { Course } = require('../models/course.model');
const fs = require('fs').promises;



exports.createStudent = async (newStudent)=> {
    let student1 = await (await Student.create(newStudent))
    .populate('department','departmentName')
    .execPopulate();
    student1 =student1.toJSON();
    delete student1.password ;
    delete student1.passwordConfirm ;
    
    return student1;
}


exports.createProfessor = async (newProfessor)=> {
    let professor1 = await (await Professor.create(newProfessor))
    .populate('department','departmentName')
    //.populate('courses')
    .execPopulate();
    return professor1;
}


async function  createDepartmentFieldKey(field){
    let newKey =0;
    while(true){
        newKey = Math.floor(Math.random()*100000);
        value = await Department.findOne({field : newKey});
        if(!value){
            break;
        }
    }
    return newKey;
}


exports.createDepartment= async (newDepartment)=> {
    console.log("enter create");
    newDepartment["studentKey"] = await createDepartmentFieldKey("studentKey");
    
    newDepartment["professorKey"] = await createDepartmentFieldKey("professorKey");
    
    let department = await Department.create(newDepartment);
    department = department.toJSON();
    return department;
}

exports.getDepartmentList = async ()=>{
    let  departments = await Department.find({}).select("name"); //all
    return departments;
}


exports.getUserById = async (userId)=>{
    let user= await User.findById(userId);
    user= user.toJSON();
    return user;
}


exports.getDepartmentLogin = async (email,password)=>{
    let info = {
        email:email,
        password: password
    }
    let user = await Department.findOne(info).exec();
    return user;
}

exports.getStudentLogin = async (receivedEmail,receivedPassword)=>{
    let info = {
        email:receivedEmail,
        password: receivedPassword
    }
    let user = await Student.findOne(info).exec();
    if(user !== null){
        user =  user.populate("department","departmentName")
        .populate("course")
        .execPopulate();
    }
    return user;
}

exports.getProfessorLogin = async (receivedEmail,receivedPassword)=>{
    let info = {
        email:receivedEmail,
        password: receivedPassword
    }
    let user = await Professor.findOne(info).exec();
    if(user !== null){
        user =  user.populate("department","departmentName")
        .populate("course")
        .execPopulate();
    }
    return user;
}


exports.checkDepartmentKey= async (departmentId,key,type)=> {
    if (type === 'Student'){
        console.log('Student');
        console.log('Student',key);
        dep = await Department.findOne({_id:departmentId,studentKey:key});
        if(!dep){
            return false;
        }
        return true;
    }else {
        console.log('prof');
        dep = await Department.findOne({_id:departmentId,professorKey:key});
        if(!dep){
            return false;
        }
        return true;
    }
}
exports.setImage = async (user, imagePath) => {

    imagePath = imagePath.replace(/\\/g, '/');
    user.imgUrl = imagePath;

    [] = await Promise.all([user.save()]);
    user = user.toJSON();
    return user;

}
exports.deleteImage = async (imagePath) => {

    if(imagePath){
        try {
            await fs.unlink(imagePath);
        } catch (error) {

            if (error.code !== 'ENOENT') throw error;
        }
    }
}