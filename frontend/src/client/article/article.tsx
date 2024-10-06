import { useState } from "react";
import { useArticlesDispatch } from "../contexts/articleContext";

export function Article({ article }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [cover, setCover] = useState(article.cover);
  const dispatch = useArticlesDispatch();

  // 处理保存文章
  const handleSave = () => {
    if (title && content) {
      dispatch({
        type: "changed",
        article: {
          ...article,
          title,
          content,
          cover,
        },
      });
      setIsEditing(false); // 关闭模态框
    }
  };

  return (
    <div className="article-item">
      {/* 展示文章内容 */}
      <p className="article-title">{article.title}</p>
      <p className="article-content">{article.content}</p>
      {article.cover && <img  className="article-cover" src={article.cover} alt={article.title} width="100" />}
      <div className="article-bth">
      <button className="article-edit" onClick={() => setIsEditing(true)}>编辑</button>
      <button className="article-delete"
        onClick={() => {
          dispatch({
            type: "deleted",
            id: article.id,
          });
        }}
      >
        删除
      </button>
      </div>
      

      {/* 编辑模态框 */}
      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h3>编辑文章</h3>
            <label>
              标题:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label>
              内容:
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </label>
            <label>
              封面图:
              <input
                type="text"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                placeholder="封面图URL"
              />
            </label>
            <button onClick={handleSave}>保存</button>
            <button onClick={() => setIsEditing(false)}>取消</button>
          </div>
        </div>
      )}
    </div>
  );
}
