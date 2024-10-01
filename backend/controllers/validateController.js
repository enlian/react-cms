const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // 引入用户模型
const router = express.Router();
const jwt = require('jsonwebtoken'); // 引入jsonwebtoken
const validateToken = require('../middlewares/authMiddleware'); // 引入中间件

const secretKey = process.env.JWT_KEY;

// 验证 JWT 的接口
const validateToken = (req, res) => {
    res.status(200).json({
        message: 'token 验证成功',
        user: req.user, // 直接使用中间件中设置的用户信息
    });
};

module.exports = validateToken;
