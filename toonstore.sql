-- MySQL dump 10.13  Distrib 5.5.32, for Linux (x86_64)
--
-- Host: localhost    Database: toonstore
-- ------------------------------------------------------
-- Server version	5.5.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Characters`
--

DROP TABLE IF EXISTS `Characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Characters` (
  `canonical_name` char(40) NOT NULL,
  `name` char(40) NOT NULL,
  `owner` char(40) NOT NULL,
  `info` text,
  `concept` char(40) DEFAULT NULL,
  `created_on` date DEFAULT NULL,
  PRIMARY KEY (`canonical_name`,`owner`),
  KEY `owner` (`owner`),
  CONSTRAINT `Characters_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `Users` (`username`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Characters`
--

LOCK TABLES `Characters` WRITE;
/*!40000 ALTER TABLE `Characters` DISABLE KEYS */;
INSERT INTO `Characters` VALUES ('lifeson','Andrew Lifeson','tester','{\"name\":\"Andrew Lifeson\",\"player\":\"tester\",\"aspects\":{\"high_concept\":{\"name\":\"White Council Footsoldier\",\"description\":\"\"},\"trouble\":{\"name\":\"Still On The Battlefield\",\"description\":\"\"},\"aspects\":[{\"name\":\"I Am From A Gutter Too\",\"description\":\"\"},{\"name\":\"Warden\'s Honor\",\"description\":\"\"},{\"name\":\"No Kill Like Overkill\",\"description\":\"\"},{\"name\":\"Crazy Enough To Work\",\"description\":\"\"},{\"name\":\"Conviction Is Both Sword And Shield\",\"description\":\"\"}]},\"stress\":[{\"name\":\"Physical\",\"skill\":\"Endurance\",\"toughness\":0,\"boxes\":[{\"used\":false},{\"used\":true},{\"used\":false},{\"used\":false}],\"armor\":[{\"vs\":\"blunt objects\",\"strength\":2}]},{\"name\":\"Physical\",\"skill\":\"Loyalty Cardigan\",\"toughness\":0,\"armor\":[],\"boxes\":[{\"used\":false},{\"used\":false}]},{\"name\":\"Mental\",\"skill\":\"Conviction\",\"toughness\":2,\"armor\":[],\"boxes\":[{\"used\":false},{\"used\":true},{\"used\":false},{\"used\":false},{\"used\":false},{\"used\":false}]},{\"name\":\"Social\",\"skill\":\"Presence\",\"toughness\":0,\"armor\":[],\"boxes\":[{\"used\":false},{\"used\":true}]}],\"consequences\":[{\"severity\":\"Mild\",\"mode\":\"Any\",\"used\":false,\"aspect\":\"\"},{\"severity\":\"Mild\",\"mode\":\"Physical\",\"used\":true,\"aspect\":\"Spun about\"},{\"severity\":\"Mild\",\"mode\":\"Mental\",\"used\":false,\"aspect\":\"\"},{\"severity\":\"Moderate\",\"mode\":\"Any\",\"used\":false,\"aspect\":\"\"},{\"severity\":\"Severe\",\"mode\":\"Any\",\"used\":false,\"aspect\":\"\"},{\"severity\":\"Extreme\",\"mode\":\"Any\",\"used\":false,\"aspect\":\"Replace permanent\"}],\"totals\":{\"power_level\":\"Submerged\",\"base_refresh\":12,\"skill_cap\":5,\"skills_total\":42,\"fate_points\":3},\"skills\":{\"lists\":[[],[\"Presence\",\"Empathy\",\"Fists\",\"Resources\",\"Investigation\"],[\"Might\",\"Survival\",\"Alertness\"],[\"Contacts\",\"Weapons\",\"Intimidation\"],[\"Discipline\",\"Lore\",\"Athletics\"],[\"Conviction\",\"Endurance\"]]},\"powers\":[{\"cost\":-4,\"name\":\"Evocation + Refinement\",\"description\":[\"Elements: Spirit, Air, Water\",\"Spec: +2 power to spirit evocation\",\"Spec: +1 control to air evocation\",\"Focus item: Crystal belt buckle\",\"* +1 control to offensive spirit magic\",\"Focus item: Hawk skin gloves\",\"* +1 power to defensive air magic\"]},{\"cost\":-3,\"name\":\"Thaumaturgy\",\"description\":[\"Spec: +1 control to spectromancy\"]},{\"cost\":-1,\"name\":\"The Sight\",\"description\":[]},{\"cost\":0,\"name\":\"Soulgaze\",\"description\":[]},{\"cost\":0,\"name\":\"Wizard\'s Constitution\",\"description\":[]},{\"cost\":-1,\"name\":\"Switchblade master\",\"description\":[\"+1 to attacks with short blades\"]},{\"cost\":-1,\"name\":\"Controlled outburst\",\"description\":[\"Zone attacks avoid allies\"]}],\"notes\":{\"text\":\"## Adventure log\\n\\nDropped into Laos jungle, asked to recover kidnapped diplomats from the Vietcong. They are holed up in a Buddhist monastery at the top of the mountain.\\n\\nStarted hiking up the mountain.\\n\\nCong outpost. Killed scouts, but alerted others.\\n\\nThen everyone died.\\n\\n_fin_\"}}','White Council Footsoldier','2013-06-27');
/*!40000 ALTER TABLE `Characters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tokens`
--

DROP TABLE IF EXISTS `Tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Tokens` (
  `token` binary(16) NOT NULL,
  `requested` date DEFAULT NULL,
  `username` char(40) NOT NULL,
  `type` enum('forget','activate') DEFAULT NULL,
  PRIMARY KEY (`token`),
  KEY `username` (`username`),
  CONSTRAINT `Tokens_ibfk_1` FOREIGN KEY (`username`) REFERENCES `Users` (`username`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tokens`
--

LOCK TABLES `Tokens` WRITE;
/*!40000 ALTER TABLE `Tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `Tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `username` char(40) NOT NULL,
  `email` char(40) NOT NULL,
  `registered` date DEFAULT NULL,
  `last_login` date DEFAULT NULL,
  `password` binary(32) DEFAULT NULL,
  `salt` binary(32) DEFAULT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES ('tester','tester@example.com','2013-06-27','2013-07-30','`g<`��R�����v��Dހ�>�̼�=?~�','b��Ot�P��֒w���	��RXp T4Q�ڬ');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-07-30 14:56:42
