const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        required:true
    },
    courseDescription:{
        type:String,
        required:true
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        },
    ],

    //an array where each element inside the array is an object with a type key and the value is id.

    ratingAndReview:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview",
        }
    ],
    price:{
        type:Number,
    },
    thumbnailImage:{
        type:String
    },

    tag:{
        type:[String],
        required:true,
    },
    //The field is an array of strings (i.e., each entry in the array must be of type String).

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    studentsEnrolled: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        }
    ],
    instructions: {
        type:[String],
    },
    status: {
        type:String,
        enum: ["Draft","Published"], // the value of status is either draft or published
    },
    createdAt: {
		type:Date,
		default:Date.now
	},

});
module.exports = mongoose.model("Course",courseSchema);
