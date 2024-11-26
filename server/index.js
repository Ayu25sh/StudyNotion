const express = require("express");
const app = express();

const timeout = require('connect-timeout');

const userRoutes = require("./routes/User.js");
const courseRoutes = require("./routes/Course.js");
const paymentRoutes = require("./routes/Payments.js");
const profileRoutes = require("./routes/Profile.js");
const contactUsRoute = require("./routes/Contact.js");


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
    origin:"https://studynotionlive.vercel.app",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials:true,
}));

//Mounting
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1/profile",profileRoutes);
app.use(timeout('10s')); // Adjust time as needed, for example, to 30 seconds


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

