const mongoose = require("mongoose"); // instance of mongoose
require("dotenv").config();

exports.dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("DB connection successful");
    })
    .catch((err) => {
        console.log("DB connection failed");
        console.error(err);
        process.exit(1);
    });
}
