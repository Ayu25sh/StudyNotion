const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//createCourse handler function
exports.createCourse = async(req,res) => {
    try{
        //data fetch
        const {courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            //tag,
            category,
            status,
            instructions} = req.body;

        //get thumbnail
        // const thumbnail = req.files.thumbnailImage;

        if( !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !category
            ){
            return res.status(400).json({
                success:true,
                message:"All fields are required"
            })

        }
        if (!status || status === undefined) {
            status = "Draft"
        }
        console.log("id".id)
        const userId = req.user.id;

        // Check if the user is an instructor
        const instructorDetails = await User.findById(userId, {
            accountType: "Instructor",
        })
      
        if (!instructorDetails) {
            return res.status(404).json({
              success: false,
              message: "Instructor Details Not Found",
            })
        }
      
        // Check if the tag given is valid
        const categoryDetails = await Category.findById(category)
          if (!categoryDetails) {
            return res.status(404).json({
              success: false,
              message: "Category Details Not Found",
            })
          }
          // Upload the Thumbnail to Cloudinary
        // const thumbnailImage = await uploadImageToCloudinary(
        //     thumbnail,
        //     process.env.FOLDER_NAME
        //   )
        //   console.log(thumbnailImage)
          // Create a new course with the given details
          const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            //tag,
            category: categoryDetails._id,
            //thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions,
          })
        //get instructor id
        

        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            instructorDetails._id,
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new:true},
        )
        

        //update tag schema
        await Category.findByIdAndUpdate(
            Category._id,
            {
                $push:{
                    course: newCourse._id,
                }
            }
        )

        //return response
        return res.status(200).json({
            success:true,
            message:"Course created successfully",
            data:newCourse,
        })
    }catch(error){
        console.error(error);

        return res.status(500).json({
            success:false,
            message:"Failed to create course",
            course:`newCourse`,
        })
    }
}

//getAllCourses handler
exports.showAllCourses = async(req,res) => {
    try{
        const allCourses = await Course.find({},{courseName:true,
                                                courseDescription:true,
                                                price:true,
                                                instructor:true,
                                                ratingAndReviews:true,
                                                studentsEnrolled:true,})
                                                .populate("instructor")
                                                .exec();
        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfully",
            data:allCourses,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"cannot fetch course data",
            error:error.message
        })
    }
}

//getCourseDetails
exports.getCourseDetails = async(req,res) => {
    try{ 
        //fetch id
        const {courseId} = req.body;
        //find course details 
        const courseDetails = await Course.find(
                                            {_id:courseId})
                                            .populate({
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails"
                                                }
                                            })
                                            .populate({
                                                path:"courseContent",
                                                populate:{
                                                    path:"subSection"
                                                }
                                            })
                                            .populate("category")
                                            // .populate("ratingAndReviews")
                                            .exec();
        console.log(courseDetails.courseContent);
        //validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"Couldn't find the course for given course id"
            })
        }              
        
        // return res
        return res.status(200).json({
            success:true,
            message:"Course Details fetched successfully",
            courseDetails,
        })


    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}