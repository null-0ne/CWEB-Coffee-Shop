DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS 'orderItems';
DROP TABLE IF EXISTS 'purchases';
DROP TABLE IF EXISTS 'items';

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
  `userID` INT NOT NULL,
  CONSTRAINT fk_User
  FOREIGN KEY (`userID`)
  REFERENCES `users`(`id`)
);
CREATE TABLE `orderItems` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `orderID` INT NOT NULL,
  `itemID` INT NOT NULL,
  `quantity` INT NOT NULL,
  CONSTRAINT fk_Order
  FOREIGN KEY (`orderID`)
  REFERENCES `orders`(`id`),
  CONSTRAINT fk_Item
  FOREIGN KEY (`itemID`)
  REFERENCES `items`(`id`)
);



-- ALTER TABLE `user`
--   ADD PRIMARY KEY (`id`);

--   ALTER TABLE `user`
--   MODIFY `id` INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
-- COMMIT;

INSERT INTO user (
  userName,email, password
) VALUES ('buffy', 'buffy@test.ca', 'Strong!Password1');