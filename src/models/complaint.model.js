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
            
        },
        content_response: {
            //required: [true , 'complaint should have a content'],
            type: String,
            default : " "
        },
        date: {
            type: String,
            required: true
        },
        date_response: {
            type: String,
            //required: true
            default : " "
        },
        response: {
            type: Boolean,
            default:false
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

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = {Complaint, complaintSchema};
