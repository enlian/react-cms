import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

// 定义 Article 类型
interface Article {
  id: number; //从数据库获取，自增
  title: string;
  content: string;
  cover: string; //封面
  categoryId: number; //关联的栏目id
  userId:number //作者id
}

// 定义 Action 类型
type Action =
  | { type: "added"; article: Article }
  | { type: "changed"; article: Article }
  | { type: "deleted"; id: number }
  | { type: "set"; articles: Article[] }; // 新增动作类型，初始化文章列表

// 创建上下文
const ArticlesContext = createContext<Article[] | null>(null);
const ArticlesDispatchContext = createContext<React.Dispatch<Action> | null>(
  null
);

// 定义 reducer
function articlesReducer(articles: Article[], action: Action): Article[] {
  switch (action.type) {
    case "added": {
      if (!action.article.title || !action.article.content) {
        return articles;
      }
      return [...articles, action.article];
    }
    case "changed": {
      return articles.map((t) =>
        t.id === action.article.id ? action.article : t
      );
    }
    case "deleted": {
      return articles.filter((t) => t.id !== action.id);
    }
    case "set": {
      return action.articles; // 初始化文章列表
    }
    default: {
      throw new Error("Unknown action: " + action.type);
    }
  }
}

// 提供者组件
export function ArticlesProvider({ children }: { children: ReactNode }) {
  const [articles, dispatch] = useReducer(articlesReducer, []);

  // 使用 useEffect 从 API 拉取数据
  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch("http://localhost:3000/api/articles", {
          method: "POST", // 使用 POST 请求
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: "user-token" }), // 可以在这里传递 token
        });
        const data = await response.json();
        dispatch({ type: "set", articles: data }); // 初始化文章列表
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    }

    fetchArticles();
  }, []); // 空依赖数组表示只在组件挂载时执行

  return (
    <ArticlesContext.Provider value={articles}>
      <ArticlesDispatchContext.Provider value={dispatch}>
        {children}
      </ArticlesDispatchContext.Provider>
    </ArticlesContext.Provider>
  );
}

// 导出Context参数 articles
export function useArticles(): Article[] {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error("useArticles must be used within an ArticlesProvider");
  }
  return context;
}

// 导出Context参数 dispatch，dispatch 作为一个执行方法，用于更新状态
export function useArticlesDispatch(): React.Dispatch<Action> {
  const context = useContext(ArticlesDispatchContext);
  if (!context) {
    throw new Error(
      "useArticlesDispatch must be used within an ArticlesProvider"
    );
  }
  return context;
}
