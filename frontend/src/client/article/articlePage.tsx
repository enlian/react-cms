import AddArticle from "./AddArticle";
import ArticleList from "./articleList";
import { ArticlesProvider } from "./ArticleContext";
import "../../assets/article.scss"

function Index() {
  return (
    <div id="article-box">
      <ArticlesProvider>
        <AddArticle />
        <ArticleList />
      </ArticlesProvider>
    </div>
  );
}

export default Index;
