const {Message} = require("../models/message.model");
const { User } = require('../models/user.model');
//const {courseService} = require("services");

exports.createMessage = async(newMessage) => {

    
    let message = await (await Message.create(newMessage))
    .select("  sender receiver subject content date")
    .populate("sender", "name imgUrl")
    .populate("receiver", "name imgUrl")
    .execPopulate();
    
    message = message.toJSON();
    return message;

};
exports.getListOfMessages= async(courseId , query, type, user_id) => {

    let result;
    if(type === "sent"){
        result = Message.find({"course._id": courseId, sender: user_id})
        /*.sort( { date: -1 } )
        //.select("course  professor content date")
        .populate("sender", "name imgUrl")
        .populate("receiver", "name imgUrl")
        .skip(parseInt(query.offset))
        .limit(parseInt(query.limit));*/
        //.exec();
    }
    else{
        result = Message.find({"course._id": courseId, receiver: user_id})
        /*.sort( { date: -1 } )
        //.select("course  professor content date")
        .populate("sender", "name imgUrl")
        .populate("receiver", "name imgUrl")
        .skip(parseInt(query.offset))
        .limit(parseInt(query.limit));*/
        //.exec();
    }
    result.sort( { date: -1 } )
        .select("  sender receiver subject content date")
        .populate("sender", "name imgUrl")
        .populate("receiver", "name imgUrl")
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
    .populate("receiver", "name imgUrl");
    //.execPopulate();
    [resumessagelts] = await Promise.all([message]);
    if(!message){
        return null;
    }
    //message = message.toJSON();
    return message;
};
/*exports.checkCourseExist = async id => {
    const course = await courseService.getCourse(id);
    return course;
};*/

