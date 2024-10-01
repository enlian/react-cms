const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // 引入用户模型
const router = express.Router();
const jwt = require('jsonwebtoken'); // 引入jsonwebtoken

const secretKey = process.env.JWT_KEY;


//生成随机邮箱功能
function generateRandomEmail() {
    const randomString = Math.random().toString(36).substring(2, 8); // 生成随机字符串
    const domains = ["gmail.com", "yahoo.com", "qq.com", "outlook.com"]; // 你可以添加其他域名
    const randomDomain = domains[Math.floor(Math.random() * domains.length)]; // 随机选择域名
    return `${randomString}@${randomDomain}`;
}

// 用户注册
const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {        
        // 检查用户是否已存在
        const existingUser = await User.findOne({ where: { name } });
        if (existingUser) {
            return res.status(400).json({ message: '用户已存在' });
        }

        // 密码加密
        const hashedPassword = await bcrypt.hash(password, 10);

        // 创建新用户
        const newUser = await User.create({ name, email:generateRandomEmail(), password: hashedPassword });
        res.status(201).json({ message: '注册成功', user: newUser });
    } catch (error) {
        console.error('注册失败:', error);
        res.status(500).json({ message: '注册失败' });
    }
};


// 只导出 register 函数
module.exports = register;