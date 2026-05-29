const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// 获取随机古诗词
router.get('/random', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM poetry 
      ORDER BY RANDOM() 
      LIMIT 1
    `);
    
    if (rows.length === 0) {
      return res.json({ success: true, data: null, message: '暂无古诗词数据' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('获取随机古诗词失败:', error);
    res.status(500).json({ success: false, message: '获取随机古诗词失败' });
  }
});

// 获取推荐古诗词
router.get('/featured', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM poetry 
      WHERE is_featured = 1 
      ORDER BY RANDOM() 
      LIMIT 1
    `);
    
    if (rows.length === 0) {
      // 如果没有推荐诗词，返回随机一首
      const [randomRows] = await pool.execute(`
        SELECT * FROM poetry 
        ORDER BY RANDOM() 
        LIMIT 1
      `);
      return res.json({ success: true, data: randomRows[0] || null });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('获取推荐古诗词失败:', error);
    res.status(500).json({ success: false, message: '获取推荐古诗词失败' });
  }
});

// 获取所有古诗词
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, author, dynasty, search } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let params = [];
    
    if (author) {
      whereClause += ' AND author LIKE ?';
      params.push(`%${author}%`);
    }
    
    if (dynasty) {
      whereClause += ' AND dynasty = ?';
      params.push(dynasty);
    }
    
    if (search) {
      whereClause += ' AND (title LIKE ? OR author LIKE ? OR content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    const [rows] = await pool.execute(`
      SELECT * FROM poetry 
      WHERE 1=1 ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);
    
    // 获取总数
    const [countRows] = await pool.execute(`
      SELECT COUNT(*) as total FROM poetry 
      WHERE 1=1 ${whereClause}
    `, params);
    
    res.json({ 
      success: true, 
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countRows[0].total,
        pages: Math.ceil(countRows[0].total / limit)
      }
    });
  } catch (error) {
    console.error('获取古诗词列表失败:', error);
    res.status(500).json({ success: false, message: '获取古诗词列表失败' });
  }
});

// 根据ID获取古诗词详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(`
      SELECT * FROM poetry WHERE id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '古诗词不存在' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('获取古诗词详情失败:', error);
    res.status(500).json({ success: false, message: '获取古诗词详情失败' });
  }
});

// 添加古诗词（管理员功能）
router.post('/', async (req, res) => {
  try {
    const { title, author, dynasty, content, translation, notes, tags, is_featured } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO poetry (title, author, dynasty, content, translation, notes, tags, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, author, dynasty, content, translation, notes, JSON.stringify(tags || []), is_featured]);
    
    res.json({ 
      success: true, 
      message: '古诗词添加成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('添加古诗词失败:', error);
    res.status(500).json({ success: false, message: '添加古诗词失败' });
  }
});

// 更新古诗词（管理员功能）
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, dynasty, content, translation, notes, tags, is_featured } = req.body;
    
    await pool.execute(`
      UPDATE poetry 
      SET title = ?, author = ?, dynasty = ?, content = ?, translation = ?, notes = ?, tags = ?, is_featured = ?
      WHERE id = ?
    `, [title, author, dynasty, content, translation, notes, JSON.stringify(tags || []), is_featured, id]);
    
    res.json({ success: true, message: '古诗词更新成功' });
  } catch (error) {
    console.error('更新古诗词失败:', error);
    res.status(500).json({ success: false, message: '更新古诗词失败' });
  }
});

// 删除古诗词（管理员功能）
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.execute('DELETE FROM poetry WHERE id = ?', [id]);
    
    res.json({ success: true, message: '古诗词删除成功' });
  } catch (error) {
    console.error('删除古诗词失败:', error);
    res.status(500).json({ success: false, message: '删除古诗词失败' });
  }
});

module.exports = router;
