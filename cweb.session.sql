--
-- Database: `cweb`
--
CREATE DATABASE IF NOT EXISTS `cweb`;
USE `cweb`;

DROP TABLE IF EXISTS `showcase`;
DROP TABLE IF EXISTS `Showcase`;
DROP TABLE IF EXISTS `submissions`;
DROP TABLE IF EXISTS `store_information`;
DROP TABLE IF EXISTS `menu`;
DROP TABLE IF EXISTS `users`;



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

CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `birthDate` DATE NULL,
  `phoneNumber` varchar(50) NOT NULL
);

CREATE TABLE `showcase` (
  id INT NOT NULL AUTO_INCREMENT,                 
  userId INT NOT NULL,                                    
  fileName VARCHAR(255) NOT NULL,                            
  title VARCHAR(60) NOT NULL,                          
  description VARCHAR(255) NULL, 
  uploadDate DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  
  FOREIGN KEY (userId) REFERENCES `users`(id)
);





--
-- Table structure for table `Menu`
--

CREATE TABLE `menu` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `userId` int NOT NULL,
    `price`decimal(10, 2),
  `uploadDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (userId) REFERENCES `users`(id)
);
 




