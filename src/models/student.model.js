const mongoose = require('mongoose');
const { User } = require('./user.model');

const studentSchema = new mongoose.Schema(
    {
      courses : [{
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Course",
        unique: false
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

//Student.createIndex()

module.exports = { Student, studentSchema };
