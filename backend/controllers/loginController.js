const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // 引入用户模型
const router = express.Router();
const jwt = require('jsonwebtoken'); // 引入jsonwebtoken

const secretKey = process.env.JWT_KEY;

// 用户登录（更新为验证 name 和 password）
const login = async (req, res) => {
    try {
        const { name, password } = req.body;
        // 查找用户
        const user = await User.findOne({ where: { name } });
        if (!user) {
            return res.status(400).json({ message: '用户不存在' });
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: '密码错误' });
        }

        // 生成 JWT
        const token = jwt.sign({ id: user.id, name: user.name }, secretKey, { expiresIn: '365d' });

        // 将 JWT 设置为 HttpOnly cookie，客户端无法通过 JS 访问，保护安全性
        res.cookie('token', token, {
            httpOnly: true, // 只能通过服务端访问，防止 XSS
            secure: false, // 如果是 HTTPS，设置为 true
            maxAge: 365 * 24 * 60 * 60 * 1000 // 1年
        });

        // 返回登录成功消息
        res.status(200).json({ message: '登录成功', token, user });
    } catch (error) {
        console.error('登录失败:', error);
        res.status(500).json({ message: '登录失败' });
    }
};

module.exports = login;
