const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
    
        course: {
            
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
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
            required: [true , 'message should have a subject'],
            trim: true,
            minlength: 2,
            maxlength: 50
        },
        content: {
            required: [true , 'message should have a content'],
            type: String,
            required: true
        },
        date: {
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

const Message = mongoose.model('Message', messageSchema);

module.exports = {Message, messageSchema};