import { useArticles } from "./../contexts/articleContext";
import { Article } from "./article";
import { Typography, CircularProgress, Box } from "@mui/material";

export default function ArticleList() {
  const articles = useArticles();

  // 假设 articles 是从上下文中异步获取的，可以根据数据是否存在来处理加载状态和错误
  if (!articles) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    ); // 如果文章数据为空，显示加载状态
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
      {articles.map((article) => (
        <Article key={article.id} article={article} />
      ))}
    </>
  );
}
