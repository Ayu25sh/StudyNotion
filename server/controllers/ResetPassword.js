const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

exports.resetPasswordToken = async (req,res) => {
    try{
        // fetch email from req body
        const email = req.body.email;
        //check email for this email,,email validaation
        if(!email){
            return res.status(401).json({
                success:false,
                message:"fill the details carefully"
            });
        }
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"your email is not registered with us"
            });
        }
        //generate token
        const token = crypto.randomUUID();
        // update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
                                        {email: email},
                                        {
                                            token:token,
                                            resetPasswordExpires: new Date(Date.now() + 5*60*60*1000),
                                        },
                                        {new:true}); 
        // create url
        const url = `http://localhost:3000/update-password/${token}`
        //send email containing the url
        await mailSender(email,
                        "Password resetLink",
                        `Password Reset Link: ${url}`);
            
        return res.json({
            success:true,
            message:"Email sent Successfully,plz check email and change password ",
            updatedDetails,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Email can't sent plz try again"
        })
    }
}

exports.resetPassword = async(req,res) => {
    try{
        // data fetch
        const {password ,confirmPassword,token} = req.body;
        // validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"password not matching",

            });
        }
        // get userdetails from db using token
        const userDetails = await User.findOne({token:token});
        //if no entry - invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"token is invalid",

            });
        }
        if(userDetails.resetPasswordExpires<new Date(Date.now())){
            return res.json({
                success:false,
                message:"Token is expired ,please regenrate your token",
            });
        }
        //hash pass
        const hashedPassword= await bcrypt.hash(password,10)

        //password update
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true}
        );
        
        return res.status(200).json({
            success:true,
            message:"Password reset successfully",
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending reset psd mail",
        });
    }
}

