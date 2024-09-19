const Course = require("../models/Course");
const Section = require("../models/Section");

exports.createSection = async(req,res) => {
    try{
        //data fetch
        const{sectionName,courseId} = req.body;

        //validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            })
        }
        //create section
        const newSection = await Section.create(
                                            {sectionName : sectionName},
                                        );
        
        //update course with section ObjectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push:{
                                                    courseContent:newSection,
                                                }
                                            },
                                            {new:true},
                                        );
        
        //hw : use populate to replace section nd subsection both in updateVourseDetails
        res.status(200).json({
            success:true,
            message:"Section create successfully",
            updatedCourseDetails,
        })
    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"unable to create a section",
        })
    }
}


 exports.updateSection = async(req,res) => {
    try{
        //data fetch
        const{sectionName,sectionId} = req.body;
        //validation
        if(!sectionId || !sectionName){
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            })
        }
        //update section
        const updatedSection = await Section.findByIdAndUpdate({sectionId},{sectionName},{new:true});

        //retrun res
        return res.status(200).json({
            success:true,
            message:"Section updated successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to update a section",
            error:error.message,
        })
    }
 }
 exports.deleteSection = async(req,res) => {
    try{
        //data fetch ----> assuming that we are passing id in params
        const{sectionId} = req.params;
        //validation
        if(!sectionId){
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            })
        }
        //delete section
        await Section.findByIdAndDelete({sectionId});
        // h/w ====> do we need to delete this id from courseschema 
        //retrun res
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to delete a section",
            error:error.message,
        })
    }
 }