const express = require('express');
const router = express.Router();
const{createCategory, updateCategory, deleteCategory, getCategory, getAllCategories} = require("../controller/categoryController");
const { isLoggedin, isAdmin } = require('../middlewares/authMiddleware');

router.route('/').post(isLoggedin,isAdmin,createCategory).get( getAllCategories);
router.route('/:id').put(isLoggedin,isAdmin,updateCategory).
delete(isLoggedin,isAdmin,deleteCategory).get(getCategory);

module.exports = router;