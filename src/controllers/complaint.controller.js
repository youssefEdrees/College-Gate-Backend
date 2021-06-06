const {complaintService} = require("../services/");
const {courseService} = require("../services/");
const statusMessageError = require("../utils/statusMessageError");

//ques????
// check if user is stud so it is enroll in this course and if user is prof
// so this course created by this prof ?

//check course is exist or not 

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

exports.createComplaint = async(req, res, next) => {
   
    //let url = req.url;
    let newComplaint;
    
    if(req.user.type === "Professor"){
        next (new statusMessageError(400," this user is professor can't create complaint"));
    }
    if((req.url).search("response") !== -1 ){ // emplyee response to stud

       
        complaintId = req.body.complaint_id;
        //console.log(complaintId, typeof(complaintId));
        //to know who the stud and the subject
        const complaintResponse = await complaintService.getComplaint(complaintId);
        // check if complaint not valid
        if(complaintResponse === null){
            next (new statusMessageError(400,"can't get complaint check id "));
        }
        newComplaint = {
        
            "sender": req.user._id,
            //"receiver": course.prof,
            "receiver": complaintResponse.sender,
            "subject": complaintResponse.subject,
            "content" : req.body.content,
            "date" : getDate(new Date())
    
        }

    }
    else {

        newComplaint = {
        
            "sender": req.user._id,
            //"receiver": course.prof,
            "receiver": req.user.department._id,
            "subject": req.body.subject,
            "content" : req.body.content,
            "date" : getDate(new Date())
    
        }

    }

    const comaplint = await complaintService.createComplaint(newComplaint);
    if(comaplint === null){
        next (new statusMessageError(400,"can't create comaplint"));
    }
    res.status(200).json({
        id : comaplint._id,
        sender: comaplint.sender,
        receiver: comaplint.receiver,
        subject: comaplint.subject,
        content: comaplint.content,
        date: comaplint.date
    });
    
    
};
exports.getListOfComplaints = async(req, res, next) => {

    let type = req.params.type;
   
    let user_id = req.user._id;

    if(req.user.type === "Professor"){
        next (new statusMessageError(400," this user is professor can't get complaints"));
    }

    const complaints= await complaintService.getListOfComplaints(req.query,
        type, user_id);

    if(complaints.length === 0){
        next (new statusMessageError(400,"user doesn't have complaint messages or offset out of range"));
    }

    res.status(200).json(
    {
        items: complaints/*.map(mes => {
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
        total: complaints.length
    });
};
exports.getComplaint = async (req, res, next) => {

    const complaint = await complaintService.getComplaint(req.params.id);
    if(complaint === null){
        next (new statusMessageError(400,"can't get complaint check id"));
    }
    res.status(200).json({
        id : complaint._id,
        sender: complaint.sender,
        receiver: complaint.receiver,
        subject: complaint.subject,
        content: complaint.content,
        date: complaint.date
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