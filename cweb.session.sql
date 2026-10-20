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

-- DROP TABLE IF EXISTS `review`;


-- --
-- -- Table structure for table `books`
-- --

-- CREATE TABLE `review` (
--   `id` int(11) NOT NULL,
--   `rating` int(11) NOT NULL,
--   `review` varchar(255) NOT NULL,
--   `name` varchar(255) NOT NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `reviews` (`UserId`, `rating`, `review`, `visitDate`) VALUES
(1, 5, 'Good', 2026-10-20),
(2, 5, 'Good', 2026-10-20),
(3, 5, 'Good', 2026-10-20),
(4, 5, 'Good', 2026-10-20),
(5, 5, 'Good', 2026-10-20),
(6, 5, 'Good', 2026-10-20),
(7, 5, 'Good', 2026-10-20),
(8, 5, 'Good', 2026-10-20),
(9, 5, 'Good', 2026-10-20),
(10, 5, 'Good', 2026-10-20),
(11, 5, 'Good', 2026-10-20);


-- ALTER TABLE `review`
--   ADD PRIMARY KEY (`id`);
--   MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;