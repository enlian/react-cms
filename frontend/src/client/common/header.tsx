import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { CategoriesContext } from "../contexts/CategoriesContext";
import "../../assets/header.scss"; // 导入 scss 文件

export default function Navbar() {
  const auth = useContext(AuthContext);
  const { categories } = useContext(CategoriesContext);

  const handleLogout = () => {
    auth?.logout();
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/editCategory"}>Edit Category</Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link to={category.link}>{category.name}</Link>
            {category.subcategories && category.subcategories.length > 0 && (
              <ul>
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
