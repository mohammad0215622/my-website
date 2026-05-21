-- FiveM Computer System - Database Schema
-- Compatible with oxmysql / mysql-async

-- Users table
CREATE TABLE IF NOT EXISTS `computer_users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `identifier` VARCHAR(60) NOT NULL UNIQUE,
    `password` VARCHAR(100) DEFAULT '1234',
    `wallpaper` INT DEFAULT 1,
    `theme` VARCHAR(20) DEFAULT 'dark',
    `settings` LONGTEXT DEFAULT '{}',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_identifier` (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Transactions table (Bank)
CREATE TABLE IF NOT EXISTS `computer_transactions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `identifier` VARCHAR(60) NOT NULL,
    `type` VARCHAR(30) NOT NULL DEFAULT 'transaction',
    `amount` DECIMAL(15,2) NOT NULL DEFAULT 0,
    `note` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_identifier` (`identifier`),
    INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Emails table
CREATE TABLE IF NOT EXISTS `computer_emails` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `sender` VARCHAR(60) NOT NULL,
    `recipient` VARCHAR(60) NOT NULL,
    `subject` VARCHAR(255) DEFAULT 'No Subject',
    `body` LONGTEXT,
    `is_read` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_recipient` (`recipient`),
    INDEX `idx_sender` (`sender`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tweets table (Twitter/Chirper)
CREATE TABLE IF NOT EXISTS `computer_tweets` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `identifier` VARCHAR(60) NOT NULL,
    `username` VARCHAR(100) DEFAULT 'Anonymous',
    `content` VARCHAR(280) NOT NULL,
    `likes` INT DEFAULT 0,
    `retweets` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notes table
CREATE TABLE IF NOT EXISTS `computer_notes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `identifier` VARCHAR(60) NOT NULL,
    `title` VARCHAR(255) DEFAULT 'Untitled',
    `content` LONGTEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_identifier` (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- MDT Records table
CREATE TABLE IF NOT EXISTS `computer_mdt_records` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `author` VARCHAR(60) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `category` VARCHAR(50) DEFAULT 'general',
    `details` LONGTEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_name` (`name`),
    INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
