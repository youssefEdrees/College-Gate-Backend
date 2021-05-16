const mongoose = require('mongoose');
const { User } = require('./user.model');

const departmentSchema = new mongoose.Schema(
    {
        DepartmentName :{
            type : String,
            unique : [true , 'department with that name already exist'],
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


const Department = User.discriminator('Department', departmentSchema);


module.exports = { Department, departmentSchema };
