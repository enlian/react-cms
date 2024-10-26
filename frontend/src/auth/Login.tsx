import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./../contexts/AuthContext";
import { Alert, TextField, Button, Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 错误消息
  const [successMessage, setSuccessMessage] = useState(""); // 成功消息
  const [isSubmitting, setIsSubmitting] = useState(false); // 按钮状态
  
  const auth = useContext(AuthContext);
  const navigate = useNavigate(); // 用于页面跳转

  // 页面初始化时检查是否已登录
  useEffect(() => {
    if (auth?.state.isLoggedIn) {
      navigate("/"); // 已登录，跳转到首页
    }
  }, [auth, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // 简单表单验证
    if (!username || !password) {
      setErrorMessage("用户名和密码不能为空");
      return;
    }

    const credentials = { name: username.trim(), password: password.trim() };

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (response.ok) {
        // 登录成功
        setSuccessMessage("登录成功！");
        // 保存 token 到 localStorage
        localStorage.setItem("token", data.token);
        // 调用 context 中的 login 方法
        auth?.login(data.user);
        
        // 延迟 1 秒后跳转到首页
        setTimeout(() => {
          navigate("/"); // 跳转到首页
        }, 1000);
        
      } else {
        // 登录失败
        setErrorMessage(data.message || "登录失败");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("发生错误，请稍后重试");
    } finally {
      setIsSubmitting(false); // 恢复按钮状态
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      {/* 大标题 */}
      <Typography variant="h4" align="center" gutterBottom>
        React 内容管理系统
      </Typography>

      <Typography variant="h5" align="center" gutterBottom>
        登录
      </Typography>

      {auth?.state.isLoggedIn ? (
        <Alert severity="info">您已登录</Alert>
      ) : (
        <form onSubmit={handleLogin}>
          <Box mb={2}>
            <TextField
              label="用户名"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())} // 去除输入框中的空格
              variant="outlined"
              error={!!errorMessage && !username}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="密码"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())} // 去除输入框中的空格
              variant="outlined"
              error={!!errorMessage && !password}
            />
            {/* 灰色小字提示 */}
            <Typography variant="caption" sx={{ color: "gray" }}>
              user: admin&nbsp;&nbsp;&nbsp;password: admin123
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? "登录中..." : "登录"}
          </Button>

          {/* 注册按钮 */}
          <Box mt={2} textAlign="center">
            <Typography variant="body1">
              还没有账户？
              <Link to="/register" style={{ marginLeft: 5 }}>
                注册
              </Link>
            </Typography>
          </Box>
        </form>
      )}
    </Box>
  );
};

export default Login;
