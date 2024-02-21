const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const isLoggedin = asyncHandler(async(req, res, next)=>{
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
        try{
            if(token){
                const decode = await jwt.verify(token, process.env.JWT_KEY);
                const user = await User.findById(decode?.id);
                req.user = user;
                next();
            }
        }catch(error){
            throw new Error('Token expired login again');
        }
    }
    else{
        throw new Error('please login ');
    }
})

const isAdmin = asyncHandler(async(req,res, next)=>{
    if(req.user?.role==="admin"){
        next();
    }
    else{
        throw new Error('your not admin');
    }
})

module.exports = {isLoggedin, isAdmin};
