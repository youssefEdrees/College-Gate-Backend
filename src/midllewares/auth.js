const jwt = require('jsonwebtoken');
const config = require('config');
const statusMessageError = require('../utils/statusMessageError');
const {User} = require('../models/user.model');

exports.authenticate = async (req,res,next)=>{
    let token;
    if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    )  {
    token = req.headers.authorization.split(' ')[1];
    }
  if (!token) return next( new statusMessageError (401,'Please log in.'));

    let receivedPayload;
    jwt.verify(token,config.get('ACCESS_TOKEN_SECRET'),(err, payload)=>{
    if(err) return next(new statusMessageError(403,'Invalid Token'))

    receivedPayload = payload;
  });
    
    const user = await (await User.findById(receivedPayload._id))
              .populate("department","departmentName") 
              .populate("courses") //todo choose user
              .execPopulate();

    req.user = user;
    next();

}