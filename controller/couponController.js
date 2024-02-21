const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');


const createCoupon = asyncHandler(async(req,res)=>{
    try{
        const coupon = await Coupon.create(req.body);
        res.json(coupon);
    }
    catch(error){
        throw new Error(error);
    }
}) 

const getAllCoupons = asyncHandler(async(req,res)=>{
    try{
        const coupon = await Coupon.find();
        res.json(coupon);
    }
    catch(error){
        throw new Error(error);
    }
}) 


const updateCoupon = asyncHandler(async(req,res)=>{
    const {id} = req.params; 
    try{
        const coupon = await Coupon.findByIdAndUpdate({_id:id}, req.body, {new: true});
        res.json(coupon);
    }
    catch(error){
        throw new Error(error);
    }
}) 
const deleteCoupon = asyncHandler(async(req,res)=>{
    const {id} = req.params; 
    try{
        const coupon = await Coupon.findByIdAndDelete({_id:id});
        res.json(coupon);
    }
    catch(error){
        throw new Error(error);
    }
}) 


module.exports = {createCoupon, getAllCoupons, updateCoupon, deleteCoupon}

