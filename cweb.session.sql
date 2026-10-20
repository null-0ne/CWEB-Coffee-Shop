--
-- Database: `cweb`
--
  
CREATE DATABASE IF NOT EXISTS `cweb`;
USE `cweb`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";




-- --------------------------------------------------------
DROP TABLE IF EXISTS `Menu`;


--
-- Table structure for table `Menu`
--

CREATE TABLE `Menu` (
  `id` int NOT NULL PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `userId` int NOT NULL CONSTRAINTS  FOREIGN KEY REFERENCES users(id),
    `price`decimal(10, 2),
  `uploadDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
);
 






-- --
-- -- AUTO_INCREMENT for table `Menu`
-- --
ALTER TABLE `Menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;



-- -- Seed Menu Data
--INSERT INTO `Menu` (`id`, `name`, `type`, `userId`, `price`) VALUES
--(1, 'Black Coffee', 'drink', 1, 3.50),
--(2, 'Croissant', 'pastry', 1, 3.50),
--(3, 'Latte', 'drink', 1, 3.50),
--(4, 'Chocolate Muffin', 'muffin', 1, 3.50);

COMMIT;


