// dbConfig.js
const { Pool } = require('pg');
require('dotenv').config({ path: './config/.env' }); // 指定 .env 文件路径

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL, // 使用你的 POSTGRES_URL
    user: process.env.POSTGRES_USER, // 使用你的 POSTGRES_USER
    host: process.env.POSTGRES_HOST, // 使用你的 POSTGRES_HOST
    password: process.env.POSTGRES_PASSWORD, // 使用你的 POSTGRES_PASSWORD
    database: process.env.POSTGRES_DATABASE, // 使用你的 POSTGRES_DATABASE
    port: 5432, // 默认 PostgreSQL 端口，视情况而定
});

module.exports = pool;
