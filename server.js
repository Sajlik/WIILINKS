const express=require('express')
const app=express()
const morgan=required('morgan')
const mongoose= require('mongoose')

app.use(bodyParser.json());
app.use(morgan('tiny'))

require('dotenv/config')

app.get('/',(req,res)=>{
    res.send('hello API')
})
app.get('/products',(req,res)=>{
 
       const product=new Product({
         name:req.body.name,
         image:req.body.image,
         countInStock:req.body.countInStock
       })

    product.save().then((createdProduct=>{
          res.status(201).json(createdProduct)
    }))
    res.send('hello ApI')
})
mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbname:'eshop-database'
})
.then(()=>{
    console.log('Database connected is ready..');
})
.catch((err)=>{
    console.log(err);
})
app.listen(3000,()=>{
    console.log(api);
    console.log('server running http://localhost:3000');
})