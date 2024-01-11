const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')



router.get('/signup',userController.signup_get)
router.post('/signup',userController.signup_post)
router.get('/login',userController.login_get)
router.post('/login',userController.login_post)
router.get('/dashboard',userController.dashboard_get)
router.post('/dashboard',userController.dashboard_post)
module.exports=router;

