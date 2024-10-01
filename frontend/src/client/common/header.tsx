import React, { useContext } from "react";
import { AuthContext } from "./../auth/AuthContext"; // 引入 AuthContext
import { Link } from "react-router-dom"; // 导入 Link 组件

const Header = () => {
  const auth = useContext(AuthContext);

  // 处理登出操作
  const handleLogout = () => {
    auth?.logout(); // 调用 logout 方法
  };

  return (
    <div
      style={{ padding: "2px", backgroundColor: "#f0f0f0", textAlign: "left" }}
    >
      {/* 新增的跳转按钮 */}
      <div style={{ marginTop: "20px" }}>
        <Link to="/">Index </Link>
        <Link to="/register">Register </Link>
      </div>

      {auth?.state.isLoading ? (
        <p>Loading...</p> // 显示加载指示器
      ) : auth?.state.isLoggedIn ? (
        <div>
          <p>{auth?.state?.user?.name}</p>
          <button onClick={handleLogout}>登出</button> {/* 登出按钮 */}
        </div>
      ) : (
        <Link to="/login">
          <button>登录</button> {/* 登录按钮 */}
        </Link>
      )}
    </div>
  );
};

export default Header;
