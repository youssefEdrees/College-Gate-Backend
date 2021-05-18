const mongoose = require('mongoose');
const { User } = require('./user.model');

const departmentSchema = new mongoose.Schema(
    {
        departmentName :{
            type : String,
            required :true
        },
        professorKey :{
            type:String,
            required : true
        },
        studentKey :{
            type:String,
            required : true
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

departmentSchema.pre('save',function(next){
    if (this.isNew){
        this.professorKey = "213123";
        this.studentKey = "213123";
    }
    next();

});
module.exports = { Department, departmentSchema };
