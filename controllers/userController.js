const User=require('../models/userModels')
module.exports.signup_get=(req,res)=>{
    res.render('signup')
}
module.exports.signup_post=async(req,res)=>{
    const {email,password}=req.body
    console.log(email);
    console.log(password);
    try{
         const User= await User.create({
            email,password
         })
         res.status(201).json(user)
    }catch(err){
      console.log(err);
    }
}
module.exports.login_get=(req,res)=>{
    res.render('login')
}
module.exports.login_post=(req,res)=>{
    res.send('login successful')
}
module.exports.dashboard_get=(req,res)=>{
    res.render('dashboard')
}
module.exports.dashboard_post=(req,res)=>{
    res.send('dashboard successful')
}