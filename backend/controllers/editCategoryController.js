const Category = require('../models/category');

exports.editCategory = async (req, res) => {
    const { id, name, link, parentId, action } = req.body; // 假设请求体包含 id、name、link、parentId 和 action

    try {
        if (action === 'add') {          
            // 增加新的分类
            const newCategory = await Category.create({ name, link, parentId });
            return res.status(201).json({ message: '分类添加成功', category: newCategory });
        } else if (action === 'update') {
            // 更新已有的分类
            const updatedCategory = await Category.update(
                { name, link, parentId },
                { where: { id } }
            );
            if (updatedCategory[0] === 0) {
                return res.status(404).json({ message: '分类未找到' });
            }
            return res.status(200).json({ message: '分类更新成功' });
        } else if (action === 'delete') {
            // 删除分类
            const deletedCategory = await Category.destroy({ where: { id } });
            if (deletedCategory === 0) {
                return res.status(404).json({ message: '分类未找到' });
            }
            return res.status(200).json({ message: '分类删除成功' });
        } else {
            return res.status(400).json({ message: '无效的操作' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: '服务器错误', error });
    }
};
