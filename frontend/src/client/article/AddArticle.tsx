import { useState } from "react";
import { useArticlesDispatch } from "../contexts/articleContext";

export default function AddArticle() {
  const [text, setText] = useState("");
  const dispatch = useArticlesDispatch();
  return (
    <div className="add-article">
      <input
        placeholder="add article"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText("");
          dispatch({
            type: "added",
            article: {
              id: 0,
              title: "",
              content: "",
              cover: "",
            },
          });
        }}
      >
        Add
      </button>
    </div>
  );
}

let nextId = 3;
