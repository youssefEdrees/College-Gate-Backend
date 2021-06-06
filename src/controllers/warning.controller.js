const {warningService} = require("../services/");
const statusMessageError = require("../utils/statusMessageError");

//ques????
// check if user is stud so it is enroll in this course and if user is prof
// so this course created by this prof ?

//check course is exist or not 

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

exports.createWarning = async(req, res, next) => {
   
    //let url = req.url;
    let newWarning;

  
    if(req.user.type !== "Department"){
        next (new statusMessageError(400," user should be employee check token"));
    }
    newWarning = {
    
        "sender": req.user._id,
        "receiver": req.body.receiver_id,
        "content" : req.body.content,
        "date" : getDate(new Date())

    }

    

    const warning = await warningService.createWarning(newWarning);
    if(warning === null){
        next (new statusMessageError(400,"can't create warning"));
    }
    res.status(200).json({
        id : warning._id,
        sender: warning.sender,
        receiver: warning.receiver,
        content: warning.content,
        date: warning.date
    });
    
    
};
exports.getListOfWarnings = async(req, res, next) => {

    let type = req.user.type;
   
    let user_id = req.user._id;

    if(req.user.type === "Professor"){
        next (new statusMessageError(400," this user is professor can't get warnings"));
    }

    const warnings= await warningService.getListOfWarnings(req.query,
        type, user_id);


    if(warnings.length === 0){
        next (new statusMessageError(400,"user doesn't have warning messages or offset out of range"));
    }

    res.status(200).json(
    {
        items: warnings/*.map(mes => {
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
        total: warnings.length
    });
};
exports.getWarning = async (req, res, next) => {

    const warning = await warningService.getWarning(req.params.id);
    if(warning === null){
        next (new statusMessageError(400,"invalid Warning Id"));
    }
    res.status(200).json({
        id : warning._id,
        sender: warning.sender,
        receiver: warning.receiver,
        content: warning.content,
        date: warning.date
    });

}; 
function getDate(d){

    //let d = new Date();
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

    //return new Date( day+"-" + monthNames[m] + "-" + year +" " + strTime) ;
    return day+"-" + monthNames[m] + "-" + year +" " + strTime;

}