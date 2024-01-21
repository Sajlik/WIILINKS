const User = require('../models/userModels');
const Category = require('../models/categoryModel');
const Product = require('../models/product');
const Coupon = require("../models/couponModel")
 // Import the 'Images' model

const  nodemailer=require("nodemailer")

const bcrypt = require('bcrypt');
const {application} = require("express")

const pageNotFound=async(req,res)=>{
    try{
        res.render("404")
    }
    catch{
       console.log(error.message);
    }
}

const securePassword= async(password)=>{
    try{
           const passwordHash=await bcrypt.hash(password,10)
           return passwordHash
    }catch{
             console.log(error.message);
          }
}
// Index
const loadLandingPage = async (req, res) => {
    try {
        const user=req.session.user
        const userData= await User.findOne({})
        const categoryData=await Category.find({isBlocked:false})
        const productData = await Product.find({ isBlocked: false }).sort({ id: -1 }).limit(4)
       

        if(user){
            res.render("home",{user:userData,data:categoryData,products:productData})
        }
        else{
            res.render("home",{data:categoryData,products:productData})
        }
    
    } 
    
    catch (error) {
        console.error("An error occurred:", error);
       
    }
}

const getLoginPage = async (req, res) => {
    try {
        if (!req.session.user) {
            res.render("login")
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error.message);
    }
}


//Load signup page

const getSignupPage = async (req, res) => {
    try {
        if (!req.session.user) {
            res.render("signup")
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error.message);
    }
}

//Generate OTP

function generateOtp() {
    const digits = "1234567890"
    var otp = ""
    for (i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)]
    }
    return otp
}

//User Registration

const signupUser = async (req, res) => {
    try {
        const { email } = req.body
        const findUser = await User.findOne({ email })
        if (req.body.password === req.body.cPassword) {
            if (!findUser) {
                var otp = generateOtp()
                console.log(otp);
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    }
                })
                const info = await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "Verify Your Account ✔",
                    text: `Your OTP is ${otp}`,
                    html: `<b>  <h4 >Your OTP  ${otp}</h4>    <br>  <a href="">Click here</a></b>`,
                })
                if (info) {
                    req.session.userOtp = otp
                    req.session.userData = req.body
                    res.render("verify-otp", {email})
                    console.log("Email sented", info.messageId);
                } else {
                    res.json("email-error")
                }
            } else {
                console.log("User already Exist");
                res.render("signup", { message: "User with this email already exists" })
            }
        } else {
            console.log("the confirm password is not matching");
            res.render("signup", { message: "The confirm password is not matching" })
        }


    } catch (error) {
        console.log(error.message);
    }
}


// render the OTP verification page

const getOtpPage = async (req, res) => {
    try {
        res.render("verify-otp")
    } catch (error) {
        console.log(error.message);
    }
}


// Resend Otp

const resendOtp = async (req, res) => {
    try {
        const email = req.session.userData.email;
        var newOtp = generateOtp();
        console.log(email, newOtp);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Resend OTP ✔",
            text: `Your new OTP is ${newOtp}`,
            html: `<b>  <h4 >Your new OTP is ${newOtp}</h4>    <br>  <a href="">Click here</a></b>`,
        });

        if (info) {
            req.session.userOtp = newOtp;
            res.json({ success: true, message: 'OTP resent successfully' });
            console.log("Email resent", info.messageId);
        } else {
            res.json({ success: false, message: 'Failed to resend OTP' });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: 'Error in resending OTP' });

    }
}


// Verify otp from email with generated otp and save the user data to db

const verifyOtp = async (req, res) => {
    try {

        //get otp from body
        const { otp } = req.body
        if (otp === req.session.userOtp) {
            const user = req.session.userData
            const passwordHash = await securePassword(user.password)

            const saveUserData = new User({
                name: user.name,
                email: user.email,
                phone: user.phone,
                password: passwordHash
            })

            await saveUserData.save()

            req.session.user = saveUserData._id


            res.json({status : true})
        } else {
            
            console.log("otp not matching");
            res.json({status : false})
        }

    } catch (error) {
        console.log(error.message);
    }
}


    
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const findUser = await User.findOne({ isAdmin: "0", email: email })

        console.log("working");

        if (findUser) {
            const isUserNotBlocked = findUser.isBlocked === false;

            if (isUserNotBlocked) {
                const passwordMatch = await bcrypt.compare(password, findUser.password)
                if (passwordMatch) {
                    req.session.user = findUser._id
                    console.log("Logged in");
                    res.redirect("/")
                } else {
                    console.log("Password is not matching");
                    res.render("login", { message: "Password is not matching" })
                }
            } else {
                console.log("User is blocked by admin");
                res.render("login", { message: "User is blocked by admin" })
            }
        } else {
            console.log("User is not found");
            res.render("login", { message: "User is not found" })
        }

    } catch (error) {
        console.log(error.message);
        res.render("login", { message: "Login failed" })
    }
}






const getLogoutUser = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err.message);
            }
            console.log("Logged out");
            res.redirect("/login")
        })
    } catch (error) {
        console.log(error.message);
    }
}

const applyCoupon = async (req, res)=>{
    try {
        const userId = req.session.user
        console.log(req.body);
        const selectedCoupon = await Coupon.findOne({name : req.body.coupon})
        // console.log(selectedCoupon);
        if(!selectedCoupon){
            console.log("no coupon");
            res.json({noCoupon : true})
        }else if(selectedCoupon.userId.includes(userId)){
            console.log("already used");
            res.json({used : true})
        }else{
            console.log("coupon exists");
            await Coupon.updateOne(
                { name: req.body.coupon },
                {
                    $addToSet: {
                        userId: userId
                    }
                }
            );
            const gt = parseInt(req.body.total)-parseInt(selectedCoupon.offerPrice);
            console.log(gt,"----");
            res.json({gt : gt, offerPrice : parseInt(selectedCoupon.offerPrice)})
        }
    } catch (error) {
        console.log(error.message);
    }
}


// loading register page---
// const loadRegister = async (req, res) => {
//     try {
        
//         res.render('./user/pages/register')
//     } catch (error) {
        
//         throw new Error(error)
//     }
// }

// // inserting User-- 
// const insertUser = async (req, res) => {
//     try {
//         const emailCheck = req.body.email;
//         const checkData = await User.findOne({ email: emailCheck });
//         if (checkData) {
//             return res.render('./user/pages/register', { userCheck: "User already exists, please try with a new email" });
//         } else {
//             const UserData = {
//                 userName: req.body.userName,
//                 email: req.body.email,
//                 password: req.body.password,
//             };
//             if (req.body.referralCode !== '') {
//                 UserData.referralCode = req.body.referralCode
//             }
//             console.log('data for inserting', UserData);

//             const OTP = generateOTP() /** otp generating **/

//             req.session.otpUser = { ...UserData, otp: OTP };
//             console.log(req.session.otpUser.otp)
            

//             /***** otp sending ******/
//             try {
//                 sendOtp(req.body.email, OTP, req.body.userName);
//                 return res.redirect('/sendOTP');
//             } catch (error) {
//                 console.error('Error sending OTP:', error);
//                 return res.status(500).send('Error sending OTP');
//             }
//         }
//     } catch (error) {
//         throw new Error(error);
//     }
// }
// /*************** OTP Section *******************/
// // loadSentOTP page Loding--
// const sendOTPpage = asyncHandler(async (req, res) => {
//     try {
//         const email = req.session.otpUser.email
//         res.render('./user/pages/verifyOTP', { email })
//     } catch (error) {
//         throw new Error(error)
//     }

// })

// // verifyOTP route handler
// const verifyOTP = asyncHandler(async (req, res) => {
//     try {

//         const enteredOTP = req.body.otp;
//         const storedOTP = req.session.otpUser.otp; // Getting the stored OTP from the session
//         const user = req.session.otpUser;
//         console.log('stored otp', storedOTP, 'user', user);

//         if (enteredOTP == storedOTP) {
//             // if referral is found the reffered user get cashback
//             let userFound = null;
//             if (user.referralCode && user.referralCode !== '') {
//                 const referralCode = user.referralCode.trim()
//                 userFound = await creditforRefferedUser(referralCode)
//                 delete user.referralCode
//             }
//             const newUser = await User.create(user);
        
//             if (newUser) {
//                 const referalCode = generateReferralCode(8)

//                 const createWallet = await Wallet.create({ user: newUser._id })
                

//                 newUser.wallet = createWallet._id
//                 newUser.referralCode = referalCode;
//                 newUser.save();
                
//                 if (userFound) {
//                     await creditforNewUser(newUser)
//                 }
//             }
//             delete req.session.otpUser.otp;
//             if (!userFound && user.referralCode) {
//                 req.flash('warning', 'Registration success , Please login , Invalid referral code!')
//             } else {
//                 req.flash('success', 'Registration success , Please login')
//             }
//             res.redirect('/login');
//         } else {
//             const message = 'Verification failed, please check the OTP or resend it.';
//             console.log('verification failed');
//             res.render('./user/pages/verifyOTP', { errorMessage: message })
//         }
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// /**********************************************/

// // Resending OTP---
// const reSendOTP = async (req, res) => {
//     try {
//         const OTP = generateOTP() /** otp generating **/
//         req.session.otpUser.otp = { otp: OTP };

//         const email = req.session.otpUser.email
//         const userName = req.session.otpUser.userName


//         /***** otp resending ******/
//         try {
//             sendOtp(email, OTP, userName);
//             console.log('otp is sent');
//             return res.render('./user/pages/reSendOTP', { email });
//         } catch (error) {
//             console.error('Error sending OTP:', error);
//             return res.status(500).send('Error sending OTP');
//         }

//     } catch (error) {
//         throw new Error(error)
//     }
// }

// // verify resendOTP--
// const verifyResendOTP = asyncHandler(async (req, res) => {
//     try {
//         const enteredOTP = req.body.otp;
//         console.log(enteredOTP);
//         const storedOTP = req.session.otpUser.otp;
//         console.log(storedOTP);

//         const user = req.session.otpUser;

//         if (enteredOTP == storedOTP.otp) {
//             let userFound = null;
//             if (user.referralCode && user.referralCode !== '') {
//                 const referralCode = user.referralCode.trim()
//                 userFound = await creditforRefferedUser(referralCode)
//                 delete user.referralCode
//             }
//             const newUser = await User.create(user);
//             if (newUser) {
//                 const referalCode = generateReferralCode(8)
//                 const createWallet = await Wallet.create({ user: newUser._id })
//                 newUser.wallet = createWallet._id
//                 newUser.referralCode = referalCode;
//                 newUser.save();
//                 if (userFound) {
//                     await creditforNewUser(newUser._id)
//                 }
//             } else {
//                 console.log('error in insert user')
//             }
//             delete req.session.otpUser.otp;

//             if (!userFound && user.referralCode) {
//                 req.flash('warning', 'Registration success , Please login , Invalid referral code!')
//             } else {
//                 req.flash('success', 'Registration success , Please login')
//             }
//             res.redirect('/login');
//         } else {
//             res.redirect('/register')
//         }
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// // loading login page---
// const loadLogin = async (req, res) => {
//     try {
//         if(!req.session.user){
//             res.render("login")
//         }
//         else{
//             res.render("/")
//         }
//     } catch (error) {
//        console.log(error.message);
//     }
// }
// // UserLogout----
// const userLogout = async (req, res) => {
//     try {
//         req.logout(function (err) {

//             if (err) {
//                 next(err);
//             }
//         })
//         res.redirect('/')
//     } catch (error) {
//         console.log(error.message);
//     }
// }

module.exports = {
    pageNotFound,
    
  
    getSignupPage,
    signupUser,
    getOtpPage,
    verifyOtp,
    resendOtp,
    userLogin,
    getLogoutUser,
    getLoginPage,
    pageNotFound,
    getSignupPage,
    loadLandingPage,
    applyCoupon
 
   
   
   
  
   
    
}