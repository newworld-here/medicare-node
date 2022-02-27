-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.26 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table medicare.med_product
CREATE TABLE IF NOT EXISTS `med_product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `price` bigint NOT NULL DEFAULT '0',
  `seller` varchar(150) NOT NULL DEFAULT '',
  `product_desc` text NOT NULL,
  `offers` bigint NOT NULL,
  `current_price` bigint NOT NULL,
  `flag` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table medicare.med_product: ~2 rows (approximately)
/*!40000 ALTER TABLE `med_product` DISABLE KEYS */;
INSERT INTO `med_product` (`id`, `name`, `time`, `price`, `seller`, `product_desc`, `offers`, `current_price`, `flag`) VALUES
	(1, 'Paracitamol', '2022-02-20 04:54:15', 100, 'abc', 'feaver', 3, 80, 1),
	(2, 'Mox 500', '2022-02-20 10:59:40', 200, 'Dristi pvt ltd', 'antibayotic', 50, 180, 1);
/*!40000 ALTER TABLE `med_product` ENABLE KEYS */;

-- Dumping structure for table medicare.user
CREATE TABLE IF NOT EXISTS `user` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `nameOfUser` varchar(255) NOT NULL,
  `phone` bigint NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(500) NOT NULL,
  `role` varchar(500) NOT NULL DEFAULT 'user',
  `flag` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`userId`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table medicare.user: ~13 rows (approximately)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`userId`, `nameOfUser`, `phone`, `email`, `password`, `role`, `flag`) VALUES
	(3, 'suman', 9876543210, 'suman@g.com', '$2a$10$xWFLkDKVRfJ3qS1HGcdCnuOLfytW/vVgTWhGxrHKtZZwhajThXsgC', 'user', 1),
	(7, 'Dolon sarkar', 980475405, 'suman.wbut@gmail.com', '$2a$10$nCQdP3KOX928bi0PfyJUReriq4T.STZUVXPvcFXEHDQKiAgVL/h0C', 'user', 1),
	(8, 'Dolon sarkar', 999999999, 'x@gmail.com', '$2a$10$FYX0OfwE0KR8Z3EmT4lrGOIR3Y2y3PnKcsZM.6K2Bw6z0lrzY46OO', 'user', 1),
	(11, 'Dibyendu', 9038960801, 'dib.bond@gmail.com', '$2a$10$SzwPCrr82uUVk1kdY7s8uupzltD.aPXysk4nOzDNiwsqOIQB0xcxm', 'user', 1),
	(12, 'Samir bag', 8017105412, 'fotafotkolkata@gmail.com', '$2a$10$u5p7a5OsPZotq0Tg5v25x.AblwAdpCjNP2hsFKcsj/D6UL67mCQvW', 'user', 1),
	(13, 'a', 9999999999, 'abc@gmail.com', '$2a$10$TXubtbmAffnJ/1md.dYfzeCvPHKUVbm3uUT7lF2Km79.K2YaTdBZ.', 'user', 1),
	(14, 'suman', 7777777777, 'dolonsarkar452@gmail.com', '$2a$10$1gaKu6hBOJkalh0UTsffzOY9fr2Ga09vkRTiFVR0p808wTFa76gh6', 'user', 1),
	(15, 'sr', 9874563210, 'ab@g.com', '$2a$10$lmsCrmKe5qBUBlFh9QPBAuI5LQoKKqyPSJx.8FQgcK8NrYn3UvCjy', 'user', 1),
	(29, 'kuman', 1122334455, 'abc@gmail.co', '$2a$10$eXlWO6wbOggK56wNu/sU0.58mzqN3OcxLJWhMOoWnPlAiA.utGe5q', 'user', 1),
	(33, 's r', 987654321, 'sr@gmail.com', '$2a$10$uljMug1V/FSmv8Qps6D.UuGgdIS79taSNutFKIfEu7MJMgBAm1sNG', 'user', 1),
	(34, 'Saurav', 3698521470, 'saurav@gmail.com', '$2a$10$9w5vbg2xW/DO2dQUASsLJOueYgD45.L8bzQTEubCG4OrtY37wGF9i', 'admin', 1),
	(36, 'Saurav sen', 9698521470, 'saurav123@gmail.com', '$2a$10$NdPOg7VKZRmV4jgLPtar9OJ5/hoQPTHE7y6QC3fL8zWqJ./9Rw3l.', 'user', 1),
	(37, 'alex', 896541230, 'alex@gmail.com', '$2a$10$9oPv4ZSBQKCJd0QGj7hW4uChRNobdxin5Hf.6Zvdu.JWqBEjRLopC', 'user', 1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
