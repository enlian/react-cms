import React, { useState, useContext, useEffect } from "react";
import { CategoriesContext } from "./../client/contexts/CategoriesContext";
import "../assets/EditCategory.scss"

const EditCategory: React.FC = () => {
  const { categories, setCategories } = useContext(CategoriesContext);
  const [newCategory, setNewCategory] = useState({ name: "", link: "" });
  const [editCategory, setEditCategory] = useState<any>(null);
  const [subCategory, setSubCategory] = useState({ name: "", link: "", parentId: null });  
  useEffect(() => {
    if (editCategory) {
      setNewCategory({ name: editCategory.name, link: editCategory.link });
      setSubCategory({ parentId: editCategory.id });
    }
  }, [editCategory]);

  const handleEditCategory = async (id: number, name: string, link: string, parentId: number | null, action: string) => {    
    try {
      const response = await fetch("http://localhost:3000/api/editCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name, link, parentId, action }),
      });
      const data = await response.json();

      if (response.ok) {
        if (action === 'add') {
          setCategories((prevCategories) => [...prevCategories, data.category]);
        } else if (action === 'update') {
          setCategories((prevCategories) =>
            prevCategories.map(category =>
              category.id === id ? { ...category, name, link, parentId } : category
            )
          );
        } else if (action === 'delete') {
          setCategories((prevCategories) =>
            prevCategories.filter(category => category.id !== id)
          );
        }
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleAddSubCategory = async () => {
    if (subCategory.name && subCategory.link && subCategory.parentId) {
      const newSubCategory = { name: subCategory.name, link: subCategory.link, parentId: subCategory.parentId };
      console.log("newSubCategory",newSubCategory);
      
      await handleEditCategory(0, newSubCategory.name, newSubCategory.link, newSubCategory.parentId, 'add');
      setSubCategory({ name: "", link: "", parentId: null });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    await handleEditCategory(id, "", "", null, 'delete');
  };

  return (
    <div>
      <h2>栏目编辑</h2>
      
      <h3>添加父栏目</h3>
      <input
        type="text"
        placeholder="栏目名称"
        value={newCategory.name}
        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="栏目链接"
        value={newCategory.link}
        onChange={(e) => setNewCategory({ ...newCategory, link: e.target.value })}
      />
      {editCategory ? (
        <button onClick={() => handleEditCategory(editCategory.id, newCategory.name, newCategory.link, null, 'update')}>保存</button>
      ) : (
        <button onClick={() => handleEditCategory(0, newCategory.name, newCategory.link, null, 'add')}>添加父栏目</button>
      )}
      
      <h3>添加子栏目</h3>
      <input
        type="text"
        placeholder="子栏目名称"
        value={subCategory.name}
        onChange={(e) => setSubCategory({ ...subCategory, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="子栏目链接"
        value={subCategory.link}
        onChange={(e) => setSubCategory({ ...subCategory, link: e.target.value })}
      />
      <select
        value={subCategory.parentId || ""}
        onChange={(e) => setSubCategory({ ...subCategory, parentId: Number(e.target.value) })}
      >
        <option value="">选择父栏目</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button onClick={handleAddSubCategory}>添加子栏目</button>
      
      <h3>栏目列表</h3>
      <div className="categories-list">
        {categories.map((category) => (
          <div className="category" key={category.id}>
            <span onClick={() => setEditCategory(category)}>{category.name}</span>
            <button onClick={() => handleDeleteCategory(category.id)}>删除</button>
            {category.subcategories && category.subcategories.length > 0 ? (
                category.subcategories.map((sub) => (
                  <div key={sub.id} className="sub-category">
                    <span>{sub.name}</span>
                    <button onClick={() => handleDeleteCategory(sub.id)}>删除</button>
                  </div>
                ))
              ) : (
                <span className="noSonText">没有子栏目</span>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

const categoriesList = {
  display: "flex", // 将ul设置为flex容器
  flexDirection: "column", // 设置主轴方向为纵向
  padding: 0, // 移除默认内边距
  margin: 0, // 移除默认外边距
  listStyleType: "none",
};

const subCate = {
  backgroundColor:"#ccc"
}

export default EditCategory;
