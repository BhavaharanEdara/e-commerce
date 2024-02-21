const Brand = require("../models/brandModel");
const asyncHandler = require('express-async-handler');

const createBrand = asyncHandler(async(req,res)=>{
    try{
        const brand = await Brand.find(req.body);
        if(brand?.length===0){
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
        }
        res.json(brand);
    }
    catch(error){
        throw new Error(error);
    }
})

const updateBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const newBrand = await Brand.findByIdAndUpdate({_id:id}, req.body,{new:true});
        res.json(newBrand);

    }
    catch(error){
        throw new Error(error);
    }
})

const deleteBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const brand = await Brand.findByIdAndDelete({_id:id});
        res.json(brand);

    }
    catch(error){
        throw new Error(error);
    }
})

const getBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const getaBrand = await Brand.findById({_id:id});
        res.json(getaBrand);

    }
    catch(error){
        throw new Error(error);
    }
})

const getAllBrands = asyncHandler(async(req,res)=>{
    try{
        const allBrands = await Brand.find();
        res.json(allBrands);

    }
    catch(error){
        throw new Error(error);
    }
})

module.exports = {createBrand, updateBrand, deleteBrand, getBrand, getAllBrands}; 