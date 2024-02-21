const express = require('express');
const router = express.Router();
const{createBrand, updateBrand, deleteBrand, getBrand, getAllBrands} = require("../controller/brandCotroller");
const { isLoggedin, isAdmin } = require('../middlewares/authMiddleware');

router.route('/').post(isLoggedin,isAdmin,createBrand).get( getAllBrands);
router.route('/:id').put(isLoggedin,isAdmin,updateBrand).
delete(isLoggedin,isAdmin,deleteBrand).get(getBrand);

module.exports = router;