const jwt = require("jsonwebtoken");
const config = require("config");
exports.createToken = (id,userType)=>{
    user = {
        _id : id,
        type : userType
    };
    const accessToken = jwt.sign(user,config.get("ACCESS_TOKEN_SECRET"));
    return accessToken;
}