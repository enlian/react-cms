import React, { useState, useContext } from "react";
import { useArticlesDispatch } from "../contexts/articleContext";
import { CategoriesContext } from "../contexts/CategoriesContext";
import {
  Snackbar,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
  IconButton,
  Grid
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export function Article({ article }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [cover, setCover] = useState(article.cover);
  const [selectedCategory, setSelectedCategory] = useState(article.categoryId || "");
  const [errors, setErrors] = useState({ title: "", content: "", cover: "", category: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const dispatch = useArticlesDispatch();
  const { categories } = useContext(CategoriesContext);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const validateCoverUrl = (url) => /^(http:\/\/|https:\/\/).*\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(url);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    setErrors((prev) => ({
      ...prev,
      title: value.length > 10 ? "" : "标题必须超过10个字"
    }));
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
    setErrors((prev) => ({
      ...prev,
      content: value.length > 10 ? "" : "内容必须超过10个字"
    }));
  };

  const handleCoverChange = (e) => {
    const value = e.target.value;
    setCover(value);
    setErrors((prev) => ({
      ...prev,
      cover: validateCoverUrl(value)
        ? ""
        : "封面图URL无效，请以http或https开头，并确保链接包含有效的图片格式后缀"
    }));
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(Number(e.target.value));
    setErrors((prev) => ({
      ...prev,
      category: ""
    }));
  };

  const handleSave = async () => {
    if (!title || !content || !cover || !selectedCategory || errors.title || errors.content || errors.cover || errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: selectedCategory ? "" : "请选择一个栏目"
      }));
      return;
    }

    const updatedArticle = {
      ...article,
      title,
      content,
      cover,
      category_id: selectedCategory
    };

    const response = await fetch(`/api/articles/${article.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedArticle)
    });

    if (response.ok) {
      const updatedArticleFromServer = await response.json();
      dispatch({
        type: "changed",
        article: updatedArticleFromServer
      });
      setSuccessMessage("文章更新成功！");
      setSnackbarOpen(true);
      setIsEditing(false);
    } else {
      setErrorMessage("文章更新失败，请稍后再试！");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/articles/${article.id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      dispatch({
        type: "deleted",
        id: article.id
      });
    } else {
      setErrorMessage("删除文章失败，请稍后再试！");
      setSnackbarOpen(true);
    }
  };

  const renderCategoryOptions = () => {
    const parentCategories = categories.filter((category) => category.parentId === null);
    const childCategories = categories.filter((category) => category.parentId !== null);

    return (
      <RadioGroup value={selectedCategory} onChange={handleCategoryChange}>
        {parentCategories.map((parentCategory) => (
          <Box key={parentCategory.id} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <FormControlLabel value={parentCategory.id} control={<Radio />} label={parentCategory.name} />
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
    <Box sx={{ borderBottom: "1px solid #ddd", padding: 2, marginBottom: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <Typography variant="h6">{article.title}</Typography>
          <Typography variant="body2" color="textSecondary">
            {article.content}
          </Typography>
        </Grid>

        <Grid item xs={4}>
          {validateCoverUrl(article.cover) && (
            <Box
              component="img"
              sx={{ height: 140, width: "100%", objectFit: "cover" }}
              alt={article.title}
              src={article.cover}
            />
          )}
        </Grid>

        <Grid item xs={4}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => setIsEditing(true)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle>编辑文章</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="标题"
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
            fullWidth
            variant="outlined"
            value={cover}
            onChange={handleCoverChange}
            error={!!errors.cover}
            helperText={errors.cover}
          />
          <Typography
            variant="subtitle1"
            sx={{ mt: 2, mb: 1, color: !!errors.category ? "red" : "inherit" }}
          >
            请选择所属栏目
          </Typography>
          <FormControl fullWidth margin="dense">
            {renderCategoryOptions()}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)}>取消</Button>
          <Button
            onClick={handleSave}
            disabled={
              !!errors.title || !!errors.content || !!errors.cover || !selectedCategory
            }
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}
