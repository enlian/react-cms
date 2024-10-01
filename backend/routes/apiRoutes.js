const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware"); // 引入中间件

// 导入处理逻辑
const registerController = require("../controllers/registerController"); // 登录、注册和验证 token 的控制器
const loginController = require("../controllers/loginController"); // 登录、注册和验证 token 的控制器

// 注册路由
router.post("/register", registerController); // 注册
router.post("/login", loginController); // 登录
router.get("/validate-token", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "token 验证成功",
    user: req.user, // 直接使用中间件中设置的用户信息
  });
}); // 验证 token

module.exports = router;
