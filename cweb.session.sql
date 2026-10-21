--
-- Database: `cweb`
--
CREATE DATABASE IF NOT EXISTS `cweb`;
USE `cweb`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
DROP TABLE IF EXISTS 'submissions';

CREATE TABLE 'submissions' (
    'id' int CONSTRAINTS submissions_id_nn NOT NULL PRIMARY KEY,
    'userId' int CONSTRAINTS submissions_user_fk FOREIGN KEY
        REFERENCES users(id),
    'formType' VARCHAR2(20),
    'message' TEXT CONSTRAINTS submissions_msg_nn NOT NULL,
    'status' BOOLEAN CONSTRAINTS submissions_sts_nn NOT NULL,
    'respondedOn' TIMESTAMP
);