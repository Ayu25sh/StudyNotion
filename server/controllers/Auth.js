const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/mailSender");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Profile = require("../models/Profile");

//send otp
exports.sendotp = async (req,res) => {
    try{
        // fetch the email from req body
        const {email} = req.body;

        //check the user already exist or not
        const checkUserPresent = await User.findOne({email});

        //if already exit then return a response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User Already Registered"
            })
        }

        // generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated",otp);

                
        //check unique otp or not
        let result = await OTP.findOne({otp: otp});
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            }); 
            result = await OTP.findOne({otp: otp});
        }

        const emailResponse = await mailSender(
                                                email,
                                                "OTP verification email",
                                                `OTP -  ${otp}`,

                                            );
        
        console.log(emailResponse);                                        
        const otpPayLoad = {email,otp};
        // create entry of otp in db
        const otpBody = await OTP.create(otpPayLoad);
        console.log(otpBody);

        //return response
        res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp,
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//signup
exports.signup = async(req,res) =>{
    try{
        //data fetch from reqbody
        const{
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
        } = req.body;

        //validate krlo
        if(!firstName || !lastName || !email ||!password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            });
        }
        // password match krlo
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"password and confirm password value does not match,plz try again"
            });  
        }

        //check user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User Already Registered"
            });
        }

        //find most recent otp stored for the user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
        //validate the otp
        if(recentOtp.length == 0){
            //otp not found
            return res.status(400).json({
                success:false,
                message:"otp not found",
            });
        }else if( otp !== recentOtp[0].otp){
            //invalid otp
            return res.status(400).json({
                success:false,
                message:"Invalid otp when",
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password,10);

        // entry create in db
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        //return res
        res.status(200).json({
            success:true,
            message:"User is registered successfully",
            user
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. Please try again"
        })
    }
}

// login
exports.login = async(req,res) => {
    try{
        // data fetch from req body
        const {email,password} = req.body;

        //validation
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            });
        }

        //check user already exist or not
        const user = await User.findOne({email})
                                    .populate("additionalDetails");
        if(!user){
            return res.status(400).json({
            success:false,
                message:"User is not registered",
            });
        }

        //generate JWT after comapring pass
        if(await bcrypt.compare(String(password),String(user.password))){
            const payload = {
                email:user.email,
                id: user._id,
                accountType:user.accountType,
            }
            
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            user.token= token;
            user.password= undefined;

            //create cookie and send response
            const options = {
                expires : new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie('token',token,options).status(200).json({
                success:true,
                token,
                user,
                message:'User logged in Successfully'
            })

            
        }else{
            return res.status(401).json({

                success:false,
                message:"password is incorrect",
                });
        }


    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure,plz try again",
            });
    }
}

//change password
exports.changePassword = async (req,res) => {
    try{
        const {oldPassword,newPassword} = req.body;
        const id = req.user.id;

        if(!oldPassword || !newPassword){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            });
        }
        // if(newPassword !== confirmPassword){
        //     return res.status(400).json({
        //         success:false,
        //         message:"both pass not match"
        //     });
        // }

        const updatedUser = await User.findByIdAndUpdate(id,{password:newPassword});
        console.log(updatedUser);

        return res.status(200).json({
            success:true,
            message:"Password change successfully",
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure,plz try again",
        });
    }
}

























 

