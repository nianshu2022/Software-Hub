-- 软件下载网站数据库结构
CREATE DATABASE IF NOT EXISTS software_download DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE software_download;

-- 软件分类表
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '分类名称',
    description TEXT COMMENT '分类描述',
    icon VARCHAR(100) COMMENT '分类图标',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 软件信息表
CREATE TABLE software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '软件名称',
    description TEXT COMMENT '软件描述',
    version VARCHAR(50) COMMENT '版本号',
    download_url VARCHAR(500) NOT NULL COMMENT '下载链接',
    official_url VARCHAR(500) COMMENT '官方网站',
    category_id INT COMMENT '分类ID',
    icon_url VARCHAR(500) COMMENT '软件图标',
    screenshot_urls JSON COMMENT '截图链接数组',
    tags JSON COMMENT '标签数组',
    file_size VARCHAR(20) COMMENT '文件大小',
    platform ENUM('Windows', 'macOS', 'Linux', 'Web', 'Mobile', 'Cross-platform') DEFAULT 'Windows' COMMENT '支持平台',
    license_type VARCHAR(50) COMMENT '许可证类型',
    developer VARCHAR(100) COMMENT '开发者',
    release_date DATE COMMENT '发布日期',
    last_updated DATE COMMENT '最后更新',
    download_count INT DEFAULT 0 COMMENT '下载次数',
    rating DECIMAL(3,2) DEFAULT 0.00 COMMENT '评分(0-5)',
    is_featured BOOLEAN DEFAULT FALSE COMMENT '是否推荐',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_platform (platform),
    INDEX idx_featured (is_featured),
    INDEX idx_active (is_active),
    FULLTEXT idx_search (name, description, developer)
);

-- 用户表（可选，用于管理后台）
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor') DEFAULT 'editor',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 法定节假日表
CREATE TABLE holidays (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '节假日名称',
    date DATE NOT NULL COMMENT '节假日日期',
    type ENUM('national', 'traditional', 'international') DEFAULT 'national' COMMENT '节假日类型',
    is_workday BOOLEAN DEFAULT FALSE COMMENT '是否工作日',
    description TEXT COMMENT '节假日描述',
    year INT NOT NULL COMMENT '年份',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_year (year),
    INDEX idx_type (type)
);

-- 古诗词表
CREATE TABLE poetry (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL COMMENT '诗词标题',
    author VARCHAR(100) NOT NULL COMMENT '作者',
    dynasty VARCHAR(50) COMMENT '朝代',
    content TEXT NOT NULL COMMENT '诗词内容',
    translation TEXT COMMENT '译文',
    notes TEXT COMMENT '注释',
    tags JSON COMMENT '标签数组',
    is_featured BOOLEAN DEFAULT FALSE COMMENT '是否推荐',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_author (author),
    INDEX idx_dynasty (dynasty),
    INDEX idx_featured (is_featured),
    FULLTEXT idx_content (title, author, content)
);

-- 插入默认分类
INSERT INTO categories (name, description, icon, sort_order) VALUES
('开发工具', '编程开发相关软件', 'code', 1),
('办公软件', '办公效率工具', 'office', 2),
('设计软件', '图形设计和创意工具', 'design', 3),
('系统工具', '系统优化和管理工具', 'system', 4),
('网络工具', '网络相关软件', 'network', 5),
('多媒体', '音视频处理软件', 'media', 6),
('游戏娱乐', '游戏和娱乐软件', 'game', 7),
('安全软件', '安全防护软件', 'security', 8),
('其他', '其他类型软件', 'other', 9);

