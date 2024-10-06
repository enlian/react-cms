import React, { createContext, useReducer, ReactNode, useEffect } from "react";

// 定义状态的类型
interface AuthState {
  isLoggedIn: boolean;
  user: Record<string, any> | null; // 用户信息类型，使用索引签名
  isLoading: boolean; // 新增的加载状态
}

// 定义 action 类型
type AuthAction =
  | { type: "LOGIN"; user: Record<string, any> } // 传入用户信息
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; isLoading: boolean }; // 新增的设置加载状态的 action

// 定义上下文的类型
interface AuthContextType {
  state: AuthState;
  login: (user: Record<string, any>) => void; // 登录时需要用户信息
  logout: () => void;
}

// 初始化状态
const initialState: AuthState = {
  isLoggedIn: false,
  user: null, // 初始用户信息为 null
  isLoading: true, // 默认加载状态为 true
};

// 创建 AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 定义 reducer 函数
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        user: action.user, // 更新用户信息
        isLoading: false, // 登录成功，设置加载状态为 false
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        user: null, // 清除用户信息
        isLoading: false, // 登出后也设置加载状态为 false
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.isLoading, // 更新加载状态
      };
    default:
      return state;
  }
};

// 创建 AuthProvider 组件
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user: Record<string, any>) => {
    dispatch({ type: "LOGIN", user }); // 传入用户信息
  };

  const logout = () => {
    localStorage.removeItem("token"); // 清除 token
    dispatch({ type: "LOGOUT" });
  };

  // 在组件挂载时验证 token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // 验证 token 的有效性
      fetch("/api/validate-token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      })
      .then((response) => {
        if (response.ok) {
          return response.json(); // 获取用户信息
        } else {
          localStorage.removeItem("token");
          dispatch({ type: "LOGOUT" });
        }
      })
      .then((data) => {
        if (data && data.user) {
          // 登录成功，更新用户信息
          login(data.user); // 直接传入 user 对象
        }
      })
      .catch((error) => {
        console.error("Error validating token:", error);
      })
      .finally(() => {
        dispatch({ type: "SET_LOADING", isLoading: false }); // 验证结束后，设置加载状态为 false
      });
    } else {
      dispatch({ type: "SET_LOADING", isLoading: false }); // 如果没有 token，直接设置加载状态为 false
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
