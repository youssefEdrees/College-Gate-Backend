const {complaintService} = require("../services/");
const {courseService} = require("../services/");
const statusMessageError = require("../utils/statusMessageError");
const {getDate} = require("../utils/helperFunctions");
//ques????
// check if user is stud so it is enroll in this course and if user is prof
// so this course created by this prof ?

//check course is exist or not 


exports.createComplaint = async(req, res, next) => {
 
    let newComplaint;
   
    newComplaint = {
    
        "sender": req.user._id,
        //"receiver": course.prof,
        "receiver": req.user.department._id,
        "subject": req.body.subject,
        "content" : req.body.content,
        "date" : getDate(new Date())

    }

    const complaint = await complaintService.createComplaint(newComplaint);
    
    res.status(200).json({
        id : complaint._id,
        sender: complaint.sender,
        receiver: complaint.receiver,
        subject: complaint.subject,
        content: complaint.content,
        date: complaint.date,
        response: complaint.response
    });
    
    
};
exports.updateComplaint = async (req, res, next) => {

    const complaintId = req.params.id;
    //console.log(complaintId, typeof(complaintId));
    //to know who the stud and the subject
    const complaintResponse = await complaintService.getComplaint(complaintId);
    // check if complaint not valid
    if(complaintResponse === null){
        return next (new statusMessageError(400,"Invalid Id"));
    }
    console.log(complaintResponse.response);
    if(complaintResponse.response === true)
        return next (new statusMessageError(400,"You already responses"));
    complaintResponse.response = true;
    complaintResponse.content_response = req.body.content;
    complaintResponse.date_response = getDate(new Date());

    
    const updatedComplaint = await complaintService.updateComplaint(complaintResponse);
    
    if(!updatedComplaint) 
        return next (new statusMessageError(400,
            "Can't updated Complaint"));

    res.status(200).json(updatedComplaint);
};
exports.getListOfComplaints = async(req, res, next) => {

    const type = req.params.type;
   
    const user = req.user;

    //if(req.user.type === "Professor"){
        //return next (new statusMessageError(403," You don't have the permission to do this action"));
    //}

    const complaints = await complaintService.getListOfComplaints(req.query,
        type, user);

    if(complaints.length === 0){
        return next (new statusMessageError(400,"user doesn't have complaint messages or offset out of range"));
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
        return next (new statusMessageError(400,"Invalid Id"));
    }
    res.status(200).json(complaint);

}; 
