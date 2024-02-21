const express = require('express');
const router = express.Router();
const { isLoggedin, isAdmin } = require('../middlewares/authMiddleware');
const { createColor, updateColor, deleteColor, getAllColors } = require('../controller/colorController');

router.route('/').post(isLoggedin,isAdmin,createColor).get(getAllColors);
router.route('/:id').put(isLoggedin,isAdmin,updateColor).
delete(isLoggedin,isAdmin,deleteColor);

module.exports = router;