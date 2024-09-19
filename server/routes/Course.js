const express = require("express");
const router = express.Router();

//Course handlers import
const {
    createCourse,
    showAllCourses,
    getCourseDetails,
} = require("../controllers/Course")

//Categories handlers import
const {
    createCategory,
    showAllCategory,
    categoryPageDetails,
} = require("../controllers/Category")

//Sections handler import
const {
    createSection,
    updateSection,
    deleteSection
} = require("../controllers/Section");

//subSections handler import
const {
    createSubSection,
    // updateSubSection,
    // deleteSubSection
} = require("../controllers/subSection");

//Rating handlers import
const {
    createRating,
    getAverageRating,
    getAllRating
} = require("../controllers/RatingAndReview")

//importing middlewares
const {
    auth,
    isStudent,
    isAdmin,
    isInstructor,
} = require("../middlewares/auth");


// *********************************************************************************
//                                    Courses
// *********************************************************************************

router.post("/createCourse",auth,isInstructor,createCourse)
router.get("/allCourses",showAllCourses)
router.get("/getCourseDetails",getCourseDetails)


// *********************************************************************************
//                            Section nd SubSection
// *********************************************************************************

router.post("/addSection",auth,isInstructor,createSection)
router.post("/updateSection",auth,isInstructor,updateSection)
router.delete("/deleteSection",auth,isInstructor,deleteSection)

router.post("/addSubSection",auth,isInstructor,createSubSection)
//router.post("/updateSubSection",auth,isInstructor,updateSubSection)
//router.delete("/deleteSubSection",auth,isInstructor,deleteSubSection)



router.post("/createCategory",auth,isAdmin,createCategory)
router.get("/showAllCategories",showAllCategory)
router.get("/getCategoryPageDetails",categoryPageDetails)


// ***********************************************************************************************************************
//                        Rating nd review
// ***********************************************************************************************************************

router.post("/createRating",auth,isStudent,createRating)
router.get("/getAverageRating",getAverageRating)
router.get("/getAllRating",getAllRating)

module.exports = router