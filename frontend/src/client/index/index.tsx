import AddTask from './AddTask';
import TaskList from './TaskList';
import { TasksProvider } from './TasksContext';
import { Link } from 'react-router-dom'; // 导入 Link 组件

function Index() {
  return (
    <TasksProvider>
      <AddTask />
      <TaskList />

      {/* 新增的跳转按钮 */}
      <div style={{ marginTop: '20px' }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/test">test</Link>
      </div>
    </TasksProvider>
  );
}

export default Index;
