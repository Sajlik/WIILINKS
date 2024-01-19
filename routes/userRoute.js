const express = require("express");
const userRoute = express.Router() 
const userController=require('../controllers/userController')
const { isLogged } = require("../middileware/auth.js")

userRoute.get("/pageNotFound", userController.pageNotFound)

// User actions
userRoute.get("/", userController.loadLandingPage,)
userRoute.get("/login", userController.getLoginPage)
userRoute.post("/login", userController.userLogin)
userRoute.get("/signup", userController.getSignupPage)
userRoute.post("/verify-otp", userController.verifyOtp)
userRoute.post("/resendOtp", userController.resendOtp)
userRoute.post("/signup", userController.signupUser)
userRoute.get("/logout", isLogged, userController.getLogoutUser)
// userRoute.get("/forgotPassword", userProfileController.getForgotPassPage)
// userRoute.post("/forgotEmailValid", userProfileController.forgotEmailValid)
// userRoute.post("/verifyPassOtp", userProfileController.verifyForgotPassOtp)
// userRoute.get("/resetPassword", userProfileController.getResetPassPage)
// userRoute.post("/changePassword", userProfileController.postNewPassword)
// userRoute.get("/", userController.getHomePage)
// userRoute.get("/login", userController.getLoginPage)
// userRoute.post("/login", userController.userLogin)
// userRoute.get("/signup", userController.getSignupPage)
// userRoute.post("/verify-otp", userController.verifyOtp)
// userRoute.post("/resendOtp", userController.resendOtp)
// userRoute.post("/signup", userController.signupUser)
// userRoute.get("/logout", isLogged, userController.getLogoutUser)

module.exports=userRoute

