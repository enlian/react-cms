import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { CategoriesContext } from "../contexts/CategoriesContext";

export default function Navbar() {
  const auth = useContext(AuthContext); // 使用 AuthContext
  const { categories } = useContext(CategoriesContext); // 使用 CategoriesContext

  // 处理登出操作
  const handleLogout = () => {
    auth?.logout(); // 调用 logout 方法
  };

  return (
    <nav style={navStyle}>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <Link to={"/"}>Home</Link>
        </li>
        <li style={liStyle}>
          <Link to={"/editCategory"}>Edit Category</Link>
        </li>
        {categories.map((category) => (
          <li key={category.id} style={liStyle}>
            <Link to={category.link}>{category.name}</Link>
            {category.subcategories && category.subcategories.length > 0 && (
              <ul style={submenuStyle}>
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.id}>
                    <Link to={subcategory.link}>{subcategory.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* 根据登录状态显示不同的按钮 */}
      <div style={authContainerStyle}>
        {auth?.state.isLoggedIn ? (
          <>
            <span>{auth?.state?.user?.name}</span>
            <button onClick={handleLogout} style={{marginLeft:10}}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

// CSS 样式
const navStyle = {
  display:"flex",
  padding: "10px",
  borderBottom: "1px solid #ccc",
  width:"1000px"
};

const ulStyle = {
  listStyle: "none",
  display: "flex",
  margin: 0,
  padding: 0,
};

const liStyle = {
  position: "relative",
  margin: "0 15px",
};

const submenuStyle = {
  listStyle: "none",
  position: "absolute",
  top: "100%", // 使子菜单在顶级栏目下方显示
  left: 0,
  display: "none",
  background: "#f9f9f9", // 子菜单背景色
  padding: "10px 0",
  zIndex: 1000, // 确保子菜单在其他元素之上
  whiteSpace: "nowrap",         /* 强制文本不换行 */
  overFlow: "hidden",             /* 隐藏超出容器的文本 */
  textOverflow: "ellipsis",   
};

const authContainerStyle = {
  marginLeft: "auto", // 将登录状态部分推到右侧
  color: "black", // 文本颜色
  display: "flex",
  alignItems: "center",
};

// 使用 CSS 的伪类 :hover 来处理子菜单显示
const navItems = document.querySelectorAll('nav > ul > li');
navItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    const submenu = item.querySelector('ul');
    if (submenu) {
      submenu.style.display = 'block'; // 显示子菜单
    }
  });

  item.addEventListener('mouseleave', () => {
    const submenu = item.querySelector('ul');
    if (submenu) {
      submenu.style.display = 'none'; // 隐藏子菜单
    }
  });
});
