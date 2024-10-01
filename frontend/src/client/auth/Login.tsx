import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext"; // 引入AuthContext

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // 从 AuthContext 中获取登录状态和 login 函数
  const auth = useContext(AuthContext);

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
        console.log(data.message);
        // 保存 token 到 localStorage
        localStorage.setItem("token", data.token);
        // 调用 context 中的 login 方法
        auth?.login();
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
      {auth?.state.isLoggedIn ? (
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
