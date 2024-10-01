import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { AuthContext } from "./../auth/AuthContext"; // 引入 AuthContext
import { Link } from "react-router-dom"; // 导入 Link 组件
import CircularProgress from "@mui/material/CircularProgress";
import { useContext } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import AcUnitIcon from '@mui/icons-material/AcUnit';


export default function ButtonAppBar() {
  const auth = useContext(AuthContext); // 使用 AuthContext

  // 处理登出操作
  const handleLogout = () => {
    auth?.logout(); // 调用 logout 方法
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            component={Link}
            to="/"
            sx={{ display: { xs: "none", md: "flex" },mr: 1, color: "white" }}
          >
            <AcUnitIcon />
          </IconButton> */}

          {/* <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 4,
              display: { xs: "none", md: "flex" },
              color: "inherit",
              textDecoration: "none",
            }}
          >
            React CMS
          </Typography> */}

          <Typography variant="h6"component={Link} to="/"sx={{ flexGrow: 1,color: "inherit",textDecoration: "none"}}>
            Home
          </Typography>
          {/* 根据登录状态显示不同的按钮 */}
          {auth?.state.isLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} /> // 显示加载指示器
          ) : auth?.state.isLoggedIn ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ color: "white", marginRight: 2 }}>
                {auth?.state?.user?.name} {/* 显示用户名 */}
              </Typography>
              <Button
                color="inherit"
                onClick={handleLogout}
                endIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
