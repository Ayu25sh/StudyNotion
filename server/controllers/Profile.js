const { default: mongoose } = require("mongoose");
const CourseProgress = require("../models/CourseProgress");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async(req,res) => {
    try{
        //fetch data
        const {dateOfBirth="",about="",gender,contactNumber} = req.body;

        //fetch user id
        const id = req.user.id;
        //validation
        if(!contactNumber || !gender){
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            })
        }

        //find profile id
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //another way of updating entry in db
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNo = contactNumber;
        await profileDetails.save();

        //return res
        return res.status(200).json({
            success:true,
            message:"Profile Updated Successfully",
            profileDetails,
        })
    }catch(error) {
        return res.status(500).json({
            success:false,
            message:"unable to update a profile",
            error:error.message,
        })
    }
}

// ----------------------
//Crone job
// how can we schedule this deletion operation

exports.deleteAccount = async (req, res) => {
    try {
        const id = req.user.id
        //   console.log(id)
      
        const user = await User.findById({ _id: id })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        // Delete Associated Profile with the User
        //additional details
        await Profile.findByIdAndDelete({
            _id: new mongoose.Types.ObjectId(user.additionalDetails),
        })
        //unenroll from enrolled course
        for (const courseId of user.courses) {
            await Course.findByIdAndUpdate(
                courseId,
                { $pull: { studentsEnrolled: id } },
                { new: true }
            )
        }

        // Now Delete User
        await User.findByIdAndDelete({ _id: id })
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        })

        await CourseProgress.deleteMany({ userId: id })
        
    }catch(error){
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "User Cannot be deleted successfully" 
        })
    }
}

exports.getAllUserDetails = async(req,res) => {
    try{
        //get id
        const id = req.user.id;

        //validation
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        if(!userDetails){
            return res.status(500).json({
                success:false,
                message:"User details not found",
            })
        }
        //return res
        return res.status(200).json({
            success:true,
            message:"User data fetched Successfully",
            userDetails,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            error:error.message,
            
        })
    }
}

exports.getEnrolledCourses = async (req, res) => {
    try {
      
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec()
        
      userDetails = userDetails.toObject()
      var SubsectionLength = 0

      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.user.id
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image)
        const updatedProfile = await User.findByIdAndUpdate(
            { _id: userId },
            { image: image.secure_url },
            { new: true }
        )
        res.status(200).json({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


exports.instructorDashboard = async (req, res) => {
    try{
        const courseDetails = await Course.find({ instructor: req.user.id })
  
        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price
  
            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                // Include other course properties as needed
                totalStudentsEnrolled,
                totalAmountGenerated,
            }  
            return courseDataWithStats
        })
  
        res.status(200).json({ 
            courses: courseData 
        })

    }catch(error){
        console.error(error)
        res.status(500).json({ 
            message: "Server Error" 
        })
    }
}
  