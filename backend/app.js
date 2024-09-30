var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const { connectToDatabase, closeConnection } = require('./config/mongoDBdatabase');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');

var app = express();
// 使用 CORS 中间件
app.use(cors());

// 立即执行 MongoDB 连接和 ping 检查
const checkMongoDBConnection = async () => {
  try {
    const client = await connectToDatabase(); // 连接或获取现有连接
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // 如果连接失败，退出进程
  }
};

checkMongoDBConnection(); // 调用检查连接的函数

// 在应用关闭时关闭数据库连接
process.on('SIGINT', async () => {
  await closeConnection();
  console.log("MongoDB connection closed.");
  process.exit(0);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json()); // 解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: false })); // 解析 URL 编码格式的请求体
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/', [loginRouter,registerRouter]); // 使用 auth 路由

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
