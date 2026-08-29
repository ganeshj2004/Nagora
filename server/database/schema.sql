-- NAGORA Digital Agency — Relational MySQL Database DDL Schema

CREATE DATABASE IF NOT EXISTS `nagora_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nagora_db`;

-- Drop existing tables to prevent legacy column mismatch errors
DROP TABLE IF EXISTS `contacts`;
DROP TABLE IF EXISTS `enquiries`;
DROP TABLE IF EXISTS `testimonials`;
DROP TABLE IF EXISTS `portfolio`;
DROP TABLE IF EXISTS `portfolio_categories`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `users`;

-- Users / Admin table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `role` VARCHAR(20) DEFAULT 'admin',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Services table
CREATE TABLE `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `number` VARCHAR(10) NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `heading` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `features_json` JSON,
  `cta_text` VARCHAR(100),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Portfolio Categories table
CREATE TABLE `portfolio_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `slug` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Portfolio Items table
CREATE TABLE `portfolio` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `full_description` TEXT,
  `image_url` VARCHAR(255) NOT NULL,
  `tags_json` JSON,
  `client` VARCHAR(100),
  `year` VARCHAR(10),
  `result` VARCHAR(255),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Testimonials table
CREATE TABLE `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `company` VARCHAR(100) NOT NULL,
  `service` VARCHAR(100) NOT NULL,
  `review` TEXT NOT NULL,
  `avatar_url` VARCHAR(255),
  `rating` TINYINT DEFAULT 5,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Enquiries table (Primary Contact Form submissions)
CREATE TABLE `enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `company` VARCHAR(100),
  `service` VARCHAR(100) NOT NULL,
  `budget` VARCHAR(100) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('New', 'Contacted', 'In Discussion', 'Converted', 'Closed') DEFAULT 'New',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Simple Contact Messages table
CREATE TABLE `contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30),
  `message` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
