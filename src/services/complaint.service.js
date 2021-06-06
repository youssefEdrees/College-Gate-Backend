const {Complaint} = require("../models/complaint.model");
const { User } = require('../models/user.model');
//const {courseService} = require("services");

exports.createComplaint = async(newComplaint) => {

    
    let complaint =  await (await Complaint.create(newComplaint))
    .select("  sender receiver subject content date")
    .populate("sender", "name imgUrl")
    .populate("receiver", "name imgUrl")
    .execPopulate();

    complaint = complaint.toJSON();
    return complaint;

};
exports.getListOfComplaints= async(query, type, user_id) => {

    let result;
    if(type === "sent"){
        result = Complaint.find({sender: user_id})
    }
    else{
        result = Complaint.find({receiver: user_id})
    }
    result.sort( { date: -1 } )
    .select("sender receiver subject content date")
    .populate("sender", "name imgUrl")
    .populate("receiver", "name imgUrl")
    .skip(parseInt(query.offset))
    .limit(parseInt(query.limit));

    const [results] = await Promise.all([result]);

    if(!results){
        return null;
    }
    //let total = Playlist.countDocuments({}).exec();
    //const [results, totals] = await Promise.all([result, total]);
    return results;
    
};
exports.getComplaint = async (id) => {

    complaint =  Complaint.findById(id)
    .select("  sender receiver subject content date")
    .populate("sender", "name imgUrl")
    .populate("receiver", "name imgUrl");
    //.execPopulate();
    
    [comaplint] = await Promise.all([complaint]);
    if(!complaint){
        return null;
    }
    //complaint = complaint.toJSON();
    return complaint;
};


