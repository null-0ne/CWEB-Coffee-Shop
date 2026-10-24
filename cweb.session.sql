--
-- Database: `cweb`
--
CREATE DATABASE IF NOT EXISTS `cweb`;
USE `cweb`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Table structure for table `submissions`
--
CREATE TABLE `submissions` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` INT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT FALSE,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `respondedOn` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
);

--
-- Table structure for table `store_information`
--
CREATE TABLE `store_information` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(50) NOT NULL,
    `label` VARCHAR(100) NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `displayOrder` INT NOT NULL,
    PRIMARY KEY (`id`)
);

COMMIT;
