const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
    {
    
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        professor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Professor",
            required: true
        },
        date: {
            type: Date,
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

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = {Announcement, announcementSchema};
