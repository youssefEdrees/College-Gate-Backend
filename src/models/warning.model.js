const mongoose = require("mongoose");

const warningSchema = new mongoose.Schema(
    {
    
        sender: {
            
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },
        receiver:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        date: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        }
        
    },
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }
);

const Warning = mongoose.model('Warning', warningSchema);

module.exports = {Warning, warningSchema};
