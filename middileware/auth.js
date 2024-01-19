const User = require("../models/userModels")

const isLogged = (req, res, next)=>{
    if(req.session.user){
        User.findById({_id : req.session.user}).lean()
        .then((data)=>{
            if(data.isBlocked == false){
                next()
            }else{
                res.redirect("/login")
            }
        })
    }else{
        res.redirect("/login")
    }
}


const isAdmin = (req, res, next) => {
    if (req.session.admin) {
        User.findOne({ isAdmin: "1" })
            .then((data) => {
                if (data) {
                    next();
                } else {
                    res.redirect("/admin/login");
                }
            })
            .catch((error) => {
                console.error("Error in isAdmin middleware:", error);
                res.status(500).send("Internal Server Error");
            });
    } else {
        res.redirect("/admin/login");
    }
};


module.exports = {
    isLogged,
    isAdmin
}

// const isLogin=async(req,res,next)=>{
//     try {
        
//         if(req.session.user_id){
//             next();
//         }
//         else{
//             res.redirect('/');
//             next();
//         }
//         next();

//     } catch (error) {
//         console.log(error.message);
//     }
// }


// const isLogout=async(req,res,next)=>{
//     try {
        
//         if(req.session.user_id){
//             res.redirect('/home')
//         }
//         next();

//     } catch (error) {
//         console.log(error.message);
//     }
// }
// module.exports={
//     isLogin,
//     isLogout
// }