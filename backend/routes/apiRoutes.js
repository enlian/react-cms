const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/authMiddleware"); // 引入中间件

// 导入处理逻辑
const registerController = require("../controllers/registerController"); // 登录、注册和验证 token 的控制器
const loginController = require("../controllers/loginController"); // 登录、注册和验证 token 的控制器
// const validateController = require("../controllers/validateController"); // 登录、注册和验证 token 的控制器

// 注册路由
router.post("/register", registerController); // 注册
router.post("/login", loginController); // 登录
router.get("/validate-token", validateToken); // 验证 token

module.exports = router;
