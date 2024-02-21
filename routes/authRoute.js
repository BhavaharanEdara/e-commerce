const express = require('express');
const router = express.Router();
const { createUser, loginUser, getAUser ,getAllUsers, deleteAUser, updateAUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, saveAddress, addToCart,deleteFromCart, emptyCart, getUserCart, applyCoupon ,createOrder, getOrders} = require('../controller/userController');
const {isLoggedin, isAdmin}= require('../middlewares/authMiddleware');

router.route('/signup')
.post(createUser);
router.route('/forgot-password-token').post(forgotPasswordToken);
router.route('/reset-password/:token').post(resetPassword);
router.route('/login').post(loginUser);
router.route('/login-admin').post(loginAdmin);
router.route('/logout').get(isLoggedin,logout);
router.route('/password').put(isLoggedin, updatePassword);
router.route('/save-address').put(saveAddress)
router.route('/cart').get(isLoggedin,getUserCart).post(isLoggedin,addToCart).delete(isLoggedin, emptyCart);
router.route('/getCart').get(isLoggedin,getUserCart);
router.route('/removeFromCart').put(isLoggedin,deleteFromCart);
router.route('/applyCoupon').put(isLoggedin, applyCoupon)
router.route('/order').post(isLoggedin,createOrder).get(isLoggedin,getOrders);
router.route('/profile/:id').get(isLoggedin,getAUser).delete(isLoggedin,deleteAUser).patch(isLoggedin,updateAUser);
router.route('/refresh').put(handleRefreshToken)

router.use(isLoggedin,isAdmin);
router.route('/allUsers').get(getAllUsers);



module.exports = router;