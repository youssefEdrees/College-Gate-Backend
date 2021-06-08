const {messageService} = require("../services/");

const statusMessageError = require("../utils/statusMessageError");

const {getDate, validationOnCourse} = require("../utils/helperFunctions");

exports.createMessage = async(req, res, next) => {

    // Todo check that course is exist
   const course = await messageService.checkCourseExist(req.params.id);
    if(!course){
        return next (new statusMessageError(400,"Invalid course ID"));
    }
    
    const check = validationOnCourse(req.user, course);
    if(check instanceof statusMessageError ) return next(check);
    
    let newMessage;

    newMessage = {
        
        "course": req.params.id,
        "sender": req.user._id,
        "receiver": req.body.receiver_id,
        "subject": req.body.subject,
        "content" : req.body.content,
        "date" : getDate(new Date())

    }
    
    const message = await messageService.createMessage(newMessage);
   
    res.status(200).json({
        id : message._id,
        sender: message.sender,
        receiver: message.receiver,
        subject: message.subject,
        content: message.content,
        date: message.date
    });
    
    
};
exports.getListOfMessages = async(req, res, next) => {

    // Todo check that course is exist
   const course = await messageService.checkCourseExist(req.params.id);
    if(!course){
        return next (new statusMessageError(400,"Invalid course ID"));
    }

    const check = validationOnCourse(req.user, course);
    if(check instanceof statusMessageError ) return next(check);

    let type = req.params.type;
    let user_id = req.user._id;
    const messages= await messageService.getListOfMessages(req.params.id, req.query,
         type, user_id);
    if(messages.length === 0){
        return next (new statusMessageError(400,
            "there are no messages for this course or offset out of range"));
    }     
    res.status(200).json(
        {
            items: messages/*.map(mes => {
                return {
                    id : mes._id,
                    sender: mes.sender,
                    receiver: mes.receiver,
                    subject: mes.subject,
                    content: mes.content,
                    date: mes.date
                }
            })*/,
            limit: parseInt(req.query.limit),
            offset: parseInt(req.query.offset),
            total: messages.length
        });
};
exports.getMessage = async (req, res, next) => {

    const message = await messageService.getMessage(req.params.id);
    if(message === null){
        return next (new statusMessageError(400,"Invalid message id"));
    }
    res.status(200).json({
        id : message._id,
        sender: message.sender,
        receiver: message.receiver,
        subject: message.subject,
        content: message.content,
        date: message.date
    });

}; 
