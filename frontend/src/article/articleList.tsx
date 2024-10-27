import { useArticles } from "./../contexts/articleContext";
import { ArticleItem } from "./ArticleItem";
import { Typography, CircularProgress, Box, Divider } from "@mui/material";

export default function ArticleList() {
  const { isLoading, articles } = useArticles(); // 获取加载状态

  // 根据 isLoading 的值来显示加载动画或文章列表
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    ); // 如果处于加载状态，显示加载动画
  }

  if (articles.length === 0) {
    return (
      <Typography variant="h6" align="center">
        没有找到任何文章。
      </Typography>
    ); // 文章列表为空时显示的提示信息
  }

  return (
    <>
    <Divider/>
      {articles.map((article) => (
        <ArticleItem key={article.id} article={article} />
      ))}
    </>
  );
}
