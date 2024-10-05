import { useState } from 'react';
import { useArticlesDispatch } from './ArticleContext';

export default function AddArticle() {
  const [text, setText] = useState('');
  const dispatch = useArticlesDispatch();
  return (
    <div className='add-article'>
      <input
        placeholder="add article"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Add</button>
    </div>
  );
}

let nextId = 3;
