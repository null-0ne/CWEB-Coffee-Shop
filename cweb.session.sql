-- SHOWCASE GALLERY (Story 4) - current table structure
USE cweb;

DROP TABLE IF EXISTS `Showcase`;
DROP TABLE IF EXISTS `showcase`;

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

DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `user`;

-- CREATE TABLE `users` (
--   `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
--   `userName` varchar(255) NOT NULL,
--   `email` varchar(255) NOT NULL UNIQUE,
--   `password` varchar(255) NOT NULL,
--   `firstName` varchar(30) NOT NULL,
--   `lastName` varchar(50) NOT NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
