import { useState } from "react";
import { useTasks, useTasksDispatch } from "./TasksContext";
import {Task} from "./Tast"

// 使用上下文的组件，Task List列表
export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

