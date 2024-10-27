import React from "react";
import { Checkbox, FormControlLabel, Typography, FormControl, Box, Divider } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Helper function to build category hierarchy
const buildCategoryHierarchy = (categories) => {
  const categoryMap = new Map();

  // 初始化每个栏目
  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, subcategories: [] });
  });

  // 将子栏目归类到父栏目
  const hierarchy = [];
  categories.forEach((category) => {
    if (category.parentId === null) {
      hierarchy.push(categoryMap.get(category.id));
    } else if (categoryMap.has(category.parentId)) {
      categoryMap.get(category.parentId).subcategories.push(categoryMap.get(category.id));
    }
  });

  return hierarchy;
};

// CategorySelector组件
export const CategorySelector = ({ categories, selectedCategory, onCategoryChange }) => {
  // 构建栏目层级结构
  const categoryHierarchy = buildCategoryHierarchy(categories);

  // 渲染栏目层级的函数，父栏目 -> 子栏目，父级栏目在左，子栏目在右
  const renderCategories = (categoryHierarchy) => {
    return categoryHierarchy.map((parentCategory, index) => (
      <React.Fragment key={parentCategory.id}>
        {/* 父栏目与子栏目容器 */}
        <Box display="flex" alignItems="center">
          {/* 父栏目 */}
          <FormControlLabel
            sx={{
              marginRight: 0
            }}
            control={
              <Checkbox
                checked={selectedCategory === parentCategory.id}
                onChange={() => onCategoryChange(parentCategory.id)}
              />
            }
            label={
              <Typography
                noWrap
                sx={{
                  maxWidth: 80, // 通过maxWidth限制列显示的宽度
                  overflow: "hidden", // 超出隐藏
                  textOverflow: "ellipsis", // 溢出显示省略号
                  whiteSpace: "nowrap", // 防止换行
                }}
              >
                {parentCategory.name.length > 5 ? parentCategory.name.slice(0, 5) + '...' : parentCategory.name}
              </Typography>
            }
          />

          {/* 箭头图标 */}
          <ChevronRightIcon />

          {/* 子栏目 - 水平排列，背景颜色，支持左右滑动 */}
          <Box
            sx={{
              display: 'flex',
              backgroundColor: '#f5f5f5', // 浅灰色背景
              padding: "0px 10px", // 内边距
              borderRadius: 1, // 圆角
              whiteSpace: 'nowrap', // 防止换行
            }}
          >
            {parentCategory.subcategories && parentCategory.subcategories.length > 0 ? (
              parentCategory.subcategories.map((subcategory) => (
                <FormControlLabel
                  key={subcategory.id}
                  control={
                    <Checkbox
                      checked={selectedCategory === subcategory.id}
                      onChange={() => onCategoryChange(subcategory.id)}
                    />
                  }
                  label={
                    <Typography
                      noWrap
                      sx={{
                        maxWidth: 80, // 同样通过maxWidth限制字数显示
                        overflow: "hidden", // 超出隐藏
                        textOverflow: "ellipsis", // 溢出显示省略号
                        whiteSpace: "nowrap", // 防止换行
                      }}
                    >
                      {subcategory.name.length > 5 ? subcategory.name.slice(0, 5) + '...' : subcategory.name}
                    </Typography>
                  }
                  sx={{
                    fontSize: '0.85rem', // 字体大小调整
                    marginRight: 1.5, // 调整子栏目之间的间距
                  }}
                />
              ))
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ padding: 1 }}>
                无子栏目
              </Typography>
            )}
          </Box>
        </Box>

        {/* 添加分界线 */}
        {index < categoryHierarchy.length - 1 && <Divider sx={{ my: 1 }} />}
      </React.Fragment>
    ));
  };

  return (
    <FormControl fullWidth margin="dense">
      {categories.length > 0 && renderCategories(categoryHierarchy)}
    </FormControl>
  );
};
