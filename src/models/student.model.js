const mongoose = require('mongoose');
const { User } = require('./user.model');

const studentSchema = new mongoose.Schema(
    {
      courses : [{
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Student"
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
