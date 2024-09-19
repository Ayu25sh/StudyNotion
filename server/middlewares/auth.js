const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth --> verifying jwt
exports.auth = async(req,res,next) => {
    try{
        //extract token
        const token = req.cookies.token
                        || req.body.token
                        || req.header("Authorization").replace("Bearer ","");
        
        console.log("Token :",token );
        
        // if token missing then return res
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token missing"
            });
        }

        //verify the token
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        }catch(error){
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            });
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:`Something went wrong while validating the token - ${token}`,
            
        });
    }
}

exports.isStudent = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students only"
            });
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"User role cannot be verified"
        });
    }
}
exports.isInstructor = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for instructor only"
            });
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"User role cannot be verified"
        });
    }
}
exports.isAdmin = async(req,res,next) => {
    try{
        console.log(req.user.accountType);
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for admin only"
            });
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"User role cannot be verified"
        });
    }
}