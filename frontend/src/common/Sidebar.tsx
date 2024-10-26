import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import "./../assets/sidebar.scss";

export default function Sidebar() {
  const auth = useContext(AuthContext);
  const location = useLocation(); // 获取当前路由路径

  const handleLogout = () => {
    auth?.logout();
  };

  // 检查是否为当前路径
  const isSelected = (path: string) => location.pathname === path;

  
  

  return (
    <Box className="sidebar">
      {/* Logo 和欢迎信息 */}
      <Box sx={{ textAlign: "center", padding: 2 }}>
        <Typography variant="h6">React CMS</Typography>
        {auth?.state.isLoggedIn && (
          <Typography variant="subtitle1">您好，{auth?.state?.user?.name}</Typography>
        )}
      </Box>

      <Divider />

      {/* 管理菜单 */}
      <List>
        <ListItem
          button
          component={Link}
          to="/articleManagement"
          className={isSelected("/articleManagement")?"selectedItem":null}
        >
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="文章管理" />
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/personnelManagement"
          className={isSelected("/personnelManagement")?"selectedItem":null} // 选中状态
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="人员管理" />
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/categoryManagement"
          className={isSelected("/categoryManagement")?"selectedItem":null} // 选中状态
        >
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="栏目管理" />
        </ListItem>
      </List>

      <Divider sx={{ marginTop: "auto" }} />

      {/* 登录/登出按钮 */}
      <List>
        {auth?.state.isLoggedIn ? (
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="退出" />
          </ListItem>
        ) : (
          <ListItem button component={Link} to="/login" selected={isSelected("/login")}>
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="登录" />
          </ListItem>
        )}
      </List>
    </Box>
  );
}
