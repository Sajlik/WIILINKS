const express = require('express')
const admin_router = express.Router()

const admincontroller=require('../controllers/adminController')
const categoryController=require('../controllers/categoryController')
const productController = require("../controllers/productController")

const { isAdmin } = require("../middileware/auth")

const multer = require("multer")
const storage = require("../helpers/multer")
const upload = multer({ storage: storage })
admin_router.use("/public/uploads", express.static("/public/uploads"))



admin_router.get("/login", admincontroller.getLoginPage)
admin_router.post("/login", admincontroller.verifyLogin)
admin_router.get("/logout", isAdmin, admincontroller.getLogout)
admin_router.get("/", isAdmin, admincontroller.getDashboard)

admin_router.get("/category", isAdmin, categoryController.getCategoryInfo)
admin_router.post("/addCategory", isAdmin, categoryController.addCategory)
admin_router.get("/allCategory", isAdmin, categoryController.getAllCategories)
admin_router.get("/listCategory", isAdmin, categoryController.getListCategory)
admin_router.get("/unListCategory", isAdmin, categoryController.getUnlistCategory)
admin_router.get("/editCategory", isAdmin, categoryController.getEditCategory)
admin_router.post("/editCategory/:id", isAdmin, categoryController.editCategory)

admin_router.get("/addProducts", isAdmin, productController.getProductAddPage)
admin_router.post("/addProducts", isAdmin, upload.array("images", 5), productController.addProducts)
admin_router.get("/products", isAdmin, productController.getAllProducts)
admin_router.get("/editProduct", isAdmin, productController.getEditProduct)
admin_router.post("/editProduct/:id", isAdmin, upload.array("images", 5), productController.editProduct)
admin_router.post("/deleteImage", isAdmin, productController.deleteSingleImage)
admin_router.get("/blockProduct", isAdmin, productController.getBlockProduct)
admin_router.get("/unBlockProduct", isAdmin, productController.getUnblockProduct)




module.exports = admin_router