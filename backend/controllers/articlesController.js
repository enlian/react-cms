const Article = require('../models/article');

// 获取文章列表
const getArticles = async (req, res) => {
  try {
    // 使用模型从数据库中获取所有文章
    const articles = await Article.findAll();

    // 返回查询结果
    res.json(articles);
  } catch (error) {
    console.error('Error retrieving articles', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

module.exports = {
  getArticles,
};
