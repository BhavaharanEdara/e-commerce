const express = require('express');
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon } = require('../controller/couponController');
const { isLoggedin, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();  

router.route('/').post(isLoggedin,isAdmin,createCoupon).get(getAllCoupons).put(updateCoupon).delete(deleteCoupon);



module.exports = router;