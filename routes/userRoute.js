const express = require("express");
const user_route = express.Router() 
const userController=require('../controllers/userController')

user_route.get('/signup',userController.signup_get);
user_route.post('/signup',userController.signup_post);
user_route.get('/login',userController.login_get);
user_route.post('/login',userController.login_post);
module.exports=user_route

