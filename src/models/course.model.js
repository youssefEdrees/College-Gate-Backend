const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 1,
      maxlength: 50,
      required :[ true , 'please enter course name'],
      trim:true
    },
    imgUrl: {
      type: String, 
      //match: /\.(png|jpg|jpeg|svg)$/, 
      default : "https://picsum.photos/500"
    },
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      required: true
    },
    students: {
      type: [{type: mongoose.Schema.Types.ObjectId, ref:"Student"}]
    },
    key: {
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
  });

//Schema.unique([professor, name]);
const Course = mongoose.model('Course', courseSchema);

module.exports = { Course, courseSchema };
