const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRES_URL);

const Article = sequelize.define(
  "Article",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // 自增
      primaryKey: true, // 主键
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, // 不能为空
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false, // 不能为空
    },
    cover: {
      type: DataTypes.STRING,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true, // 可以为空
      field: "category_id", // 指定数据库中对应的字段名
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false, // 不能为空
        field: "user_id",
    }
  },
  {
    timestamps: false, // 关闭自动创建 createdAt 和 updatedAt 字段
    tableName: "articles", // 显式指定表名为小写
  }
);

module.exports = Article; // 导出模型
