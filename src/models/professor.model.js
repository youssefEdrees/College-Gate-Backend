const mongoose = require('mongoose');
const { User } = require('./user.model');

const professorSchema = new mongoose.Schema(
    {
      courses : [{
          type : mongoose.Schema.Types.ObjectId ,
          ref : "Course"
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


const Professor = User.discriminator('Professor', professorSchema);


module.exports = { Professor, professorSchema };
