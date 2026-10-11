DROP TABLE IF EXISTS `orderItems`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `items`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
  `userName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `items` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `itemName` varchar(255) NOT NULL UNIQUE,
  `price` DECIMAL(10,2) NOT NULL
);

CREATE TABLE `orders` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `total` DECIMAL(10,2) NOT NULL,
  `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userID` INT NOT NULL
);
CREATE TABLE `orderItems` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `orderID` INT NOT NULL,
  `itemID` INT NOT NULL,
  `quantity` INT NOT NULL
);

INSERT INTO users (
  userName,email, password
) VALUES ('Buffy', 'buffy@test.ca', 'Strong!Password1'), ('Luna', 'luna@test.ca', 'Strong!Password1');

INSERT INTO items (
  itemName, price
) VALUES ('Cappuccino', 3.00),('Espresso', 3.00), ('Americano', 3.00), ('Pie', 4.50), ('Cake', 4.50), ('Bagel', 5.00);

INSERT INTO orders (
  total, userID
) VALUES (6.00, 1), (7.50, 1), (11.00, 2), (13.50, 2);

INSERT INTO orderItems (
  orderID, itemID, quantity
) VALUES (1, 1, 1), (1, 3, 1), (2, 2, 1), (2, 5, 1), (3, 2, 2), (3, 6, 1), (4, 3, 3), (4, 4, 1);