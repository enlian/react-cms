## CMS Project - React, Express, PostgreSQL

A content management system (CMS) based on React. The front-end uses react.js, the back-end uses express.js (models, controllers, and middlewares are developed separately), and the database uses postgres. The content editor uses a rich text editor.

### Main functions:
- **Register and log in** JSON Web Token authentication
- **Article list** Get the article list based on the user ID, and get the article list based on the column ID.
- **Article management** Use a rich text editor to publish articles, edit and delete articles. Articles include title, content, cover image, and author information.
- **Column/sub-column management** Create, edit and delete columns and sub-columns.
- **Article mounting** Mount articles to columns or sub-columns.
<br><br>
The front-end interface is pure data flow, with complete logic and interaction. No third-party UI components are used, which is convenient for later custom styles or secondary development based on the design draft.
<br>

## Usage Instructions

### Backend
```bash
cd backend
npm i
npm run dev
```
Backend configuration file location: backend/config/.env


### Frontend
```bash
cd frontend
npm i 
npm run dev
```

---
<br>
基于 React 的内容管理系统 (CMS)，前端使用react.js，后端采用express.js（models、controllers、middlewares分离开发），数据库采用postgres
内容编辑器采用富文本编辑器。

### 主要功能：
- **注册登录** JSON Web Token 认证
- **文章列表** 根据用户id获取文章列表，根据栏目id获取文章列表。
- **文章管理** 使用富文本编辑器发布文章，编辑和删除文章，文章包含标题、内容、封面图、作者信息。
- **栏目/子栏目管理** 创建、编辑和删除栏目和子栏目。
- **文章挂载** 将文章挂载到栏目或子栏目。
<br><br>
前端界面纯数据流，逻辑和交互齐全，未采用第三方UI组件，方便后期根据设计稿自定义样式或二次开发。
