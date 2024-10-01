const jwt = require('jsonwebtoken');
const User = require('../models/User'); // 引入用户模型
const secretKey = process.env.JWT_KEY; // 从环境变量中获取密钥

// 创建验证 token 的中间件
const validateToken = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '未提供 token' });
    }

    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: '无效的 token' });
        }

        try {
            const userId = decoded.userId;
            const user = await User.findOne({ where: { id: userId } });

            if (!user) {
                return res.status(404).json({ message: '用户不存在' });
            }

            // 将用户信息添加到请求对象中
            req.user = user;

            next(); // 继续执行下一个中间件或路由处理程序
        } catch (dbError) {
            console.error('数据库查询失败:', dbError);
            res.status(500).json({ message: '数据库查询失败' });
        }
    });
};

module.exports = validateToken;
