// App.js
import React, { Component, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./client/index/Index";
import Login from "./client/auth/Login";
import Register from "./client/auth/Register";
import { AuthProvider } from "./client/contexts/AuthContext";
import { CategoriesProvider, CategoriesContext } from "./client/contexts/CategoriesContext"; // 引入 CategoriesProvider 和 CategoriesContext
import Header from "./client/common/Header"; 
import EditCategory from "./manage/EditCategory";

const CategoriesRoutes = () => {
  const { categories } = useContext(CategoriesContext); // 获取 categories 数据

  return (
    <Routes>
      {categories.map(category => (
        <Route key={category.id} path={category.link} element={<div>{category.name}</div>} />
      ))}
    </Routes>
  );
};

export default class App extends Component {
  render() {
    return (
      <CategoriesProvider>
        <AuthProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/editCategory" element={<EditCategory />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* 将 CategoriesRoutes 作为 Route 的子组件使用 */}
              <Route path="*" element={<CategoriesRoutes />} /> {/* 捕获所有其他路径 */}
            </Routes>
          </Router>
        </AuthProvider>
      </CategoriesProvider>
    );
  }
}
