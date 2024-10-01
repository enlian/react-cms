import React, { useState, useEffect } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 检查用户是否已登录
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // 验证 token 的有效性
      fetch("http://localhost:3000/api/validate-token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 如果你的 token 存储在 cookie，可以根据需要修改
        },
        credentials: 'include', // 允许发送和接收 cookie
      })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(true); // token 有效，更新登录状态
        } else {
          // token 无效，清除 localStorage
          // localStorage.removeItem("token");
        }
      })
      .catch((error) => {
        console.error("Error validating token:", error);
      });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const credentials = { name: username, password };

    // 向后端发送 POST 请求
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (response.ok) {
        // 登录成功
        alert(data.message);
        // 保存 token 到 localStorage
        console.log(data.token);
        
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true); // 更新登录状态
      } else {
        // 登录失败
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {isLoggedIn ? (
        <p>已登录</p> // 显示已登录的信息
      ) : (
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default Login;
