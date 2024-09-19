const express = require("express");
const app = express();

const userRoutes = require("./routes/User.js");
const courseRoutes = require("./routes/Course.js");
const paymentRoutes = require("./routes/Payment.js");
const profileRoutes = require("./routes/Profile.js");

const cookieParser = require('cookie-parser');
const cors = require("cors");
const fileUpload = require("express-fileupload");

require("./config/database").dbConnect();
require("./config/cloudinary").cloudinaryConnect(); 

require("dotenv").config();
const PORT = process.env.PORT;  

//add middlware
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
}));
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}));

//Mounting
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/profile",profileRoutes);

//default route
app.get("/",(req,res) => {
    return res.json({
        success:true,
        message:"Your server is up and running........ "
    })
})
 
app.listen(PORT, () => {
    console.log(`App is listening at port no ${PORT}`);
})

