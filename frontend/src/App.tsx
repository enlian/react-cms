import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./client/index/Index";
import Login from "./client/auth/Login";
import Register from "./client/auth/Register";
import { AuthProvider } from "./client/auth/AuthContext"; // 引入 AuthProvider
import Header from "./client/common/Header"; // 引入 Header 组件

export default class App extends Component {
  render() {
    return (
      <AuthProvider>
        <Router>
          <Header /> {/* 全局头部组件 */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </AuthProvider>
    );
  }
}
