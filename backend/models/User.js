// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // unique 约束，确保用户名不重复
  password: { type: String, required: true },
});

// 检查模型是否已存在，如果已存在，则直接使用它
const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

module.exports = User;
