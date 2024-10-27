import React, { useState, useContext } from "react";
import { CategoriesContext } from "../contexts/CategoriesContext";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryModal from "./CategoryModal"; // 引入CategoryModal组件

const EditCategory = () => {
  const { categories, setCategories } = useContext(CategoriesContext);
  const [modalData, setModalData] = useState({ name: "", link: "", parentId: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // 标识是否是编辑操作
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleEditCategory = async (id, name, link, parentId, action) => {
    setLoading(true);
    try {
      const response = await fetch("/api/editCategory", {
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
              category.id === id ? { ...category, name, link, parentId } : category
            )
          );
        } else if (action === "delete") {
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== id)
          );
        }
        setSnackbarMessage("操作成功");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(data.message || "操作失败");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage("请求失败，请稍后重试");
      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleAddSubCategory = async () => {
    if (modalData.name && modalData.link) {
      await handleEditCategory(0, modalData.name, modalData.link, modalData.parentId || null, "add");
      setModalData({ name: "", link: "", parentId: null });
      setIsModalOpen(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    await handleEditCategory(id, "", "", null, "delete");
  };

  const handleSaveEdit = async () => {
    if (modalData) {
      await handleEditCategory(modalData.id, modalData.name, modalData.link, modalData.parentId, "update");
      setIsModalOpen(false);
      setModalData({ name: "", link: "", parentId: null });
    }
  };

  const openEditModal = (category) => {
    setModalData({
      id: category.id,
      name: category.name,
      link: category.link,
      parentId: category.parentId,
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setModalData({ name: "", link: "", parentId: null });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{paddingTop:"20px"}}>
      <Box display="flex" gap={2}>
        <Button variant="contained" onClick={openAddModal}>
          添加栏目
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        栏目列表
      </Typography>
      <Box className="categories-list">
        {categories
          .filter((category) => category.parentId === null)
          .map((category) => (
            <Box key={category.id} className="category" sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography>{category.name}</Typography>
                <IconButton color="primary" onClick={() => openEditModal(category)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDeleteCategory(category.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>

              {/* Display subcategories */}
              <Box sx={{ pl: 4 }}>
                {categories
                  .filter((sub) => sub.parentId === category.id)
                  .map((sub) => (
                    <Box key={sub.id} display="flex" alignItems="center" gap={2}>
                      <Typography>{sub.name}</Typography>
                      <IconButton color="primary" onClick={() => openEditModal(sub)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDeleteCategory(sub.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
              </Box>
            </Box>
          ))}
      </Box>

      {/* 共用的新增/编辑弹窗 */}
      <CategoryModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={isEdit ? handleSaveEdit : handleAddSubCategory}
        modalData={modalData}
        setModalData={setModalData}
        isEdit={isEdit}
        loading={loading}
      />

      {/* Snackbar 提示 */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditCategory;
