const express = require('express');
const router = express.Router();
const {createProduct, getAProduct, getAllProducts,updateProduct, deleteProduct, addToWishlist, rateProduct, uploadImages, deleteImages} = require('../controller/productController');
const { isAdmin, isLoggedin } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImg');

router.route('/create').post(createProduct);
router.route('/upload/').put(isLoggedin,isAdmin, uploadPhoto.array('images',10), productImgResize, uploadImages);
router.route('/allProducts').get(getAllProducts)
router.route('/addWishlist').put(isLoggedin, addToWishlist);
router.route('/rate').put(isLoggedin, rateProduct);
router.route('/delete-img/:id').delete(isLoggedin,isAdmin, deleteImages)
router.route('/getProduct/:id')
.get(getAProduct)
.put(isLoggedin,isAdmin,updateProduct)
.delete(isLoggedin,isAdmin,deleteProduct);



module.exports = router;
