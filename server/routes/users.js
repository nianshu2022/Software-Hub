const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// 获取用户列表 - 需要管理员权限
router.get('/', authenticateToken, async (req, res) => {
  try {
    // 检查当前用户是否为管理员
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '权限不足，需要管理员权限' });
    }

    const [rows] = await pool.execute(`
      SELECT 
        id, 
        username, 
        email, 
        role, 
        created_at, 
        last_login,
        is_active
      FROM users 
      ORDER BY created_at DESC
    `);

    res.json({ 
      success: true, 
      users: rows 
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({ error: '获取用户列表失败' });
  }
});

// 更新用户角色 - 需要管理员权限
router.put('/:id/role', authenticateToken, async (req, res) => {
  try {
    // 检查当前用户是否为管理员
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '权限不足，需要管理员权限' });
    }

    const { id } = req.params;
    const { role } = req.body;

    // 验证角色
    if (!['admin', 'editor'].includes(role)) {
      return res.status(400).json({ error: '无效的角色' });
    }

    // 不能修改自己的角色
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: '不能修改自己的角色' });
    }

    const [result] = await pool.execute(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({ 
      success: true, 
      message: '用户角色更新成功' 
    });
  } catch (error) {
    console.error('更新用户角色失败:', error);
    res.status(500).json({ error: '更新用户角色失败' });
  }
});

// 删除用户 - 需要管理员权限
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // 检查当前用户是否为管理员
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '权限不足，需要管理员权限' });
    }

    const { id } = req.params;

    // 不能删除自己
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: '不能删除自己' });
    }

    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({ 
      success: true, 
      message: '用户删除成功' 
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({ error: '删除用户失败' });
  }
});

// 获取用户详情 - 需要管理员权限
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // 检查当前用户是否为管理员
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '权限不足，需要管理员权限' });
    }

    const { id } = req.params;

    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at, last_login, is_active FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({ 
      success: true, 
      user: rows[0] 
    });
  } catch (error) {
    console.error('获取用户详情失败:', error);
    res.status(500).json({ error: '获取用户详情失败' });
  }
});

module.exports = router;
