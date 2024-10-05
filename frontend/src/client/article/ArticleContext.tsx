import { createContext, useContext, useReducer, ReactNode } from "react";

// 定义 Article 类型
interface Article {
  id: number;
  text: string;
}

// 定义 Action 类型
type Action =
  | { type: "added"; id: number; text: string }
  | { type: "changed"; article: Article }
  | { type: "deleted"; id: number };

// 定义初始数据
const initialArticles: Article[] = [
  { id: 0, text: "做饭" },
  { id: 1, text: "扫地" },
  { id: 2, text: "买菜" },
];

// 创建上下文
const ArticlesContext = createContext<Article[] | null>(null);
const ArticlesDispatchContext = createContext<React.Dispatch<Action> | null>(
  null
);

// 定义 reducer
function articlesReducer(articles: Article[], action: Action): Article[] {
  switch (action.type) {
    case "added": {
      if (!action.text) {
        return articles;
      }
      return [...articles, { id: action.id, text: action.text }];
    }
    case "changed": {
      return articles.map((t) =>
        t.id === action.article.id ? action.article : t
      );
    }
    case "deleted": {
      return articles.filter((t) => t.id !== action.id);
    }
    default: {
      throw new Error("Unknown action: " + action.type);
    }
  }
}

// 提供者组件
export function ArticlesProvider({ children }: { children: ReactNode }) {
  const [articles, dispatch] = useReducer(articlesReducer, initialArticles);

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
