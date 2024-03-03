const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const User = require('../models/userModel');
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require('../utils/cloundinary');
const fs = require('fs');


const createProduct = asyncHandler(async(req, res)=>{
    try{
        const newProduct = await Product.create(req.body);

        res.json(newProduct);
    }
    catch(error){
        throw new Error(error);
    }
})

const getAProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    }
    catch(error){
        throw new Error(error);

    }
})

const updateProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {new:true});
        res.json(updatedProduct);
    }
    catch(error){
        throw new Error(error);
    }
})
const deleteProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const deletedProduct = await Product.findByIdAndDelete(id, req.body, {new:true});
        res.json(deletedProduct);
    }
    catch(error){
        throw new Error(error);
    }
})
const getAllProducts = asyncHandler(async(req,res)=>{
    try{
        //filtering
            console.log(req.query.title);

        if(req.query.title){
            const regex = new RegExp(req.query.title, 'i');
            req.query.$or = [{title:regex}, {category:regex}, {brand:regex}];
            delete req.query[title];
        }
            console.log(req.query);

        const queryObj = {...req.query};
        const excludeFields = ["page", "sort", "limit","fields", "title"];
        excludeFields.forEach((ele)=>{delete queryObj[ele]});
        
        //let queryString = JSON.stringify(queryObj);
        /*****queryString = queryString.replace(/\b(gte|lt|let|gt)\b/g, (match)=>`$${match}`);*****/
        //console.log(queryString)
        let queryProducts = Product.find(queryObj);
        console.log(queryobj,3);
        //sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ");
            queryProducts.sort(sortBy);
        }
        const count = await Product.countDocuments(queryObj);
        //paging
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page-1)*limit;
        if(page){
            const productCount = await Product.countDocuments();
            if(skip>=productCount){
                throw new Error("This page doesnt exist");
            }
        }
        console.log(queryobj,3);
        queryProducts =await queryProducts.skip(skip).limit(limit);
        res.json({products:queryProducts,count:count});
    }
    catch(error){
        throw new Error(error);

    }
})

const addToWishlist = asyncHandler(async(req,res)=>{
    const {id} = req.user;
    const {productId} = req.body;
    try{
        const user = await User.findById({_id:id});
        const alreadyPresent = user.wishlist.find((id)=>id.toString()===productId);
        if(alreadyPresent){
            let user = await User.findByIdAndUpdate({_id:id},{
                $pull:{wishlist: productId},
            },{
                new :true
            });
            res.json(user);
        }
        else{
            let user = await User.findByIdAndUpdate({_id:id},{
                $push:{wishlist: productId},
            },{
                new :true
            });
            res.json(user);

        }
    }
    catch(error){
        throw new Error(error);
    }
})

const rateProduct = asyncHandler(async(req,res)=>{
    const {id} = req.user;
    const {firstname, lastname} = req.user;
    const {star,productId, comment} = req.body;
    try{
        const product = await Product.findById({_id:productId});
        let alreadyRated = product.ratings.find((userId)=>userId.postedby.toString()===id.toString());
        if(!alreadyRated){
            const date = new Date();
            const rateProduct = await Product.findByIdAndUpdate({_id:productId}, {
                $push:{ratings:{star:star, postedby:id, firstname:firstname, lastname:lastname,comment : comment, }}
            },{
                new: true
            }
            )

        }
        else{
            product.ratings.forEach((ele)=>{
                if(ele.postedby.toString()===id.toString()){
                    ele.star = star;
                    if(comment){
                        ele.comment = comment
                    }
                }
            });
            await product.save();
            
        }
        const getAllratings = await Product.findById({_id:productId});
        let totalRating = getAllratings.ratings.length;
        let ratingSum = getAllratings.ratings.map((item)=>
            item.star).reduce((prev,cur)=>prev+cur,0)
        let actualRating = ratingSum/totalRating;
        getAllratings.totalRating = actualRating;
        await getAllratings.save();
        res.json(getAllratings);


    }
    catch(error){
        throw new Error(error);
    }

})

const uploadImages = asyncHandler(async (req,res)=>{
    try{
        const uploader = (path)=>cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for(const file of files){
            const filePath = file.path;
            const newPath = await uploader(filePath);
            urls.push(newPath);
            fs.unlinkSync(filePath);
        }
        const images = urls.map((file)=>{return file;});
        res.json(images);
    }
    catch(error){
        throw new Error(error);
    }

})

const deleteImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = cloudinaryDeleteImg(id, "images");
      res.json({ message: "Deleted", id:id });
    } catch (error) {
      throw new Error(error);
    }
  });
  
module.exports = {createProduct, getAProduct, getAllProducts, updateProduct, deleteProduct, addToWishlist, rateProduct, uploadImages, deleteImages}
