const express = require("express");
const router = express.Router();

const {
    login,
    signup,
    sendotp,
    changePassword,
} = require("../controllers/Auth");

const {
    resetPassword,
    resetPasswordToken,
} = require("../controllers/ResetPassword");

const {auth } = require("../middlewares/auth");

// *******************************************************************************************

// ******************************************************************************************

// Route for user login
router.post("/login",login)

//Route for user signup
router.post("/signup",signup)

//Route for sending otp to the user email
router.post("/sendotp",sendotp)

//Route for changing the password
router.post("/changePassword",auth,changePassword)

// ***********************************************************************************************

// ***********************************************************************************************

//Route for generating a reset password token
router.post("/reset-password-token",resetPasswordToken)

//Route for resetting user password after verification 
router.post("/reset-password",resetPassword)

//export the router 
module.exports = router

