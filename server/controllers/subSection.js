 const Section = require("../models/Section");
 const SubSection = require("../models/SubSection");
const {uploadImageToCloudinary}  = require("../utils/imageUploader");

 exports.createSubSection = async (req,res) => {
    try{
        //fetch data
        const {sectionId,title,description,timeDuration} = req.body;

        //fetch files
        const video = req.files.videoFile;

        //validation
        if(!sectionId || !title || !description || !timeDuration || !video){
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            });
        }

        //video upload to cloudinaryy
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME)

        //create a subsection
        const subSectionDetails = await SubSection.create({
                                                    title:title,
                                                    description:description,
                                                    timeDuration:timeDuration,
                                                    videoUrl:uploadDetails.secure_url,
                                                });
        console.log(subSectionDetails);
        //update section with this subsection objectId
        const updatedSection = await Section.findByIdAndUpdate(
                                                        sectionId,
                                                        {
                                                            $push:{
                                                                subSection: subSectionDetails._id,
                                                            }
                                                        },
                                                        {new:true});
        // h/w -------> log updated section here after adding populate query
        //return res
        console.log(updatedSection);
        res.status(200).json({
            success:true,
            message:"SubSection create successfully",
            updatedSection,
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Unable to create a subsection",
        })
    }
 }

 //updateSection handler
 //deleteSection handler