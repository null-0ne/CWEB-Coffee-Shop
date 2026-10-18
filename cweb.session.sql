--
-- Database: `cweb`
--
  
CREATE DATABASE IF NOT EXISTS `cweb`;
USE `cweb`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
DROP TABLE IF EXISTS `Menu`;

--
-- Table structure for table `Menu`
--

CREATE TABLE `Menu` (
  `id` int(11) NOT NULL,
  `itemName` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL
);
 

-- --
-- -- Indexes for dumped tables
-- --


-- -- Indexes for table `Menu`

ALTER TABLE `Menu`
  ADD PRIMARY KEY (`id`);



-- --
-- -- AUTO_INCREMENT for table `Menu`
-- --
ALTER TABLE `Menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;



-- -- Seed Menu Data
INSERT INTO `Menu` (`id`, `itemName`, `type`) VALUES
(1, 'Black Coffee', 'drink'),
(2, 'Croissant', 'pastry'),
(3, 'Latte', 'drink'),
(4, 'Chocolate Muffin', 'muffin');

COMMIT;


