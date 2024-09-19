const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    description: {
        type:String,
        required:true,
    },
    course: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true,
    },

});

module.exports = mongoose.model("Tags",tagsSchema);