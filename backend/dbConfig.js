// dbConfig.js
const { Pool } = require('pg');
require('dotenv').config({ path: './config/.env' }); // 指定 .env 文件路径

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = pool;
