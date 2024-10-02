import AddTask from "./AddArticle";
import TaskList from "./articleList";
import { TasksProvider } from "./ArticleContext";
import "../../assets/article.scss"

function Index() {
  return (
    <div id="article-box">
      <TasksProvider>
        <AddTask />
        <TaskList />
      </TasksProvider>
    </div>
  );
}

export default Index;
