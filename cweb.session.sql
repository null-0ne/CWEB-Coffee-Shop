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
