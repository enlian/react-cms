import React, { createContext, useState, useEffect } from "react";

// 定义数据类型
export interface Category {
  id: number;
  name: string;
  link: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: number;
  name: string;
  link: string;
  parentId: number;
}

// 创建上下文
export const CategoriesContext = createContext<
  | {
      categories: Category[];
      setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
      isLoading: boolean;
    }
  | undefined
>(undefined);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const defaultCategories: Category[] = [];

  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);

  // 模拟从服务端获取数据的函数
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/getCategories");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      const data: Category[] = result.categories;
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider
      value={{ categories, setCategories, isLoading }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
