const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config/.env' }); // 指定 .env 文件路径
const secretKey = process.env.JWT_KEY;

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // 从 cookie 或请求头获取 token
    if (!token) {
      return res.sendStatus(401); // 未授权
    }
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // 403 Forbidden
      }
      req.user = user; // 将用户信息存储到请求对象中
      next(); // 继续处理请求
    });
  };
  
  module.exports = authenticateToken;
