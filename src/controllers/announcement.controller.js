const {announcementService} = require("../services/");
const {courseService} = require("../services/");
const { Student } = require('../models/student.model');

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];
//course servise
const statusMessageError = require("../utils/statusMessageError");
const mongoose = require('mongoose');

exports.createAnnouncement = async(req, res, next) => {

    //check course is exist
    /*const course = await announcementService.checkCourseExist(req.params.id);
    if(!course){
        next (new statusMessageError(400,"Invalid course ID"));
    }*/
    //check if professor create this course
    /*
    if(course.professor._id !== req.user._id){
        next (new statusMessageError(400,"this course is not created by the user"));
    }*/
    /*const course = {
        "_id":req.params.id,
        "name":"math",
        "professor":"60b97c0b12d1ee66eb581d4w"
    }*/
    if(req.user.type !== "Professor"){
        next (new statusMessageError(400,"this user is not professor so it can't create post"));
    }
    //validationOnCourse(req.user, course, next);
    let newAnnouncement = {
        
        //"course": req.params.id
         
        "course": {
            "_id":req.params.id,
            "name":"math"
        },
        "professor": req.user._id,
        "content" : req.body.content,
        "date" : getDate(new Date())

    } 
    const announcement = await announcementService.createAnnouncement(newAnnouncement);
    
    res.status(200).json(announcement);
};
exports.getListOfAnnouncements = async(req, res, next) => {

    //check course is exist
    /*const course = await announcementService.checkCourseExist(req.params.id);
    if(!course){
        next (new statusMessageError(400,"Invalid course ID"));
    }*/
    /*const course = {
        "_id":req.params.id,
        "name":"math",
        "professor":"60b97c0b12d1ee66eb581d4w",
        "students":[
            {
                _id: "60b97c0b12d1ee66eb581d4z"
            },
            {
                _id: "60b9eee012d1ee66eb58511c"
            }

        ]
    }*/
    
    //validationOnCourse(req.user, course, next);
    const announcements= await announcementService.getListOfAnnouncements(req.params.id, req.query);
    if(announcements.length === 0){
        next (new statusMessageError(400,"there are no announcements for this course or offset out of range"));
    }
    res.status(200).json(
    {
        items: announcements,
        limit: parseInt(req.query.limit),
        offset: parseInt(req.query.offset),
        total: announcements.length
    });
};
exports.getAllAnnouncements = async(req, res, next) => {

   
    //let courses_ids = [];
    
    /*for(let i = 0; i < req.user.courses.length ; i++){

        courses_ids[i] = req.user.courses[i]._id;
    }
    res.status(200).json( courses_ids );*/

    //check if there are no courses for this user
    if(!req.user.courses){
        next (new statusMessageError(400,"there are no courses for this user"));
    }
    if(req.user.type !== "Student"){
        next (new statusMessageError(400,"this user is not student"));
    }

    const announcements= await announcementService.getAllAnnouncements(req.query,
         req.user.courses);
    if(announcements.length === 0){
        next (new statusMessageError(400,"there are no announcements yet oroffset out of range"));
    }     
    
    res.status(200).json(
    {
        items: announcements,
        limit: parseInt(req.query.limit),
        offset: parseInt(req.query.offset),
        total: announcements.length
    });
};
function getDate(d){

    
    let year = d.getFullYear();
    let m = d.getMonth();
    let day = d.getDay() - 1;
    
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;

    return day+"-" + monthNames[m] + "-" + year +" " + strTime;

}
function validationOnCourse(user, course, next){
    //if prof is sender
   
    if(user.type === "Professor"){
        //check if prof is created this course
        if(course.professor._id !== user._id){
            next (new statusMessageError(400,"this course is not created by professor so check course ID"));
        }
    }
    else if(user.type === "Student"){
        //check if stud enrolled in this course
        let student = course.students.findIndex(function (stud, index){
           
            if(stud._id.toString() === user._id.toString()){
                
                return true;
            }      
        });
        if(student === -1){
            next (new statusMessageError(400,"student didn't enroll in this course so check course ID"));
        }
    }
}