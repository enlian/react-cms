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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export function Article({ article }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [cover, setCover] = useState(article.cover);
  const [selectedCategory, setSelectedCategory] = useState(
    article.categoryId || ""
  );
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    cover: "",
    category: "",
  });
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

  const validateCoverUrl = (url) =>
    /^(http:\/\/|https:\/\/).*\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(url);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    setErrors((prev) => ({
      ...prev,
      title: value.length > 10 ? "" : "标题必须超过10个字",
    }));
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
    setErrors((prev) => ({
      ...prev,
      content: value.length > 10 ? "" : "内容必须超过10个字",
    }));
  };

  const handleCoverChange = (e) => {
    const value = e.target.value;
    setCover(value);
    setErrors((prev) => ({
      ...prev,
      cover: validateCoverUrl(value)
        ? ""
        : "封面图URL无效，请以http或https开头，并确保链接包含有效的图片格式后缀",
    }));
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(Number(e.target.value));
    setErrors((prev) => ({
      ...prev,
      category: "",
    }));
  };

  const handleSave = async () => {
    if (
      !title ||
      !content ||
      !cover ||
      !selectedCategory ||
      errors.title ||
      errors.content ||
      errors.cover ||
      errors.category
    ) {
      setErrors((prev) => ({
        ...prev,
        category: selectedCategory ? "" : "请选择一个栏目",
      }));
      return;
    }

    const updatedArticle = {
      ...article,
      title,
      content,
      cover,
      category_id: selectedCategory,
    };

    const response = await fetch(`/api/articles/${article.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedArticle),
    });

    if (response.ok) {
      const updatedArticleFromServer = await response.json();
      dispatch({
        type: "changed",
        article: updatedArticleFromServer,
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
      method: "DELETE",
    });

    if (response.ok) {
      dispatch({
        type: "deleted",
        id: article.id,
      });
    } else {
      setErrorMessage("删除文章失败，请稍后再试！");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <ListItem alignItems="flex-start" sx={{margin:"10px 0 10px 0",paddingLeft:0}}>
        {validateCoverUrl(article.cover) ? (
          <img
            src={validateCoverUrl(article.cover) ? article.cover : ""}
            style={{
              width: 120,
              height: 60,
              borderRadius: 5,
              marginRight: 10,
              objectFit: "cover",
            }}
          />
        ) : null}

        <ListItemText
          primary={
            <Typography
              component="span"
              variant="body1"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis", // 超出部分显示为省略号
              }}
            >
              {article.title}
            </Typography>
          }
          secondary={
            <>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: "text.primary", display: "inline" }}
              >
                {article.content.slice(0, 100)}...
              </Typography>
            </>
          }
        />
        <IconButton onClick={() => setIsEditing(true)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
      <Divider
        component="li"
        sx={{
          borderColor: "rgba(0, 0, 0, 0.12)",
          borderBottomWidth: 1,
          listStyleType: "none",
        }}
      />

      {/* 编辑模态框 */}
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
            {categories.length && (
              <RadioGroup
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                {categories.map((category) => (
                  <FormControlLabel
                    key={category.id}
                    value={category.id}
                    control={<Radio />}
                    label={category.name}
                  />
                ))}
              </RadioGroup>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)}>取消</Button>
          <Button
            onClick={handleSave}
            disabled={
              !!errors.title ||
              !!errors.content ||
              !!errors.cover ||
              !selectedCategory
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
    </>
  );
}