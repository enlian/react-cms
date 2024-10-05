import { useArticles } from "./ArticleContext";
import { Article } from "./article";

// 使用上下文的组件，Article List列表
export default function ArticleList() {
  const articles = useArticles();
  return (
    <>
      {articles.map((article) => (
        <Article key={article.id} article={article} />
      ))}
    </>
  );
}
