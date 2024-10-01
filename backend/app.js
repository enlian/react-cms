var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const {testConnection} = require("./dbConfig"); // 引入数据库配置

const indexRouter = require("./routes/index");
const apiRoutes = require('./routes/apiRoutes'); // 导入 apiRoutes


const app = express();

// 测试数据库连接
testConnection();

// 配置 CORS
const corsOptions = {
  origin: "http://localhost:5173", // 允许的源
  credentials: true, // 允许凭证（如 cookies）
};
app.use(cors(corsOptions)); // 使用配置的 CORS 中间件

app.use(express.json()); // 解析 JSON 格式的请求体
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false })); // 解析 URL 编码格式的请求体
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", apiRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
