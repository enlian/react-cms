import React, { useState, useContext, useEffect } from "react";
import { CategoriesContext } from "./../client/contexts/CategoriesContext";
import "../assets/editCategory.scss";

const EditCategory: React.FC = () => {
  const { categories, setCategories } = useContext(CategoriesContext);
  const [newCategory, setNewCategory] = useState({
    name: "",
    link: "",
    parentId: null,
  });
  const [modalData, setModalData] = useState<{
    id: number;
    name: string;
    link: string;
    parentId: number | null;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, link, parentId, action }),
      });
      const data = await response.json();

      if (response.ok) {
        if (action === "add") {
          setCategories((prevCategories) => [...prevCategories, data.category]);
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
    if (newCategory.name && newCategory.link) {
      await handleEditCategory(
        0,
        newCategory.name,
        newCategory.link,
        newCategory.parentId || null,
        "add"
      );
      setNewCategory({ name: "", link: "", parentId: null });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    await handleEditCategory(id, "", "", null, "delete");
  };

  const handleSaveEdit = async () => {
    if (modalData) {
      await handleEditCategory(
        modalData.id,
        modalData.name,
        modalData.link,
        modalData.parentId,
        "update"
      );
      setIsModalOpen(false);
      setModalData(null);
    }
  };

  const openEditModal = (category: any) => {
    setModalData({
      id: category.id,
      name: category.name,
      link: category.link,
      parentId: category.parentId,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="edit-category">
      <h5>添加栏目</h5>
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
      <select
        value={newCategory.parentId || ""}
        onChange={(e) =>
          setNewCategory({ ...newCategory, parentId: Number(e.target.value) })
        }
      >
        <option value="">选择父栏目（可选）</option>
        {categories
          .filter((category) => category.parentId === null)
          .map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
      </select>
      <button onClick={handleAddSubCategory}>添加栏目</button>

      <h5>栏目列表</h5>
      <div className="categories-list">
        {categories
          .filter((category) => category.parentId === null)
          .map((category) => (
            <div className="category" key={category.id}>
              <span>{category.name}</span>
              <button onClick={() => openEditModal(category)}>编辑</button>
              <button onClick={() => handleDeleteCategory(category.id)}>
                删除
              </button>

              {/* Display subcategories */}
              <div className="subcategories">
                {categories
                  .filter((sub) => sub.parentId === category.id)
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className="sub-category subcategory-container"
                    >
                      <div className="subcategory-arrow"></div>{" "}
                      {/* Arrow element */}
                      <span>{sub.name}</span>
                      <button onClick={() => openEditModal(sub)}>编辑</button>
                      <button onClick={() => handleDeleteCategory(sub.id)}>
                        删除
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>

      {isModalOpen &&
        modalData && ( // 确保 modalData 存在
          <div className="modal">
            <h5>编辑栏目</h5>
            <input
              type="text"
              placeholder="栏目名称"
              value={modalData.name}
              onChange={(e) =>
                setModalData({ ...modalData, name: e.target.value })
              } // 更新 modalData
            />
            <input
              type="text"
              placeholder="栏目链接"
              value={modalData.link}
              onChange={(e) =>
                setModalData({ ...modalData, link: e.target.value })
              } // 更新 modalData
            />
            <button onClick={handleSaveEdit}>保存</button>
            <button
              onClick={() => {
                setIsModalOpen(false);
                setModalData(null);
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
