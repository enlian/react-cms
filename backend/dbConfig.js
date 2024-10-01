// dbConfig.js
const { Pool } = require('pg');
require('dotenv').config({ path: './config/.env' }); // 指定 .env 文件路径

// 初始化连接池
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL, // 完整的 PostgreSQL URL（如果存在）
    user: process.env.POSTGRES_USER,            // PostgreSQL 用户
    host: process.env.POSTGRES_HOST,            // PostgreSQL 主机
    password: process.env.POSTGRES_PASSWORD,    // PostgreSQL 密码
    database: process.env.POSTGRES_DATABASE,    // PostgreSQL 数据库
    port: process.env.POSTGRES_PORT || 5432,    // 端口，默认 5432
    max: 10,                                    // 连接池的最大连接数
    idleTimeoutMillis: 30000,                   // 连接空闲超时时间（30 秒）
    connectionTimeoutMillis: 5000,              // 连接超时时间（5 秒）
});

// 测试连接函数
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to the database successfully');
        client.release(); // 释放连接
    } catch (err) {
        console.error('Error connecting to the database:', {
            message: err.message,
            stack: err.stack,
            code: err.code,
        });
    }
};

// 监听应用退出事件并关闭连接池
process.on('exit', () => {
    pool.end(() => {
        console.log('Pool has ended'); // 关闭连接池时打印消息
    });
});

// 导出连接池和测试连接函数
module.exports = {
    pool,
    testConnection,
};
