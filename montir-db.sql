-- MySQL dump 10.13  Distrib 8.0.31, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: montir-db
-- ------------------------------------------------------
-- Server version	8.0.31-google

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `montir-db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `montir-db` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `montir-db`;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` varchar(16) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES ('2IEeKHYlYD0w7cmI','Eureka69','$2b$10$WJs/lNJTK2sEPwmz4NcL7uh3Gtz7kkPf6P0radHEEcgda6W0rnfD6'),('cnFZj4QU6pGSZ-NF','yotsba','$2b$10$trrhei4jtWtljBguTAUr/eedLhOkw13K16AxD2xJL3eYJRqgvWUea'),('d9xyA8QJ1AUR9o5B','JohnDoe','$2b$10$6sa9aOQYLm.OdMclr18mIOAFra0.53MLmGuzrSLC2K64Z53uhkUGm'),('QyfZv0ASSkC10p9a','Eureka','$2b$10$sDcPxEZinTgGaDi6CHBYc.bUBqIkHaozYCCsmi/Ll3rbPI3Ms8yk.');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datas`
--

DROP TABLE IF EXISTS `datas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `datas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(16) COLLATE utf8mb4_general_ci NOT NULL,
  `age` int DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gender` tinyint(1) DEFAULT NULL,
  `bmi` float DEFAULT NULL,
  `stress_level` int NOT NULL,
  `sleep_duration` float NOT NULL,
  `date` date NOT NULL DEFAULT (curdate()),
  `quality_score` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `datas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datas`
--

LOCK TABLES `datas` WRITE;
/*!40000 ALTER TABLE `datas` DISABLE KEYS */;
INSERT INTO `datas` VALUES (47,'_KXVYVQB_t982whT',23,'Pati',1,53.19,6,8,'2024-06-15',8.41),(48,'_KXVYVQB_t982whT',23,'Pati',1,53.19,2,6,'2024-06-15',7.5),(49,'_KXVYVQB_t982whT',23,'Pati',1,53.19,8,4,'2024-06-15',1.03),(50,'_KXVYVQB_t982whT',23,'Pati',1,53.19,0,7,'2024-06-15',9.25),(51,'_KXVYVQB_t982whT',23,'Pati',1,53.19,5,8,'2024-06-15',8.61),(52,'2xGyvIXoFxFj8XCI',23,'Jakarta',1,28.29,5,8,'2024-06-15',8.25),(53,'2xGyvIXoFxFj8XCI',23,'Jakarta',1,28.29,1,3,'2024-06-15',8.5),(54,'2xGyvIXoFxFj8XCI',23,'Jakarta',1,28.29,6,3,'2024-06-15',3.09),(55,'2xGyvIXoFxFj8XCI',23,'Jakarta',1,28.29,8,7,'2024-06-15',4.7),(56,'2xGyvIXoFxFj8XCI',23,'Jakarta',1,28.29,4,8,'2024-06-15',8.59),(57,'2xGyvIXoFxFj8XCI',23,'Jakarta',1,28.29,0,11,'2024-06-15',13.41),(58,'2xGyvIXoFxFj8XCI',23,'Jakarta',1,28.29,2,11,'2024-06-15',13.11),(59,'2xGyvIXoFxFj8XCI',23,'Jakarta',1,28.29,5,5,'2024-06-15',5.32),(60,'2xGyvIXoFxFj8XCI',23,'Jakarta',1,28.29,3,7,'2024-06-15',8.38),(61,'2xGyvIXoFxFj8XCI',23,'Jakarta',1,28.29,3,7,'2024-06-16',8.38);
/*!40000 ALTER TABLE `datas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(16) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `age` int NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `gender` tinyint(1) NOT NULL,
  `height` float NOT NULL,
  `weight` float NOT NULL,
  `bmi` float NOT NULL,
  `bmi_underweight` tinyint(1) DEFAULT NULL,
  `bmi_normal` tinyint(1) DEFAULT NULL,
  `bmi_overweight` tinyint(1) DEFAULT NULL,
  `bmi_obese` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('2xGyvIXoFxFj8XCI','test12345','$2b$10$h6eU9fZQvf.gjSbrR6yq8O/x87GrJzYZuf50L12bCzmxcWgEw2KCy',23,'Jakarta',1,188,100,28.29,0,0,1,0),('LCxfWbXtSOIgF1PN','test1234','$2b$10$p0TJwmH9dkB31hTfx5lHsOOMkSbEuekKAuUVxhiWSuj5eNIWoVwcW',23,'Malang',1,188,75,21.22,0,1,0,0),('wdaP29EORplV73Ie','test123','$2b$10$GHXUKn/fCNOIVlifRsNXsetUMfixcrMRgkjIdcz6pnc2oqSmyzlyy',23,'Malang',1,188,42,11.88,1,0,0,0),('_KXVYVQB_t982whT','test123456','$2b$10$HOGUgSaLQVLga1HTKjHwPeLrmcviZ/hbvr6FHj2oN9wyPlwsDLPwy',23,'Pati',1,188,188,53.19,0,0,0,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `montir-db`
--

USE `montir-db`;

--
-- Final view structure for view `Sleep_Quality`
--

/*!50001 DROP VIEW IF EXISTS `Sleep_Quality`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`Viewer`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `Sleep_Quality` AS select `u`.`id` AS `id`,`u`.`username` AS `username`,`d`.`age` AS `age`,`d`.`city` AS `city`,`d`.`bmi` AS `bmi`,`d`.`stress_level` AS `stress_level`,`d`.`sleep_duration` AS `sleep_duration`,`d`.`quality_score` AS `quality_score`,`d`.`date` AS `date` from (`users` `u` join `datas` `d` on((`u`.`id` = `d`.`user_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `user_data`
--

/*!50001 DROP VIEW IF EXISTS `user_data`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`Viewer`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `user_data` AS select `datas`.`user_id` AS `user_id`,`datas`.`age` AS `age`,`datas`.`gender` AS `gender`,`datas`.`bmi` AS `bmi`,`datas`.`stress_level` AS `stress_level`,`datas`.`sleep_duration` AS `sleep_duration`,`datas`.`date` AS `date` from `datas` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-16  7:17:27
