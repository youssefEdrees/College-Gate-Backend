const {Announcement} = require("../models/announcement.model");
const { User } = require('../models/user.model');
const { Student } = require('../models/student.model');
const mongoose = require('mongoose');
//const {courseService} = require("services");

exports.createAnnouncement = async(newAnnouncement) => {

    let announcement = await(await Announcement.create(newAnnouncement))
    .populate("professor", "name imgUrl")
    .execPopulate();

    announcement = announcement.toJSON();
    return announcement;

};
exports.getListOfAnnouncements = async(courseId , query) => {
    
   
    const result = Announcement.find({"course._id": courseId})
    .sort( { date: -1 } )
    .select("course  professor content date")
    .populate("professor", "name imageUrl")
    .skip(parseInt(query.offset))
    .limit(parseInt(query.limit));
    //.exec();
    const [results] = await Promise.all([result]);
    if(!results){
        return null;
    }
   
    return results;
    
};
exports.getAllAnnouncements = async(query, courses) => {

   
    //let courses_ids = [];
    /*for(let i = 0; i < courses.length ; i++){

        courses_ids[i] = courses[i]._id;
    }*/
    const result = Announcement.find({"course._id":  courses})
    .sort( { date: -1 } )
    .select("id  professor course  content date")
    .populate("professor", "name imageUrl")
    .skip(parseInt(query.offset))
    .limit(parseInt(query.limit));
    //.exec();
    const [results] = await Promise.all([result]);
    if(!results){
        return null;
    }
    
    return results;
    
};
exports.checkUser = async id => {
    const user = await User.findById(id);
    return user;
};
/*exports.checkCourseExist = async id => {
    const course = await courseService.getCourse(id);
    return course;
};*/

