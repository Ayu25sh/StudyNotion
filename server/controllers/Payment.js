const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {default: mongoose} = require("mongoose");

//capture the payment and initiate the razorpay order
exports.capturePayment = async(req,res) => {
    // get courseid and userId
    const userId = req.user.id;// as we pass user id into req.user while logging
    const {course_id} = req.body;
    //validation
    if(!course_id) {
        return res.status(400).json({
            success:false,
            message:"Plz provide valid course id",
        })
    }
    //validate course id
    
    //validate course details
    let course;
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.status(400).json({
                success:false,
                message:"Corse not found",
            })
        }

        //user already pay for this course or not
        const uid = new mongoose.Types.ObjectId(userId);  // as the user id is string nd inthe array it stored as objectId so convert kiye h
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:true,
                message:"Student is already enrolled",
            });
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,

        })
    }

    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount:amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId,
        }
    };

    try{
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        //return res
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount:paymentResponse.amount,

        })
    }catch(error){
        console.log(error);
        return res.json({
            success:false,
            message:"Could not initiate order"
        });
    }


}; 

//verify signature of razorpay and server
exports.verifySignature = async(req,res)=>{
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest){
        console.log("Payment is authorized");

        const {courseId,userId} = req.body.payload.payment.entity.notes;

        try{
            //fulfill the action
            //find the course and enroll the stuent int it
            const enrolledCourse = await Course.findOneAndUpate(
                                                    {_id:courseId},
                                                    {$push:{studentsEnrolled:userId}},
                                                    {new:true},
                                                );
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found"
                });
            }
            console.log(enrolledCourse);

            //find the student and add the course to their list of enrolled course mai
            const enrolledStudent = await User.findOneAndUpdate(
                                                {_id:userId},
                                                {$push :{courses:courseId}},
                                                {new:true},
            );
            console.log(enrolledStudent);

            //mail send krdo confirmation wala
            const emailResponse = await mailSender(
                                        enrolledStudent.email,
                                        "Congratulations",
                                        "Congratulations you are onboarded into new course"

            );

            return res.status(200).json({
                success:true,
                message:"Signature verifie and course added"
            });

        }catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }else{
        return res.status(500).json({
            success:false,
            message:"Invalid request",
        });
    }
}