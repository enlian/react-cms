import { useState } from "react";
import { useTasks, useTasksDispatch } from "./ArticleContext";
import { Task } from "./Tast";

// 使用上下文的组件，Task List列表
export default function TaskList() {
  const tasks = useTasks();
  return (
    <>
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </>
  );
}
