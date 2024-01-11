const express=require('express')
const mongoose=require('mongoose')
const cookieparser=require('cookie-parser')
const app=express()
app.use(express.static('public'))
app.use(cookieparser())
app.use(express.json())
app.set('view engine','ejs')
const dbURI = "mongodb://127.0.0.1:27017/project";

const userRoutes=require('./routes/userRoute')
app.use(userRoutes)
mongoose.connect(dbURI)
    .then((result) => {
        app.listen(5000, () => {
            console.log("App is listening on port 5000");
        });
    })
    .catch((err) => console.log(err));

    app.get('/',(req,res)=>{
        res.render('login')
    })
    app.get('/dashboard',(req,res)=>{
        res.render('dashboard')
    })
    
