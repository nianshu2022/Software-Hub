import bcrypt from 'bcryptjs';

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'access-control-allow-headers': 'Content-Type,Authorization'
};

const securityHeaders = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'SAMEORIGIN',
  'referrer-policy': 'no-referrer'
};

const selectPattern = /^\s*(SELECT|SHOW|PRAGMA|WITH)\b/i;
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const response = (data, status = 200) => Response.json(data, {
  status,
  headers: { ...jsonHeaders, ...securityHeaders }
});

const notFound = (path) => response({ error: '接口不存在', path }, 404);

const execute = async (env, sql, params = []) => {
  const stmt = env.DB.prepare(sql).bind(...params);
  if (selectPattern.test(sql)) {
    const result = await stmt.all();
    return [result.results || []];
  }

  const result = await stmt.run();
  return [{
    insertId: result.meta?.last_row_id || null,
    affectedRows: result.meta?.changes || 0
  }];
};

const readJson = async (request) => {
  if (['GET', 'HEAD'].includes(request.method)) return {};
  const text = await request.text();
  if (!text) return {};
  return JSON.parse(text);
};

const normalizePath = (pathname) => {
  if (pathname === '/api') return '/';
  return pathname.startsWith('/api/') ? pathname.slice(4) : pathname;
};

const base64UrlEncode = (input) => {
  const bytes = input instanceof Uint8Array ? input : textEncoder.encode(input);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const base64UrlDecode = (input) => {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const jwtSecret = (env) => env.JWT_SECRET || 'default_secret';

const signToken = async (env, payload) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const body = { ...payload, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 };
  const data = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(body))}`;
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(jwtSecret(env)),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(data));
  return `${data}.${base64UrlEncode(new Uint8Array(signature))}`;
};

const verifyToken = async (env, token) => {
  const parts = token?.split('.');
  if (!parts || parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(jwtSecret(env)),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlDecode(encodedSignature),
    textEncoder.encode(data)
  );
  if (!isValid) return null;

  const payload = JSON.parse(textDecoder.decode(base64UrlDecode(encodedPayload)));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
};

const currentUser = async (request, env) => {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  return verifyToken(env, token);
};

const requireUser = async (request, env) => {
  const user = await currentUser(request, env);
  if (!user) throw Object.assign(new Error('访问令牌无效'), { status: 401 });
  return user;
};

const requireAdmin = async (request, env) => {
  const user = await requireUser(request, env);
  if (user.role !== 'admin') throw Object.assign(new Error('权限不足，需要管理员权限'), { status: 403 });
  return user;
};

const listSoftware = async (request, env) => {
  const url = new URL(request.url);
  const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '12', 10), 1), 100);
  const offset = (page - 1) * limit;
  const category = url.searchParams.get('category');
  const platform = url.searchParams.get('platform');
  const search = url.searchParams.get('search');
  const featured = url.searchParams.get('featured');
  const where = ['s.is_active = 1'];
  const params = [];

  if (category) {
    where.push('s.category_id = ?');
    params.push(category);
  }
  if (platform) {
    where.push('s.platform = ?');
    params.push(platform);
  }
  if (featured === 'true') {
    where.push('s.is_featured = 1');
  }
  if (search) {
    where.push('(s.name LIKE ? OR s.description LIKE ? OR s.developer LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const whereClause = `WHERE ${where.join(' AND ')}`;
  const [rows] = await execute(env, `
    SELECT s.*, c.name as category_name, c.icon as category_icon
    FROM software s
    LEFT JOIN categories c ON s.category_id = c.id
    ${whereClause}
    ORDER BY s.is_featured DESC, s.download_count DESC, s.created_at DESC
    LIMIT ? OFFSET ?
  `, [...params, limit, offset]);
  const [countRows] = await execute(env, `SELECT COUNT(*) as total FROM software s ${whereClause}`, params);
  const total = countRows[0]?.total || 0;

  return response({
    data: rows,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  });
};

const softwareDetail = async (request, env, id) => {
  const [rows] = await execute(env, `
    SELECT s.*, c.name as category_name, c.icon as category_icon
    FROM software s
    LEFT JOIN categories c ON s.category_id = c.id
    WHERE s.id = ? AND s.is_active = 1
  `, [id]);
  if (rows.length === 0) return response({ error: '软件不存在' }, 404);
  await execute(env, 'UPDATE software SET download_count = download_count + 1 WHERE id = ?', [id]);
  return response({ data: rows[0] });
};

const createSoftware = async (request, env) => {
  const body = await readJson(request);
  if (!body.name || !body.description || !body.download_url) {
    return response({ error: '软件名称、描述和下载链接不能为空' }, 400);
  }

  const [result] = await execute(env, `
    INSERT INTO software (
      name, description, version, download_url, official_url, category_id,
      icon_url, screenshot_urls, tags, file_size, platform, license_type,
      developer, release_date, last_updated, download_count, rating, is_featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    body.name, body.description, body.version, body.download_url, body.official_url, body.category_id,
    body.icon_url ? JSON.stringify(body.icon_url) : null,
    body.screenshot_urls ? JSON.stringify(body.screenshot_urls) : null,
    body.tags ? JSON.stringify(body.tags) : null,
    body.file_size, body.platform || 'Windows', body.license_type, body.developer, body.release_date,
    body.last_updated, 0, 0, body.is_featured ? 1 : 0
  ]);
  return response({ message: '软件创建成功', data: { id: result.insertId } }, 201);
};

const updateSoftware = async (request, env, id) => {
  const body = await readJson(request);
  const allowed = [
    'name', 'description', 'version', 'download_url', 'official_url', 'category_id',
    'icon_url', 'screenshot_urls', 'tags', 'file_size', 'platform', 'license_type',
    'developer', 'release_date', 'last_updated', 'is_featured', 'is_active'
  ];
  const fields = [];
  const values = [];

  for (const key of allowed) {
    if (body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(['screenshot_urls', 'tags'].includes(key) ? JSON.stringify(body[key]) : body[key]);
    }
  }

  if (fields.length === 0) return response({ error: '没有提供更新数据' }, 400);
  const [result] = await execute(env, `UPDATE software SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [...values, id]);
  if (result.affectedRows === 0) return response({ error: '软件不存在' }, 404);
  return response({ message: '软件更新成功' });
};

const deleteSoftware = async (env, id) => {
  const [result] = await execute(env, 'DELETE FROM software WHERE id = ?', [id]);
  if (result.affectedRows === 0) return response({ error: '软件不存在' }, 404);
  return response({ message: '软件删除成功' });
};

const listCategories = async (env) => {
  const [rows] = await execute(env, `
    SELECT c.*, COUNT(s.id) as software_count
    FROM categories c
    LEFT JOIN software s ON c.id = s.category_id AND s.is_active = 1
    GROUP BY c.id
    ORDER BY c.sort_order ASC, c.name ASC
  `);
  return response({ data: rows });
};

const categoryDetail = async (env, id) => {
  const [rows] = await execute(env, `
    SELECT c.*, COUNT(s.id) as software_count
    FROM categories c
    LEFT JOIN software s ON c.id = s.category_id AND s.is_active = 1
    WHERE c.id = ?
    GROUP BY c.id
  `, [id]);
  if (rows.length === 0) return response({ error: '分类不存在' }, 404);
  return response({ data: rows[0] });
};

const createCategory = async (request, env) => {
  const body = await readJson(request);
  if (!body.name) return response({ error: '分类名称不能为空' }, 400);
  const [existing] = await execute(env, 'SELECT id FROM categories WHERE name = ?', [body.name]);
  if (existing.length > 0) return response({ error: '分类名称已存在' }, 400);
  const [result] = await execute(env, 'INSERT INTO categories (name, description, icon, sort_order) VALUES (?, ?, ?, ?)', [
    body.name, body.description, body.icon, body.sort_order || 0
  ]);
  return response({ message: '分类创建成功', data: { id: result.insertId } }, 201);
};

const updateCategory = async (request, env, id) => {
  const body = await readJson(request);
  const fields = [];
  const values = [];
  for (const key of ['name', 'description', 'icon', 'sort_order']) {
    if (body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(body[key]);
    }
  }
  if (fields.length === 0) return response({ error: '没有提供更新数据' }, 400);
  const [result] = await execute(env, `UPDATE categories SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [...values, id]);
  if (result.affectedRows === 0) return response({ error: '分类不存在' }, 404);
  return response({ message: '分类更新成功' });
};

const deleteCategory = async (env, id) => {
  const [softwareCount] = await execute(env, 'SELECT COUNT(*) as count FROM software WHERE category_id = ?', [id]);
  if ((softwareCount[0]?.count || 0) > 0) return response({ error: '无法删除分类，该分类下还有软件' }, 400);
  const [result] = await execute(env, 'DELETE FROM categories WHERE id = ?', [id]);
  if (result.affectedRows === 0) return response({ error: '分类不存在' }, 404);
  return response({ message: '分类删除成功' });
};

const register = async (request, env) => {
  const body = await readJson(request);
  if (!body.username || !body.email || !body.password) return response({ error: '用户名、邮箱和密码不能为空' }, 400);
  const [existing] = await execute(env, 'SELECT id FROM users WHERE username = ? OR email = ?', [body.username, body.email]);
  if (existing.length > 0) return response({ error: '用户名或邮箱已存在' }, 400);
  const passwordHash = await bcrypt.hash(body.password, 10);
  const [result] = await execute(env, "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'editor')", [
    body.username, body.email, passwordHash
  ]);
  return response({ message: '注册成功', data: { id: result.insertId, username: body.username } }, 201);
};

const login = async (request, env) => {
  const body = await readJson(request);
  const [users] = await execute(env, 'SELECT * FROM users WHERE (username = ? OR email = ?) AND is_active = 1', [body.username, body.username]);
  const user = users[0];
  if (!user || !(await bcrypt.compare(body.password || '', user.password_hash))) {
    return response({ error: '用户名或密码错误' }, 401);
  }
  const token = await signToken(env, { id: user.id, username: user.username, role: user.role });
  return response({
    message: '登录成功',
    data: {
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    }
  });
};

const me = async (request, env) => {
  const user = await requireUser(request, env);
  const [users] = await execute(env, 'SELECT id, username, email, role, created_at FROM users WHERE id = ?', [user.id]);
  if (users.length === 0) return response({ error: '用户不存在' }, 404);
  return response({ data: users[0] });
};

const changePassword = async (request, env) => {
  const user = await requireUser(request, env);
  const body = await readJson(request);
  const [users] = await execute(env, 'SELECT password_hash FROM users WHERE id = ?', [user.id]);
  if (users.length === 0) return response({ error: '用户不存在' }, 404);
  if (!(await bcrypt.compare(body.oldPassword || '', users[0].password_hash))) {
    return response({ error: '原密码错误' }, 400);
  }
  const hash = await bcrypt.hash(body.newPassword || '', 10);
  await execute(env, 'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [hash, user.id]);
  return response({ message: '密码修改成功' });
};

const listUsers = async (request, env) => {
  await requireAdmin(request, env);
  const [rows] = await execute(env, `
    SELECT id, username, email, role, created_at, last_login, is_active
    FROM users
    ORDER BY created_at DESC
  `);
  return response({ success: true, users: rows });
};

const userDetail = async (request, env, id) => {
  await requireAdmin(request, env);
  const [rows] = await execute(env, 'SELECT id, username, email, role, created_at, last_login, is_active FROM users WHERE id = ?', [id]);
  if (rows.length === 0) return response({ error: '用户不存在' }, 404);
  return response({ success: true, user: rows[0] });
};

const updateUserRole = async (request, env, id) => {
  const user = await requireAdmin(request, env);
  const body = await readJson(request);
  if (!['admin', 'editor'].includes(body.role)) return response({ error: '无效的角色' }, 400);
  if (parseInt(id, 10) === user.id) return response({ error: '不能修改自己的角色' }, 400);
  const [result] = await execute(env, 'UPDATE users SET role = ? WHERE id = ?', [body.role, id]);
  if (result.affectedRows === 0) return response({ error: '用户不存在' }, 404);
  return response({ success: true, message: '用户角色更新成功' });
};

const deleteUser = async (request, env, id) => {
  const user = await requireAdmin(request, env);
  if (parseInt(id, 10) === user.id) return response({ error: '不能删除自己' }, 400);
  const [result] = await execute(env, 'DELETE FROM users WHERE id = ?', [id]);
  if (result.affectedRows === 0) return response({ error: '用户不存在' }, 404);
  return response({ success: true, message: '用户删除成功' });
};

const listHolidays = async (env) => {
  const [rows] = await execute(env, 'SELECT * FROM holidays ORDER BY date ASC');
  return response({ success: true, data: rows });
};

const holidaysByYear = async (env, year) => {
  const [rows] = await execute(env, 'SELECT * FROM holidays WHERE year = ? ORDER BY date ASC', [year]);
  return response({ success: true, data: rows });
};

const nextHoliday = async (env) => {
  const today = new Date().toISOString().split('T')[0];
  const [rows] = await execute(env, 'SELECT * FROM holidays WHERE date >= ? ORDER BY date ASC LIMIT 1', [today]);
  if (rows.length === 0) return response({ success: true, data: null, message: '暂无节假日信息' });
  const daysUntil = Math.ceil((new Date(rows[0].date) - new Date(today)) / (1000 * 60 * 60 * 24));
  return response({ success: true, data: { ...rows[0], daysUntil } });
};

const createHoliday = async (request, env) => {
  const body = await readJson(request);
  const [result] = await execute(env, 'INSERT INTO holidays (name, date, type, is_workday, description, year) VALUES (?, ?, ?, ?, ?, ?)', [
    body.name, body.date, body.type, body.is_workday, body.description, body.year
  ]);
  return response({ success: true, message: '节假日添加成功', data: { id: result.insertId } });
};

const updateHoliday = async (request, env, id) => {
  const body = await readJson(request);
  await execute(env, 'UPDATE holidays SET name = ?, date = ?, type = ?, is_workday = ?, description = ?, year = ? WHERE id = ?', [
    body.name, body.date, body.type, body.is_workday, body.description, body.year, id
  ]);
  return response({ success: true, message: '节假日更新成功' });
};

const deleteHoliday = async (env, id) => {
  await execute(env, 'DELETE FROM holidays WHERE id = ?', [id]);
  return response({ success: true, message: '节假日删除成功' });
};

const randomPoetry = async (env, featured = false) => {
  const [rows] = await execute(env, featured
    ? 'SELECT * FROM poetry WHERE is_featured = 1 ORDER BY RANDOM() LIMIT 1'
    : 'SELECT * FROM poetry ORDER BY RANDOM() LIMIT 1');
  if (rows.length === 0 && featured) return randomPoetry(env, false);
  if (rows.length === 0) return response({ success: true, data: null, message: '暂无古诗词数据' });
  return response({ success: true, data: rows[0] });
};

const listPoetry = async (request, env) => {
  const url = new URL(request.url);
  const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '20', 10), 1), 100);
  const author = url.searchParams.get('author');
  const dynasty = url.searchParams.get('dynasty');
  const search = url.searchParams.get('search');
  let where = 'WHERE 1=1';
  const params = [];

  if (author) {
    where += ' AND author LIKE ?';
    params.push(`%${author}%`);
  }
  if (dynasty) {
    where += ' AND dynasty = ?';
    params.push(dynasty);
  }
  if (search) {
    where += ' AND (title LIKE ? OR author LIKE ? OR content LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const [rows] = await execute(env, `SELECT * FROM poetry ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [
    ...params, limit, (page - 1) * limit
  ]);
  const [countRows] = await execute(env, `SELECT COUNT(*) as total FROM poetry ${where}`, params);
  const total = countRows[0]?.total || 0;
  return response({ success: true, data: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};

const poetryDetail = async (env, id) => {
  const [rows] = await execute(env, 'SELECT * FROM poetry WHERE id = ?', [id]);
  if (rows.length === 0) return response({ success: false, message: '古诗词不存在' }, 404);
  return response({ success: true, data: rows[0] });
};

const createPoetry = async (request, env) => {
  const body = await readJson(request);
  const [result] = await execute(env, 'INSERT INTO poetry (title, author, dynasty, content, translation, notes, tags, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
    body.title, body.author, body.dynasty, body.content, body.translation, body.notes, JSON.stringify(body.tags || []), body.is_featured ? 1 : 0
  ]);
  return response({ success: true, message: '古诗词添加成功', data: { id: result.insertId } });
};

const updatePoetry = async (request, env, id) => {
  const body = await readJson(request);
  await execute(env, 'UPDATE poetry SET title = ?, author = ?, dynasty = ?, content = ?, translation = ?, notes = ?, tags = ?, is_featured = ? WHERE id = ?', [
    body.title, body.author, body.dynasty, body.content, body.translation, body.notes, JSON.stringify(body.tags || []), body.is_featured ? 1 : 0, id
  ]);
  return response({ success: true, message: '古诗词更新成功' });
};

const deletePoetry = async (env, id) => {
  await execute(env, 'DELETE FROM poetry WHERE id = ?', [id]);
  return response({ success: true, message: '古诗词删除成功' });
};

const route = async (request, env) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: jsonHeaders });

  const url = new URL(request.url);
  const path = normalizePath(url.pathname);
  const segments = path.split('/').filter(Boolean);
  const [resource, id, action] = segments;
  const method = request.method;

  if (path === '/health' && method === 'GET') {
    return response({ status: 'OK', timestamp: new Date().toISOString(), version: '1.0.0' });
  }

  if (resource === 'software') {
    if (!id && method === 'GET') return listSoftware(request, env);
    if (id && !action && method === 'GET') return softwareDetail(request, env, id);
    if (!id && method === 'POST') return createSoftware(request, env);
    if (id && !action && method === 'PUT') return updateSoftware(request, env, id);
    if (id && !action && method === 'DELETE') return deleteSoftware(env, id);
  }

  if (resource === 'categories') {
    if (!id && method === 'GET') return listCategories(env);
    if (id && method === 'GET') return categoryDetail(env, id);
    if (!id && method === 'POST') return createCategory(request, env);
    if (id && method === 'PUT') return updateCategory(request, env, id);
    if (id && method === 'DELETE') return deleteCategory(env, id);
  }

  if (resource === 'auth') {
    if (id === 'register' && method === 'POST') return register(request, env);
    if (id === 'login' && method === 'POST') return login(request, env);
    if (id === 'me' && method === 'GET') return me(request, env);
    if (id === 'password' && method === 'PUT') return changePassword(request, env);
  }

  if (resource === 'users') {
    if (!id && method === 'GET') return listUsers(request, env);
    if (id && action === 'role' && method === 'PUT') return updateUserRole(request, env, id);
    if (id && !action && method === 'GET') return userDetail(request, env, id);
    if (id && !action && method === 'DELETE') return deleteUser(request, env, id);
  }

  if (resource === 'holidays') {
    if (!id && method === 'GET') return listHolidays(env);
    if (id === 'year' && action && method === 'GET') return holidaysByYear(env, action);
    if (id === 'next' && method === 'GET') return nextHoliday(env);
    if (!id && method === 'POST') return createHoliday(request, env);
    if (id && method === 'PUT') return updateHoliday(request, env, id);
    if (id && method === 'DELETE') return deleteHoliday(env, id);
  }

  if (resource === 'poetry') {
    if (id === 'random' && method === 'GET') return randomPoetry(env);
    if (id === 'featured' && method === 'GET') return randomPoetry(env, true);
    if (!id && method === 'GET') return listPoetry(request, env);
    if (id && method === 'GET') return poetryDetail(env, id);
    if (!id && method === 'POST') return createPoetry(request, env);
    if (id && method === 'PUT') return updatePoetry(request, env, id);
    if (id && method === 'DELETE') return deletePoetry(env, id);
  }

  return notFound(url.pathname);
};

export default {
  async fetch(request, env) {
    try {
      return await route(request, env);
    } catch (error) {
      console.error('Worker error:', error);
      return response({
        error: error.status === 401 ? '访问令牌无效' : error.status === 403 ? error.message : '服务器内部错误',
        message: env.NODE_ENV === 'development' ? error.message : '请稍后重试'
      }, error.status || 500);
    }
  }
};
