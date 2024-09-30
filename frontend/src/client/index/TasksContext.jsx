import { createContext, useContext, useReducer } from 'react';
const initialTasks = [
  { id: 0, text: '做饭', done: true },
  { id: 1, text: '扫地', done: false },
  { id: 2, text: '买菜', done: false }
];
// 创建上下文
const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

// 定义 reducer
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      if(!action.text){
        return tasks
      }
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

//提供者组件
export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer,initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

//导出Context参数 tasks
export function useTasks() {
  return useContext(TasksContext);
}

//导出Context参数dispatch，dispatch 作为一个执行方法，用于更新状态
export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}
