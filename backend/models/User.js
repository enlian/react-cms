// models/User.js
const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); // 引入 uuid 库
const pool = require('../dbConfig'); // 引入数据库配置

const sequelize = new Sequelize(process.env.POSTGRES_URL); // 使用环境变量连接数据库

let User;

if (!sequelize.models.User) {
    User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER, // 更改为整数类型
            autoIncrement: true, // 设置为自增
            primaryKey: true, // 设为主键
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false, // 关闭自动创建 createdAt 和 updatedAt 字段
        tableName: 'users' // 自定义表名为小写
    });

    // 同步模型到数据库
    User.sync();
} else {
    User = sequelize.models.User;
}

module.exports = User;
