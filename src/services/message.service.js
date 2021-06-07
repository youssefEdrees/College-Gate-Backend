const {Message} = require("../models/message.model");
const { User } = require('../models/user.model');
const {getCourse} = require("../services/course.service");

exports.createMessage = async(newMessage) => {

    
    let message = await (await Message.create(newMessage))
    //.select("  sender receiver subject content date")
    .populate("sender", "name imgUrl")
    .populate("receiver", "name imgUrl")
    .populate("course", "name imgUrl")
    .execPopulate();
    
    message = message.toJSON();
    return message;

};
exports.getListOfMessages= async(courseId , query, type, user_id) => {

    let result;
    if(type === "sent"){
        result = Message.find({course: courseId, sender: user_id})
      
    }
    else{
        result = Message.find({course: courseId, receiver: user_id})
  
    }
    result.sort( { date: -1 } )
        .select("  sender receiver subject content date")
        .populate("sender", "name imgUrl")
        .populate("receiver", "name imgUrl")
        .populate("course", "name imgUrl")
        .skip(parseInt(query.offset))
        .limit(parseInt(query.limit));

    const [results] = await Promise.all([result]);
    if(!results){
        return null;
    }
   
    return results;
    
};
exports.getMessage = async (id) => {

    message = Message.findById(id)
    .select("  sender receiver subject content date")
    .populate("sender", "name imgUrl")
    .populate("receiver", "name imgUrl")
    .populate("course", "name imgUrl");
    //.execPopulate();
    [resumessagelts] = await Promise.all([message]);
    if(!message){
        return null;
    }
    //message = message.toJSON();
    return message;
};
exports.checkCourseExist = async id => {
    const course = await getCourse(id);
    return course;
};


