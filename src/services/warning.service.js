const {Warning} = require("../models/warning.model");
const { User } = require('../models/user.model');
const { Student } = require('../models/student.model');
const mongoose = require('mongoose');
//const {courseService} = require("services");

exports.createWarning = async(newWarning) => {

    let warning = await(await Warning.create(newWarning))
    //.select("  sender receiver content date")
    .populate("sender", "name imgUrl")
    .populate("receiver", "name imgUrl")
    .execPopulate();

    warning = warning.toJSON();
    return warning;

};
exports.getListOfWarnings = async(query, type, id) => {

    let result;
    if(type === "Department"){
        result = Warning.find({sender: id});
    }
    else if(type === "Student"){
        result = Warning.find({receiver: id});
    }
    result 
        .sort( { date: -1 } )
        .select("  sender receiver content date")
        .populate("sender", "name imgUrl")
        .populate("receiver", "name imgUrl")
        .skip(parseInt(query.offset))
        .limit(parseInt(query.limit));
    //.exec();
    const [results] = await Promise.all([result]);
    if(!results){
        return null;
    }
   
    return results;
    
};
exports.getWarning= async (id) => {

    warning =  Warning.findById(id)
    .select("  sender receiver content date")
    .populate("sender", "name imgUrl")
    .populate("receiver", "name imgUrl");
    //.execPopulate();
    
    [warning] = await Promise.all([warning]);

    if(!warning){
        return null;
    }
    
    return warning;
};

