const User = require('../models/userModel');
const asyncHandler = require('express-async-handler'); 
const {generateToken} = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const sendMail = require('./emailController');
const crypto = require('crypto');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/ordersModel');
const uniqid = require("uniqid");

const Product = require('../models/productModel')

const createUser = asyncHandler(async(req, res)=>{
    const email = req.body.email;
    const findUser = await User.findOne({email:email});
    if(!findUser){
        const user = await User.create(req.body);
        res.json(user);
    }
    else{
        throw new Error('User aleady exists');
    }
})

const loginUser = asyncHandler(async (req, res)=>{
    const {email, password} = req.body;
    const findUser = await User.findOne({email:email});
    if(findUser && await findUser.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updatedUser = await User.findOneAndUpdate({_id:findUser.id},{
            refreshToken:refreshToken,
        },{new: true});

        const payload = findUser['_id'];
        const jwt = generateToken(payload);
        res.cookie('refreshToken',refreshToken,{httpOnly:true, maxAge: 72*60*60*1000});
        res.json({findUser, token:jwt});
    }
    else if(findUser){
        res.status(500).send("Invalid Credentials");
        throw new Error('Invalid credentials');

    }
    else{
        res.send("User Doesnt exist");

        throw new Error('User doest exists please register');
    }
})

const loginAdmin = asyncHandler(async (req, res)=>{
    const {email, password} = req.body;
    const findAdmin = await User.findOne({email:email});
    if(findAdmin.role !== 'admin'){
        throw new Error("Not Autthorised");
    }
    if(findAdmin && await findAdmin.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updatedUser = await User.findOneAndUpdate({_id:findAdmin.id},{
            refreshToken:refreshToken,
        },{new: true});

        const payload = findAdmin['_id'];
        const jwt = generateToken(payload);
        res.cookie('refreshToken',refreshToken,{httpOnly:true, maxAge: 72*60*60*1000});
        res.json({findAdmin, token:jwt});
    }
    else if(findAdmin){
        throw new Error('Invalid credentials');

    }
    else{
        throw new Error('User doest exists please register');
    }
})

const getAllUsers = asyncHandler(async (req, res)=>{
    try{
        const users = await User.find();
        res.json(users);

    }catch(error){
        throw new Error(error);
    }

})

const getAUser = asyncHandler(async(req, res)=>{
    try{
        const{id} = req.params;
        const getUser = await User.findById({_id:id});
        res.json(getUser);
    }catch(error){
        throw new Error(error);
    }

})

const deleteAUser = asyncHandler(async(req, res)=>{

    try{
        const{id} = req.params;
        const deleteUser = await User.findOneAndDelete({_id:id});
        res.json(deleteUser);
    }catch(error){
        throw new Error(error);
    }

})


const updateAUser = asyncHandler(async(req, res)=>{
    try{
        const{id} = req.params;
        const updatedUser = await User.findOneAndUpdate({_id:id},{
            firstname : req?.body?.firstname,
            secondname : req?.body?.secondname,
            email : req?.body?.email,
        },{new: true});
        res.json(updatedUser);
    }catch(error){
        throw new Error(error);
    }

})

const handleRefreshToken = asyncHandler(async (req, res)=>{
    const cookie = {refreshToken:req.user?.refreshToken};
    if(!cookie?.refreshToken ||cookie?.refreshToken==='') throw new Error("no refresh token");
    const refreshToken = cookie.refreshToken;
    
    const decode = jwt.verify(refreshToken, process.env.refresh_KEY);
    const user = await User.findById({_id:decode.id});
    if(!user) throw Error("No token in db");
    jwt.verify(refreshToken,process.env.refresh_KEY, (err, decode)=>{
        if(err|| user.id!==decode.id){
            console.log(err);
            throw new Error("wrong refreshtoken");
        }
        const accessToken = generateToken(user._id);
        res.json(accessToken);
    })
})

const logout = asyncHandler(async(req, res)=>{
    const cookie = {refreshToken:req.user?.refreshToken};
    if(!cookie?.refreshToken ||cookie?.refreshToken==='') throw new Error("no refresh token");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken:refreshToken});
    if(!user){
        res.clearCookie('refreshToken', {
            httpOnly:true,
            secure:true
        })
         res.sendStatus(204)
    }
    await User.findOneAndUpdate({refreshToken:refreshToken},{
        refreshToken:""
    });
    res.clearCookie('refreshToken', {
        httpOnly:true,
        secure:true
    })
    res.sendStatus(204)



})

const updatePassword = asyncHandler(async(req,res)=>{
    const {id} = req.user
    const password = req.body.password
    const user = await User.findById({_id:id});
    if(password){
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    }
    else{
        res.json(user);
    }
})

const forgotPasswordToken = asyncHandler(async(req,res)=>{
    const {email} = req.body;

    const user = await User.findOne({email:email});
    if(!user){
        throw new Error("User not found");
    } 
    try{
        const token = await user.createResetPasswordToken();
        await user.save();
        const resetURL = `Hi please follow this link to reset Password link valid for 10 mins <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`;
        const data = {
            to: email,
            subject:"Forget Password Link",
            text :"hello user",
            html:resetURL
        }
        sendMail(data);
        res.json(token);
    }
    catch(error){
        throw new Error(error);
    }
})

const resetPassword = asyncHandler(async(req, res)=>{
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken:hashedToken, 
        passwordResetExpires:{$gt:Date.now()}
    });
    if(!user){
        throw Error("url expired");
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.send({msg:"Sucessfull", user: user});

})

const saveAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          address: req?.body?.address,
        },
        {
          new: true,
        }
      );
      res.json(updatedUser);
    } catch (error) {
      throw new Error(error);
    }
  });
  
const addToCart = asyncHandler(async(req,res)=>{
    const {id} = req.user;
    const cartItem = req.body; 
    try{
        let cart =await Cart.findOne({orderBy:id});
        if(!cart){
            cart = new Cart({
                Products:[],
                cartTotal : 0,
                totalAfterDiscount :0,
                orderBy:id
            })
        }
        const productIndex = cart.Products.findIndex((ele)=>ele.Product.toString()===cartItem.Product.toString())
        if(productIndex!==-1){
            cart.Products[productIndex].count += cartItem.count;
        }
        else{
            cart.Products.push(cartItem);
        }
        cart.cartTotal += parseInt(cartItem.count,10)*parseInt(cartItem.price,10);
        await cart.save();
        const user = await User.findOneAndUpdate({_id:id},{cart:cart._id});
        res.json(cart);
    }
    catch(error){
        throw new Error(error);
    }
})
const deleteFromCart = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const item = req.body;
    try{
        let cart = await Cart.findOne({orderBy:_id});
        if(!cart){
            throw new Error('no cart available');
        }
        const itemIndex = cart.Products.findIndex((ele)=>ele.Product.toString()===item.Product.toString());
        if(cart.Products[itemIndex].count<=item.count){
            cart.Products = cart.Products.filter((ele)=>ele.Product.toString()!==item.Product.toString());
            cart.cartTotal -= item.count*item.price
        }
        else{
            cart.Products[itemIndex].count -= item.count;
            cart.cartTotal -= item.count*item.price
        }
        cart.save();
        res.json(cart);
    }
    catch(error){
        throw new Error(error);
    }
})
const getUserCart = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    try{
        const cart = await Cart.findOne({orderBy: _id});
        res.json(cart);
    }
    catch(error){
        throw new Error(error);
    }
})

const emptyCart = asyncHandler(async(req,res)=>{
    const {id} = req.user;
    try{
        const cart = await Cart.findOne({orderBy:id})
        cart.Products=[];
        cart.cartTotal = 0;
        cart.totalAfterDiscount = 0;
        cart.orderBy=id;
        cart.save();
        res.json(cart);
    }
    catch(error){
        throw new Error(error);
    }
})

const applyCoupon = asyncHandler(async(req, res)=>{
    const {name} = req.body;
    const validCoupon = await Coupon.findOne({name :name});
    const {id} = req.user;
    if(!validCoupon){
        throw new Error("Invaid Coupon");
    }
    let {cartTotal} = await Cart.findOne({orderBy: req.user.id});
    let totalAfterDiscount = cartTotal - (cartTotal*validCoupon.discount/100).toFixed(2);
    const updateCart = await Cart.findOneAndUpdate({orderBy: req.user.id}, {totalAfterDiscount:totalAfterDiscount},{new: true});
    res.json(updateCart);

})

const createOrder = asyncHandler(async (req,res)=>{
    const {cod,couponApplied,address,phoneNumber} = req.body;
    const {id} = req.user;

    try{
        if(!cod){
            throw Error("order not placed");
        }
        let userCart = await Cart.findOne({orderBy:id});
        let finalAmount = 0;
        if(couponApplied && userCart.totalDiscount){
            finalAmount = userCart.totalAfterDiscount;
        }
        else{
            finalAmount = userCart.cartTotal;
        }
        let newOrder = await new Order({
            Products :userCart.Products,
            PaymentIntent:{
                id:uniqid(),
                method:"COD",
                amount : finalAmount,
                status :"Processing",
                created : Date.now(),
                currency: "rupees"
            },
            orderBy : id,
            orderStatus :"Processing",
            address:address,
            phoneNumber:phoneNumber
        }).save();
        let update = userCart.Products.map((item) => {
            console.log(item);
            return {
              updateOne: {
                filter: { _id: item.Product._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } },
              },
            };
          });
          const updated = await Product.bulkWrite(update, {});
          res.json({ message: "success" });
      
    }
    catch(error){
        throw new Error(error);
    }
})

const getOrders = asyncHandler(async(req,res)=>{
    const {id} = req.user;
    try{
        const userOrders = await Order.find({orderBy: id});
        res.json(userOrders);
    }
    catch(error){
        throw new Error(error);
    }
})

module.exports = {
    createUser, 
    loginUser, 
    getAllUsers,
    getAUser, 
    deleteAUser,
    updateAUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    saveAddress,
    addToCart,
    deleteFromCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
};
