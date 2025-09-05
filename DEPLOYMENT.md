# Software Hub 部署指南

## 🚀 Cloudflare Pages 部署

### 1. 准备工作

#### 1.1 创建 GitHub 仓库
```bash
# 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit: Software Hub project"

# 添加远程仓库
git remote add origin https://github.com/yourusername/software-hub.git
git push -u origin main
```

#### 1.2 环境变量配置
在 Cloudflare Pages 控制台设置以下环境变量：

```env
# 前端环境变量
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_TITLE=Software Hub
VITE_APP_DESCRIPTION=个人软件推荐平台

# 构建配置
NODE_VERSION=18
```

### 2. Cloudflare Pages 部署步骤

#### 2.1 连接 GitHub 仓库
1. 登录 [Cloudflare Pages](https://pages.cloudflare.com/)
2. 点击 "Create a project"
3. 选择 "Connect to Git"
4. 授权 GitHub 并选择 `software-hub` 仓库

#### 2.2 构建设置
```
框架预设: Vue
构建命令: cd client && npm ci && npm run build
构建输出目录: client/dist
根目录: /
Node.js版本: 18.x
```

#### 2.3 环境变量设置
在 Pages 项目设置中添加：
- `VITE_API_BASE_URL`: 后端API地址
- `VITE_APP_TITLE`: 应用标题
- `VITE_APP_DESCRIPTION`: 应用描述

### 3. 后端部署选项

#### 选项1: Vercel（推荐）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署后端
cd server
vercel --prod
```

#### 选项2: Railway
```bash
# 连接 GitHub 仓库到 Railway
# 设置环境变量：
# DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
```

#### 选项3: Heroku
```bash
# 安装 Heroku CLI
# 创建 Heroku 应用
heroku create your-app-name

# 设置环境变量
heroku config:set DB_HOST=your-db-host
heroku config:set DB_USER=your-db-user
heroku config:set DB_PASSWORD=your-db-password
heroku config:set DB_NAME=your-db-name

# 部署
git push heroku main
```

### 4. 数据库部署

#### 4.1 云数据库选项
- **PlanetScale**: MySQL 兼容，免费额度
- **Railway**: 提供 MySQL 数据库
- **Supabase**: PostgreSQL，免费额度
- **MongoDB Atlas**: 如果改用 MongoDB

#### 4.2 数据库迁移
```bash
# 导出当前数据库
mysqldump -u root -p software_download > database_backup.sql

# 导入到云数据库
mysql -h your-cloud-host -u your-user -p your-database < database_backup.sql
```

### 5. 域名配置

#### 5.1 自定义域名
1. 在 Cloudflare Pages 项目设置中添加自定义域名
2. 配置 DNS 记录指向 Cloudflare
3. 启用 SSL 证书

#### 5.2 子域名配置
```
前端: https://software-hub.yourdomain.com
后端: https://api.yourdomain.com
```

### 6. 性能优化

#### 6.1 前端优化
- 启用 Cloudflare 的 CDN
- 配置缓存策略
- 启用 Brotli 压缩
- 使用 Cloudflare 的图片优化

#### 6.2 后端优化
- 启用数据库连接池
- 配置 Redis 缓存
- 使用 CDN 加速静态资源

### 7. 监控和分析

#### 7.1 错误监控
- 集成 Sentry 进行错误追踪
- 使用 Cloudflare Analytics 监控访问

#### 7.2 性能监控
- 使用 Google Analytics 或 Cloudflare Web Analytics
- 监控 Core Web Vitals

### 8. 持续集成/持续部署 (CI/CD)

#### 8.1 GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: software-hub
          directory: client/dist
```

### 9. 安全配置

#### 9.1 环境变量安全
- 使用 Cloudflare Pages 的环境变量功能
- 不要在代码中硬编码敏感信息

#### 9.2 API 安全
- 启用 CORS 配置
- 使用 HTTPS
- 配置 API 限流

### 10. 故障排除

#### 10.1 常见问题
1. **构建失败**: 检查 Node.js 版本和依赖
2. **路由问题**: 确保 `_redirects` 文件正确配置
3. **API 调用失败**: 检查 CORS 和 API 地址配置

#### 10.2 调试工具
- Cloudflare Pages 构建日志
- 浏览器开发者工具
- 网络请求监控

## 📞 支持

如有问题，请参考：
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Vue.js 部署指南](https://vuejs.org/guide/best-practices/production-deployment.html)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
