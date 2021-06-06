const mongoose = require('mongoose');
const { User } = require('./user.model');

const studentSchema = new mongoose.Schema(
    {
      courses : [{
        _id:{type : mongoose.Schema.Types.ObjectId} ,
        name:String
        //ref : "Course"
    }],

      department :{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Department'

      }
    },
    {
        toJSON: {
          virtuals: true
        },
        toObject: {
          virtuals: true
        },
        discriminatorKey: 'type'
      }
);


const Student = User.discriminator('Student', studentSchema);


module.exports = { Student, studentSchema };
