// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();

const getCategoriesController = require("../controllers/getCategoriesController");
const editCategoryController = require('../controllers/editCategoryController');

// 定义获取所有栏目和子栏目的路由
router.get("/getCategories", getCategoriesController);

// 修改栏目
router.post('/editCategory', editCategoryController.editCategory); // 使用 POST 方法处理增、改和删请求


module.exports = router;
