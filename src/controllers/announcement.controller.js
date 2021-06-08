const {announcementService} = require("../services/");

const statusMessageError = require("../utils/statusMessageError");
const {getDate, validationOnCourse} = require("../utils/helperFunctions");

exports.createAnnouncement = async(req, res, next) => {

    if(req.user.type !== "Professor"){
        return next (new statusMessageError(403,
            "this user is not professor so it can't create post"));
    }

    //check course is exist
    const course = await announcementService.checkCourseExist(req.params.id);
    if(!course){
        return next (new statusMessageError(400,"Invalid course ID"));
    }
    //check if professor create this course
    //console.log(course.professor._id, )
    if(String(course.professor._id) !== String(req.user._id)){
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
        return next (new statusMessageError(400,"Invalid course ID"));
    }
    
    //check user is enrolled or create course
    const check = validationOnCourse(req.user, course);
    if(check instanceof statusMessageError ) return next(check);

    const announcements= await announcementService.getListOfAnnouncements(req.params.id, req.query);
    if(announcements.length === 0){
        return next (new statusMessageError(400,
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
        return next (new statusMessageError(403,"You don't have the permission to do this action"));
    }
    //check if there are no courses for this user
    if(req.user.courses.length === 0){
        return next (new statusMessageError(400,"You don't have courses yet"));
    }
   
    const announcements= await announcementService.getAllAnnouncements(req.query,
         req.user.courses);
    if(announcements.length === 0){
        return next (new statusMessageError(400,
            "there are no announcements yet or offset out of range"));
    }     
    
    res.status(200).json(
    {
        items: announcements,
        limit: parseInt(req.query.limit),
        offset: parseInt(req.query.offset),
        total: announcements.length
    });
};
