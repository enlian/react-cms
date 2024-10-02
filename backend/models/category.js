const { Sequelize, DataTypes } = require("sequelize");
const pool = require("../dbConfig"); // 引入数据库配置

const sequelize = new Sequelize(process.env.POSTGRES_URL);
let Category;

// 检查是否已定义模型
if (!sequelize.models.Category) {
  Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, // 自增
        primaryKey: true, // 主键
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false, // 不能为空
        // unique: "category_unique", // 唯一性约束
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false, // 不能为空
        // unique: "category_unique", // 唯一性约束
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true, // 可以为空
        field: "parent_id", // 指定数据库中对应的字段名
        references: {
          model: "categories", // 自关联
          key: "id", // 关联的主键
        },
        onDelete: "CASCADE", // 删除主栏目时，自动删除子栏目
      },
    },
    {
      timestamps: false, // 关闭自动创建 createdAt 和 updatedAt 字段
      tableName: "categories", // 显式指定表名为小写
      indexes: [
        {
          unique: true,
          fields: ["name", "link"], // 对 name 和 link 建立唯一性索引
        },
      ],
    }
  );

  // 定义父子关系
  Category.hasMany(Category, { foreignKey: "parentId", as: "subcategories" }); // 父类有多个子类
  Category.belongsTo(Category, { foreignKey: "parentId", as: "parent" }); // 子类属于一个父类
} else {
  // 如果模型已经定义，直接引用现有的模型
  Category = sequelize.models.Category;
}

module.exports = Category; // 导出模型
