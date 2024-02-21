const Color = require('../models/colorModel');
const asyncHandler = require('express-async-handler');


const createColor = asyncHandler(async(req,res)=>{
    try{
        const color = await Color.create(req.body);
        res.json(color);
    }
    catch(error){
        res.status(500).json({message:error});
    }
}) 

const getAllColors = asyncHandler(async(req,res)=>{
    try{
        const color = await Color.find();
        res.json(color);
    }
    catch(error){
        throw new Error(error);
    }
}) 


const updateColor = asyncHandler(async(req,res)=>{
    const {id} = req.params; 
    try{
        const color = await Color.findByIdAndUpdate({_id:id}, req.body, {new: true});
        res.json(color);
    }
    catch(error){
        throw new Error(error);
    }
}) 
const deleteColor = asyncHandler(async(req,res)=>{
    const {id} = req.params; 
    try{
        const color = await Color.findByIdAndDelete({_id:id});
        res.json(color);
    }
    catch(error){
        throw new Error(error);
    }
}) 


module.exports = {createColor, getAllColors, updateColor, deleteColor}

