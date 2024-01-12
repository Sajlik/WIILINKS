const User = require("../models/userSchema");
const Product = require('../models/productSchema')

const jwttoken = require("../utils/jwt");
const bcrypt = require('bcrypt')

const loginredirect = async (req,res)=>{
    res.redirect('/admin/login')
}

const loginload = async (req,res)=>{
    res.render('admin/login')
}

const login = async (req,res)=>{
    const email = req.body.email
    const pwd = req.body.password

    const admin = await User.findOne({email:email,type:"admin"})
    if(admin != null)
    {   
        const isAdmin = await bcrypt.compare(pwd,admin.password)
        if(isAdmin)
        {   
            const payload ={
                id: admin._id.toString()
            }
            const token =  jwttoken.createtoken(payload)
            res.cookie("admintoken",token,{ secure:true , httpOnly:true })
            res.redirect("/admin/home")
        }
        else{
            res.render("admin/login",{err:"Invalid Password !!"})
        }
    }
    else{
        res.render("admin/login",{err:"Invalid Credentials !!"})
    }
}

const loadhome = async (req,res)=>{

    res.render("admin/dashboard")
}


const search = async (req,res)=>
{
    try {
        const key = req.body.searchdata
        const prodata = await Product.find({productname:{$regex: new RegExp(key,'i')}})
        console.log(prodata)
        if(prodata)
        {
            res.render('admin/productmanage',{products:prodata})
        }
        else{
            res.render('/admin/products',{err:"No Products Found !!"})
        }
    } catch (error) {
        console.log(error.message)
    }
}



module.exports = {
    loginredirect,
    loginload,
    login,
    loadhome,
    search
}