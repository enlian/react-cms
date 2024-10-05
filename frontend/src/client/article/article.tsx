import { useState } from "react";
import { useArticlesDispatch } from "./ArticleContext";

export function Article({ article }) {
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useArticlesDispatch();
    let articleContent;
    if (isEditing) {
      articleContent = (
        <>
          <input
            value={article.text}
            onChange={(e) => {
              dispatch({
                type: "changed",
                article: {
                  ...article,
                  text: e.target.value,
                },
              });
            }}
          />
          <button onClick={() => {
            if (article.text) {
              setIsEditing(false)
            }
            }}>保存</button>
        </>
      );
    } else {
      articleContent = (
        <>
          {article.text}
          <button onClick={() => setIsEditing(true)}>编辑</button>
        </>
      );
    }
    return (
      <div className="article-item">
        {articleContent}
        <button
          onClick={() => {
            dispatch({
              type: "deleted",
              id: article.id,
            });
          }}
        >删除</button>
      </div>
    );
  }