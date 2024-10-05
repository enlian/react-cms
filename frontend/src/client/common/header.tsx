import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { CategoriesContext } from "../contexts/CategoriesContext";
import "../../assets/header.scss";

export default function Header() {
  const auth = useContext(AuthContext);
  const { categories } = useContext(CategoriesContext);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);

  const handleLogout = () => {
    auth?.logout();
  };

  // 根据 parentId 归类子分类
  const categorizedSubcategories = categories.reduce((acc: { [key: number]: any[] }, category) => {
    if (category.parentId) {
      acc[category.parentId] = acc[category.parentId] || [];
      acc[category.parentId].push(category);
    }
    return acc;
  }, {});

  return (
    <nav>
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/editCategory"}>Edit Category</Link>
        </li>
        {categories
          .filter((category) => !category.parentId) // 只显示主栏目
          .map((category) => (
            <li key={category.id}
                onMouseEnter={() => setExpandedCategoryId(category.id)}
                onMouseLeave={() => setExpandedCategoryId(null)} // 隐藏子栏目
            >
              <Link to={category.link}>{category.name}</Link>
              {expandedCategoryId === category.id && categorizedSubcategories[category.id]?.length > 0 && (
                <ul>
                  {categorizedSubcategories[category.id].map((subcategory) => (
                    <li key={subcategory.id}>
                      <Link to={subcategory.link}>{subcategory.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
      </ul>

      <div className="auth-container">
        {auth?.state.isLoggedIn ? (
          <>
            <span>{auth?.state?.user?.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
