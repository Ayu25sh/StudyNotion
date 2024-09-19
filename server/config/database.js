const mongoose = require("mongoose"); // instance of mongoose
require("dotenv").config();

exports.dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then( () => {console.log("DB ka connection successful")})
    .catch( (err) => {
        console.log("DB connection failed");
        console.error(err);
        process.exit(1);
    });
}