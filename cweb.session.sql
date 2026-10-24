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
USE cweb;

DROP TABLE IF EXISTS `showcase`;
DROP TABLE IF EXISTS `Showcase`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `user`;

CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `birthDate` DATE NULL,
  `phoneNumber` varchar(50) NOT NULL
);

-- INSERT INTO users (
--   userName,email, password, firstName, lastName
-- ) VALUES ('Johnnyboy', 'john@test.ca', 'Strong!Password1', 'John', 'Doe'),
--           ('Janegirl', 'jane@test.ca', 'Strong!Password1', 'Jane', 'Doe'),
--           ('Milly', 'mildred@test.ca', 'Strong!Password1', 'Mildred', 'Tanaka'),
--           ('Tommyboy', 'thomas@test.ca', 'Strong!Password1', 'Thomas', 'Walsh'),
--           ('Jo', 'johanna@test.ca', 'Strong!Password1', 'Johanna', 'Weidner'),
--           ('Jelly', 'jelena@test.ca', 'Strong!Password1', 'Jelena', 'Stojanovic'),
--           ('Carls', 'carlotta@test.ca', 'Strong!Password1', 'Carlotta', 'De Luca'),
--           ('Bronny', 'bronwen@test.ca', 'Strong!Password1', 'Bronwen', 'Pugh'),
--           ('JamJam', 'jamal@test.ca', 'Strong!Password1', 'Jamal', 'Okeke'),
--           ('Trav', 'travis@test.ca', 'Strong!Password1', 'Travis', 'Gentry'),
--           ('JakeTheSnake', 'jake@test.ca', 'Strong!Password1', 'Jake', 'Farnsworth'),
--           ('Walt', 'walter@test.ca', 'Strong!Password1', 'Walter', 'Grimshaw');

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



