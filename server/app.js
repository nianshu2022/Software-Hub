const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const softwareRoutes = require('./routes/software');
const categoryRoutes = require('./routes/categories');
const { router: authRoutes } = require('./routes/auth');
const userRoutes = require('./routes/users');
const holidayRoutes = require('./routes/holidays');
const poetryRoutes = require('./routes/poetry');

const app = express();

const parseBody = async (req) => {
  if (['GET', 'HEAD'].includes(req.method)) {
    req.body = {};
    return;
  }

  const chunks = [];
  let size = 0;
  const limit = 10 * 1024 * 1024;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) {
      const error = new Error('请求体超过 10MB 限制');
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  if (!rawBody) {
    req.body = {};
    return;
  }

  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    req.body = JSON.parse(rawBody);
    return;
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    req.body = Object.fromEntries(new URLSearchParams(rawBody));
    return;
  }

  req.body = rawBody;
};

// 安全中间件
app.use(helmet());

// 限流中间件（在 Workers 环境下禁用，交由 Cloudflare WAF 限流以规避 global scope 定时器限制）
const isWorker = typeof globalThis.navigator !== 'undefined' && globalThis.navigator.userAgent === 'Cloudflare-Workers';

if (!isWorker) {
  const rateLimit = require('express-rate-limit');
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 开发环境放宽限制
    message: '请求过于频繁，请稍后再试',
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);
} else {
  app.use((req, res, next) => next());
}

// CORS配置
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// 解析中间件
app.use(async (req, res, next) => {
  try {
    await parseBody(req);
    next();
  } catch (error) {
    next(error);
  }
});

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// 路由
app.use('/api/software', softwareRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/poetry', poetryRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: '接口不存在',
    path: req.originalUrl 
  });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({ 
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? error.message : '请稍后重试'
  });
});

module.exports = app;
