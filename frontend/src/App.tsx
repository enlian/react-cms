import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ArticleManagement from "./article/ArticleManagement";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { CategoriesProvider, CategoriesContext } from "./contexts/CategoriesContext";
import Sidebar from "./common/Sidebar";
import CategoryManagement from "./Category/CategoryManagement";
import "./../src/assets/App.css"; // 引入CSS文件

const PrivateRoute = ({ children }) => {
  const auth = useContext(AuthContext);

  if (!auth?.state?.isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

const CategoriesRoutes = () => {
  const { categories } = useContext(CategoriesContext);

  return (
    <Routes>
      {categories.map((category) => (
        <Route key={category.id} path={category.link} element={<div>{category.name}</div>} />
      ))}
    </Routes>
  );
};

export default function App() {
  return (
    <CategoriesProvider>
      <AuthProvider>
        <Router>
          <MainApp />
        </Router>
      </AuthProvider>
    </CategoriesProvider>
  );
}

// 把主要内容分离到 MainApp 组件内，以确保 useContext 可以正常使用
function MainApp() {
  const auth = useContext(AuthContext);

  return (
    <div className="app-layout">
      {auth?.state?.isLoggedIn && <Sidebar />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 以下路由需要用户登录 */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ArticleManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/articleManagement"
            element={
              <PrivateRoute>
                <ArticleManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/categoryManagement"
            element={
              <PrivateRoute>
                <CategoryManagement />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<CategoriesRoutes />} />
        </Routes>
      </div>
    </div>
  );
}
