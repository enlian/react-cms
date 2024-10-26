const express = require('express');
const { getArticles, updateArticle, deleteArticle, addArticle } = require('../controllers/articlesController');

const router = express.Router();

// 定义 POST /articles 路由 (获取文章列表)
router.post('/articles', getArticles);

// 定义 PUT /articles/:id 路由 (更新文章)
router.put('/articles/:id', updateArticle);

// 定义 DELETE /articles/:id 路由 (删除文章)
router.delete('/articles/:id', deleteArticle);

// 新增文章
router.post('/articles/new', addArticle);

module.exports = router;
