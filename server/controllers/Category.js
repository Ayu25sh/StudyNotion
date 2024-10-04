const { Mongoose } = require("mongoose");
const Category = require("../models/Category");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

//handler for creating a category
exports.createCategory = async(req,res) => {
    try{

        //fetch data
        const {name,description } =  req.body;

        //validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //create entry in db
        const dbdetails = await Category.create({
            name:name,
            description:description,
        });

        return res.status(200).json({
            success:true,
            message:"Category is created successfully",
        })

         

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//handler for show all categories
exports.showAllCategories = async (req,res) => {
    try{
        const allCategory = await Category.find({},{name:true,description:true})

        res.status(200).json({
            success:true,
            message:"All Category returned successfully",
            allCategory,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// handler for getting CategoryPageDetails

// exports.categoryPageDetails = async(req,res) => {
//     try{
//         //get categoryId
//         const {categoryId} = req.body;
//         //get courses for specified category
//         const selectedCategory = await Category.find({_id:categoryId})
//                                                     .populate("courses")
//                                                     .exec();
//         console.log(selectedCategory);
//         //validation
//         if(!selectedCategory){
//             console.log("Category not found");
//             return res.status(404).json({
//                 success:false,
//                 message:"Category not found",
//             })
//         }
//         //get course for differenet categories
//         const differentCategories = await category.find(
//                                                     {_id: {$ne: categoryId}}
//                                                 )
//                                                 .populate("courses")
//                                                 .exec();
//         //get top selling courses
//         // H/w ----------------

//         //return res
//         return res.status(200).json({
//             success:true,
//             data: {
//                 selectedCategory,
//                 differentCategories
//             }
//         })
//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         })
//     }
// }

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body
    // console.log("PRINTING CATEGORY ID: ", categoryId);
    // Get courses for the specified category

    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        populate: {
          path :"instructor",
          populate: {
            path:"additionalDetails"
          },
        },
        match: { status: "Published" },
        // populate: "ratingAndReview",
      })
      .exec()

    // console.log("SELECTED COURSE", selectedCategory)

    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.")
      return res
        .status(404)
        .json({ success: false, message: "Category not found" })
    }

    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.")
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      })
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
    .populate({
      path: "courses",
      populate: {
        path :"instructor",
        populate: {
          path:"additionalDetails"
        },
      },
      match: { status: "Published" },
      // populate: "ratingAndReview",
    })
    .exec()
    // console.log("Different COURSE", differentCategory)

    // Get top-selling courses across all categories
    const allCategories = await Category.find()
    .populate({
      path: "courses",
      populate: {
        path :"instructor",
        populate: {
          path:"additionalDetails"
        },
      },
      match: { status: "Published" },
      // populate: "ratingAndReview",
    })
    .exec()

    const allCourses = allCategories.flatMap((category) => category.courses)
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)
    //  console.log("mostSellingCourses COURSE", mostSellingCourses)

    //  console.log("data",{
    //     selectedCategory,
    //     differentCategory,
    //     mostSellingCourses,
    //   })

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}