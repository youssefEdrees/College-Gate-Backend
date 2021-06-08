const {warningService} = require("../services/");
const statusMessageError = require("../utils/statusMessageError");

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

exports.createWarning = async(req, res, next) => {
   
    let newWarning;
  
    if(req.user.type !== "Department"){
        return next (new statusMessageError(403,"You don't have the permission to do this action"));
    }
    newWarning = {
    
        "sender": req.user._id,
        "receiver": req.body.receiver_id,
        "content" : req.body.content,
        "date" : getDate(new Date())

    }

    const warning = await warningService.createWarning(newWarning);
    
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
        return next (new statusMessageError(403,
            "You don't have the permission to do this action"));
    }

    const warnings= await warningService.getListOfWarnings(req.query,
        type, user_id);


    if(warnings.length === 0){
        return next (new statusMessageError(400,
            "You don't have warning messages or you insert offset out of range"));
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
        return next (new statusMessageError(400,"Invalid Id"));
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