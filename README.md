# Software Hub 🚀

一个现代化的软件推荐平台，基于 Vue.js 和 Node.js 构建，支持 Cloudflare Pages 部署。

## ✨ 功能特性

- 🎯 **软件分类管理** - 智能分类和标签系统
- 🔍 **智能搜索** - 全文搜索和筛选功能
- 📱 **响应式设计** - 完美适配各种设备
- 🔐 **用户认证** - JWT 身份验证系统
- 📊 **数据统计** - 实时数据分析和展示
- 🎨 **现代化UI** - 基于 Element Plus 的美观界面
- 🌤️ **实时天气** - 集成天气API显示
- 📚 **古诗词展示** - 随机古诗词推荐
- 📅 **节假日倒计时** - 法定节假日倒计时功能

## 🛠️ 技术栈

### 前端
- **Vue 3** + Composition API
- **Vue Router 4** - 路由管理
- **Pinia** - 状态管理
- **Element Plus** - UI组件库
- **SCSS** - 样式预处理
- **Vite** - 构建工具

### 后端
- **Node.js** + Express
- **MySQL** - 数据库
- **JWT** - 身份验证
- **bcryptjs** - 密码加密
- **Multer** - 文件上传
- **CORS** - 跨域支持

## 🚀 快速开始

### 环境要求
- Node.js 18+
- MySQL 8.0+
- npm 或 yarn

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/yourusername/software-hub.git
cd software-hub
```

2. **安装依赖**
```bash
npm run install-all
```

3. **数据库配置**
```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE software_download;

# 导入数据库结构
mysql -u root -p software_download < database/schema.sql

# 导入初始数据
mysql -u root -p software_download < database/init_data.sql
```

4. **环境变量配置**
```bash
# 复制环境变量模板
cp server/.env.example server/.env

# 编辑配置文件
# 配置数据库连接信息
```

5. **启动开发服务器**
```bash
# 同时启动前端和后端
npm run dev

# 访问应用
# 前端: http://localhost:3000
# 后端: http://localhost:3001
```

## 🌐 部署到 Cloudflare Pages

### 1. 准备 GitHub 仓库
```bash
git init
git add .
git commit -m "Initial commit: Software Hub project"
git remote add origin https://github.com/yourusername/software-hub.git
git push -u origin main
```

### 2. 配置 Cloudflare Pages
1. 登录 [Cloudflare Pages](https://pages.cloudflare.com/)
2. 创建新项目，连接 GitHub 仓库
3. 配置构建设置：
   - **构建命令**: `cd client && npm ci && npm run build`
   - **构建输出目录**: `client/dist`
   - **Node.js版本**: `18.x`

### 3. 环境变量设置
在 Cloudflare Pages 控制台设置：
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_TITLE=Software Hub
VITE_APP_DESCRIPTION=个人软件推荐平台
```

### 4. 后端部署
推荐使用以下平台部署后端：
- **Vercel** - 简单易用
- **Railway** - 支持数据库
- **Heroku** - 成熟稳定

## 📁 项目结构

```
software-hub/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── components/     # Vue组件
│   │   ├── views/          # 页面组件
│   │   ├── router/         # 路由配置
│   │   ├── stores/         # Pinia状态管理
│   │   ├── config/         # 配置文件
│   │   └── styles/         # 样式文件
│   ├── public/             # 静态资源
│   └── vite.config.js      # Vite配置
├── server/                 # 后端应用
│   ├── routes/             # API路由
│   ├── config/             # 配置文件
│   └── index.js            # 服务器入口
├── database/               # 数据库相关
│   ├── schema.sql          # 数据库结构
│   ├── init_data.sql       # 初始数据
│   └── init_holiday_poetry.js # 数据初始化脚本
├── .github/workflows/      # GitHub Actions
├── cloudflare-pages.yml    # Cloudflare Pages配置
└── DEPLOYMENT.md           # 详细部署指南
```

## 🔧 开发命令

```bash
# 开发环境
npm run dev              # 同时启动前后端
npm run client           # 仅启动前端
npm run server           # 仅启动后端

# 构建
npm run build            # 构建前端
npm run build:server     # 构建后端

# 部署
npm run deploy:client    # 部署前端
npm run deploy:server    # 部署后端

# 安装依赖
npm run install-all      # 安装所有依赖
```

## 📊 数据库管理

### 节假日和古诗词数据
```bash
# 初始化数据
cd database
node init_holiday_poetry.js

# 通过API管理
# 添加节假日: POST /api/holidays
# 添加古诗词: POST /api/poetry
# 获取随机古诗词: GET /api/poetry/random
# 获取下一个节假日: GET /api/holidays/next
```

## 🎨 自定义配置

### 主题配置
- 修改 `client/src/styles/variables.scss`
- 调整颜色、字体、间距等

### 功能配置
- 天气API: `client/src/config/weather.js`
- 数据库: `server/config/database.js`

## 📈 性能优化

- ✅ 代码分割和懒加载
- ✅ 静态资源CDN加速
- ✅ 数据库查询优化
- ✅ 图片压缩和优化
- ✅ 缓存策略配置

## 🔒 安全特性

- ✅ JWT身份验证
- ✅ 密码加密存储
- ✅ CORS跨域保护
- ✅ API限流防护
- ✅ 输入验证和过滤

## 📱 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 支持

- 📧 邮箱: your-email@example.com
- 🐛 问题反馈: [GitHub Issues](https://github.com/yourusername/software-hub/issues)
- 📖 文档: [部署指南](DEPLOYMENT.md)

## 🙏 致谢

感谢以下开源项目：
- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Express.js](https://expressjs.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

---

⭐ 如果这个项目对您有帮助，请给个 Star！