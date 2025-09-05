const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const router = express.Router();

// 获取所有分类
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        c.*,
        COUNT(s.id) as software_count
      FROM categories c
      LEFT JOIN software s ON c.id = s.category_id AND s.is_active = 1
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
    `);

    res.json({ data: rows });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    res.status(500).json({ error: '获取分类列表失败' });
  }
});

// 获取分类详情
router.get('/:id', [
  param('id').isInt().withMessage('分类ID必须是整数')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const [rows] = await pool.execute(`
      SELECT 
        c.*,
        COUNT(s.id) as software_count
      FROM categories c
      LEFT JOIN software s ON c.id = s.category_id AND s.is_active = 1
      WHERE c.id = ?
      GROUP BY c.id
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: '分类不存在' });
    }

    res.json({ data: rows[0] });
  } catch (error) {
    console.error('获取分类详情失败:', error);
    res.status(500).json({ error: '获取分类详情失败' });
  }
});

// 创建分类（需要认证）
router.post('/', [
  body('name').notEmpty().withMessage('分类名称不能为空'),
  body('description').optional().isLength({ max: 500 }).withMessage('描述长度不能超过500字符'),
  body('icon').optional().isLength({ max: 100 }).withMessage('图标名称长度不能超过100字符'),
  body('sort_order').optional().isInt({ min: 0 }).withMessage('排序值必须是非负整数')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, icon, sort_order = 0 } = req.body;

    // 检查分类名称是否已存在
    const [existing] = await pool.execute(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: '分类名称已存在' });
    }

    const [result] = await pool.execute(`
      INSERT INTO categories (name, description, icon, sort_order)
      VALUES (?, ?, ?, ?)
    `, [name, description, icon, sort_order]);

    res.status(201).json({
      message: '分类创建成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('创建分类失败:', error);
    res.status(500).json({ error: '创建分类失败' });
  }
});

// 更新分类（需要认证）
router.put('/:id', [
  param('id').isInt().withMessage('分类ID必须是整数'),
  body('name').optional().notEmpty().withMessage('分类名称不能为空'),
  body('description').optional().isLength({ max: 500 }).withMessage('描述长度不能超过500字符'),
  body('icon').optional().isLength({ max: 100 }).withMessage('图标名称长度不能超过100字符'),
  body('sort_order').optional().isInt({ min: 0 }).withMessage('排序值必须是非负整数')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, icon, sort_order } = req.body;

    // 检查分类是否存在
    const [existing] = await pool.execute(
      'SELECT id FROM categories WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: '分类不存在' });
    }

    // 如果更新名称，检查是否与其他分类重名
    if (name) {
      const [duplicate] = await pool.execute(
        'SELECT id FROM categories WHERE name = ? AND id != ?',
        [name, id]
      );

      if (duplicate.length > 0) {
        return res.status(400).json({ error: '分类名称已存在' });
      }
    }

    // 构建更新语句
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (icon !== undefined) {
      updateFields.push('icon = ?');
      updateValues.push(icon);
    }
    if (sort_order !== undefined) {
      updateFields.push('sort_order = ?');
      updateValues.push(sort_order);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: '没有提供更新数据' });
    }

    updateValues.push(id);

    await pool.execute(`
      UPDATE categories 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, updateValues);

    res.json({ message: '分类更新成功' });
  } catch (error) {
    console.error('更新分类失败:', error);
    res.status(500).json({ error: '更新分类失败' });
  }
});

// 删除分类（需要认证）
router.delete('/:id', [
  param('id').isInt().withMessage('分类ID必须是整数')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // 检查是否有软件使用此分类
    const [softwareCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM software WHERE category_id = ?',
      [id]
    );

    if (softwareCount[0].count > 0) {
      return res.status(400).json({ 
        error: '无法删除分类，该分类下还有软件' 
      });
    }

    const [result] = await pool.execute(
      'DELETE FROM categories WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '分类不存在' });
    }

    res.json({ message: '分类删除成功' });
  } catch (error) {
    console.error('删除分类失败:', error);
    res.status(500).json({ error: '删除分类失败' });
  }
});

module.exports = router;
