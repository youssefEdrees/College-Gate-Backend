const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = mongoose.Schema({
    name :{
        type : String ,
        required :[ true , 'please enter your name']
    },
    email : {
        type : String ,
        required :[ true , 'please enter your email'],
        unique : [true , 'this email is already used'],
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email!'],
        trim: true
    },
    password : {
        type : String ,
        select : false ,
        required  : [true , "password is required"]
    },
    passwordConfirm: {
        type :String ,
        select: false,
        required: [true, 'Please confirm your password!'],
        validate: {
            validator: function(el) {
              return el === this.password;
            },
            message: 'Passwords are not the same'
          }
    },
    imgUrl : {
      type : String,
      match: /\.(png|jpg|jpeg|svg)$/

    } , 
    verifyToken: {
        type: String,
        select: false
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

const User = mongoose.model('User', userSchema);

module.exports = { User, userSchema };