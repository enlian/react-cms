import { useContext, useState } from "react";
import { useArticlesDispatch } from "../contexts/articleContext";
import { AuthContext } from "../contexts/AuthContext";
import { CategoriesContext } from "../contexts/CategoriesContext";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Box,
  Snackbar,
  Alert
} from "@mui/material";
import React from "react";

export default function AddArticle() {
  const [open, setOpen] = useState(false);  // 控制弹窗打开状态
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");  // 选中的category
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    cover: "",
    category: "",
  });
  const [isCategoryError, setIsCategoryError] = useState(false); // 控制栏目提示是否闪烁
  const [successMessage, setSuccessMessage] = useState(""); // 成功消息
  const [errorMessage, setErrorMessage] = useState(""); // 失败消息
  const [snackbarOpen, setSnackbarOpen] = useState(false); // 控制Snackbar状态
  const { categories, isLoading } = useContext(CategoriesContext);  // 直接从CategoriesContext获取categories
  const dispatch = useArticlesDispatch();
  const auth = useContext(AuthContext);  
  const isLoggedIn = auth?.state?.isLoggedIn;  // 从auth.state获取登录状态

  // 打开弹窗
  const handleClickOpen = () => {
    setOpen(true);
  };

  // 关闭弹窗
  const handleClose = () => {
    setOpen(false);
    setErrors({ title: "", content: "", cover: "", category: "" }); // 清空错误信息
    setIsCategoryError(false); // 重置栏目提示状态
  };

  // 关闭Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  // 验证封面图片URL是否符合规则
  const validateCoverUrl = (url) => {
    const urlPattern = /^(http:\/\/|https:\/\/).*\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i;
    return urlPattern.test(url);
  };

  // 实时验证标题
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    setErrors((prev) => ({
      ...prev,
      title: value.length > 10 ? "" : "标题必须超过10个字"
    }));
  };

  // 实时验证内容
  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
    setErrors((prev) => ({
      ...prev,
      content: value.length > 10 ? "" : "内容必须超过10个字"
    }));
  };

  // 实时验证封面图 URL
  const handleCoverChange = (e) => {
    const value = e.target.value;
    setCover(value);
    setErrors((prev) => ({
      ...prev,
      cover: validateCoverUrl(value) ? "" : "封面图URL无效，请以http或https开头，并确保链接包含有效的图片格式后缀"
    }));
  };

  // 处理栏目选择
  const handleCategoryChange = (e) => {
    setSelectedCategory(Number(e.target.value));
    setErrors((prev) => ({
      ...prev,
      category: "",
    }));
    setIsCategoryError(false); // 选择栏目后不再闪烁
  };

  // 保存文章
  const handleSave = async () => {
    // 最终验证表单
    if (!title || !content || !cover || !selectedCategory || errors.title || errors.content || errors.cover || errors.category) {
      if (!selectedCategory) {
        setErrors((prev) => ({
          ...prev,
          category: "请选择一个栏目",
        }));
        setIsCategoryError(true); // 如果未选择栏目，触发闪烁效果
        // 设置闪烁效果持续一段时间
        setTimeout(() => {
          setIsCategoryError(false);
        }, 500); // 500ms 后停止闪烁
      }
      return;  // 如果有任何验证错误，停止提交
    }

    const newArticle = {
      id: auth?.state?.user?.id,  // 从全局上下文获取的id
      title,
      content,
      cover,
      category_id: selectedCategory,  // 选中的分类ID
    };

    // 发起 POST 请求保存文章
    const response = await fetch('/api/articles/new', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newArticle),
    });

    if (response.ok) {
      const savedArticle = await response.json();

      // 显示成功提示
      setSuccessMessage("文章保存成功！");
      setSnackbarOpen(true);

      dispatch({
        type: "added",
        article: savedArticle,
      });
      setTitle("");  // 清空输入
      setContent("");
      setCover("");
      setSelectedCategory("");  // 清空选中的分类
      handleClose();  // 关闭弹窗
    } else {
      console.error("Failed to save article");

      // 显示失败提示
      setErrorMessage("保存文章失败，请稍后再试！");
      setSnackbarOpen(true);
    }
  };

  // 渲染主分类和子分类
  const renderCategoryOptions = () => {
    const parentCategories = categories.filter(category => category.parentId === null);
    const childCategories = categories.filter(category => category.parentId !== null);

    return (
      <RadioGroup
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        {parentCategories.map((parentCategory) => (
          <Box key={parentCategory.id} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            {/* 主分类 */}
            <FormControlLabel
              value={parentCategory.id}
              control={<Radio />}
              label={parentCategory.name}
            />
            {/* 子分类横向排列 */}
            <Box sx={{ display: "flex", ml: 4 }}>
              {childCategories
                .filter((childCategory) => childCategory.parentId === parentCategory.id)
                .map((childCategory) => (
                  <FormControlLabel
                    key={childCategory.id}
                    value={childCategory.id}
                    control={<Radio />}
                    label={childCategory.name}
                    sx={{ mr: 2 }}
                  />
                ))}
            </Box>
          </Box>
        ))}
      </RadioGroup>
    );
  };

  return (
    <div className="add-article">
      {/* 仅在用户已登录时显示新增文章按钮 */}
      {isLoggedIn && (
        <>
          <Button variant="outlined" onClick={handleClickOpen} disabled={isLoading}>
            Add Article
          </Button>

          {/* 弹窗 */}
          <Dialog
            open={open}
            onClose={handleClose}
            disableEnforceFocus  // 解决焦点强制问题
            disableRestoreFocus // 防止页面焦点恢复问题
          >
            <DialogTitle>新增文章</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="标题"
                type="text"
                fullWidth
                variant="outlined"
                value={title}
                onChange={handleTitleChange}
                error={!!errors.title}
                helperText={errors.title}
              />
              <TextField
                margin="dense"
                label="内容"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={content}
                onChange={handleContentChange}
                error={!!errors.content}
                helperText={errors.content}
              />
              <TextField
                margin="dense"
                label="封面图URL"
                type="text"
                fullWidth
                variant="outlined"
                value={cover}
                onChange={handleCoverChange}
                error={!!errors.cover}
                helperText={errors.cover}
              />
              {/* 分类选择框 */}
              <Typography
                variant="subtitle1"
                sx={{
                  mt: 2,
                  mb: 1,
                  color: isCategoryError ? "red" : "inherit", // 控制文字颜色
                  animation: isCategoryError ? "blinking 0.5s ease-in-out" : "none", // 控制闪烁效果
                }}
              >
                请选择所属栏目
              </Typography>
              <FormControl fullWidth margin="dense">
                {renderCategoryOptions()}
              </FormControl>
              {/* 错误信息展示 */}
              {errors.category && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {errors.category}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>取消</Button>
              <Button onClick={handleSave} disabled={isLoading || !selectedCategory || !!errors.title || !!errors.content || !!errors.cover}>
                保存
              </Button>
            </DialogActions>
          </Dialog>

          {/* 保存结果的 Snackbar 提示 */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
          >
            {successMessage ? (
              <Alert onClose={handleSnackbarClose} severity="success">
                {successMessage}
              </Alert>
            ) : (
              <Alert onClose={handleSnackbarClose} severity="error">
                {errorMessage}
              </Alert>
            )}
          </Snackbar>
        </>
      )}
    </div>
  );
}
