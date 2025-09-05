# 节假日和古诗词数据库功能

## 概述

本功能将法定节假日和古诗词数据存储到数据库中，替代了原来的外部API调用，提供了更好的数据管理和更新能力。

## 数据库表结构

### 1. 法定节假日表 (holidays)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| name | VARCHAR(100) | 节假日名称 |
| date | DATE | 节假日日期 |
| type | ENUM | 节假日类型：national(法定)、traditional(传统)、international(国际) |
| is_workday | BOOLEAN | 是否工作日 |
| description | TEXT | 节假日描述 |
| year | INT | 年份 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 2. 古诗词表 (poetry)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| title | VARCHAR(200) | 诗词标题 |
| author | VARCHAR(100) | 作者 |
| dynasty | VARCHAR(50) | 朝代 |
| content | TEXT | 诗词内容 |
| translation | TEXT | 译文 |
| notes | TEXT | 注释 |
| tags | JSON | 标签数组 |
| is_featured | BOOLEAN | 是否推荐 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## API接口

### 节假日接口

- `GET /api/holidays` - 获取所有节假日
- `GET /api/holidays/year/:year` - 获取指定年份的节假日
- `GET /api/holidays/next` - 获取下一个节假日（带倒计时）
- `POST /api/holidays` - 添加节假日（管理员）
- `PUT /api/holidays/:id` - 更新节假日（管理员）
- `DELETE /api/holidays/:id` - 删除节假日（管理员）

### 古诗词接口

- `GET /api/poetry/random` - 获取随机古诗词
- `GET /api/poetry/featured` - 获取推荐古诗词
- `GET /api/poetry` - 获取古诗词列表（支持分页、搜索、筛选）
- `GET /api/poetry/:id` - 获取古诗词详情
- `POST /api/poetry` - 添加古诗词（管理员）
- `PUT /api/poetry/:id` - 更新古诗词（管理员）
- `DELETE /api/poetry/:id` - 删除古诗词（管理员）

## 初始化数据

### 方法1：使用SQL文件

```bash
# 1. 创建表结构
mysql -u root -p software_download < database/schema.sql

# 2. 插入初始数据
mysql -u root -p software_download < database/init_data.sql
```

### 方法2：使用Node.js脚本

```bash
# 1. 确保已安装依赖
npm install mysql2 dotenv

# 2. 运行初始化脚本
node database/init_holiday_poetry.js
```

## 数据管理

### 添加新的节假日

```javascript
// 通过API添加
const response = await fetch('/api/holidays', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: '春节',
    date: '2025-01-28',
    type: 'national',
    is_workday: false,
    description: '农历新年',
    year: 2025
  })
});
```

### 添加新的古诗词

```javascript
// 通过API添加
const response = await fetch('/api/poetry', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: '静夜思',
    author: '李白',
    dynasty: '唐',
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    translation: '明亮的月光洒在床前的窗户纸上...',
    notes: '李白最著名的思乡诗...',
    tags: ['思乡', '月亮', '简洁'],
    is_featured: true
  })
});
```

## 前端使用

### 获取下一个节假日

```javascript
const getHolidayCountdown = async () => {
  try {
    const response = await fetch('/api/holidays/next');
    const result = await response.json();
    
    if (result.success && result.data) {
      const holiday = result.data;
      // 处理节假日数据
      console.log('下一个节假日:', holiday.name);
      console.log('距离天数:', holiday.daysUntil);
    }
  } catch (error) {
    console.error('获取节假日失败:', error);
  }
};
```

### 获取随机古诗词

```javascript
const getPoetry = async () => {
  try {
    const response = await fetch('/api/poetry/random');
    const result = await response.json();
    
    if (result.success && result.data) {
      const poetry = result.data;
      // 处理古诗词数据
      console.log('诗词内容:', poetry.content);
      console.log('作者:', poetry.author);
      console.log('标题:', poetry.title);
    }
  } catch (error) {
    console.error('获取古诗词失败:', error);
  }
};
```

## 优势

1. **数据可控**：所有数据存储在本地数据库中，不依赖外部API
2. **更新方便**：可以通过管理后台或API直接更新数据
3. **性能更好**：避免了外部API调用的网络延迟
4. **数据丰富**：可以存储更多详细信息（译文、注释、标签等）
5. **扩展性强**：可以轻松添加新的字段和功能

## 注意事项

1. 确保数据库连接配置正确
2. 定期备份节假日和古诗词数据
3. 可以根据需要添加更多年份的节假日数据
4. 古诗词数据可以按朝代、作者等维度进行扩展
