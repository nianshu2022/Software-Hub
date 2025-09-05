const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const router = express.Router();

// 获取软件列表
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量必须在1-100之间'),
  query('category').optional().isInt().withMessage('分类ID必须是整数'),
  query('platform').optional().isIn(['Windows', 'macOS', 'Linux', 'Web', 'Mobile', 'Cross-platform']),
  query('search').optional().isLength({ min: 1, max: 100 }).withMessage('搜索关键词长度必须在1-100之间'),
  query('featured').optional().isBoolean().withMessage('推荐参数必须是布尔值')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 12,
      category,
      platform,
      search,
      featured
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = ['s.is_active = 1'];
    let queryParams = [];

    // 构建查询条件
    if (category) {
      whereConditions.push('s.category_id = ?');
      queryParams.push(category);
    }

    if (platform) {
      whereConditions.push('s.platform = ?');
      queryParams.push(platform);
    }

    if (featured === 'true') {
      whereConditions.push('s.is_featured = 1');
    }

    if (search) {
      whereConditions.push('(s.name LIKE ? OR s.description LIKE ? OR s.developer LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    // 查询软件列表
    const softwareQuery = `
      SELECT 
        s.*,
        c.name as category_name,
        c.icon as category_icon
      FROM software s
      LEFT JOIN categories c ON s.category_id = c.id
      ${whereClause}
      ORDER BY s.is_featured DESC, s.download_count DESC, s.created_at DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM software s
      ${whereClause}
    `;

    const [softwareRows] = await pool.execute(softwareQuery, queryParams);
    const [countRows] = await pool.execute(countQuery, queryParams);

    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: softwareRows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('获取软件列表失败:', error);
    res.status(500).json({ error: '获取软件列表失败' });
  }
});

// 获取软件详情
router.get('/:id', [
  param('id').isInt().withMessage('软件ID必须是整数')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const [rows] = await pool.execute(`
      SELECT 
        s.*,
        c.name as category_name,
        c.icon as category_icon
      FROM software s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.id = ? AND s.is_active = 1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: '软件不存在' });
    }

    // 增加下载次数
    await pool.execute(
      'UPDATE software SET download_count = download_count + 1 WHERE id = ?',
      [id]
    );

    res.json({ data: rows[0] });
  } catch (error) {
    console.error('获取软件详情失败:', error);
    res.status(500).json({ error: '获取软件详情失败' });
  }
});

// 创建软件（需要认证）
router.post('/', [
  body('name').notEmpty().withMessage('软件名称不能为空'),
  body('description').notEmpty().withMessage('软件描述不能为空'),
  body('download_url').isURL().withMessage('下载链接必须是有效的URL'),
  body('category_id').optional().custom((value) => {
    if (value === null || value === undefined || value === '') {
      return true; // 允许为空
    }
    return Number.isInteger(Number(value));
  }).withMessage('分类ID必须是整数'),
  body('platform').optional().isIn(['Windows', 'macOS', 'Linux', 'Web', 'Mobile', 'Cross-platform']),
  body('official_url').optional().custom((value) => {
    if (!value || value.trim() === '') {
      return true; // 允许为空
    }
    return require('validator').isURL(value);
  }).withMessage('官方网站链接必须是有效的URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('验证错误:', errors.array());
      console.log('请求数据:', req.body);
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      version,
      download_url,
      official_url,
      category_id,
      icon_url,
      screenshot_urls,
      tags,
      file_size,
      platform = 'Windows',
      license_type,
      developer,
      release_date,
      last_updated,
      is_featured = false
    } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO software (
        name, description, version, download_url, official_url, category_id,
        icon_url, screenshot_urls, tags, file_size, platform, license_type,
        developer, release_date, last_updated, download_count, rating, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name, description, version, download_url, official_url, category_id,
      icon_url ? JSON.stringify(icon_url) : null,
      screenshot_urls ? JSON.stringify(screenshot_urls) : null,
      tags ? JSON.stringify(tags) : null,
      file_size, platform, license_type, developer, release_date, last_updated, 
      0, 0.0, is_featured
    ]);

    res.status(201).json({
      message: '软件创建成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('创建软件失败:', error);
    res.status(500).json({ error: '创建软件失败' });
  }
});

// 更新软件（需要认证）
router.put('/:id', [
  param('id').isInt().withMessage('软件ID必须是整数'),
  body('name').optional().notEmpty().withMessage('软件名称不能为空'),
  body('download_url').optional().isURL().withMessage('下载链接必须是有效的URL'),
  body('official_url').optional().isURL().withMessage('官方网站链接必须是有效的URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // 检查软件是否存在
    const [existing] = await pool.execute(
      'SELECT id FROM software WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: '软件不存在' });
    }

    // 构建更新语句
    const updateFields = [];
    const updateValues = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        if (['screenshot_urls', 'tags'].includes(key)) {
          updateFields.push(`${key} = ?`);
          updateValues.push(JSON.stringify(updateData[key]));
        } else {
          updateFields.push(`${key} = ?`);
          updateValues.push(updateData[key]);
        }
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: '没有提供更新数据' });
    }

    updateValues.push(id);

    await pool.execute(`
      UPDATE software 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, updateValues);

    res.json({ message: '软件更新成功' });
  } catch (error) {
    console.error('更新软件失败:', error);
    res.status(500).json({ error: '更新软件失败' });
  }
});

// 删除软件（需要认证）
router.delete('/:id', [
  param('id').isInt().withMessage('软件ID必须是整数')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM software WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '软件不存在' });
    }

    res.json({ message: '软件删除成功' });
  } catch (error) {
    console.error('删除软件失败:', error);
    res.status(500).json({ error: '删除软件失败' });
  }
});

module.exports = router;
