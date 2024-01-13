// const User = require("../models/userSchema");
// const otpModel = require("../models/otpSchema");
// const jwttoken = require("../utils/jwt");
// const otp = require('../utils/otp')
// const mailer = require('../utils/mailer')
// const bcrypt = require('bcrypt');
// const Product = require("../models/productSchema");
// const saltRounds = 10;


// const loginredirect = (req, res) => {
//   res.redirect("/login");
// };

// const loginload =async (req, res) => {
//   res.render("user/userlogin");
// };
// const login =async (req, res) => {
//     const email = req.body.email
//     const pwd = req.body.password
//     const loggeduser = await User.findOne({email:email,type:"user",isActive:1})
    
//     if(loggeduser != null)
//     {   
//         const passtrue = await bcrypt.compare(pwd,loggeduser.password)
//         if(passtrue)
//         {
//             res.redirect(`/otplogin?uid=${loggeduser._id}`)
//         }
//         else{
//             res.render("user/userlogin",{err:"Invalid Password"})
//         }
//     }
//     else{
//         res.render('user/userlogin',{err:"Invalid User"})
//     }
// };

// const signupload = (req, res) => {
//   res.render("user/usersignup");
// };

// let calledpost

// const otpload = async (req,res)=>{
//     const uid = req.query.uid
//     // console.log("otppload "+uid)
//     calledpost = false
//     try {
//     res.render("user/otpsignup",{uid:uid})
//     setTimeout(()=>{ 
//         if(!calledpost)
//         {   console.log("entered into called post")
//             setTimeout(()=>{
//             deleteuser(uid)
//         },120000)
//     }
//     else{
//         console.log("user not deleted")
//     }
// },300000)

//     } catch (error) {
//         console.log(error.message)
//     }

// }



// const otplogin = async (req,res)=>{
//     const uid = req.query.uid
//     console.log("otppload "+uid)
//     try {
//     res.render("user/otplogin",{uid:uid})

//     } catch (error) {
//         console.log(error.message)
//     }

// }

// async function deleteuser(uid){
//     try {
//         const deleted  = await User.findOneAndDelete({_id:uid})
//         if(deleted != null)
//         {
//         console.log("user deleted")

//         }
//         else{
//             console.log("error in deletion")
//         }
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const signup = async (req,res) =>{
//    try{ const fname = req.body.firstname
//     const lname = req.body.lastname
//     const email = req.body.email
//     const mobile = req.body.countrycode + req.body.mobile
//     const pass1 = req.body.password
//     const pass2 = req.body.confirmpassword
//     if(pass1 === pass2)
//     {   
//         const hashedpass =await bcrypt.hash(pass1,saltRounds)
//         const user = {
//             firstname:fname,
//             lastname:lname,
//             email:email,
//             mobile:mobile,
//             password:hashedpass,
//         }

//         const userexist = await User.find({email:email,type:'user',isActive:1})
//         // console.log(userexist)
//         if(userexist.length === 0)
//         {
//             const userdata =await User.create(user)
//         if(userdata != null)
//         {   
//             const userID = userdata._id
//             console.log(userID)
//             res.redirect(`/otpload?uid=${userID}`)
//         }
//         else{
//             res.redirect('/signup')
//         }
//         }
//         else{
//             res.render("user/usersignup",{err:"Account already exist !!"})

//         }
        
//     }
//     else{
//         res.render("user/usersignup",{err:"Password does not Match !!"})
//     }}
//     catch(err)
//     {
//         console.log(err.message)
//     }

// }

// const sendotp =  async (req,res) =>{
// try{    const uid = req.query.uid
//     console.log(uid+"from fetch")
//     const udata = await User.findById({_id:uid})
//     if(udata != null)
//     {   
//         const email = udata.email
//         const userID = udata._id
//         const OTP =  otp.createOTP()
//         const hashedOTP = await otp.hashOTP(OTP)
//         console.log(hashedOTP)
//         const otptosave = {
//             user_id:userID,
//             otp:hashedOTP,
//             createdAt: Date.now(),
//             expireAt: Date.now() + 60000

//         }
//         const savedOTP =await otpModel.create(otptosave)
//         //  calledpost = true
//         if (savedOTP != null)
//         {   console.log(savedOTP._id +"OTP saved")
//             const mailres = mailer.sendmail(email,OTP)
//             if(mailres)
//             {
//             res.json({data:"OTP send successfully!!"})
//             setTimeout(()=>{otp.removeOTP(savedOTP._id)},60000)
//             }
//             else{
//                 res.json({err:"Error in sending mail!! Try Again."})
//             }
//         }
//         else
//         {
//             console.log(savedOTP)
//         }
//     }
//     else{
//         res.json({err:"User doesn't exist !!.Please register again."})
//     }
// }
// catch(error)
// {
//     console.log(error.message)
// }
// }

// const verifyotplogin = async (req,res)=>{
//     try {
//         const otpfrom = req.body.otp
//         const uid = req.body.uid
//         const hashed = await otpModel.findOne({user_id:uid})
//         if(hashed != null)
//         {   console.log("hashed"+hashed)
         
//             const isverified = await otp.verifyOTP(otpfrom,hashed.otp)
//             console.log(isverified)

//             if(isverified)
//             {   console.log(isverified)
//                 const userconfirm = await User.findById({_id:uid})
//                 if(userconfirm != null)
//                 {   
//                     calledpost = true
//                     const id = userconfirm._id.toString()
//                     const payload ={
//                         _id:id,
//                     }
//                 const token = jwttoken.createtoken(payload)
//                     res.cookie("token",token,{ secure:true , httpOnly:true })
//                     res.redirect("/home")
//                 }
//             else{
//                     console.log("user is not confirmed")
//                  }
//             }
//             else{
//                 res.render("user/otplogin",{err:"Invalid OTP !!",uid:uid})
//             }

//         }
//         else{
//             res.render('user/otplogin',{err:"OTP timed out!! Register again.",uid:uid})
//         }

//     } catch (error) {
//         console.log(error.message)
//     }
// }


// const verifyotp = async (req,res)=>{
//     try {
//         const otpfrom = req.body.otp
//         const uid = req.body.uid
//         const hashed = await otpModel.findOne({user_id:uid})
//         if(hashed != null)
//         {
//             const isverified =await otp.verifyOTP(otpfrom,hashed.otp)
//             if(isverified)
//             {
//                 const userconfirm = await User.findByIdAndUpdate({_id:uid},{$set:{isActive:1}})
//                 if(userconfirm != null)
//                 {   
//                     calledpost = true
//                     const id = userconfirm._id.toString()
//                     const payload ={
//                         _id:id,
//                     }
//                 const token = jwttoken.createtoken(payload)
//                     res.cookie("token",token,{ secure:true , httpOnly:true })
//                     res.redirect("/home")
//                 }
//                 else{
//                     console.log("user is not confirmed")
//                 }
//             }
//             else{
//                 res.render("user/otpsignup",{err:"Invalid OTP !!",uid:uid})
//             }

//         }
//         else{
//             res.render('user/otpsignup',{err:"OTP timed out!! Register again.",uid:uid})
//         }

//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const loadhome = async(req,res)=>{
//     try {
//         const uid = req.userid
//         // console.log("home "+uid)
//         const data = await User.findById({_id:uid}).populate('cart.product_id')
//         // console.log(data.cart)
//         const pdata = await Product.find().limit(8)
//         // console.log(data)
//         res.render('user/home',{products:pdata,udata:data})
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const logout = async (req,res)=>{
//     try {
//         res.clearCookie('token').json({data:"Logout Successful."})
        
// //     } catch (error) {
// //         console.log(error.message)
// //     }
// // }

// // module.exports = {
// //   loginredirect,
// //   loginload,
// //   login,
// //   signupload,
// //   sendotp,
// //   signup,
// //   otpload,
// //   verifyotp,
// //   verifyotplogin,
// //   loadhome,
// //   otplogin,
// //   logout
// // };
// module.exports.signup_get=(req,res)=>{
//    res.render('users/signup') 
// }
// module.exports.signup_post=async(req,res)=>{
//    const {email,password}=req.body;
//    res.status(201).json(user)
//    try{
//     const user=await user.create({email,password})
//     res.status(201).json(user)
//    }catch(err){
//          console.log(err);
//          res.status(400).send('error user not created')
//  }
// }
//  module.exports.login_get=(req,res)=>{
//     res.render('users/login') 
//  }
//  module.exports.login_post=(req,res)=>{
//     res.send('login') 
//  }

const User = require("../models/userModels");
const otpModel = require("../models/otpSchema");
const jwttoken = require("../utils/jwt");
const otp = require('../utils/otp')
const mailer = require('../utils/mailer')
const bcrypt = require('bcrypt');

const saltRounds = 10;


const loginredirect = (req, res) => {
  res.redirect("/login");
};

const loginload =async (req, res) => {
  res.render("users/userlogin");
};
const login =async (req, res) => {
    const email = req.body.email
    const pwd = req.body.password
    const loggeduser = await User.findOne({email:email,type:"user",isActive:1})
    
    if(loggeduser != null)
    {   
        const passtrue = await bcrypt.compare(pwd,loggeduser.password)
        if(passtrue)
        {
            res.redirect(`/otplogin?uid=${loggeduser._id}`)
        }
        else{
            res.render("users/userlogin",{err:"Invalid Password"})
        }
    }
    else{
        res.render('users/userlogin',{err:"Invalid User"})
    }
};

const signupload = (req, res) => {
  res.render("users/usersignup");
};

let calledpost

const otpload = async (req,res)=>{
    const uid = req.query.uid
    // console.log("otppload "+uid)
    calledpost = false
    try {
    res.render("users/otpsignup",{uid:uid})
    setTimeout(()=>{ 
        if(!calledpost)
        {   console.log("entered into called post")
            setTimeout(()=>{
            deleteuser(uid)
        },120000)
    }
    else{
        console.log("user not deleted")
    }
},300000)

    } catch (error) {
        console.log(error.message)
    }

}



const otplogin = async (req,res)=>{
    const uid = req.query.uid
    console.log("otppload "+uid)
    try {
    res.render("users/otplogin",{uid:uid})

    } catch (error) {
        console.log(error.message)
    }

}

async function deleteuser(uid){
    try {
        const deleted  = await User.findOneAndDelete({_id:uid})
        if(deleted != null)
        {
        console.log("user deleted")

        }
        else{
            console.log("error in deletion")
        }
    } catch (error) {
        console.log(error.message)
    }
}

const signup = async (req,res) =>{
   try{ const fname = req.body.firstname
    const lname = req.body.lastname
    const email = req.body.email
    const mobile = req.body.countrycode + req.body.mobile
    const pass1 = req.body.password
    const pass2 = req.body.confirmpassword
    if(pass1 === pass2)
    {   
        const hashedpass =await bcrypt.hash(pass1,saltRounds)
        const user = {
            firstname:fname,
            lastname:lname,
            email:email,
            mobile:mobile,
            password:hashedpass,
        }

        const userexist = await User.find({email:email,type:'user',isActive:1})
        // console.log(userexist)
        if(userexist.length === 0)
        {
            const userdata =await User.create(user)
        if(userdata != null)
        {   
            const userID = userdata._id
            console.log(userID)
            res.redirect(`/otpload?uid=${userID}`)
        }
        else{
            res.redirect('/signup')
        }
        }
        else{
            res.render("users/usersignup",{err:"Account already exist !!"})

        }
        
    }
    else{
        res.render("users/usersignup",{err:"Password does not Match !!"})
    }}
    catch(err)
    {
        console.log(err.message)
    }

}

const sendotp =  async (req,res) =>{
try{    const uid = req.query.uid
    console.log(uid+"from fetch")
    const udata = await User.findById({_id:uid})
    if(udata != null)
    {   
        const email = udata.email
        const userID = udata._id
        const OTP =  otp.createOTP()
        const hashedOTP = await otp.hashOTP(OTP)
        console.log(hashedOTP)
        const otptosave = {
            user_id:userID,
            otp:hashedOTP,
            createdAt: Date.now(),
            expireAt: Date.now() + 60000

        }
        const savedOTP =await otpModel.create(otptosave)
        //  calledpost = true
        if (savedOTP != null)
        {   console.log(savedOTP._id +"OTP saved")
            const mailres = mailer.sendmail(email,OTP)
            if(mailres)
            {
            res.json({data:"OTP send successfully!!"})
            setTimeout(()=>{otp.removeOTP(savedOTP._id)},60000)
            }
            else{
                res.json({err:"Error in sending mail!! Try Again."})
            }
        }
        else
        {
            console.log(savedOTP)
        }
    }
    else{
        res.json({err:"User doesn't exist !!.Please register again."})
    }
}
catch(error)
{
    console.log(error.message)
}
}

const verifyotplogin = async (req,res)=>{
    try {
        const otpfrom = req.body.otp
        const uid = req.body.uid
        const hashed = await otpModel.findOne({user_id:uid})
        if(hashed != null)
        {   console.log("hashed"+hashed)
         
            const isverified = await otp.verifyOTP(otpfrom,hashed.otp)
            console.log(isverified)

            if(isverified)
            {   console.log(isverified)
                const userconfirm = await User.findById({_id:uid})
                if(userconfirm != null)
                {   
                    calledpost = true
                    const id = userconfirm._id.toString()
                    const payload ={
                        _id:id,
                    }
                const token = jwttoken.createtoken(payload)
                    res.cookie("token",token,{ secure:true , httpOnly:true })
                    res.redirect("/home")
                }
            else{
                    console.log("user is not confirmed")
                 }
            }
            else{
                res.render("users/otplogin",{err:"Invalid OTP !!",uid:uid})
            }

        }
        else{
            res.render('users/otplogin',{err:"OTP timed out!! Register again.",uid:uid})
        }

    } catch (error) {
        console.log(error.message)
    }
}


const verifyotp = async (req,res)=>{
    try {
        const otpfrom = req.body.otp
        const uid = req.body.uid
        const hashed = await otpModel.findOne({user_id:uid})
        if(hashed != null)
        {
            const isverified =await otp.verifyOTP(otpfrom,hashed.otp)
            if(isverified)
            {
                const userconfirm = await User.findByIdAndUpdate({_id:uid},{$set:{isActive:1}})
                if(userconfirm != null)
                {   
                    calledpost = true
                    const id = userconfirm._id.toString()
                    const payload ={
                        _id:id,
                    }
                const token = jwttoken.createtoken(payload)
                    res.cookie("token",token,{ secure:true , httpOnly:true })
                    res.redirect("/home")
                }
                else{
                    console.log("user is not confirmed")
                }
            }
            else{
                res.render("users/otpsignup",{err:"Invalid OTP !!",uid:uid})
            }

        }
        else{
            res.render('users/otpsignup',{err:"OTP timed out!! Register again.",uid:uid})
        }

    } catch (error) {
        console.log(error.message)
    }
}

const loadhome = async(req,res)=>{
    try {
        const uid = req.userid
        // console.log("home "+uid)
        const data = await User.findById({_id:uid}).populate('cart.product_id')
        // console.log(data.cart)
        const pdata = await Product.find().limit(8)
        // console.log(data)
        res.render('users/home',{products:pdata,udata:data})
    } catch (error) {
        console.log(error.message)
    }
}

const logout = async (req,res)=>{
    try {
        res.clearCookie('token').json({data:"Logout Successful."})
        
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
  loginredirect,
  loginload,
  login,
  signupload,
  sendotp,
  signup,
  otpload,
  verifyotp,
  verifyotplogin,
  loadhome,
  otplogin,
  logout
};
