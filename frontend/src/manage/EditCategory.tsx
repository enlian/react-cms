import React, { useState, useContext, useEffect } from "react";
import { CategoriesContext } from "./../client/contexts/CategoriesContext";
import "../assets/EditCategory.scss";

const EditCategory: React.FC = () => {
  const { categories, setCategories } = useContext(CategoriesContext);
  const [newCategory, setNewCategory] = useState({ name: "", link: "" });
  const [editCategory, setEditCategory] = useState<any>(null);
  const [subCategory, setSubCategory] = useState({
    name: "",
    link: "",
    parentId: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制弹出框的显示

  useEffect(() => {
    if (editCategory) {
      setNewCategory({
        name: editCategory.name || "",
        link: editCategory.link || "",
      }); // 确保输入框有默认值
      setSubCategory({ parentId: editCategory.id });
    } else {
      // 如果没有编辑类别，清空输入框
      setNewCategory({ name: "", link: "" });
    }
  }, [editCategory]);

  const handleEditCategory = async (
    id: number,
    name: string,
    link: string,
    parentId: number | null,
    action: string
  ) => {
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
        if (action === "add") {
          if (parentId) {
            // 如果是子栏目，找到对应的父栏目，并添加到父栏目的 subcategories 中
            setCategories((prevCategories) =>
              prevCategories.map((category) =>
                category.id === parentId
                  ? {
                      ...category,
                      subcategories: [
                        ...(category.subcategories || []),
                        data.category,
                      ],
                    }
                  : category
              )
            );
          } else {
            // 如果是父栏目，直接添加到顶层
            setCategories((prevCategories) => [
              ...prevCategories,
              data.category,
            ]);
          }
        } else if (action === "update") {
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.id === id
                ? { ...category, name, link, parentId }
                : category
            )
          );
        } else if (action === "delete") {
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== id)
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
      const newSubCategory = {
        name: subCategory.name,
        link: subCategory.link,
        parentId: subCategory.parentId,
      };

      await handleEditCategory(
        0,
        newSubCategory.name,
        newSubCategory.link,
        newSubCategory.parentId,
        "add"
      );
      setSubCategory({ name: "", link: "", parentId: null });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    await handleEditCategory(id, "", "", null, "delete");
  };

  const handleSaveEdit = async () => {
    if (editCategory) {
      await handleEditCategory(
        editCategory.id,
        newCategory.name,
        newCategory.link,
        null,
        "update"
      );
      setIsModalOpen(false);
      setEditCategory(null);
    }
  };

  return (
    <div>
      <h2>栏目编辑</h2>

      <h3>添加父栏目</h3>
      <input
        type="text"
        placeholder="栏目名称"
        value={newCategory.name}
        onChange={(e) =>
          setNewCategory({ ...newCategory, name: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="栏目链接"
        value={newCategory.link}
        onChange={(e) =>
          setNewCategory({ ...newCategory, link: e.target.value })
        }
      />
      <button
        onClick={() =>
          handleEditCategory(0, newCategory.name, newCategory.link, null, "add")
        }
      >
        添加父栏目
      </button>

      <h3>添加子栏目</h3>
      <input
        type="text"
        placeholder="子栏目名称"
        value={subCategory.name}
        onChange={(e) =>
          setSubCategory({ ...subCategory, name: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="子栏目链接"
        value={subCategory.link}
        onChange={(e) =>
          setSubCategory({ ...subCategory, link: e.target.value })
        }
      />
      <select
        value={subCategory.parentId || ""}
        onChange={(e) =>
          setSubCategory({ ...subCategory, parentId: Number(e.target.value) })
        }
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
            <span>{category.name}</span>
            <button
              onClick={() => {
                setEditCategory(category);
                setIsModalOpen(true);
              }}
            >
              编辑
            </button>
            <button onClick={() => handleDeleteCategory(category.id)}>
              删除
            </button>
            {category.subcategories && category.subcategories.length > 0 ? (
              category.subcategories.map((sub) => (
                <div key={sub.id} className="sub-category">
                  <span>{sub.name}</span>
                  <button
                    onClick={() => {
                      setEditCategory(sub);
                      setIsModalOpen(true);
                    }}
                  >
                    编辑
                  </button>
                  <button onClick={() => handleDeleteCategory(sub.id)}>
                    删除
                  </button>
                </div>
              ))
            ) : (
              <span className="noSonText">没有子栏目</span>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal">
          <h3>编辑栏目</h3>
          <input
            type="text"
            placeholder="栏目名称"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="栏目链接"
            value={newCategory.link}
            onChange={(e) =>
              setNewCategory({ ...newCategory, link: e.target.value })
            }
          />
          <button onClick={handleSaveEdit}>保存</button>
          <button
            onClick={() => {
              setIsModalOpen(false);
              setEditCategory(null);
            }}
          >
            取消
          </button>
        </div>
      )}
    </div>
  );
};

export default EditCategory;
