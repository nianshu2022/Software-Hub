const { env } = require('cloudflare:workers');

const pool = {
  execute: async (sql, params = []) => {
    // Cloudflare D1 uses prepare().bind().all() for reads, and prepare().bind().run() for writes.
    const isSelect = /^\s*(SELECT|SHOW|PRAGMA|WITH)\b/i.test(sql);
    
    try {
      const stmt = env.DB.prepare(sql).bind(...params);
      
      if (isSelect) {
        const res = await stmt.all();
        return [res.results || [], null];
      } else {
        const res = await stmt.run();
        return [{
          insertId: res.meta.last_row_id || null,
          affectedRows: res.meta.changes || 0
        }, null];
      }
    } catch (error) {
      console.error('D1 Query Error:', error);
      throw error;
    }
  }
};

const testConnection = async () => {
  try {
    // Run a simple query to verify D1 is working
    await pool.execute('SELECT 1');
    console.log('✅ D1 数据库连接测试成功');
  } catch (error) {
    console.error('❌ D1 数据库连接测试失败:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection
};
