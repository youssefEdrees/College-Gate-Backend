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

    if(req.user.type !== "Professor"){
        return next (new statusMessageError(403,
            "this user is not professor so it can't create post"));
    }

    //check course is exist
    const course = await announcementService.checkCourseExist(req.params.id);
    if(!course){
        return next (new statusMessageError(404,"Invalid course ID"));
    }
    //check if professor create this course
    
    if(course.professor._id !== req.user._id){
        return next (new statusMessageError(403,
            "this course is not created by the user"));
    }
  
    
    const check = validationOnCourse(req.user, course);
    if(check instanceof statusMessageError) return next(check);

    let newAnnouncement = {
        
        "course": req.params.id,
        "professor": req.user._id,
        "content" : req.body.content,
        "date" : getDate(new Date())

    } 
    const announcement = await announcementService.createAnnouncement(newAnnouncement);
    
    res.status(200).json(announcement);
};
exports.getListOfAnnouncements = async(req, res, next) => {

    //check course is exist
    const course = await announcementService.checkCourseExist(req.params.id);
    if(!course){
        return next (new statusMessageError(404,"Invalid course ID"));
    }
    
    //check user is enrolled or create course
    const check = validationOnCourse(req.user, course);
    if(check instanceof statusMessageError ) return next(check);

    const announcements= await announcementService.getListOfAnnouncements(req.params.id, req.query);
    if(announcements.length === 0){
        return next (new statusMessageError(404,
            "there are no announcements for this course or offset out of range"));
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

  
    if(req.user.type !== "Student"){
        return next (new statusMessageError(403,"this user is not student"));
    }
    //check if there are no courses for this user
    if(req.user.courses.length === 0){
        return next (new statusMessageError(404,"there are no courses for this user"));
    }
   
    const announcements= await announcementService.getAllAnnouncements(req.query,
         req.user.courses);
    if(announcements.length === 0){
        return next (new statusMessageError(404,
            "there are no announcements yet oroffset out of range"));
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
function validationOnCourse(user, course){
    
   
    if(user.type === "Professor"){
        //check if prof is created this course
        if(String(course.professor._id )!== String(user._id)){
            return new statusMessageError(403,
                "this course is not created by this professor so check course ID");
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
            return new statusMessageError(403,
                "student didn't enroll in this course so check course ID");
        }
    }
}