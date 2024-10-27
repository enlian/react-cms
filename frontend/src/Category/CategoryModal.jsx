import React, { useState, useContext } from "react";
import {
  Box,
  Modal,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { CategoriesContext } from "../contexts/CategoriesContext"; // 假设你有这个上下文

const CategoryModal = ({
  open,
  onClose,
  onSave,
  modalData,
  setModalData,
  isEdit,
  loading,
}) => {
  const { categories } = useContext(CategoriesContext); // 获取已有的栏目数据
  const [errors, setErrors] = useState({ name: "", link: "" });

  // 表单验证函数
  const validateForm = () => {
    let nameError = "";
    let linkError = "";

    // 栏目名长度验证
    if (modalData.name.length > 20) {
      nameError = "栏目名称长度不能超过 20 个字符";
    }

    // 链接只能为英文，且长度不能超过20
    const linkRegex = /^[a-zA-Z]+$/;
    if (!linkRegex.test(modalData.link)) {
      linkError = "链接只能包含英文字符";
    } else if (modalData.link.length > 20) {
      linkError = "链接长度不能超过 20 个字符";
    }

    setErrors({ name: nameError, link: linkError });

    // 如果没有错误，返回 true，否则 false
    return !nameError && !linkError;
  };

  // 处理保存操作
  const handleSave = () => {
    if (validateForm()) {
      onSave();
    }
  };

  // 绑定回车键触发保存
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ marginTop: "15%" }}>
      <Box
        className="modal-content"
        sx={{
          p: 3,
          backgroundColor: "white",
          margin: "auto",
          width: "400px",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          {isEdit ? "编辑栏目" : "添加栏目"}
        </Typography>
        <TextField
          label="栏目名称"
          value={modalData.name}
          onChange={(e) =>
            setModalData({ ...modalData, name: e.target.value })
          }
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.name}
          helperText={errors.name}
          onKeyPress={handleKeyPress} // 绑定回车键
        />
        <TextField
          label="栏目链接"
          value={modalData.link}
          onChange={(e) =>
            setModalData({ ...modalData, link: e.target.value })
          }
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.link}
          helperText={errors.link}
          onKeyPress={handleKeyPress} // 绑定回车键
        />

        {/* 父栏目选择框，允许为子栏目选择父级栏目 */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel shrink>选择父栏目（可选）</InputLabel> {/* 设置 shrink 属性 */}
          <Select
            value={modalData.parentId || ""}
            onChange={(e) =>
              setModalData({
                ...modalData,
                parentId: e.target.value ? Number(e.target.value) : null,
              })
            }
            displayEmpty
            renderValue={(selected) => {
              if (selected === "") {
                return <em>无父栏目</em>; // 提示无父栏目
              }
              const selectedCategory = categories.find(
                (category) => category.id === selected
              );
              return selectedCategory ? selectedCategory.name : "无父栏目";
            }}
          >
            <MenuItem value="">
              <em>无父栏目</em>
            </MenuItem>
            {categories
              .filter((category) => category.parentId === null) // 父级栏目
              .map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : "保存"}
        </Button>
      </Box>
    </Modal>
  );
};

export default CategoryModal;
