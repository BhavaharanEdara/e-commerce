const Category = require("../models/categoryModel");
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async(req,res)=>{
    try{
        const category = await Category.find(req.body);
        if(category?.length===0){
            const newCategory = await Category.create(req.body);
            res.json(newCategory);
        }
        res.json(category);
    }
    catch(error){
        throw new Error(error);
    }
})

const updateCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const newCategory = await Category.findByIdAndUpdate({_id:id}, req.body,{new:true});
        res.json(newCategory);

    }
    catch(error){
        throw new Error(error);
    }
})

const deleteCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const category = await Category.findByIdAndDelete({_id:id});
        res.json(category);

    }
    catch(error){
        throw new Error(error);
    }
})

const getCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const getaCategory = await Category.findById({_id:id});
        res.json(getaCategory);

    }
    catch(error){
        throw new Error(error);
    }
})

const getAllCategories = asyncHandler(async(req,res)=>{
    try{
        const allCategories = await Category.find();
        res.json(allCategories);

    }
    catch(error){
        throw new Error(error);
    }
})

module.exports = {createCategory, updateCategory, deleteCategory, getCategory, getAllCategories}; 