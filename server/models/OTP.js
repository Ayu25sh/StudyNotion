const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true,
    },
    otp: {
        type:String,
        required:true,
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        expires: 5*60, 
    },

});


// a function -> to send email
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verifictaion Email from StudyNotion",otp);
        console.log("Emailsent successfully",mailResponse);
    }catch(error){
        console.log("error occured while sending an email",error);
        throw error;
    }
}

otpSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);  // this.email nd all represent current obj data
    next();
})

module.exports = mongoose.model("OTP",otpSchema);