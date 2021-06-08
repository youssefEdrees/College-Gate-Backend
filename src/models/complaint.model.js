const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
  
        sender: {
            
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiver: {
           
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        subject: {
            type: String,
            required: [true , 'complaint should have a subject'],
            trim: true,
            minlength: 2,
            maxlength: 50
        },
        content: {
            required: [true , 'complaint should have a content'],
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        /*response: {
            type: bool,
        }*/
        
        
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

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = {Complaint, complaintSchema};
