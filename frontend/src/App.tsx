import AddTask from './client/index/AddTask';
import TaskList from './client/index/TaskList';
import { TasksProvider } from './client/index/TasksContext';

function App() {
  return (
    <TasksProvider>
      <AddTask />
      <TaskList />
    </TasksProvider>
  )
}

export default App