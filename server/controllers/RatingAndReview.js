const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

//createRating
exports.createRating = async(req,res) => {
    try{
        //get id
        const userId = req.user.id;
        //fetch data
        const{review,rating,courseId} = req.body;
        //check user is enrolled or not
        const courseDetails = await Course.findOne(
                                            {_id:courseId,
                                            studentsEnrolled: {$elemMatch: {$eq: userId}},
                                        });
        if(!courseDetails){
            return res.status(404).json({
                success:true,
                message:"Student is not enrolled in the course",
            });
        }
        //check if user alraedy reveiewed the course
        const alraedyReviewed = await RatingAndReview.findOne({
                                                        user:userId,
                                                        courseId:courseId,
                                                    });
        if(alraedyReviewed){
            return res.status(403).json({
                success:false,
                message:"Course is alraedy reviewed by the user",
            })
        }
        // create review and rating
        const ratingReview = await RatingAndReview.create({
                                                    rating,review,
                                                    course:courseId,
                                                    user:userId,
                                                })
        //upadate course with this rating/review
        const updatedCourseDetails = await Course.findbyIdAndUpdate(
                            {_id:courseId},
                            {
                                $push:{
                                    ratingAndReview: ratingReview._id,
                                }
                            },
                            {new:true});
        console.log(updatedCourseDetails);
        //return res
        return res.status(200).json({
            success:true,
            message:"rating and review created successfully",
            ratingReview,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


// getAverageRating
exports.getAverageRating = async(req,res) => {
    try{
        //get course id
        const courseId = req.body.courseId;
        //calcultae avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null, // wrap all the entry in a single grp
                    averageRating: {$avg : "$rating"},
                }
            }
        ])
        //return rating
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })
        }
        // if not rating/review exist
        return res.status(200).json({
            success:true,
            message:"Average rating is 0, no rating given till now",
            averageRating:0,
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//getAllRatingAndReview
exports.getAllRating = async(req,res) => {
    try{
        const allReviews = await RatingAndReview.find({})
                                                .sort({rating:"desc"})
                                                .populate({
                                                    path:"user",
                                                    select:"firstName lastName email image"
                                                })
                                                .populate({
                                                    path:"course",
                                                    select:"courseName"
                                                })
                                                .exec();
        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            allReviews
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}