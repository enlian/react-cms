const express = require('express');
const { getArticles } = require('../controllers/articlesController');

const router = express.Router();

// 定义 POST /articles 路由
router.post('/articles', getArticles);

module.exports = router;
