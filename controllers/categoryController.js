// const expressHandler=require('express-async-handler')
 const Category=require('../models/categoryModel')


// const categoryManagement=expressHandler(async(req,res)=>{
//     try{
//         const messages=req.flash();
//         const findCategory=await category.find()
//         res.render('./admin/category',{catList:findCategory,title:'Categories',messages})
//     }
//     catch(error){
//         throw new Error(error)
//     }
// })

// const addcategory=expressHandler(async(req,res)=>{
//    try{
//     const messages=req.flash();
//     req.render('./admin/addCategory',{title:'addCategory',messages})
// }catch(error){
//  throw new Error(error)
// }
// })

// const insertCategory=expressHandler(async(req,res)=>{
//     try{
//         const categoryName=req.body.addCategory;
//         const regexCategoryName=new RegExp(`^${categoryName}$`,'i');
//         const findCat=await category.findOne({ categoryName:regexCategoryName})
       
//         if(findCat){
//             const catCheck=`Category ${categoryName} Already exist`;
//             res.render('./admin/addCategory', {catCheck,title:'addCategory'})
//         }else{
//             const result=new category({
//                 categoryName:categoryName,
//             });
//             await result.save();
//             res.render('./admin/addCategory',{
//                 message:`Category ${categoryName} added successfully`,
//                 title:'addCategory'
//             })
//         }
//     }catch(error){
//         throw new Error(error)
//     }
// })
// const unList=express=expressHandler(async(req,res)=>{
//     try {
//         const id=req.params.id
//         console.log(id);
//         const listing=await category.findByIdAndUpdate({_id:id}, {$set:{isListed:false}})
//         console.log(listing);
//         res.redirect('/admin/category')
//     } catch (error) {
//         throw new error(error)
//     }
// })

// const list=express=expressHandler(async(req,res)=>{
//     try {
//         const id=req.params.id
//         console.log(id);
//         const listing=await category.findByIdAndUpdate({_id:id}, {$set:{isListed:true}})
//         console.log(listing);
//         res.redirect('/admin/category')
//     } catch (error) {
//         throw new error(error)
//     }
// })
// const searchCategory=expressHandler(async(req,res)=>{
//     try{
//         const data=req.body.search
//         const searching=await category.find({title:'searching',catList:searching})
//         if(searching){
//             res.render('./admin/categories',{title:'Searching',catList:searching})
//         }else{
//             res.render('./admin/categories',{title:'searching'})
//         }
//     }catch(error){
//         throw new Error(error)
//     }
// })
// const editCategory=expressHandler(async(req,res)=>{
//     try{
//         const {id}= req.params
//         const catName=await category.findById(id);
//         if(catName){
//             res.render('./admin/editCategory',{title:'editCategory',values:catName});
//         }else{
//             console.log('error..');
//         }
//     }catch(error){
//         throw new Error(error)
//     }
// })
// const updateCategory=expresshandler(async(req,res)=>{
//     try {
//         const id=req.params.id
//          const{updateName,offer,description,startDate,endDate}=req.body
//          const cat=await category.findById(id)
//          cat.categoryName=updateName;
//          cat.offer=offer;
//          cat.description=description;
//          cat.startDate=startDate;
//          cat.endDate=endDate;
//          const saved=await cat.save()
//          res.redirect()
//     } catch (error) {
        
//     }
// })
// Rendering the category page
const getCategoryInfo = async (req, res) => {
    try {
        const categoryData = await Category.find({})
        res.render("category", { category: categoryData })
    } catch (error) {
        console.log(error.message);
    }
}

// const addCategory = async (req, res) => {
//     try {
//         const { name, description } = req.body
//         const categoryExists = await Category.findOne({ name })
//         if (description) {
//             if (!categoryExists) {
//                 const newCategory = new Category({
//                     name: name,
//                     description: description
//                 })
//                 await newCategory.save()
//                 console.log("New Category : ", newCategory);
//                 res.redirect("/admin/allCategory")
//             } else {
//                 res.redirect("/admin/category")
//                 console.log("Category Already exists");
//             }
//         } else {
//             console.log("description required");
//         }
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const caseInsensitiveNameRegex = new RegExp(`^${name}$`, 'i');
        const categoryExists = await Category.findOne({ name: caseInsensitiveNameRegex });

        if (description) {
            if (!categoryExists) {
                const newCategory = new Category({
                    name: name,
                    description: description,
                });
                await newCategory.save();
                console.log("New Category : ", newCategory);
                res.redirect("/admin/category");
            } else {
                console.log("Category Already exists");
                const categoryData = await Category.find({})
                res.render('category',{message:"Category Already exists", category: categoryData })

            }
        } else {
            console.log("Description required");
            // Handle the case where description is not provided
            
            // or
            // res.redirect("/admin/descriptionRequired");
        }
    } catch (error) {
        console.log(error.message);
        // Handle other errors as needed
        res.status(500).send("Internal Server Error");
    }
};




const getListCategory = async (req, res) => {
    try {
        let id = req.query.id
        console.log("working");
        await Category.updateOne({ _id: id }, { $set: { isListed: false } })
        res.redirect("/admin/category")
    } catch (error) {
        console.log(error.message);
    }
}


const getUnlistCategory = async (req, res) => {
    try {
        let id = req.query.id
        await Category.updateOne({ _id: id }, { $set: { isListed: true } })
        res.redirect("/admin/category")
    } catch (error) {
        console.log(error.message);
    }
}


const getEditCategory = async (req, res) => {
    try {
        const id = req.query.id
        const category = await Category.findOne({ _id: id })
        res.render("edit-category", { category: category })
    } catch (error) {
        console.log(error.message);
    }
}


const editCategory = async (req, res) => {
    try {
        const id = req.params.id
        const { categoryName, description } = req.body
        const findCategory = await Category.find({ _id: id })
        if (findCategory) {
            await Category.updateOne(
                { _id: id },
                {
                    name: categoryName,
                    description: description
                })
            res.redirect("/admin/category")
        } else {
            console.log("Category not found");
        }

    } catch (error) {
        console.log(error.message);
    }
}





module.exports = {
    getCategoryInfo,
    addCategory,
    getListCategory,
    getUnlistCategory,
    editCategory,
    getEditCategory
}