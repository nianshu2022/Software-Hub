const app = require('./app');
const { testConnection } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

// 启动服务器
const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
      console.log(`📊 环境: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
};

startServer();
