const Profile = require("../models/Profile");
const User = require("../models/User");

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

// -----------------------&&&&&&&&&&&& ----------------------
//Crone job
// how can we schedule this deletion operation

exports.deleteAccount = async(req,res) => {
    try{
        //fetch id
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            });
        }

        //delete profile 
        
        await Profile.findByIdAndDelete({_id : userDetails.additionalDetails});

        //delete user
        await User.findByIdAndDelete({_id:id});
        //H/W ------>> unenroll user from enrolled course
        
        //return res
        return res.status(200).json({
            success:true,
            message:"Profile deleted Successfully",
            userDetails
        })

    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"unable to delete a profile",
            error:error.message,
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
exports.getEnrolledCourses = async(req,res) => {
    try{
        
    }catch(error){
        
    }
}