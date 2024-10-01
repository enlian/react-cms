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


// 验证 JWT 的接口
router.get('/validate-token', (req, res) => {

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // 从 cookie 或请求头获取 token
    console.log(15151515151, req.headers.authorization);

    
    if (!token) {
      return res.status(401).json({ message: '未提供 token' }); // 未授权
    }
  
    // 验证 token
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ message: '无效的 token' }); // 无效 token
      }
  
      // 如果 token 有效，返回用户信息
      res.status(200).json({ message: 'token 验证成功', user });
    });
  });

// 用户注册
router.post('/register', async (req, res) => {
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
});

// 用户登录（更新为验证 name 和 password）
router.post('/login', async (req, res) => {
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
        const token = jwt.sign({ userId: user.id, name: user.name }, secretKey, { expiresIn: '365d' }); // 令牌x后过期        
        console.log('Generated Token:', token); // 在这里打印 Token

        // 将 JWT 设置为 HttpOnly cookie，客户端无法通过 JS 访问，保护安全性
        res.cookie('token', token, {
            httpOnly: true, // 只能通过服务端访问，防止 XSS
            secure: false, // 如果是 HTTPS，设置为 true
            maxAge: 365 * 24 * 60 * 60 * 1000 // 1年
        });

        // 返回登录成功消息
        res.status(200).json({ message: '登录成功'+'Generated Token:', token});
    } catch (error) {
        console.error('登录失败:', error);
        res.status(500).json({ message: '登录失败' });
    }
});


module.exports = router;
