const Category = require("../models/Category");


//tag create krne ka handler function
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

//getAlltag handler function

exports.showAllCategory = async (req,res) => {
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

// getCategoryPageDetails

exports.categoryPageDetails = async(req,res) => {
    try{
        //get categoryId
        const {categoryId} = req.body;
        //get courses for specified category
        const selectedCategory = await Category.find({_id:categoryId})
                                                    .populate("courses")
                                                    .exec();
        console.log(selectedCategory);
        //validation
        if(!selectedCategory){
            console.log("Category not found");
            return res.status(404).json({
                success:false,
                message:"Category not found",
            })
        }
        //get course for differenet categories
        const differentCategories = await category.find(
                                                    {_id: {$ne: categoryId}}
                                                )
                                                .populate("courses")
                                                .exec();
        //get top selling courses
        // H/w ----------------

        //return res
        return res.status(200).json({
            success:true,
            data: {
                selectedCategory,
                differentCategories
            }
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}















