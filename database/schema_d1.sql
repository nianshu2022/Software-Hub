-- 软件分类表
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 软件信息表
CREATE TABLE IF NOT EXISTS software (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    version TEXT,
    download_url TEXT NOT NULL,
    official_url TEXT,
    category_id INTEGER,
    icon_url TEXT,
    screenshot_urls TEXT, -- JSON Array as string
    tags TEXT, -- JSON Array as string
    file_size TEXT,
    platform TEXT DEFAULT 'Windows',
    license_type TEXT,
    developer TEXT,
    release_date TEXT,
    last_updated TEXT,
    download_count INTEGER DEFAULT 0,
    rating REAL DEFAULT 0.00,
    is_featured INTEGER DEFAULT 0, -- 0 or 1
    is_active INTEGER DEFAULT 1, -- 0 or 1
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'editor',
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 法定节假日表
CREATE TABLE IF NOT EXISTS holidays (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT DEFAULT 'national',
    is_workday INTEGER DEFAULT 0,
    description TEXT,
    year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 古诗词表
CREATE TABLE IF NOT EXISTS poetry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    dynasty TEXT,
    content TEXT NOT NULL,
    translation TEXT,
    notes TEXT,
    tags TEXT, -- JSON Array as string
    is_featured INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入默认分类
INSERT OR IGNORE INTO categories (id, name, description, icon, sort_order) VALUES
(1, '开发工具', '编程开发相关软件', 'code', 1),
(2, '办公软件', '办公效率工具', 'office', 2),
(3, '设计软件', '图形设计和创意工具', 'design', 3),
(4, '系统工具', '系统优化和管理工具', 'system', 4),
(5, '网络工具', '网络相关软件', 'network', 5),
(6, '多媒体', '音视频处理软件', 'media', 6),
(7, '游戏娱乐', '游戏和娱乐软件', 'game', 7),
(8, '安全软件', '安全防护软件', 'security', 8),
(9, '其他', '其他类型软件', 'other', 9);
