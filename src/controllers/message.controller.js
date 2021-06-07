const {messageService} = require("../services/");

const statusMessageError = require("../utils/statusMessageError");

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

exports.createMessage = async(req, res, next) => {

    // Todo check that course is exist
   const course = await messageService.checkCourseExist(req.params.id);
    if(!course){
        return next (new statusMessageError(404,"Invalid course ID"));
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
        return next (new statusMessageError(404,"Invalid course ID"));
    }

    const check = validationOnCourse(req.user, course);
    if(check instanceof statusMessageError ) return next(check);

    let type = req.params.type;
    let user_id = req.user._id;
    const messages= await messageService.getListOfMessages(req.params.id, req.query,
         type, user_id);
    if(messages.length === 0){
        return next (new statusMessageError(404,
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
        return next (new statusMessageError(404,"Invalid message id"));
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
function getDate(d){

   
    let year = d.getFullYear();
    let m = d.getMonth();
    let day = d.getDay();
    
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
    //if prof is sender
    if(user.type === "Professor"){
        //check if prof is created this course
       
        if(String(course.professor._id) !== String(user._id)){
            return new statusMessageError(403,"this course is not created by professor");
        }
    }
    
    else if(user.type === "Student"){

        let student = course.students.findIndex(function (stud, index){
           
            
            if(stud._id.toString() === user._id.toString()){
                
                return true;
            }      
        });
        //check if stud enrolled in this course
        if(student === -1){
            return new statusMessageError(400,"student didn't enroll in this course");
        }
    }
}