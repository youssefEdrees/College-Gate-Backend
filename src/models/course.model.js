const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    /*imageUrl: {type: String, default : "tbd"},
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professor",
        required: true
    },
    students: {
        type: [{type: mongoose.Schema.Types.ObjectId,ref:"Student"}]
    }*/
        
}/*,
{
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }*/);


const Course = mongoose.model('Course', courseSchema);

module.exports = { Course, courseSchema };
