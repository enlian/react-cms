const Article = require('../models/article');

// 获取文章列表
const getArticles = async (req, res) => {
  try {
    // 使用模型从数据库中获取所有文章
    const articles = await Article.findAll();

    // 将文章列表倒序排列
    const reversedArticles = articles.reverse();

    // 返回倒序后的查询结果
    res.json(reversedArticles);
  } catch (error) {
    console.error('Error retrieving articles', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content, cover, category_id } = req.body; // 确保接收到 category_id

  try {
    // 检查文章是否存在
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // 更新文章
    const updatedArticle = await Article.update(
      { title, content, cover, category_id }, // 确保 category_id 也被更新
      { where: { id } }
    );

    if (updatedArticle[0] > 0) {
      const updatedArticleData = await Article.findByPk(id); // 获取更新后的文章
      res.json(updatedArticleData);
    } else {
      res.status(500).json({ error: "Failed to update the article" });
    }
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ error: "Failed to update the article" });
  }
};

// 删除文章
const deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    // 删除文章
    const result = await Article.destroy({ where: { id } });

    if (result) {
      res.status(204).end(); // No content, 删除成功
    } else {
      res.status(404).json({ error: "Article not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the article" });
  }
};

// 新增文章
const addArticle = async (req, res) => {
  const { title, content, cover, category_id, id } = req.body;  // 接收 category_id 和 id（用户ID）

  try {
    // 新增文章
    const newArticle = await Article.create({
      title,
      content,
      cover,
      categoryId: category_id,  
      userId: id,               
    });

    // 返回新增的文章
    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error adding article', error);
    res.status(500).json({ error: 'Failed to add article' });
  }
};

module.exports = {
  getArticles,
  updateArticle,
  deleteArticle,
  addArticle,
};

