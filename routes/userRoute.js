const express = require("express");
const user_route = express.Router() 
const userController=require('../controllers/userController')
const userAuth = require("../middleware/userAuth")
user_route.get('/',userController.loginredirect)

user_route.get('/login',userAuth.isLogout,userController.loginload)
user_route.post('/login',userAuth.isLogout,userController.login)
user_route.get('/logout',userAuth.isLogin,userController.logout)

user_route.get('/signup',userAuth.isLogout,userController.signupload)
user_route.post('/signup',userAuth.isLogout,userController.signup)
user_route.get('/sendotp',userAuth.isLogout,userController.sendotp)
user_route.get('/otpload',userAuth.isLogout,userController.otpload)
user_route.post('/otpload',userAuth.isLogout,userController.verifyotp)


user_route.get('/otplogin',userAuth.isLogout,userController.otplogin)
user_route.post('/otplogin',userAuth.isLogout,userController.verifyotplogin)
module.exports=user_route

