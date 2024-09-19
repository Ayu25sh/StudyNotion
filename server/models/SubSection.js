const mongoose = require("mongoose");

const SubSection = new mongoose.Schema({
    title: {
        type:String,
    },
    duration: {
        type:String,
    },
    description: {
        type:String,
    },
    videoUrl: {
        type:String,
    },

});

module.exports = mongoose.model("SubSection",SubSection);