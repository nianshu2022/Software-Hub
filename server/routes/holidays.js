const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// 获取所有节假日
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM holidays 
      ORDER BY date ASC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('获取节假日数据失败:', error);
    res.status(500).json({ success: false, message: '获取节假日数据失败' });
  }
});

// 获取指定年份的节假日
router.get('/year/:year', async (req, res) => {
  try {
    const { year } = req.params;
    const [rows] = await pool.execute(`
      SELECT * FROM holidays 
      WHERE year = ? 
      ORDER BY date ASC
    `, [year]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('获取节假日数据失败:', error);
    res.status(500).json({ success: false, message: '获取节假日数据失败' });
  }
});

// 获取下一个节假日
router.get('/next', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await pool.execute(`
      SELECT * FROM holidays 
      WHERE date >= ? 
      ORDER BY date ASC 
      LIMIT 1
    `, [today]);
    
    if (rows.length === 0) {
      return res.json({ success: true, data: null, message: '暂无节假日信息' });
    }
    
    const holiday = rows[0];
    const holidayDate = new Date(holiday.date);
    const todayDate = new Date(today);
    const diffTime = holidayDate - todayDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    res.json({ 
      success: true, 
      data: {
        ...holiday,
        daysUntil: diffDays
      }
    });
  } catch (error) {
    console.error('获取下一个节假日失败:', error);
    res.status(500).json({ success: false, message: '获取下一个节假日失败' });
  }
});

// 添加节假日（管理员功能）
router.post('/', async (req, res) => {
  try {
    const { name, date, type, is_workday, description, year } = req.body;
    
    const [result] = await db.execute(`
      INSERT INTO holidays (name, date, type, is_workday, description, year)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, date, type, is_workday, description, year]);
    
    res.json({ 
      success: true, 
      message: '节假日添加成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('添加节假日失败:', error);
    res.status(500).json({ success: false, message: '添加节假日失败' });
  }
});

// 更新节假日（管理员功能）
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, type, is_workday, description, year } = req.body;
    
    await pool.execute(`
      UPDATE holidays 
      SET name = ?, date = ?, type = ?, is_workday = ?, description = ?, year = ?
      WHERE id = ?
    `, [name, date, type, is_workday, description, year, id]);
    
    res.json({ success: true, message: '节假日更新成功' });
  } catch (error) {
    console.error('更新节假日失败:', error);
    res.status(500).json({ success: false, message: '更新节假日失败' });
  }
});

// 删除节假日（管理员功能）
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.execute('DELETE FROM holidays WHERE id = ?', [id]);
    
    res.json({ success: true, message: '节假日删除成功' });
  } catch (error) {
    console.error('删除节假日失败:', error);
    res.status(500).json({ success: false, message: '删除节假日失败' });
  }
});

module.exports = router;
