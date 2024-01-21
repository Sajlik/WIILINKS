const User = require("../models/userModels");
const Coupon = require("../models/couponModel")
const Order=require("../models/orderSchema")
const expressHandler = require('express-async-handler')
const bcrypt = require("bcrypt")
const Product = require("../models/product");
const  numeral = require("numeral");
const moment = require("moment")

const helpers = require('../helpers/adminHelpers')

const getDashboard = async (req, res) => {
    try {
        res.render("index")
    } catch (error) {
        console.log(error.message);
    }
}

const getLoginPage = async (req, res) => {
    try {
        res.render("admin-login")
    } catch (error) {
        console.log(error.message);
    }
}


const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email)

        const findAdmin = await User.findOne({ email, isAdmin: "1" })
        // console.log("admin data : ", findAdmin);

        if (findAdmin) {
            const passwordMatch = await bcrypt.compare(password, findAdmin.password)
            if (passwordMatch) {
                req.session.admin = true
                console.log("Admin Logged In");
                res.redirect("/admin")
            } else {
                console.log("Password is not correct");
                res.redirect("/admin/login")
            }
        } else {
            console.log("He's not an admin");
        }
    } catch (error) {
        console.log(error.message);
    }
}
const getLogout = async (req, res) => {
    try {
        req.session.admin = null
        res.redirect("/admin/login")
    } catch (error) {
        console.log(error.message);
    }
}

const getCouponPageAdmin = async (req, res) => {
    try {
        const findCoupons = await Coupon.find({})
        res.render("coupon", {coupons : findCoupons})
    } catch (error) {
        console.log(error.message);
    }
}
const createCoupon = async (req, res) => {
    try {

        const data = {
            couponName: req.body.couponName,
            startDate: new Date(req.body.startDate + 'T00:00:00'),
            endDate: new Date(req.body.endDate + 'T00:00:00'),
            offerPrice: parseInt(req.body.offerPrice),
            minimumPrice: parseInt(req.body.minimumPrice)
        };

        const newCoupon = new Coupon({
            name : data.couponName,
            createdOn : data.startDate,
            expireOn : data.endDate,
            offerPrice : data.offerPrice,
            minimumPrice : data.minimumPrice
        })

        await newCoupon.save()
        .then(data=>console.log(data))

        res.redirect("/admin/coupon")
        
console.log(data);
        
    } catch (error) {
        console.log(error.message);
    }
}
const loadDashboard = expressHandler(async (req, res) => {
    try {
        const messages = req.flash();
        const user = req?.user;
        const recentOrders = await Order.find()
            .limit(3)
           
            .select("totalAmount orderedDate totalPrice")
            .sort({ _id: -1 });

        let totalSalesAmount = 0;
        recentOrders.forEach((order) => {
            totalSalesAmount += order.totalPrice;
        });

        totalSalesAmount = numeral(totalSalesAmount).format("0.0a");

        const totalSoldProducts = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    total_sold_count: {
                        $sum: "$sold",
                    },
                },
            },
        ]);

        const totalOrderCount = await Order.countDocuments();
        const totalActiveUserCount = await User.countDocuments({ isBlock: false });
        const allOrders = await helpers.getAllOrders();
        const todoMessage = await helpers.getTodoList();

        var totalSales = 0;
        for (let i = 0; i < allOrders.length; i++) {
            totalSales += allOrders[i].totalAmount + allOrders[i].walletAmount
        }
        const topProducts = await mostPurchasedProducts();
        // console.log(topProducts)
        const timeWiseOrders = await helpers.timeWiseOrders()

        const newarr = helpers.newArray(timeWiseOrders);
        // console.log(newarr);
        // const year=helpers.getYearRatio(newarr);
        // const month=helpers.getMonthRatio(newarr);
        // const week=helpers.getWeekRatio(newarr);
        const day = helpers.getDayRatio(newarr);
        res.render("dashboard", {
            title: "Dashboard",
            user,
            messages,
            recentOrders,
            totalOrderCount,
            totalActiveUserCount,
            totalSalesAmount,
            moment,
            totalSoldProducts: totalSoldProducts[0].total_sold_count,
            allOrders,
            todoMessage,
            totalSales,
            newarr,
            graph: { day },
        });
    } catch (error) {
        throw new Error(error);
    }
});

//  const loadDashboard = expressHandler(async (req, res) => {
//      try {
//          const messages = req.flash();
//          const user = req?.user;
//          const recentOrders = await Order.find()
//              .limit(3)
//              .populate({
//                  path: "user",
//                  select: "firstName lastName image",
//              })
//              .populate("orderItems")
//              .select("totalAmount orderedDate totalPrice")
//              .sort({ _id: -1 });

//          let totalSalesAmount = 0;
//          recentOrders.forEach((order) => {
//              totalSalesAmount += order.totalPrice;
//          });

//          totalSalesAmount = numeral(totalSalesAmount).format("0.0a");

//          const totalSoldProducts = await Product.aggregate([
//              {
//                  $group: {
//                      _id: null,
//                      total_sold_count: {
//                          $sum: "$sold",
//                      },
//                  },
//              },
//          ]);

//          const totalOrderCount = await Order.countDocuments();
//          const totalActiveUserCount = await User.countDocuments({ isBlock: false });

//          res.render("admin/pages/dashboard", {
//              title: "Dashboard",
//              user,
//              messages,
//              recentOrders,
//              totalOrderCount,
//              totalActiveUserCount,
//              totalSalesAmount,
//              moment,
//              totalSoldProducts: totalSoldProducts[0].total_sold_count,
//          });
//      } catch (error) {
//          throw new Error(error);
//      }
//  });
 const salesReportpage = expressHandler(async (req, res) => {
     try {
         res.render("admin/pages/sales-report", { title: "Sales Report" });
     } catch (error) {
         throw new Error(error);
     }
 });

const generateSalesReport = async (req, res, next) => {
    try {
        const fromDate = new Date(req.query.fromDate);
        const toDate = new Date(req.query.toDate);
        const paymentMethod = req.query.paymentMethod;

        // Create a filter object based on the selected payment method
        let paymentMethodFilter;
        if (paymentMethod !== 'all') {
            paymentMethodFilter = { payment_method: paymentMethod };
        } else {
            paymentMethodFilter = {}; // No specific payment method selected, include all
        }

        const salesData = await Order.find({
            orderedDate: {
                $gte: fromDate,
                $lte: toDate,
            },
            ...paymentMethodFilter,
        }).select("orderId totalPrice orderedDate payment_method -_id");
        
        res.status(200).json(salesData);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

async function showGraph(req, res) {
    try {
        const timetype = req.params.timetype;
        const timeWiseOrders = await helpers.timeWiseOrders()
        const newarr = helpers.newArray(timeWiseOrders);
        if (timetype === 'year') {
            const yearRatio = helpers.getYearRatio(newarr);
            return res.json({ success: true, ratio: { time: timetype, value: yearRatio } })
        }
        if (timetype === 'month') {
            const monthRatio = helpers.getMonthRatio(newarr);
            return res.json({ success: true, ratio: { time: timetype, value: monthRatio } })
        }
        if (timetype === 'week') {
            const weekRatio = helpers.getWeekRatio(newarr);
            return res.json({ success: true, ratio: { time: timetype, value: weekRatio } })
        }
        if (timetype === 'day') {
            const dayRatio = helpers.getDayRatio(newarr);
            return res.json({ success: true, ratio: { time: timetype, value: dayRatio } })
        }
        return res.json({ success: false, message: 'Somthing Trouble detected.' })
    } catch (error) {
        console.log(error)
    }
}


const getSalesData = async (req, res) => {
    try {
        const pipeline = [
            {
                $project: {
                    year: { $year: "$orderedDate" },
                    month: { $month: "$orderedDate" },
                    totalPrice: 1,
                },
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    totalSales: { $sum: "$totalPrice" },
                },
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            {
                                $cond: {
                                    if: { $lt: ["$_id.month", 10] },
                                    then: { $concat: ["0", { $toString: "$_id.month" }] },
                                    else: { $toString: "$_id.month" },
                                },
                            },
                        ],
                    },
                    sales: "$totalSales",
                },
            },
        ];

        const monthlySalesArray = await Order.aggregate(pipeline);
       

        res.json(monthlySalesArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


/**
 * Get Sales Data yearly
 * Method GET
 */
const getSalesDataYearly = async (req, res) => {
    try {
        const yearlyPipeline = [
            {
              $project: {
                year: { $year: "$orderedDate" },
                totalPrice: 1,
              },
            },
            {
              $group: {
                _id: { year: "$year" },
                totalSales: { $sum: "$totalPrice" },
              },
            },
            {
              $project: {
                _id: 0,
                year: { $toString: "$_id.year" },
                sales: "$totalSales",
              },
            },
          ];
          

        const yearlySalesArray = await Order.aggregate(yearlyPipeline);
        
        res.json(yearlySalesArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * get sales data weekly
 * method get
 */
const getSalesDataWeekly =async (req, res) => {
    try {
        const weeklySalesPipeline = [
            {
              $project: {
                week: { $week: "$orderedDate" },
                totalPrice: 1,
              },
            },
            {
                $group: {
                    _id: { week: { $mod: ["$week", 7] } },
                    totalSales: { $sum: "$totalPrice" },
                  },
            },
            {
              $project: {
                _id: 0,
                week: { $toString: "$_id.week" },
                dayOfWeek: { $add: ["$_id.week", 1] },
                sales: "$totalSales",
              },
            },
            {
                $sort: { dayOfWeek: 1 },
              },
        ];
          

        const weeklySalesArray = await Order.aggregate(weeklySalesPipeline);
        console.log(weeklySalesArray);

        res.json(weeklySalesArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = {
    getDashboard,
    getLoginPage,
    verifyLogin,
    getLogout,
    createCoupon,
    getCouponPageAdmin,
  
    getSalesData,
    generateSalesReport,
    getSalesDataYearly,
    getSalesDataWeekly,
    loadDashboard,
    showGraph

}
