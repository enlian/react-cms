//\controllers\categoryController.js
const Category = require('../models/category');

// 获取所有栏目和子栏目
const getCategories = async (req, res) => {
  try {
    // 查询所有的主栏目和子栏目，关联父子关系
    const categories = await Category.findAll({
      where: { parentId: null }, // 查找所有主栏目
      include: [{
        model: Category, // 关联子栏目
        as: 'subcategories', // 别名
      }]
    });

    res.status(200).json({ message: '查询成功', categories});
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getCategories;