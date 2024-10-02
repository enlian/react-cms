const Category = require('../models/category');

// 获取所有栏目和子栏目
const getCategories = async (req, res) => {
  try {
    // 查询所有的分类
    const categories = await Category.findAll();

    // 转换为一维数组
    const result = categories.map((category) => ({
      id: category.id,
      name: category.name,
      link: category.link,
      parentId: category.parentId, // 保留 parentId 以便于前端使用
    }));

    res.status(200).json({ message: '查询成功', categories: result });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getCategories;
