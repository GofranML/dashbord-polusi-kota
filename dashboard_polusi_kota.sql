/*
 Navicat Premium Dump SQL

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80030 (8.0.30)
 Source Host           : localhost:3306
 Source Schema         : dashboard_polusi_kota

 Target Server Type    : MySQL
 Target Server Version : 80030 (8.0.30)
 File Encoding         : 65001

 Date: 14/06/2026 13:39:39
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for alerts
-- ----------------------------
DROP TABLE IF EXISTS `alerts`;
CREATE TABLE `alerts`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `device_id` bigint UNSIGNED NOT NULL,
  `parameter` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` double NOT NULL,
  `threshold` double NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `resolved_by` bigint UNSIGNED NULL DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `alerts_device_id_foreign`(`device_id` ASC) USING BTREE,
  INDEX `alerts_resolved_by_foreign`(`resolved_by` ASC) USING BTREE,
  CONSTRAINT `alerts_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `alerts_resolved_by_foreign` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of alerts
-- ----------------------------
INSERT INTO `alerts` VALUES (1, 10, 'PM2.5', 145.2, 100, 'acknowledged', NULL, NULL, 'Tingkat partikulat PM2.5 sangat tinggi di area kilang Plaju.', '2026-06-12 12:01:29', '2026-06-12 12:30:32');
INSERT INTO `alerts` VALUES (2, 15, 'PM2.5', 110.1, 100, 'acknowledged', NULL, NULL, 'Laporan masuk dari Simpang Polda, sedang dipantau oleh petugas.', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `alerts` VALUES (3, 1, 'MQ-135', 280, 250, 'resolved', 2, '2026-06-12 07:01:29', 'Tingkat gas telah menurun ke batas aman (210 ppm). Status resolved oleh Petugas Monitoring.', '2026-06-12 12:01:29', '2026-06-12 12:01:29');

-- ----------------------------
-- Table structure for audit_logs
-- ----------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NULL DEFAULT NULL,
  `action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `audit_logs_user_id_foreign`(`user_id` ASC) USING BTREE,
  CONSTRAINT `audit_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of audit_logs
-- ----------------------------
INSERT INTO `audit_logs` VALUES (1, 1, 'User Management', 'Created user account for operator@smartcity.com with Petugas Monitoring role.', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `audit_logs` VALUES (2, 1, 'Security', 'Database backup created and saved locally.', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `audit_logs` VALUES (3, 2, 'Alert Resolution', 'Resolved breach alert on Kambang Iwak Park.', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `audit_logs` VALUES (4, 1, 'System Config Change', 'Updated custom thresholds: PM2.5=91, PM10=150, MQ-135=250', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-12 12:30:19', '2026-06-12 12:30:19');
INSERT INTO `audit_logs` VALUES (5, 1, 'Alert Acknowledged', 'Acknowledged alert ID: 1 on Device: Plaju Refinery Zone', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-12 12:30:32', '2026-06-12 12:30:32');

-- ----------------------------
-- Table structure for cache
-- ----------------------------
DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache`  (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`) USING BTREE,
  INDEX `cache_expiration_index`(`expiration` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cache
-- ----------------------------
INSERT INTO `cache` VALUES ('laravel-cache-b3d24e9465b352c2252265f9e6c0ca20', 'i:1;', 1781266660);
INSERT INTO `cache` VALUES ('laravel-cache-b3d24e9465b352c2252265f9e6c0ca20:timer', 'i:1781266660;', 1781266660);

-- ----------------------------
-- Table structure for cache_locks
-- ----------------------------
DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks`  (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`) USING BTREE,
  INDEX `cache_locks_expiration_index`(`expiration` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cache_locks
-- ----------------------------

-- ----------------------------
-- Table structure for devices
-- ----------------------------
DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `device_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `api_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `latitude` decimal(10, 7) NOT NULL,
  `longitude` decimal(10, 7) NOT NULL,
  `region` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'online',
  `battery_voltage` double NOT NULL DEFAULT 4.2,
  `signal_strength` int NOT NULL DEFAULT -50,
  `calibration_factor` double NOT NULL DEFAULT 1,
  `last_seen_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `devices_device_code_unique`(`device_code` ASC) USING BTREE,
  UNIQUE INDEX `devices_api_token_unique`(`api_token` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of devices
-- ----------------------------
INSERT INTO `devices` VALUES (1, 'SC-N01v2', 'Kambang Iwak Park', NULL, -2.9912000, 104.7479000, 'Ilir Barat', 'online', 4.1, -62, 1, '2026-06-12 11:47:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `devices` VALUES (2, 'SC-N02v2', 'Kambang Iwak Residential', NULL, -2.9916000, 104.7485000, 'Ilir Barat', 'online', 4, -68, 1, '2026-06-12 11:49:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `devices` VALUES (3, 'SC-N03v2', 'Palembang Icon Mall', NULL, -2.9754000, 104.7505000, 'Ilir Barat', 'online', 3.9, -70, 1, '2026-06-12 11:51:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `devices` VALUES (4, 'SC-N04v2', 'Benteng Kuto Besak', NULL, -2.9904000, 104.7592000, 'Ilir Barat', 'calibrating', 4.2, -55, 1, '2026-06-12 11:56:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `devices` VALUES (5, 'SC-N05v2', 'Ampera Bridge', NULL, -2.9918000, 104.7634000, 'Seberang Ulu', 'online', 3.8, -75, 1, '2026-06-12 12:00:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `devices` VALUES (6, 'SC-N06v2', 'Jakabaring Lake', NULL, -3.0211000, 104.7925000, 'Seberang Ulu', 'online', 3.7, -82, 1, '2026-06-12 11:59:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `devices` VALUES (7, 'SC-N07v2', 'Masjid Agung Palembang', NULL, -2.9888000, 104.7570000, 'Ilir Timur', 'online', 4, -60, 1, '2026-06-12 11:56:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `devices` VALUES (8, 'SC-N08v2', 'Boom Baru Port', NULL, -2.9691000, 104.7885000, 'Ilir Timur', 'calibrating', 3.6, -85, 1, '2026-06-12 11:56:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `devices` VALUES (9, 'SC-N09v2', 'Pusri Industrial Area', NULL, -2.9723000, 104.8118000, 'Kalidoni', 'online', 3.9, -65, 1, '2026-06-12 11:58:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `devices` VALUES (10, 'SC-N10v2', 'Plaju Refinery Zone', NULL, -3.0039000, 104.8152000, 'Plaju', 'online', 4.1, -58, 1, '2026-06-12 11:46:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `devices` VALUES (11, 'SC-N11v2', 'Kertapati Station', NULL, -3.0195000, 104.7431000, 'Kertapati', 'online', 3.8, -72, 1, '2026-06-12 11:51:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `devices` VALUES (12, 'SC-N12v2', 'Bukit Siguntang', NULL, -2.9972000, 104.7294000, 'Ilir Barat', 'online', 4, -64, 1, '2026-06-12 11:49:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `devices` VALUES (13, 'SC-N13v2', 'Punti Kayu Forest', NULL, -2.9431000, 104.7251000, 'Alang-Alang Lebar', 'online', 3.9, -78, 1, '2026-06-12 11:51:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `devices` VALUES (14, 'SC-N14v2', 'Sultan Mahmud Badaruddin Airport', NULL, -2.8986000, 104.7014000, 'Sukarami', 'online', 4.2, -52, 1, '2026-06-12 11:52:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `devices` VALUES (15, 'SC-N15v2', 'Simpang Polda', NULL, -2.9556000, 104.7377000, 'Kemuning', 'offline', 3.1, -95, 1, '2026-06-11 12:01:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');

-- ----------------------------
-- Table structure for failed_jobs
-- ----------------------------
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `failed_jobs_uuid_unique`(`uuid` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of failed_jobs
-- ----------------------------

-- ----------------------------
-- Table structure for job_batches
-- ----------------------------
DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `cancelled_at` int NULL DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of job_batches
-- ----------------------------

-- ----------------------------
-- Table structure for jobs
-- ----------------------------
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED NULL DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `jobs_queue_index`(`queue` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of jobs
-- ----------------------------

-- ----------------------------
-- Table structure for maintenance_tickets
-- ----------------------------
DROP TABLE IF EXISTS `maintenance_tickets`;
CREATE TABLE `maintenance_tickets`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `device_id` bigint UNSIGNED NOT NULL,
  `technician_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `maintenance_tickets_device_id_foreign`(`device_id` ASC) USING BTREE,
  INDEX `maintenance_tickets_technician_id_foreign`(`technician_id` ASC) USING BTREE,
  CONSTRAINT `maintenance_tickets_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `maintenance_tickets_technician_id_foreign` FOREIGN KEY (`technician_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of maintenance_tickets
-- ----------------------------
INSERT INTO `maintenance_tickets` VALUES (1, 4, 4, 'Kalibrasi Ulang Sensor PM2.5', 'Lakukan kalibrasi ulang sensor PM2.5 di area Benteng Kuto Besak karena adanya deviasi pembacaan sebesar 15%.', 'pending', '2026-06-13 12:01:29', NULL, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `maintenance_tickets` VALUES (2, 15, 4, 'Perbaikan Sensor Offline', 'Sensor Simpang Polda dilaporkan offline sejak 24 jam lalu. Cek koneksi baterai dan modul Lora/GSM.', 'in_progress', '2026-06-12 12:01:29', NULL, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `maintenance_tickets` VALUES (3, 13, 4, 'Ganti Baterai LiPo 3.7V', 'Baterai sensor Punti Kayu Forest telah drop di bawah 3.5V. Lakukan penggantian baterai LiPo baru.', 'completed', '2026-06-10 12:01:29', '2026-06-11 12:01:29', '2026-06-12 12:01:29', '2026-06-12 12:01:29');

-- ----------------------------
-- Table structure for migrations
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of migrations
-- ----------------------------
INSERT INTO `migrations` VALUES (1, '0001_01_01_000000_create_users_table', 1);
INSERT INTO `migrations` VALUES (2, '0001_01_01_000001_create_cache_table', 1);
INSERT INTO `migrations` VALUES (3, '0001_01_01_000002_create_jobs_table', 1);
INSERT INTO `migrations` VALUES (4, '2025_08_14_170933_add_two_factor_columns_to_users_table', 1);
INSERT INTO `migrations` VALUES (5, '2026_05_21_000001_add_fields_to_users_table', 1);
INSERT INTO `migrations` VALUES (6, '2026_05_21_000002_create_smart_city_monitoring_tables', 1);
INSERT INTO `migrations` VALUES (7, '2026_05_22_123557_add_api_token_to_devices_table', 1);
INSERT INTO `migrations` VALUES (8, '2026_05_22_123558_create_iot_tables', 1);
INSERT INTO `migrations` VALUES (9, '2026_05_22_133515_add_unique_device_datetime_to_sensor_data', 1);

-- ----------------------------
-- Table structure for password_reset_tokens
-- ----------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens`  (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of password_reset_tokens
-- ----------------------------

-- ----------------------------
-- Table structure for sensor_data
-- ----------------------------
DROP TABLE IF EXISTS `sensor_data`;
CREATE TABLE `sensor_data`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `device_id` bigint UNSIGNED NOT NULL,
  `datetime` datetime NOT NULL,
  `pm25` double NULL DEFAULT NULL,
  `pm10` double NULL DEFAULT NULL,
  `pm1` double NULL DEFAULT NULL,
  `gas_index` int NULL DEFAULT NULL,
  `gps_lat` decimal(10, 7) NULL DEFAULT NULL,
  `gps_lng` decimal(10, 7) NULL DEFAULT NULL,
  `rain_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `air_pressure` double NULL DEFAULT NULL,
  `temperature` double NULL DEFAULT NULL,
  `humidity` double NULL DEFAULT NULL,
  `battery_status` double NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `sensor_data_device_datetime_unique`(`device_id` ASC, `datetime` ASC) USING BTREE,
  CONSTRAINT `sensor_data_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 903 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sensor_data
-- ----------------------------
INSERT INTO `sensor_data` VALUES (1, 1, '2026-06-10 00:00:00', 53, 37.5, 23.9, 179, -2.9912000, 104.7479000, 'Cerah', 1010, 27, 59, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (2, 2, '2026-06-10 00:00:00', 45, 31.3, 20.3, 132, -2.9916000, 104.7485000, 'Cerah', 1007, 30, 51, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (3, 3, '2026-06-10 00:00:00', 61, 37.7, 27.5, 175, -2.9754000, 104.7505000, 'Cerah', 1011, 27, 52, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (4, 4, '2026-06-10 00:00:00', 60, 38, 27, 153, -2.9904000, 104.7592000, 'Cerah', 1006, 27, 51, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (5, 5, '2026-06-10 00:00:00', 52, 33.8, 23.4, 124, -2.9918000, 104.7634000, 'Berawan', 1013, 30, 55, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (6, 6, '2026-06-10 00:00:00', 15, 7.8, 6.8, 51, -3.0211000, 104.7925000, 'Cerah', 1005, 26, 70, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (7, 7, '2026-06-10 00:00:00', 42, 28.3, 18.9, 135, -2.9888000, 104.7570000, 'Cerah', 1010, 29, 59, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (8, 8, '2026-06-10 00:00:00', 79, 56.4, 35.6, 264, -2.9691000, 104.7885000, 'Berawan', 1005, 28, 69, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (9, 9, '2026-06-10 00:00:00', 58, 35.7, 26.1, 152, -2.9723000, 104.8118000, 'Cerah', 1007, 29, 53, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (10, 10, '2026-06-10 00:00:00', 99, 60.4, 44.6, 233, -3.0039000, 104.8152000, 'Cerah', 1006, 30, 54, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (11, 11, '2026-06-10 00:00:00', 64, 41.6, 28.8, 147, -3.0195000, 104.7431000, 'Cerah', 1009, 30, 58, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (12, 12, '2026-06-10 00:00:00', 61, 40.7, 27.5, 171, -2.9972000, 104.7294000, 'Cerah', 1013, 28, 63, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (13, 13, '2026-06-10 00:00:00', 5, 5, 2.3, 40, -2.9431000, 104.7251000, 'Cerah', 1009, 29, 56, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (14, 14, '2026-06-10 00:00:00', 17, 13.1, 7.7, 44, -2.8986000, 104.7014000, 'Cerah', 1013, 29, 64, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (15, 15, '2026-06-10 00:00:00', 72, 43.8, 32.4, 275, -2.9556000, 104.7377000, 'Cerah', 1006, 28, 53, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (16, 1, '2026-06-10 01:00:00', 43, 28, 19.4, 151, -2.9912000, 104.7479000, 'Berawan', 1005, 29, 57, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (17, 2, '2026-06-10 01:00:00', 44, 25.6, 19.8, 143, -2.9916000, 104.7485000, 'Cerah', 1005, 28, 57, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (18, 3, '2026-06-10 01:00:00', 37, 22.1, 16.7, 136, -2.9754000, 104.7505000, 'Cerah', 1011, 26, 63, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (19, 4, '2026-06-10 01:00:00', 50, 34.5, 22.5, 105, -2.9904000, 104.7592000, 'Cerah', 1005, 27, 64, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (20, 5, '2026-06-10 01:00:00', 53, 35.5, 23.9, 111, -2.9918000, 104.7634000, 'Berawan', 1012, 26, 63, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (21, 6, '2026-06-10 01:00:00', 10, 5, 4.5, 38, -3.0211000, 104.7925000, 'Cerah', 1014, 27, 70, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (22, 7, '2026-06-10 01:00:00', 61, 37.7, 27.5, 149, -2.9888000, 104.7570000, 'Cerah', 1007, 28, 61, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (23, 8, '2026-06-10 01:00:00', 74, 43.1, 33.3, 233, -2.9691000, 104.7885000, 'Cerah', 1010, 30, 55, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (24, 9, '2026-06-10 01:00:00', 44, 31.6, 19.8, 116, -2.9723000, 104.8118000, 'Cerah', 1008, 30, 67, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (25, 10, '2026-06-10 01:00:00', 89, 54.9, 40.1, 349, -3.0039000, 104.8152000, 'Cerah', 1008, 27, 65, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (26, 11, '2026-06-10 01:00:00', 42, 25.3, 18.9, 156, -3.0195000, 104.7431000, 'Cerah', 1013, 27, 68, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (27, 12, '2026-06-10 01:00:00', 61, 37.7, 27.5, 148, -2.9972000, 104.7294000, 'Cerah', 1012, 30, 58, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (28, 13, '2026-06-10 01:00:00', 14, 10.1, 6.3, 48, -2.9431000, 104.7251000, 'Cerah', 1011, 26, 50, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (29, 14, '2026-06-10 01:00:00', 7, 5, 3.2, 31, -2.8986000, 104.7014000, 'Cerah', 1014, 29, 52, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (30, 15, '2026-06-10 01:00:00', 86, 56.9, 38.7, 308, -2.9556000, 104.7377000, 'Cerah', 1014, 30, 54, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (31, 1, '2026-06-10 02:00:00', 40, 29, 18, 151, -2.9912000, 104.7479000, 'Cerah', 1010, 30, 66, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (32, 2, '2026-06-10 02:00:00', 51, 31.2, 23, 104, -2.9916000, 104.7485000, 'Berawan', 1005, 30, 66, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (33, 3, '2026-06-10 02:00:00', 53, 35.5, 23.9, 171, -2.9754000, 104.7505000, 'Cerah', 1008, 28, 59, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (34, 4, '2026-06-10 02:00:00', 51, 32.2, 23, 100, -2.9904000, 104.7592000, 'Cerah', 1014, 27, 70, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (35, 5, '2026-06-10 02:00:00', 43, 31, 19.4, 140, -2.9918000, 104.7634000, 'Berawan', 1007, 29, 62, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (36, 6, '2026-06-10 02:00:00', 11, 7.2, 5, 52, -3.0211000, 104.7925000, 'Cerah', 1010, 28, 68, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (37, 7, '2026-06-10 02:00:00', 57, 34.1, 25.7, 119, -2.9888000, 104.7570000, 'Berawan', 1009, 30, 54, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (38, 8, '2026-06-10 02:00:00', 84, 59.6, 37.8, 345, -2.9691000, 104.7885000, 'Cerah', 1012, 30, 68, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (39, 9, '2026-06-10 02:00:00', 53, 32.5, 23.9, 122, -2.9723000, 104.8118000, 'Berawan', 1007, 29, 52, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (40, 10, '2026-06-10 02:00:00', 107, 71.6, 48.2, 290, -3.0039000, 104.8152000, 'Cerah', 1011, 26, 54, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (41, 11, '2026-06-10 02:00:00', 40, 26, 18, 118, -3.0195000, 104.7431000, 'Cerah', 1014, 26, 64, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (42, 12, '2026-06-10 02:00:00', 36, 26.4, 16.2, 165, -2.9972000, 104.7294000, 'Cerah', 1009, 26, 70, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (43, 13, '2026-06-10 02:00:00', 11, 8.2, 5, 38, -2.9431000, 104.7251000, 'Berawan', 1011, 26, 61, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (44, 14, '2026-06-10 02:00:00', 5, 5, 2.3, 40, -2.8986000, 104.7014000, 'Cerah', 1012, 26, 61, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (45, 15, '2026-06-10 02:00:00', 85, 55.3, 38.3, 368, -2.9556000, 104.7377000, 'Cerah', 1009, 28, 56, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (46, 1, '2026-06-10 03:00:00', 62, 37.3, 27.9, 176, -2.9912000, 104.7479000, 'Cerah', 1010, 26, 61, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (47, 2, '2026-06-10 03:00:00', 43, 25, 19.4, 154, -2.9916000, 104.7485000, 'Cerah', 1015, 29, 53, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (48, 3, '2026-06-10 03:00:00', 50, 31.5, 22.5, 129, -2.9754000, 104.7505000, 'Cerah', 1005, 30, 59, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (49, 4, '2026-06-10 03:00:00', 63, 40, 28.4, 121, -2.9904000, 104.7592000, 'Cerah', 1007, 26, 51, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (50, 5, '2026-06-10 03:00:00', 55, 36.8, 24.8, 169, -2.9918000, 104.7634000, 'Berawan', 1006, 27, 65, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (51, 6, '2026-06-10 03:00:00', 14, 7.1, 6.3, 48, -3.0211000, 104.7925000, 'Cerah', 1014, 26, 51, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (52, 7, '2026-06-10 03:00:00', 53, 35.5, 23.9, 141, -2.9888000, 104.7570000, 'Cerah', 1012, 28, 66, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (53, 8, '2026-06-10 03:00:00', 105, 72.3, 47.3, 255, -2.9691000, 104.7885000, 'Cerah', 1010, 29, 60, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (54, 9, '2026-06-10 03:00:00', 37, 21.1, 16.7, 165, -2.9723000, 104.8118000, 'Cerah', 1015, 29, 52, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (55, 10, '2026-06-10 03:00:00', 92, 64.8, 41.4, 320, -3.0039000, 104.8152000, 'Berawan', 1014, 29, 67, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (56, 11, '2026-06-10 03:00:00', 59, 39.4, 26.6, 103, -3.0195000, 104.7431000, 'Cerah', 1014, 26, 67, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (57, 12, '2026-06-10 03:00:00', 57, 36.1, 25.7, 115, -2.9972000, 104.7294000, 'Cerah', 1007, 30, 58, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (58, 13, '2026-06-10 03:00:00', 6, 5, 2.7, 40, -2.9431000, 104.7251000, 'Cerah', 1014, 29, 67, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (59, 14, '2026-06-10 03:00:00', 6, 5, 2.7, 46, -2.8986000, 104.7014000, 'Cerah', 1013, 26, 64, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (60, 15, '2026-06-10 03:00:00', 98, 63.7, 44.1, 342, -2.9556000, 104.7377000, 'Cerah', 1014, 27, 59, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (61, 1, '2026-06-10 04:00:00', 55, 33.8, 24.8, 141, -2.9912000, 104.7479000, 'Berawan', 1013, 26, 55, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (62, 2, '2026-06-10 04:00:00', 65, 39.3, 29.3, 137, -2.9916000, 104.7485000, 'Cerah', 1013, 28, 50, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (63, 3, '2026-06-10 04:00:00', 57, 38.1, 25.7, 167, -2.9754000, 104.7505000, 'Cerah', 1008, 28, 53, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (64, 4, '2026-06-10 04:00:00', 40, 28, 18, 138, -2.9904000, 104.7592000, 'Berawan', 1011, 29, 64, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (65, 5, '2026-06-10 04:00:00', 50, 33.5, 22.5, 168, -2.9918000, 104.7634000, 'Cerah', 1015, 26, 66, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (66, 6, '2026-06-10 04:00:00', 15, 9.8, 6.8, 55, -3.0211000, 104.7925000, 'Berawan', 1015, 30, 55, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (67, 7, '2026-06-10 04:00:00', 52, 35.8, 23.4, 124, -2.9888000, 104.7570000, 'Cerah', 1014, 29, 54, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (68, 8, '2026-06-10 04:00:00', 96, 66.4, 43.2, 345, -2.9691000, 104.7885000, 'Cerah', 1014, 28, 62, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (69, 9, '2026-06-10 04:00:00', 57, 39.1, 25.7, 143, -2.9723000, 104.8118000, 'Cerah', 1012, 30, 62, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (70, 10, '2026-06-10 04:00:00', 85, 54.3, 38.3, 371, -3.0039000, 104.8152000, 'Cerah', 1005, 30, 61, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (71, 11, '2026-06-10 04:00:00', 36, 22.4, 16.2, 170, -3.0195000, 104.7431000, 'Cerah', 1015, 26, 60, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (72, 12, '2026-06-10 04:00:00', 45, 27.3, 20.3, 159, -2.9972000, 104.7294000, 'Cerah', 1010, 27, 56, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (73, 13, '2026-06-10 04:00:00', 17, 9.1, 7.7, 55, -2.9431000, 104.7251000, 'Cerah', 1014, 29, 52, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (74, 14, '2026-06-10 04:00:00', 7, 5, 3.2, 35, -2.8986000, 104.7014000, 'Cerah', 1012, 26, 66, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (75, 15, '2026-06-10 04:00:00', 95, 64.8, 42.8, 340, -2.9556000, 104.7377000, 'Cerah', 1009, 28, 64, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (76, 1, '2026-06-10 05:00:00', 63, 43, 28.4, 156, -2.9912000, 104.7479000, 'Cerah', 1015, 30, 57, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (77, 2, '2026-06-10 05:00:00', 61, 41.7, 27.5, 160, -2.9916000, 104.7485000, 'Cerah', 1005, 26, 58, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (78, 3, '2026-06-10 05:00:00', 58, 40.7, 26.1, 164, -2.9754000, 104.7505000, 'Cerah', 1008, 26, 65, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (79, 4, '2026-06-10 05:00:00', 65, 41.3, 29.3, 180, -2.9904000, 104.7592000, 'Cerah', 1010, 28, 57, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (80, 5, '2026-06-10 05:00:00', 64, 43.6, 28.8, 147, -2.9918000, 104.7634000, 'Cerah', 1015, 27, 50, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (81, 6, '2026-06-10 05:00:00', 15, 9.8, 6.8, 42, -3.0211000, 104.7925000, 'Cerah', 1009, 30, 54, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (82, 7, '2026-06-10 05:00:00', 60, 38, 27, 137, -2.9888000, 104.7570000, 'Cerah', 1006, 28, 56, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (83, 8, '2026-06-10 05:00:00', 95, 56.8, 42.8, 318, -2.9691000, 104.7885000, 'Cerah', 1013, 28, 56, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (84, 9, '2026-06-10 05:00:00', 45, 30.3, 20.3, 176, -2.9723000, 104.8118000, 'Cerah', 1014, 29, 57, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (85, 10, '2026-06-10 05:00:00', 89, 59.9, 40.1, 313, -3.0039000, 104.8152000, 'Cerah', 1011, 28, 57, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (86, 11, '2026-06-10 05:00:00', 65, 41.3, 29.3, 127, -3.0195000, 104.7431000, 'Cerah', 1013, 29, 57, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (87, 12, '2026-06-10 05:00:00', 64, 42.6, 28.8, 172, -2.9972000, 104.7294000, 'Cerah', 1008, 30, 68, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (88, 13, '2026-06-10 05:00:00', 9, 5.9, 4.1, 50, -2.9431000, 104.7251000, 'Cerah', 1015, 30, 50, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (89, 14, '2026-06-10 05:00:00', 11, 8.2, 5, 57, -2.8986000, 104.7014000, 'Berawan', 1008, 30, 63, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (90, 15, '2026-06-10 05:00:00', 85, 53.3, 38.3, 307, -2.9556000, 104.7377000, 'Cerah', 1015, 28, 56, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (91, 1, '2026-06-10 06:00:00', 51, 32.2, 23, 151, -2.9912000, 104.7479000, 'Cerah', 1005, 28, 63, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (92, 2, '2026-06-10 06:00:00', 38, 21.7, 17.1, 107, -2.9916000, 104.7485000, 'Cerah', 1013, 26, 66, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (93, 3, '2026-06-10 06:00:00', 35, 20.8, 15.8, 176, -2.9754000, 104.7505000, 'Cerah', 1013, 29, 54, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (94, 4, '2026-06-10 06:00:00', 49, 31.9, 22.1, 115, -2.9904000, 104.7592000, 'Cerah', 1015, 26, 69, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (95, 5, '2026-06-10 06:00:00', 44, 25.6, 19.8, 153, -2.9918000, 104.7634000, 'Cerah', 1014, 26, 68, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (96, 6, '2026-06-10 06:00:00', 6, 5.9, 2.7, 31, -3.0211000, 104.7925000, 'Cerah', 1008, 27, 68, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (97, 7, '2026-06-10 06:00:00', 36, 21.4, 16.2, 180, -2.9888000, 104.7570000, 'Cerah', 1010, 29, 56, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (98, 8, '2026-06-10 06:00:00', 85, 55.3, 38.3, 362, -2.9691000, 104.7885000, 'Cerah', 1014, 28, 64, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (99, 9, '2026-06-10 06:00:00', 55, 34.8, 24.8, 172, -2.9723000, 104.8118000, 'Cerah', 1010, 27, 58, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (100, 10, '2026-06-10 06:00:00', 74, 48.1, 33.3, 322, -3.0039000, 104.8152000, 'Cerah', 1008, 26, 51, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (101, 11, '2026-06-10 06:00:00', 59, 40.4, 26.6, 166, -3.0195000, 104.7431000, 'Cerah', 1013, 30, 50, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (102, 12, '2026-06-10 06:00:00', 36, 26.4, 16.2, 179, -2.9972000, 104.7294000, 'Cerah', 1011, 29, 55, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (103, 13, '2026-06-10 06:00:00', 9, 5.9, 4.1, 42, -2.9431000, 104.7251000, 'Cerah', 1011, 28, 70, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (104, 14, '2026-06-10 06:00:00', 15, 7.8, 6.8, 54, -2.8986000, 104.7014000, 'Cerah', 1014, 30, 65, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (105, 15, '2026-06-10 06:00:00', 94, 63.1, 42.3, 245, -2.9556000, 104.7377000, 'Cerah', 1005, 29, 63, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (106, 1, '2026-06-10 07:00:00', 93, 63.5, 41.9, 234, -2.9912000, 104.7479000, 'Cerah', 1006, 28, 70, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (107, 2, '2026-06-10 07:00:00', 72, 49.8, 32.4, 269, -2.9916000, 104.7485000, 'Cerah', 1009, 29, 51, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (108, 3, '2026-06-10 07:00:00', 89, 57.9, 40.1, 202, -2.9754000, 104.7505000, 'Cerah', 1009, 26, 59, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (109, 4, '2026-06-10 07:00:00', 89, 55.9, 40.1, 186, -2.9904000, 104.7592000, 'Cerah', 1008, 28, 70, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (110, 5, '2026-06-10 07:00:00', 80, 52, 36, 226, -2.9918000, 104.7634000, 'Cerah', 1009, 27, 68, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (111, 6, '2026-06-10 07:00:00', 25, 14.3, 11.3, 63, -3.0211000, 104.7925000, 'Cerah', 1005, 26, 70, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (112, 7, '2026-06-10 07:00:00', 73, 47.5, 32.9, 252, -2.9888000, 104.7570000, 'Cerah', 1009, 26, 56, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (113, 8, '2026-06-10 07:00:00', 110, 74.5, 49.5, 455, -2.9691000, 104.7885000, 'Cerah', 1006, 26, 61, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (114, 9, '2026-06-10 07:00:00', 73, 48.5, 32.9, 209, -2.9723000, 104.8118000, 'Cerah', 1008, 27, 70, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (115, 10, '2026-06-10 07:00:00', 132, 82.8, 59.4, 460, -3.0039000, 104.8152000, 'Cerah', 1005, 27, 58, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (116, 11, '2026-06-10 07:00:00', 83, 57, 37.4, 237, -3.0195000, 104.7431000, 'Cerah', 1005, 27, 68, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (117, 12, '2026-06-10 07:00:00', 94, 64.1, 42.3, 267, -2.9972000, 104.7294000, 'Cerah', 1011, 28, 60, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (118, 13, '2026-06-10 07:00:00', 26, 17.9, 11.7, 50, -2.9431000, 104.7251000, 'Cerah', 1014, 28, 54, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (119, 14, '2026-06-10 07:00:00', 27, 17.6, 12.2, 74, -2.8986000, 104.7014000, 'Cerah', 1015, 26, 69, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (120, 15, '2026-06-10 07:00:00', 141, 91.7, 63.5, 423, -2.9556000, 104.7377000, 'Cerah', 1010, 28, 53, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (121, 1, '2026-06-10 08:00:00', 84, 53.6, 37.8, 223, -2.9912000, 104.7479000, 'Cerah', 1011, 30, 52, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (122, 2, '2026-06-10 08:00:00', 89, 57.9, 40.1, 214, -2.9916000, 104.7485000, 'Cerah', 1007, 26, 51, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (123, 3, '2026-06-10 08:00:00', 65, 44.3, 29.3, 260, -2.9754000, 104.7505000, 'Cerah', 1008, 28, 63, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (124, 4, '2026-06-10 08:00:00', 71, 49.2, 32, 249, -2.9904000, 104.7592000, 'Cerah', 1005, 30, 63, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (125, 5, '2026-06-10 08:00:00', 68, 41.2, 30.6, 236, -2.9918000, 104.7634000, 'Cerah', 1007, 27, 69, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (126, 6, '2026-06-10 08:00:00', 19, 13.4, 8.6, 76, -3.0211000, 104.7925000, 'Cerah', 1009, 26, 50, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (127, 7, '2026-06-10 08:00:00', 87, 57.6, 39.2, 249, -2.9888000, 104.7570000, 'Cerah', 1010, 30, 54, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (128, 8, '2026-06-10 08:00:00', 150, 96.5, 67.5, 533, -2.9691000, 104.7885000, 'Cerah', 1009, 30, 65, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (129, 9, '2026-06-10 08:00:00', 67, 44.6, 30.2, 267, -2.9723000, 104.8118000, 'Cerah', 1014, 26, 52, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (130, 10, '2026-06-10 08:00:00', 157, 104.1, 70.7, 472, -3.0039000, 104.8152000, 'Cerah', 1011, 30, 56, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (131, 11, '2026-06-10 08:00:00', 68, 43.2, 30.6, 255, -3.0195000, 104.7431000, 'Cerah', 1008, 26, 51, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (132, 12, '2026-06-10 08:00:00', 89, 58.9, 40.1, 215, -2.9972000, 104.7294000, 'Cerah', 1005, 30, 58, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (133, 13, '2026-06-10 08:00:00', 16, 9.4, 7.2, 50, -2.9431000, 104.7251000, 'Cerah', 1012, 26, 57, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (134, 14, '2026-06-10 08:00:00', 18, 9.7, 8.1, 60, -2.8986000, 104.7014000, 'Cerah', 1006, 28, 53, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (135, 15, '2026-06-10 08:00:00', 141, 95.7, 63.5, 568, -2.9556000, 104.7377000, 'Cerah', 1009, 27, 69, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (136, 1, '2026-06-10 09:00:00', 72, 48.8, 32.4, 215, -2.9912000, 104.7479000, 'Cerah', 1008, 27, 63, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (137, 2, '2026-06-10 09:00:00', 88, 56.2, 39.6, 266, -2.9916000, 104.7485000, 'Cerah', 1008, 27, 68, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (138, 3, '2026-06-10 09:00:00', 68, 43.2, 30.6, 208, -2.9754000, 104.7505000, 'Cerah', 1013, 26, 63, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (139, 4, '2026-06-10 09:00:00', 68, 41.2, 30.6, 236, -2.9904000, 104.7592000, 'Cerah', 1012, 30, 63, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (140, 5, '2026-06-10 09:00:00', 94, 61.1, 42.3, 212, -2.9918000, 104.7634000, 'Cerah', 1006, 30, 53, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (141, 6, '2026-06-10 09:00:00', 16, 12.4, 7.2, 57, -3.0211000, 104.7925000, 'Cerah', 1014, 30, 69, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (142, 7, '2026-06-10 09:00:00', 71, 48.2, 32, 182, -2.9888000, 104.7570000, 'Cerah', 1009, 29, 62, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (143, 8, '2026-06-10 09:00:00', 147, 99.6, 66.2, 408, -2.9691000, 104.7885000, 'Cerah', 1014, 26, 70, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (144, 9, '2026-06-10 09:00:00', 71, 48.2, 32, 206, -2.9723000, 104.8118000, 'Cerah', 1010, 30, 69, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (145, 10, '2026-06-10 09:00:00', 119, 76.4, 53.6, 467, -3.0039000, 104.8152000, 'Cerah', 1013, 29, 54, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (146, 11, '2026-06-10 09:00:00', 69, 47.9, 31.1, 193, -3.0195000, 104.7431000, 'Cerah', 1007, 26, 55, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (147, 12, '2026-06-10 09:00:00', 80, 50, 36, 187, -2.9972000, 104.7294000, 'Cerah', 1015, 28, 53, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (148, 13, '2026-06-10 09:00:00', 25, 14.3, 11.3, 74, -2.9431000, 104.7251000, 'Cerah', 1007, 27, 52, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (149, 14, '2026-06-10 09:00:00', 23, 13, 10.4, 70, -2.8986000, 104.7014000, 'Cerah', 1011, 27, 70, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (150, 15, '2026-06-10 09:00:00', 124, 75.6, 55.8, 442, -2.9556000, 104.7377000, 'Cerah', 1007, 30, 63, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (151, 1, '2026-06-10 10:00:00', 39, 27.4, 17.6, 150, -2.9912000, 104.7479000, 'Cerah', 1007, 30, 52, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (152, 2, '2026-06-10 10:00:00', 44, 27.6, 19.8, 161, -2.9916000, 104.7485000, 'Cerah', 1013, 29, 58, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (153, 3, '2026-06-10 10:00:00', 38, 25.7, 17.1, 108, -2.9754000, 104.7505000, 'Cerah', 1012, 29, 60, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (154, 4, '2026-06-10 10:00:00', 61, 39.7, 27.5, 104, -2.9904000, 104.7592000, 'Cerah', 1013, 27, 52, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (155, 5, '2026-06-10 10:00:00', 46, 27.9, 20.7, 161, -2.9918000, 104.7634000, 'Cerah', 1012, 28, 65, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (156, 6, '2026-06-10 10:00:00', 14, 9.1, 6.3, 45, -3.0211000, 104.7925000, 'Cerah', 1008, 26, 63, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (157, 7, '2026-06-10 10:00:00', 62, 41.3, 27.9, 151, -2.9888000, 104.7570000, 'Cerah', 1007, 26, 67, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (158, 8, '2026-06-10 10:00:00', 109, 69.9, 49.1, 352, -2.9691000, 104.7885000, 'Cerah', 1012, 30, 56, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (159, 9, '2026-06-10 10:00:00', 50, 34.5, 22.5, 143, -2.9723000, 104.8118000, 'Cerah', 1005, 28, 58, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (160, 10, '2026-06-10 10:00:00', 71, 42.2, 32, 222, -3.0039000, 104.8152000, 'Cerah', 1015, 29, 62, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (161, 11, '2026-06-10 10:00:00', 37, 21.1, 16.7, 167, -3.0195000, 104.7431000, 'Cerah', 1015, 30, 50, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (162, 12, '2026-06-10 10:00:00', 53, 34.5, 23.9, 179, -2.9972000, 104.7294000, 'Cerah', 1006, 30, 67, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (163, 13, '2026-06-10 10:00:00', 9, 7.9, 4.1, 37, -2.9431000, 104.7251000, 'Cerah', 1014, 30, 66, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (164, 14, '2026-06-10 10:00:00', 5, 5.3, 2.3, 56, -2.8986000, 104.7014000, 'Cerah', 1013, 30, 54, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (165, 15, '2026-06-10 10:00:00', 107, 71.6, 48.2, 241, -2.9556000, 104.7377000, 'Cerah', 1005, 28, 60, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (166, 1, '2026-06-10 11:00:00', 64, 38.6, 28.8, 115, -2.9912000, 104.7479000, 'Cerah', 1011, 28, 60, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (167, 2, '2026-06-10 11:00:00', 45, 30.3, 20.3, 125, -2.9916000, 104.7485000, 'Cerah', 1011, 27, 57, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (168, 3, '2026-06-10 11:00:00', 58, 35.7, 26.1, 108, -2.9754000, 104.7505000, 'Cerah', 1013, 28, 68, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (169, 4, '2026-06-10 11:00:00', 46, 31.9, 20.7, 152, -2.9904000, 104.7592000, 'Cerah', 1009, 30, 55, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (170, 5, '2026-06-10 11:00:00', 62, 42.3, 27.9, 100, -2.9918000, 104.7634000, 'Cerah', 1006, 26, 54, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (171, 6, '2026-06-10 11:00:00', 7, 6.6, 3.2, 37, -3.0211000, 104.7925000, 'Cerah', 1009, 28, 64, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (172, 7, '2026-06-10 11:00:00', 36, 21.4, 16.2, 114, -2.9888000, 104.7570000, 'Cerah', 1014, 30, 61, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (173, 8, '2026-06-10 11:00:00', 107, 73.6, 48.2, 244, -2.9691000, 104.7885000, 'Cerah', 1013, 29, 51, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (174, 9, '2026-06-10 11:00:00', 51, 33.2, 23, 176, -2.9723000, 104.8118000, 'Cerah', 1009, 30, 55, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (175, 10, '2026-06-10 11:00:00', 90, 54.5, 40.5, 315, -3.0039000, 104.8152000, 'Cerah', 1012, 30, 56, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (176, 11, '2026-06-10 11:00:00', 62, 39.3, 27.9, 135, -3.0195000, 104.7431000, 'Cerah', 1011, 30, 51, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (177, 12, '2026-06-10 11:00:00', 39, 27.4, 17.6, 139, -2.9972000, 104.7294000, 'Cerah', 1009, 26, 52, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (178, 13, '2026-06-10 11:00:00', 6, 5, 2.7, 33, -2.9431000, 104.7251000, 'Cerah', 1008, 30, 63, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (179, 14, '2026-06-10 11:00:00', 13, 6.5, 5.9, 44, -2.8986000, 104.7014000, 'Cerah', 1005, 27, 65, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (180, 15, '2026-06-10 11:00:00', 110, 73.5, 49.5, 296, -2.9556000, 104.7377000, 'Cerah', 1010, 28, 51, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (181, 1, '2026-06-10 12:00:00', 41, 26.7, 18.5, 107, -2.9912000, 104.7479000, 'Cerah', 1011, 26, 62, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (182, 2, '2026-06-10 12:00:00', 41, 23.7, 18.5, 146, -2.9916000, 104.7485000, 'Cerah', 1014, 30, 60, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (183, 3, '2026-06-10 12:00:00', 53, 33.5, 23.9, 132, -2.9754000, 104.7505000, 'Cerah', 1012, 27, 61, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (184, 4, '2026-06-10 12:00:00', 44, 31.6, 19.8, 110, -2.9904000, 104.7592000, 'Cerah', 1010, 28, 61, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (185, 5, '2026-06-10 12:00:00', 44, 27.6, 19.8, 119, -2.9918000, 104.7634000, 'Cerah', 1007, 26, 57, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (186, 6, '2026-06-10 12:00:00', 14, 9.1, 6.3, 48, -3.0211000, 104.7925000, 'Cerah', 1009, 30, 56, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (187, 7, '2026-06-10 12:00:00', 56, 35.4, 25.2, 116, -2.9888000, 104.7570000, 'Cerah', 1009, 28, 60, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (188, 8, '2026-06-10 12:00:00', 71, 44.2, 32, 320, -2.9691000, 104.7885000, 'Cerah', 1005, 29, 68, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (189, 9, '2026-06-10 12:00:00', 52, 33.8, 23.4, 146, -2.9723000, 104.8118000, 'Cerah', 1012, 27, 66, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (190, 10, '2026-06-10 12:00:00', 89, 62.9, 40.1, 221, -3.0039000, 104.8152000, 'Cerah', 1010, 30, 60, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (191, 11, '2026-06-10 12:00:00', 48, 28.2, 21.6, 148, -3.0195000, 104.7431000, 'Cerah', 1010, 29, 63, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (192, 12, '2026-06-10 12:00:00', 50, 32.5, 22.5, 128, -2.9972000, 104.7294000, 'Cerah', 1014, 27, 59, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (193, 13, '2026-06-10 12:00:00', 12, 6.8, 5.4, 57, -2.9431000, 104.7251000, 'Cerah', 1006, 29, 66, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (194, 14, '2026-06-10 12:00:00', 7, 6.6, 3.2, 35, -2.8986000, 104.7014000, 'Cerah', 1012, 27, 61, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (195, 15, '2026-06-10 12:00:00', 81, 48.7, 36.5, 348, -2.9556000, 104.7377000, 'Cerah', 1007, 26, 67, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (196, 1, '2026-06-10 13:00:00', 58, 39.7, 26.1, 111, -2.9912000, 104.7479000, 'Berawan', 1015, 28, 56, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (197, 2, '2026-06-10 13:00:00', 57, 39.1, 25.7, 123, -2.9916000, 104.7485000, 'Gerimis', 1013, 26, 70, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (198, 3, '2026-06-10 13:00:00', 52, 33.8, 23.4, 172, -2.9754000, 104.7505000, 'Berawan', 1007, 29, 69, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (199, 4, '2026-06-10 13:00:00', 37, 27.1, 16.7, 163, -2.9904000, 104.7592000, 'Berawan', 1006, 29, 54, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (200, 5, '2026-06-10 13:00:00', 59, 40.4, 26.6, 170, -2.9918000, 104.7634000, 'Berawan', 1005, 26, 69, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (201, 6, '2026-06-10 13:00:00', 17, 12.1, 7.7, 42, -3.0211000, 104.7925000, 'Berawan', 1008, 27, 61, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (202, 7, '2026-06-10 13:00:00', 55, 37.8, 24.8, 178, -2.9888000, 104.7570000, 'Gerimis', 1015, 28, 72, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (203, 8, '2026-06-10 13:00:00', 103, 67, 46.4, 379, -2.9691000, 104.7885000, 'Berawan', 1006, 28, 53, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (204, 9, '2026-06-10 13:00:00', 35, 24.8, 15.8, 100, -2.9723000, 104.8118000, 'Berawan', 1014, 28, 61, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (205, 10, '2026-06-10 13:00:00', 104, 65.6, 46.8, 335, -3.0039000, 104.8152000, 'Hujan', 1005, 26, 93, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (206, 11, '2026-06-10 13:00:00', 48, 28.2, 21.6, 110, -3.0195000, 104.7431000, 'Berawan', 1012, 30, 70, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (207, 12, '2026-06-10 13:00:00', 48, 28.2, 21.6, 127, -2.9972000, 104.7294000, 'Berawan', 1010, 30, 53, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (208, 13, '2026-06-10 13:00:00', 16, 10.4, 7.2, 45, -2.9431000, 104.7251000, 'Berawan', 1013, 26, 66, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (209, 14, '2026-06-10 13:00:00', 14, 8.1, 6.3, 37, -2.8986000, 104.7014000, 'Berawan', 1012, 28, 54, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (210, 15, '2026-06-10 13:00:00', 83, 52, 37.4, 341, -2.9556000, 104.7377000, 'Gerimis', 1008, 26, 84, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (211, 1, '2026-06-10 14:00:00', 35, 22.8, 15.8, 155, -2.9912000, 104.7479000, 'Gerimis', 1007, 29, 76, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (212, 2, '2026-06-10 14:00:00', 56, 36.4, 25.2, 133, -2.9916000, 104.7485000, 'Berawan', 1013, 29, 60, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (213, 3, '2026-06-10 14:00:00', 55, 32.8, 24.8, 106, -2.9754000, 104.7505000, 'Berawan', 1006, 30, 53, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (214, 4, '2026-06-10 14:00:00', 56, 33.4, 25.2, 106, -2.9904000, 104.7592000, 'Berawan', 1008, 28, 62, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (215, 5, '2026-06-10 14:00:00', 36, 24.4, 16.2, 142, -2.9918000, 104.7634000, 'Berawan', 1007, 29, 51, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (216, 6, '2026-06-10 14:00:00', 5, 5, 2.3, 53, -3.0211000, 104.7925000, 'Gerimis', 1014, 27, 78, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (217, 7, '2026-06-10 14:00:00', 40, 23, 18, 178, -2.9888000, 104.7570000, 'Hujan', 1015, 26, 83, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (218, 8, '2026-06-10 14:00:00', 105, 64.3, 47.3, 265, -2.9691000, 104.7885000, 'Berawan', 1012, 27, 64, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (219, 9, '2026-06-10 14:00:00', 57, 36.1, 25.7, 179, -2.9723000, 104.8118000, 'Berawan', 1014, 26, 50, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (220, 10, '2026-06-10 14:00:00', 96, 63.4, 43.2, 282, -3.0039000, 104.8152000, 'Berawan', 1008, 29, 70, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (221, 11, '2026-06-10 14:00:00', 59, 37.4, 26.6, 115, -3.0195000, 104.7431000, 'Gerimis', 1010, 29, 76, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (222, 12, '2026-06-10 14:00:00', 35, 24.8, 15.8, 164, -2.9972000, 104.7294000, 'Gerimis', 1013, 28, 81, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (223, 13, '2026-06-10 14:00:00', 6, 5.9, 2.7, 45, -2.9431000, 104.7251000, 'Hujan', 1011, 29, 85, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (224, 14, '2026-06-10 14:00:00', 16, 12.4, 7.2, 33, -2.8986000, 104.7014000, 'Berawan', 1009, 26, 65, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (225, 15, '2026-06-10 14:00:00', 110, 66.5, 49.5, 293, -2.9556000, 104.7377000, 'Gerimis', 1012, 26, 70, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (226, 1, '2026-06-10 15:00:00', 40, 23, 18, 149, -2.9912000, 104.7479000, 'Hujan', 1005, 30, 80, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (227, 2, '2026-06-10 15:00:00', 41, 24.7, 18.5, 167, -2.9916000, 104.7485000, 'Gerimis', 1009, 29, 77, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (228, 3, '2026-06-10 15:00:00', 59, 41.4, 26.6, 158, -2.9754000, 104.7505000, 'Berawan', 1008, 30, 58, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (229, 4, '2026-06-10 15:00:00', 60, 41, 27, 101, -2.9904000, 104.7592000, 'Berawan', 1005, 26, 59, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (230, 5, '2026-06-10 15:00:00', 53, 34.5, 23.9, 132, -2.9918000, 104.7634000, 'Berawan', 1013, 29, 60, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (231, 6, '2026-06-10 15:00:00', 8, 5, 3.6, 59, -3.0211000, 104.7925000, 'Gerimis', 1006, 26, 83, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (232, 7, '2026-06-10 15:00:00', 51, 35.2, 23, 177, -2.9888000, 104.7570000, 'Berawan', 1008, 28, 67, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (233, 8, '2026-06-10 15:00:00', 73, 50.5, 32.9, 229, -2.9691000, 104.7885000, 'Berawan', 1014, 27, 57, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (234, 9, '2026-06-10 15:00:00', 36, 25.4, 16.2, 155, -2.9723000, 104.8118000, 'Gerimis', 1015, 30, 76, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (235, 10, '2026-06-10 15:00:00', 94, 63.1, 42.3, 248, -3.0039000, 104.8152000, 'Berawan', 1010, 26, 63, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (236, 11, '2026-06-10 15:00:00', 63, 38, 28.4, 104, -3.0195000, 104.7431000, 'Berawan', 1005, 27, 62, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (237, 12, '2026-06-10 15:00:00', 39, 26.4, 17.6, 164, -2.9972000, 104.7294000, 'Berawan', 1009, 26, 61, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (238, 13, '2026-06-10 15:00:00', 9, 7.9, 4.1, 50, -2.9431000, 104.7251000, 'Gerimis', 1005, 28, 84, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (239, 14, '2026-06-10 15:00:00', 13, 7.5, 5.9, 40, -2.8986000, 104.7014000, 'Berawan', 1012, 28, 67, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (240, 15, '2026-06-10 15:00:00', 88, 56.2, 39.6, 343, -2.9556000, 104.7377000, 'Gerimis', 1013, 30, 84, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (241, 1, '2026-06-10 16:00:00', 62, 41.3, 27.9, 108, -2.9912000, 104.7479000, 'Berawan', 1010, 30, 64, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (242, 2, '2026-06-10 16:00:00', 36, 22.4, 16.2, 114, -2.9916000, 104.7485000, 'Hujan', 1008, 27, 89, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (243, 3, '2026-06-10 16:00:00', 61, 37.7, 27.5, 150, -2.9754000, 104.7505000, 'Hujan', 1005, 27, 95, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (244, 4, '2026-06-10 16:00:00', 59, 35.4, 26.6, 161, -2.9904000, 104.7592000, 'Hujan', 1014, 26, 88, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (245, 5, '2026-06-10 16:00:00', 44, 30.6, 19.8, 159, -2.9918000, 104.7634000, 'Berawan', 1008, 28, 54, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (246, 6, '2026-06-10 16:00:00', 7, 5.6, 3.2, 54, -3.0211000, 104.7925000, 'Gerimis', 1010, 26, 81, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (247, 7, '2026-06-10 16:00:00', 41, 24.7, 18.5, 128, -2.9888000, 104.7570000, 'Berawan', 1008, 30, 69, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (248, 8, '2026-06-10 16:00:00', 108, 65.2, 48.6, 232, -2.9691000, 104.7885000, 'Berawan', 1012, 29, 69, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (249, 9, '2026-06-10 16:00:00', 46, 29.9, 20.7, 156, -2.9723000, 104.8118000, 'Berawan', 1013, 26, 61, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (250, 10, '2026-06-10 16:00:00', 98, 68.7, 44.1, 359, -3.0039000, 104.8152000, 'Gerimis', 1008, 28, 72, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (251, 11, '2026-06-10 16:00:00', 60, 41, 27, 165, -3.0195000, 104.7431000, 'Berawan', 1005, 29, 57, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (252, 12, '2026-06-10 16:00:00', 44, 31.6, 19.8, 116, -2.9972000, 104.7294000, 'Gerimis', 1006, 27, 76, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (253, 13, '2026-06-10 16:00:00', 12, 9.8, 5.4, 38, -2.9431000, 104.7251000, 'Gerimis', 1011, 26, 77, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (254, 14, '2026-06-10 16:00:00', 8, 7.2, 3.6, 52, -2.8986000, 104.7014000, 'Gerimis', 1005, 29, 79, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (255, 15, '2026-06-10 16:00:00', 71, 47.2, 32, 370, -2.9556000, 104.7377000, 'Hujan', 1012, 29, 83, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (256, 1, '2026-06-10 17:00:00', 84, 52.6, 37.8, 233, -2.9912000, 104.7479000, 'Cerah', 1005, 27, 66, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (257, 2, '2026-06-10 17:00:00', 77, 47.1, 34.7, 255, -2.9916000, 104.7485000, 'Cerah', 1015, 27, 69, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (258, 3, '2026-06-10 17:00:00', 76, 48.4, 34.2, 215, -2.9754000, 104.7505000, 'Cerah', 1014, 29, 68, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (259, 4, '2026-06-10 17:00:00', 69, 42.9, 31.1, 224, -2.9904000, 104.7592000, 'Cerah', 1009, 28, 64, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (260, 5, '2026-06-10 17:00:00', 90, 60.5, 40.5, 255, -2.9918000, 104.7634000, 'Cerah', 1010, 26, 63, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (261, 6, '2026-06-10 17:00:00', 17, 9.1, 7.7, 68, -3.0211000, 104.7925000, 'Cerah', 1013, 30, 60, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (262, 7, '2026-06-10 17:00:00', 77, 53.1, 34.7, 259, -2.9888000, 104.7570000, 'Cerah', 1010, 30, 65, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (263, 8, '2026-06-10 17:00:00', 145, 94.3, 65.3, 532, -2.9691000, 104.7885000, 'Cerah', 1011, 26, 64, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (264, 9, '2026-06-10 17:00:00', 95, 60.8, 42.8, 246, -2.9723000, 104.8118000, 'Cerah', 1009, 30, 51, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (265, 10, '2026-06-10 17:00:00', 115, 76.8, 51.8, 425, -3.0039000, 104.8152000, 'Cerah', 1014, 30, 62, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (266, 11, '2026-06-10 17:00:00', 74, 46.1, 33.3, 212, -3.0195000, 104.7431000, 'Cerah', 1013, 30, 57, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (267, 12, '2026-06-10 17:00:00', 66, 41.9, 29.7, 233, -2.9972000, 104.7294000, 'Cerah', 1013, 28, 66, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (268, 13, '2026-06-10 17:00:00', 18, 11.7, 8.1, 82, -2.9431000, 104.7251000, 'Cerah', 1010, 27, 57, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (269, 14, '2026-06-10 17:00:00', 29, 18.9, 13.1, 74, -2.8986000, 104.7014000, 'Cerah', 1006, 27, 62, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (270, 15, '2026-06-10 17:00:00', 143, 97, 64.4, 564, -2.9556000, 104.7377000, 'Cerah', 1008, 29, 60, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (271, 1, '2026-06-10 18:00:00', 77, 49.1, 34.7, 199, -2.9912000, 104.7479000, 'Cerah', 1005, 26, 70, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (272, 2, '2026-06-10 18:00:00', 95, 59.8, 42.8, 201, -2.9916000, 104.7485000, 'Cerah', 1010, 30, 59, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (273, 3, '2026-06-10 18:00:00', 92, 61.8, 41.4, 265, -2.9754000, 104.7505000, 'Cerah', 1010, 27, 69, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (274, 4, '2026-06-10 18:00:00', 69, 46.9, 31.1, 186, -2.9904000, 104.7592000, 'Cerah', 1005, 28, 63, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (275, 5, '2026-06-10 18:00:00', 84, 55.6, 37.8, 203, -2.9918000, 104.7634000, 'Cerah', 1008, 27, 65, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (276, 6, '2026-06-10 18:00:00', 21, 11.7, 9.5, 81, -3.0211000, 104.7925000, 'Cerah', 1011, 30, 59, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (277, 7, '2026-06-10 18:00:00', 74, 47.1, 33.3, 198, -2.9888000, 104.7570000, 'Cerah', 1008, 30, 67, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (278, 8, '2026-06-10 18:00:00', 143, 91, 64.4, 478, -2.9691000, 104.7885000, 'Cerah', 1008, 29, 58, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (279, 9, '2026-06-10 18:00:00', 83, 57, 37.4, 192, -2.9723000, 104.8118000, 'Cerah', 1015, 28, 67, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (280, 10, '2026-06-10 18:00:00', 155, 98.8, 69.8, 546, -3.0039000, 104.8152000, 'Cerah', 1014, 30, 53, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (281, 11, '2026-06-10 18:00:00', 65, 42.3, 29.3, 242, -3.0195000, 104.7431000, 'Cerah', 1009, 27, 61, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (282, 12, '2026-06-10 18:00:00', 76, 49.4, 34.2, 248, -2.9972000, 104.7294000, 'Cerah', 1015, 29, 61, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (283, 13, '2026-06-10 18:00:00', 22, 12.3, 9.9, 90, -2.9431000, 104.7251000, 'Cerah', 1006, 26, 70, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (284, 14, '2026-06-10 18:00:00', 23, 17, 10.4, 76, -2.8986000, 104.7014000, 'Cerah', 1013, 29, 54, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (285, 15, '2026-06-10 18:00:00', 127, 77.6, 57.2, 554, -2.9556000, 104.7377000, 'Cerah', 1007, 27, 62, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (286, 1, '2026-06-10 19:00:00', 73, 49.5, 32.9, 195, -2.9912000, 104.7479000, 'Cerah', 1010, 29, 66, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (287, 2, '2026-06-10 19:00:00', 67, 46.6, 30.2, 250, -2.9916000, 104.7485000, 'Berawan', 1008, 27, 63, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (288, 3, '2026-06-10 19:00:00', 75, 45.8, 33.8, 232, -2.9754000, 104.7505000, 'Cerah', 1013, 28, 58, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (289, 4, '2026-06-10 19:00:00', 86, 54.9, 38.7, 266, -2.9904000, 104.7592000, 'Cerah', 1008, 30, 50, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (290, 5, '2026-06-10 19:00:00', 75, 45.8, 33.8, 206, -2.9918000, 104.7634000, 'Cerah', 1007, 26, 56, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (291, 6, '2026-06-10 19:00:00', 28, 20.2, 12.6, 52, -3.0211000, 104.7925000, 'Cerah', 1011, 26, 59, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (292, 7, '2026-06-10 19:00:00', 66, 45.9, 29.7, 200, -2.9888000, 104.7570000, 'Cerah', 1012, 30, 70, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (293, 8, '2026-06-10 19:00:00', 160, 100, 72, 401, -2.9691000, 104.7885000, 'Berawan', 1015, 28, 52, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (294, 9, '2026-06-10 19:00:00', 67, 44.6, 30.2, 208, -2.9723000, 104.8118000, 'Cerah', 1013, 29, 53, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (295, 10, '2026-06-10 19:00:00', 112, 71.8, 50.4, 455, -3.0039000, 104.8152000, 'Berawan', 1012, 27, 51, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (296, 11, '2026-06-10 19:00:00', 67, 46.6, 30.2, 257, -3.0195000, 104.7431000, 'Cerah', 1014, 27, 53, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (297, 12, '2026-06-10 19:00:00', 94, 59.1, 42.3, 241, -2.9972000, 104.7294000, 'Cerah', 1012, 28, 56, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (298, 13, '2026-06-10 19:00:00', 27, 19.6, 12.2, 81, -2.9431000, 104.7251000, 'Cerah', 1015, 26, 58, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (299, 14, '2026-06-10 19:00:00', 26, 16.9, 11.7, 60, -2.8986000, 104.7014000, 'Cerah', 1009, 29, 69, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (300, 15, '2026-06-10 19:00:00', 137, 88.1, 61.7, 503, -2.9556000, 104.7377000, 'Cerah', 1009, 27, 65, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (301, 1, '2026-06-10 20:00:00', 70, 46.5, 31.5, 243, -2.9912000, 104.7479000, 'Cerah', 1005, 29, 53, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (302, 2, '2026-06-10 20:00:00', 75, 46.8, 33.8, 229, -2.9916000, 104.7485000, 'Berawan', 1011, 29, 58, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (303, 3, '2026-06-10 20:00:00', 72, 46.8, 32.4, 238, -2.9754000, 104.7505000, 'Cerah', 1011, 27, 60, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (304, 4, '2026-06-10 20:00:00', 75, 50.8, 33.8, 228, -2.9904000, 104.7592000, 'Cerah', 1011, 27, 68, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (305, 5, '2026-06-10 20:00:00', 91, 56.2, 41, 237, -2.9918000, 104.7634000, 'Cerah', 1012, 28, 60, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (306, 6, '2026-06-10 20:00:00', 30, 19.5, 13.5, 70, -3.0211000, 104.7925000, 'Cerah', 1014, 27, 65, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (307, 7, '2026-06-10 20:00:00', 73, 49.5, 32.9, 218, -2.9888000, 104.7570000, 'Cerah', 1011, 28, 62, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (308, 8, '2026-06-10 20:00:00', 141, 93.7, 63.5, 396, -2.9691000, 104.7885000, 'Cerah', 1009, 27, 67, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (309, 9, '2026-06-10 20:00:00', 67, 46.6, 30.2, 266, -2.9723000, 104.8118000, 'Cerah', 1007, 29, 69, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (310, 10, '2026-06-10 20:00:00', 137, 85.1, 61.7, 405, -3.0039000, 104.8152000, 'Berawan', 1014, 26, 54, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (311, 11, '2026-06-10 20:00:00', 90, 57.5, 40.5, 217, -3.0195000, 104.7431000, 'Berawan', 1013, 27, 61, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (312, 12, '2026-06-10 20:00:00', 83, 54, 37.4, 228, -2.9972000, 104.7294000, 'Cerah', 1010, 27, 58, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (313, 13, '2026-06-10 20:00:00', 25, 14.3, 11.3, 72, -2.9431000, 104.7251000, 'Berawan', 1011, 28, 66, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (314, 14, '2026-06-10 20:00:00', 29, 19.9, 13.1, 50, -2.8986000, 104.7014000, 'Cerah', 1010, 27, 60, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (315, 15, '2026-06-10 20:00:00', 128, 87.2, 57.6, 392, -2.9556000, 104.7377000, 'Cerah', 1009, 27, 54, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (316, 1, '2026-06-10 21:00:00', 62, 43.3, 27.9, 120, -2.9912000, 104.7479000, 'Cerah', 1007, 28, 60, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (317, 2, '2026-06-10 21:00:00', 59, 36.4, 26.6, 162, -2.9916000, 104.7485000, 'Cerah', 1011, 26, 58, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (318, 3, '2026-06-10 21:00:00', 58, 34.7, 26.1, 139, -2.9754000, 104.7505000, 'Berawan', 1015, 28, 67, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (319, 4, '2026-06-10 21:00:00', 47, 28.6, 21.2, 124, -2.9904000, 104.7592000, 'Cerah', 1011, 27, 69, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (320, 5, '2026-06-10 21:00:00', 50, 33.5, 22.5, 113, -2.9918000, 104.7634000, 'Cerah', 1010, 29, 63, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (321, 6, '2026-06-10 21:00:00', 16, 10.4, 7.2, 44, -3.0211000, 104.7925000, 'Cerah', 1014, 26, 70, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (322, 7, '2026-06-10 21:00:00', 62, 38.3, 27.9, 167, -2.9888000, 104.7570000, 'Cerah', 1011, 29, 56, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (323, 8, '2026-06-10 21:00:00', 83, 50, 37.4, 310, -2.9691000, 104.7885000, 'Cerah', 1009, 27, 54, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (324, 9, '2026-06-10 21:00:00', 39, 22.4, 17.6, 144, -2.9723000, 104.8118000, 'Cerah', 1008, 30, 53, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (325, 10, '2026-06-10 21:00:00', 104, 63.6, 46.8, 380, -3.0039000, 104.8152000, 'Cerah', 1007, 30, 69, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (326, 11, '2026-06-10 21:00:00', 52, 33.8, 23.4, 159, -3.0195000, 104.7431000, 'Cerah', 1014, 27, 64, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (327, 12, '2026-06-10 21:00:00', 42, 26.3, 18.9, 100, -2.9972000, 104.7294000, 'Cerah', 1006, 27, 50, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (328, 13, '2026-06-10 21:00:00', 5, 5, 2.3, 32, -2.9431000, 104.7251000, 'Berawan', 1011, 29, 51, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (329, 14, '2026-06-10 21:00:00', 14, 7.1, 6.3, 44, -2.8986000, 104.7014000, 'Berawan', 1014, 26, 51, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (330, 15, '2026-06-10 21:00:00', 110, 75.5, 49.5, 257, -2.9556000, 104.7377000, 'Cerah', 1010, 26, 67, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (331, 1, '2026-06-10 22:00:00', 36, 20.4, 16.2, 152, -2.9912000, 104.7479000, 'Cerah', 1006, 26, 54, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (332, 2, '2026-06-10 22:00:00', 56, 38.4, 25.2, 107, -2.9916000, 104.7485000, 'Cerah', 1009, 28, 70, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (333, 3, '2026-06-10 22:00:00', 62, 38.3, 27.9, 132, -2.9754000, 104.7505000, 'Cerah', 1011, 28, 70, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (334, 4, '2026-06-10 22:00:00', 49, 29.9, 22.1, 171, -2.9904000, 104.7592000, 'Berawan', 1006, 26, 69, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (335, 5, '2026-06-10 22:00:00', 65, 43.3, 29.3, 178, -2.9918000, 104.7634000, 'Cerah', 1009, 26, 69, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (336, 6, '2026-06-10 22:00:00', 7, 5, 3.2, 42, -3.0211000, 104.7925000, 'Cerah', 1011, 28, 50, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (337, 7, '2026-06-10 22:00:00', 61, 42.7, 27.5, 105, -2.9888000, 104.7570000, 'Cerah', 1011, 29, 59, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (338, 8, '2026-06-10 22:00:00', 85, 57.3, 38.3, 294, -2.9691000, 104.7885000, 'Cerah', 1014, 29, 66, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (339, 9, '2026-06-10 22:00:00', 48, 34.2, 21.6, 178, -2.9723000, 104.8118000, 'Cerah', 1006, 26, 50, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (340, 10, '2026-06-10 22:00:00', 102, 61.3, 45.9, 355, -3.0039000, 104.8152000, 'Berawan', 1006, 28, 70, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (341, 11, '2026-06-10 22:00:00', 50, 29.5, 22.5, 165, -3.0195000, 104.7431000, 'Cerah', 1010, 29, 53, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (342, 12, '2026-06-10 22:00:00', 53, 36.5, 23.9, 177, -2.9972000, 104.7294000, 'Cerah', 1008, 28, 59, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (343, 13, '2026-06-10 22:00:00', 9, 5.9, 4.1, 54, -2.9431000, 104.7251000, 'Cerah', 1014, 29, 55, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (344, 14, '2026-06-10 22:00:00', 11, 7.2, 5, 45, -2.8986000, 104.7014000, 'Cerah', 1006, 27, 59, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (345, 15, '2026-06-10 22:00:00', 79, 50.4, 35.6, 322, -2.9556000, 104.7377000, 'Cerah', 1012, 30, 58, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (346, 1, '2026-06-10 23:00:00', 42, 28.3, 18.9, 136, -2.9912000, 104.7479000, 'Cerah', 1007, 26, 59, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (347, 2, '2026-06-10 23:00:00', 63, 43, 28.4, 152, -2.9916000, 104.7485000, 'Cerah', 1007, 30, 65, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (348, 3, '2026-06-10 23:00:00', 39, 24.4, 17.6, 121, -2.9754000, 104.7505000, 'Cerah', 1005, 26, 52, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (349, 4, '2026-06-10 23:00:00', 57, 35.1, 25.7, 155, -2.9904000, 104.7592000, 'Cerah', 1010, 29, 64, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (350, 5, '2026-06-10 23:00:00', 61, 40.7, 27.5, 147, -2.9918000, 104.7634000, 'Cerah', 1015, 29, 58, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (351, 6, '2026-06-10 23:00:00', 17, 13.1, 7.7, 45, -3.0211000, 104.7925000, 'Cerah', 1010, 27, 60, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (352, 7, '2026-06-10 23:00:00', 49, 30.9, 22.1, 140, -2.9888000, 104.7570000, 'Cerah', 1006, 28, 60, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (353, 8, '2026-06-10 23:00:00', 93, 56.5, 41.9, 371, -2.9691000, 104.7885000, 'Cerah', 1008, 28, 58, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (354, 9, '2026-06-10 23:00:00', 58, 38.7, 26.1, 169, -2.9723000, 104.8118000, 'Cerah', 1015, 29, 56, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (355, 10, '2026-06-10 23:00:00', 84, 49.6, 37.8, 257, -3.0039000, 104.8152000, 'Cerah', 1009, 28, 60, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (356, 11, '2026-06-10 23:00:00', 41, 25.7, 18.5, 162, -3.0195000, 104.7431000, 'Cerah', 1009, 27, 63, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (357, 12, '2026-06-10 23:00:00', 37, 26.1, 16.7, 125, -2.9972000, 104.7294000, 'Cerah', 1011, 27, 69, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (358, 13, '2026-06-10 23:00:00', 9, 5, 4.1, 46, -2.9431000, 104.7251000, 'Cerah', 1010, 26, 61, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (359, 14, '2026-06-10 23:00:00', 8, 5, 3.6, 43, -2.8986000, 104.7014000, 'Cerah', 1007, 30, 59, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (360, 15, '2026-06-10 23:00:00', 82, 49.3, 36.9, 289, -2.9556000, 104.7377000, 'Cerah', 1005, 30, 69, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (361, 1, '2026-06-11 00:00:00', 63, 38, 28.4, 100, -2.9912000, 104.7479000, 'Cerah', 1013, 27, 50, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (362, 2, '2026-06-11 00:00:00', 54, 38.1, 24.3, 122, -2.9916000, 104.7485000, 'Cerah', 1005, 28, 57, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (363, 3, '2026-06-11 00:00:00', 54, 34.1, 24.3, 118, -2.9754000, 104.7505000, 'Cerah', 1012, 30, 57, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (364, 4, '2026-06-11 00:00:00', 36, 20.4, 16.2, 178, -2.9904000, 104.7592000, 'Cerah', 1012, 29, 56, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (365, 5, '2026-06-11 00:00:00', 60, 39, 27, 140, -2.9918000, 104.7634000, 'Cerah', 1014, 26, 67, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (366, 6, '2026-06-11 00:00:00', 16, 9.4, 7.2, 52, -3.0211000, 104.7925000, 'Berawan', 1005, 27, 65, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (367, 7, '2026-06-11 00:00:00', 49, 31.9, 22.1, 150, -2.9888000, 104.7570000, 'Cerah', 1012, 29, 52, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (368, 8, '2026-06-11 00:00:00', 83, 49, 37.4, 260, -2.9691000, 104.7885000, 'Cerah', 1014, 26, 59, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (369, 9, '2026-06-11 00:00:00', 57, 37.1, 25.7, 106, -2.9723000, 104.8118000, 'Berawan', 1015, 28, 63, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (370, 10, '2026-06-11 00:00:00', 82, 58.3, 36.9, 352, -3.0039000, 104.8152000, 'Berawan', 1009, 29, 58, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (371, 11, '2026-06-11 00:00:00', 57, 37.1, 25.7, 129, -3.0195000, 104.7431000, 'Cerah', 1014, 26, 62, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (372, 12, '2026-06-11 00:00:00', 65, 41.3, 29.3, 175, -2.9972000, 104.7294000, 'Cerah', 1014, 28, 66, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (373, 13, '2026-06-11 00:00:00', 16, 12.4, 7.2, 55, -2.9431000, 104.7251000, 'Cerah', 1006, 29, 66, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (374, 14, '2026-06-11 00:00:00', 12, 8.8, 5.4, 37, -2.8986000, 104.7014000, 'Berawan', 1014, 26, 64, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (375, 15, '2026-06-11 00:00:00', 81, 49.7, 36.5, 355, -2.9556000, 104.7377000, 'Cerah', 1014, 26, 53, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (376, 1, '2026-06-11 01:00:00', 45, 31.3, 20.3, 117, -2.9912000, 104.7479000, 'Cerah', 1005, 29, 56, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (377, 2, '2026-06-11 01:00:00', 60, 42, 27, 178, -2.9916000, 104.7485000, 'Cerah', 1010, 26, 50, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (378, 3, '2026-06-11 01:00:00', 61, 38.7, 27.5, 121, -2.9754000, 104.7505000, 'Cerah', 1009, 28, 69, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (379, 4, '2026-06-11 01:00:00', 51, 35.2, 23, 172, -2.9904000, 104.7592000, 'Cerah', 1006, 29, 58, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (380, 5, '2026-06-11 01:00:00', 47, 30.6, 21.2, 172, -2.9918000, 104.7634000, 'Cerah', 1005, 28, 60, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (381, 6, '2026-06-11 01:00:00', 6, 5, 2.7, 51, -3.0211000, 104.7925000, 'Cerah', 1012, 26, 64, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (382, 7, '2026-06-11 01:00:00', 46, 31.9, 20.7, 179, -2.9888000, 104.7570000, 'Berawan', 1015, 26, 63, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (383, 8, '2026-06-11 01:00:00', 90, 60.5, 40.5, 255, -2.9691000, 104.7885000, 'Cerah', 1012, 27, 58, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (384, 9, '2026-06-11 01:00:00', 49, 33.9, 22.1, 155, -2.9723000, 104.8118000, 'Cerah', 1006, 28, 55, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (385, 10, '2026-06-11 01:00:00', 98, 61.7, 44.1, 324, -3.0039000, 104.8152000, 'Cerah', 1010, 29, 62, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (386, 11, '2026-06-11 01:00:00', 50, 35.5, 22.5, 116, -3.0195000, 104.7431000, 'Berawan', 1011, 30, 66, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (387, 12, '2026-06-11 01:00:00', 45, 31.3, 20.3, 127, -2.9972000, 104.7294000, 'Cerah', 1006, 30, 55, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (388, 13, '2026-06-11 01:00:00', 8, 6.2, 3.6, 43, -2.9431000, 104.7251000, 'Cerah', 1014, 28, 67, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (389, 14, '2026-06-11 01:00:00', 7, 5, 3.2, 56, -2.8986000, 104.7014000, 'Cerah', 1013, 30, 50, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (390, 15, '2026-06-11 01:00:00', 107, 65.6, 48.2, 265, -2.9556000, 104.7377000, 'Cerah', 1009, 26, 64, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (391, 1, '2026-06-11 02:00:00', 38, 22.7, 17.1, 105, -2.9912000, 104.7479000, 'Cerah', 1005, 26, 60, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (392, 2, '2026-06-11 02:00:00', 44, 26.6, 19.8, 107, -2.9916000, 104.7485000, 'Berawan', 1015, 30, 57, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (393, 3, '2026-06-11 02:00:00', 63, 40, 28.4, 142, -2.9754000, 104.7505000, 'Cerah', 1006, 30, 62, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (394, 4, '2026-06-11 02:00:00', 49, 33.9, 22.1, 160, -2.9904000, 104.7592000, 'Cerah', 1007, 29, 67, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (395, 5, '2026-06-11 02:00:00', 63, 40, 28.4, 117, -2.9918000, 104.7634000, 'Cerah', 1011, 30, 58, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (396, 6, '2026-06-11 02:00:00', 16, 8.4, 7.2, 56, -3.0211000, 104.7925000, 'Cerah', 1015, 26, 59, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (397, 7, '2026-06-11 02:00:00', 48, 28.2, 21.6, 145, -2.9888000, 104.7570000, 'Cerah', 1012, 28, 56, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (398, 8, '2026-06-11 02:00:00', 106, 69.9, 47.7, 365, -2.9691000, 104.7885000, 'Cerah', 1011, 28, 51, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (399, 9, '2026-06-11 02:00:00', 62, 41.3, 27.9, 130, -2.9723000, 104.8118000, 'Cerah', 1008, 26, 56, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (400, 10, '2026-06-11 02:00:00', 85, 55.3, 38.3, 361, -3.0039000, 104.8152000, 'Cerah', 1006, 26, 70, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (401, 11, '2026-06-11 02:00:00', 60, 39, 27, 156, -3.0195000, 104.7431000, 'Berawan', 1010, 28, 59, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (402, 12, '2026-06-11 02:00:00', 50, 33.5, 22.5, 141, -2.9972000, 104.7294000, 'Cerah', 1006, 28, 60, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (403, 13, '2026-06-11 02:00:00', 5, 5, 2.3, 58, -2.9431000, 104.7251000, 'Cerah', 1014, 27, 61, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (404, 14, '2026-06-11 02:00:00', 7, 5, 3.2, 39, -2.8986000, 104.7014000, 'Cerah', 1012, 27, 65, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (405, 15, '2026-06-11 02:00:00', 71, 43.2, 32, 322, -2.9556000, 104.7377000, 'Cerah', 1006, 27, 68, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (406, 1, '2026-06-11 03:00:00', 58, 35.7, 26.1, 112, -2.9912000, 104.7479000, 'Cerah', 1006, 30, 62, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (407, 2, '2026-06-11 03:00:00', 39, 23.4, 17.6, 162, -2.9916000, 104.7485000, 'Cerah', 1014, 29, 66, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (408, 3, '2026-06-11 03:00:00', 42, 29.3, 18.9, 165, -2.9754000, 104.7505000, 'Cerah', 1014, 26, 68, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (409, 4, '2026-06-11 03:00:00', 53, 31.5, 23.9, 162, -2.9904000, 104.7592000, 'Berawan', 1011, 27, 53, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (410, 5, '2026-06-11 03:00:00', 52, 36.8, 23.4, 103, -2.9918000, 104.7634000, 'Cerah', 1012, 26, 61, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (411, 6, '2026-06-11 03:00:00', 11, 9.2, 5, 35, -3.0211000, 104.7925000, 'Cerah', 1014, 27, 52, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (412, 7, '2026-06-11 03:00:00', 63, 44, 28.4, 174, -2.9888000, 104.7570000, 'Cerah', 1011, 27, 51, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (413, 8, '2026-06-11 03:00:00', 83, 55, 37.4, 231, -2.9691000, 104.7885000, 'Cerah', 1015, 29, 53, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (414, 9, '2026-06-11 03:00:00', 49, 31.9, 22.1, 173, -2.9723000, 104.8118000, 'Cerah', 1007, 30, 67, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (415, 10, '2026-06-11 03:00:00', 89, 62.9, 40.1, 283, -3.0039000, 104.8152000, 'Cerah', 1012, 29, 57, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (416, 11, '2026-06-11 03:00:00', 40, 23, 18, 155, -3.0195000, 104.7431000, 'Berawan', 1015, 26, 66, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (417, 12, '2026-06-11 03:00:00', 40, 23, 18, 132, -2.9972000, 104.7294000, 'Cerah', 1008, 30, 68, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (418, 13, '2026-06-11 03:00:00', 18, 11.7, 8.1, 31, -2.9431000, 104.7251000, 'Cerah', 1012, 30, 70, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (419, 14, '2026-06-11 03:00:00', 10, 8.5, 4.5, 31, -2.8986000, 104.7014000, 'Cerah', 1008, 30, 64, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (420, 15, '2026-06-11 03:00:00', 108, 74.2, 48.6, 241, -2.9556000, 104.7377000, 'Berawan', 1014, 29, 55, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (421, 1, '2026-06-11 04:00:00', 63, 39, 28.4, 121, -2.9912000, 104.7479000, 'Cerah', 1012, 28, 60, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (422, 2, '2026-06-11 04:00:00', 42, 26.3, 18.9, 167, -2.9916000, 104.7485000, 'Cerah', 1013, 28, 50, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (423, 3, '2026-06-11 04:00:00', 43, 29, 19.4, 102, -2.9754000, 104.7505000, 'Cerah', 1006, 29, 70, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (424, 4, '2026-06-11 04:00:00', 47, 28.6, 21.2, 149, -2.9904000, 104.7592000, 'Berawan', 1012, 27, 59, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (425, 5, '2026-06-11 04:00:00', 40, 27, 18, 142, -2.9918000, 104.7634000, 'Cerah', 1011, 30, 62, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (426, 6, '2026-06-11 04:00:00', 17, 9.1, 7.7, 39, -3.0211000, 104.7925000, 'Berawan', 1008, 27, 59, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (427, 7, '2026-06-11 04:00:00', 44, 30.6, 19.8, 166, -2.9888000, 104.7570000, 'Cerah', 1010, 26, 56, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (428, 8, '2026-06-11 04:00:00', 90, 56.5, 40.5, 378, -2.9691000, 104.7885000, 'Cerah', 1007, 30, 61, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (429, 9, '2026-06-11 04:00:00', 35, 21.8, 15.8, 174, -2.9723000, 104.8118000, 'Berawan', 1007, 27, 52, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (430, 10, '2026-06-11 04:00:00', 71, 42.2, 32, 255, -3.0039000, 104.8152000, 'Cerah', 1005, 29, 53, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (431, 11, '2026-06-11 04:00:00', 52, 33.8, 23.4, 118, -3.0195000, 104.7431000, 'Berawan', 1006, 29, 62, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (432, 12, '2026-06-11 04:00:00', 43, 28, 19.4, 167, -2.9972000, 104.7294000, 'Cerah', 1007, 28, 57, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (433, 13, '2026-06-11 04:00:00', 16, 10.4, 7.2, 50, -2.9431000, 104.7251000, 'Cerah', 1005, 29, 62, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (434, 14, '2026-06-11 04:00:00', 17, 11.1, 7.7, 33, -2.8986000, 104.7014000, 'Cerah', 1015, 26, 60, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (435, 15, '2026-06-11 04:00:00', 101, 64.7, 45.5, 314, -2.9556000, 104.7377000, 'Cerah', 1010, 26, 67, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (436, 1, '2026-06-11 05:00:00', 45, 30.3, 20.3, 157, -2.9912000, 104.7479000, 'Cerah', 1010, 26, 62, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (437, 2, '2026-06-11 05:00:00', 44, 29.6, 19.8, 128, -2.9916000, 104.7485000, 'Berawan', 1011, 27, 63, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (438, 3, '2026-06-11 05:00:00', 39, 25.4, 17.6, 139, -2.9754000, 104.7505000, 'Cerah', 1007, 29, 51, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (439, 4, '2026-06-11 05:00:00', 57, 35.1, 25.7, 137, -2.9904000, 104.7592000, 'Cerah', 1008, 26, 56, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (440, 5, '2026-06-11 05:00:00', 39, 22.4, 17.6, 177, -2.9918000, 104.7634000, 'Cerah', 1011, 28, 55, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (441, 6, '2026-06-11 05:00:00', 5, 5, 2.3, 58, -3.0211000, 104.7925000, 'Cerah', 1013, 26, 59, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (442, 7, '2026-06-11 05:00:00', 40, 28, 18, 119, -2.9888000, 104.7570000, 'Berawan', 1013, 26, 68, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (443, 8, '2026-06-11 05:00:00', 105, 64.3, 47.3, 324, -2.9691000, 104.7885000, 'Cerah', 1013, 29, 63, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (444, 9, '2026-06-11 05:00:00', 57, 35.1, 25.7, 132, -2.9723000, 104.8118000, 'Cerah', 1011, 30, 59, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (445, 10, '2026-06-11 05:00:00', 93, 62.5, 41.9, 237, -3.0039000, 104.8152000, 'Cerah', 1010, 30, 66, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (446, 11, '2026-06-11 05:00:00', 55, 32.8, 24.8, 158, -3.0195000, 104.7431000, 'Cerah', 1006, 29, 57, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (447, 12, '2026-06-11 05:00:00', 55, 34.8, 24.8, 128, -2.9972000, 104.7294000, 'Cerah', 1008, 26, 60, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (448, 13, '2026-06-11 05:00:00', 15, 11.8, 6.8, 39, -2.9431000, 104.7251000, 'Cerah', 1009, 28, 53, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (449, 14, '2026-06-11 05:00:00', 14, 10.1, 6.3, 44, -2.8986000, 104.7014000, 'Cerah', 1009, 27, 65, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (450, 15, '2026-06-11 05:00:00', 83, 57, 37.4, 268, -2.9556000, 104.7377000, 'Cerah', 1013, 28, 69, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (451, 1, '2026-06-11 06:00:00', 37, 23.1, 16.7, 106, -2.9912000, 104.7479000, 'Cerah', 1009, 27, 69, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (452, 2, '2026-06-11 06:00:00', 57, 38.1, 25.7, 100, -2.9916000, 104.7485000, 'Cerah', 1006, 30, 53, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (453, 3, '2026-06-11 06:00:00', 62, 42.3, 27.9, 124, -2.9754000, 104.7505000, 'Cerah', 1011, 27, 68, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (454, 4, '2026-06-11 06:00:00', 63, 43, 28.4, 127, -2.9904000, 104.7592000, 'Cerah', 1006, 28, 59, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (455, 5, '2026-06-11 06:00:00', 43, 30, 19.4, 109, -2.9918000, 104.7634000, 'Cerah', 1007, 30, 53, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (456, 6, '2026-06-11 06:00:00', 18, 10.7, 8.1, 53, -3.0211000, 104.7925000, 'Cerah', 1008, 29, 53, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (457, 7, '2026-06-11 06:00:00', 41, 29.7, 18.5, 117, -2.9888000, 104.7570000, 'Cerah', 1013, 27, 58, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (458, 8, '2026-06-11 06:00:00', 70, 49.5, 31.5, 347, -2.9691000, 104.7885000, 'Cerah', 1011, 27, 65, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (459, 9, '2026-06-11 06:00:00', 45, 29.3, 20.3, 136, -2.9723000, 104.8118000, 'Cerah', 1013, 27, 56, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (460, 10, '2026-06-11 06:00:00', 87, 59.6, 39.2, 339, -3.0039000, 104.8152000, 'Cerah', 1014, 30, 65, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (461, 11, '2026-06-11 06:00:00', 37, 24.1, 16.7, 166, -3.0195000, 104.7431000, 'Cerah', 1010, 30, 55, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (462, 12, '2026-06-11 06:00:00', 42, 24.3, 18.9, 102, -2.9972000, 104.7294000, 'Cerah', 1007, 27, 63, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (463, 13, '2026-06-11 06:00:00', 13, 6.5, 5.9, 49, -2.9431000, 104.7251000, 'Cerah', 1012, 30, 58, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (464, 14, '2026-06-11 06:00:00', 15, 8.8, 6.8, 40, -2.8986000, 104.7014000, 'Cerah', 1015, 30, 57, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (465, 15, '2026-06-11 06:00:00', 96, 66.4, 43.2, 324, -2.9556000, 104.7377000, 'Cerah', 1008, 26, 67, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (466, 1, '2026-06-11 07:00:00', 88, 58.2, 39.6, 215, -2.9912000, 104.7479000, 'Cerah', 1006, 28, 63, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (467, 2, '2026-06-11 07:00:00', 87, 54.6, 39.2, 264, -2.9916000, 104.7485000, 'Cerah', 1006, 26, 50, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (468, 3, '2026-06-11 07:00:00', 77, 49.1, 34.7, 226, -2.9754000, 104.7505000, 'Cerah', 1014, 30, 56, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (469, 4, '2026-06-11 07:00:00', 79, 51.4, 35.6, 269, -2.9904000, 104.7592000, 'Cerah', 1012, 29, 67, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (470, 5, '2026-06-11 07:00:00', 89, 55.9, 40.1, 242, -2.9918000, 104.7634000, 'Cerah', 1012, 27, 61, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (471, 6, '2026-06-11 07:00:00', 23, 14, 10.4, 75, -3.0211000, 104.7925000, 'Cerah', 1009, 27, 54, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (472, 7, '2026-06-11 07:00:00', 77, 48.1, 34.7, 234, -2.9888000, 104.7570000, 'Cerah', 1011, 29, 55, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (473, 8, '2026-06-11 07:00:00', 123, 81, 55.4, 515, -2.9691000, 104.7885000, 'Cerah', 1010, 27, 55, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (474, 9, '2026-06-11 07:00:00', 78, 48.7, 35.1, 222, -2.9723000, 104.8118000, 'Cerah', 1007, 27, 53, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (475, 10, '2026-06-11 07:00:00', 155, 102.8, 69.8, 390, -3.0039000, 104.8152000, 'Cerah', 1005, 30, 53, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (476, 11, '2026-06-11 07:00:00', 70, 42.5, 31.5, 232, -3.0195000, 104.7431000, 'Cerah', 1013, 28, 68, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (477, 12, '2026-06-11 07:00:00', 77, 47.1, 34.7, 201, -2.9972000, 104.7294000, 'Cerah', 1009, 28, 63, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (478, 13, '2026-06-11 07:00:00', 27, 19.6, 12.2, 55, -2.9431000, 104.7251000, 'Cerah', 1013, 30, 69, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (479, 14, '2026-06-11 07:00:00', 22, 12.3, 9.9, 58, -2.8986000, 104.7014000, 'Cerah', 1007, 30, 52, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (480, 15, '2026-06-11 07:00:00', 145, 91.3, 65.3, 501, -2.9556000, 104.7377000, 'Cerah', 1013, 29, 61, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (481, 1, '2026-06-11 08:00:00', 92, 57.8, 41.4, 249, -2.9912000, 104.7479000, 'Cerah', 1008, 29, 63, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (482, 2, '2026-06-11 08:00:00', 70, 45.5, 31.5, 244, -2.9916000, 104.7485000, 'Cerah', 1005, 30, 50, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (483, 3, '2026-06-11 08:00:00', 87, 56.6, 39.2, 192, -2.9754000, 104.7505000, 'Cerah', 1012, 26, 61, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (484, 4, '2026-06-11 08:00:00', 94, 60.1, 42.3, 211, -2.9904000, 104.7592000, 'Cerah', 1013, 26, 51, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (485, 5, '2026-06-11 08:00:00', 67, 44.6, 30.2, 191, -2.9918000, 104.7634000, 'Cerah', 1015, 28, 50, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (486, 6, '2026-06-11 08:00:00', 26, 18.9, 11.7, 52, -3.0211000, 104.7925000, 'Cerah', 1011, 28, 61, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (487, 7, '2026-06-11 08:00:00', 94, 61.1, 42.3, 199, -2.9888000, 104.7570000, 'Cerah', 1014, 27, 64, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (488, 8, '2026-06-11 08:00:00', 146, 94.9, 65.7, 415, -2.9691000, 104.7885000, 'Cerah', 1007, 26, 51, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (489, 9, '2026-06-11 08:00:00', 78, 53.7, 35.1, 187, -2.9723000, 104.8118000, 'Cerah', 1008, 27, 60, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (490, 10, '2026-06-11 08:00:00', 114, 70.1, 51.3, 494, -3.0039000, 104.8152000, 'Cerah', 1014, 26, 67, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (491, 11, '2026-06-11 08:00:00', 85, 56.3, 38.3, 240, -3.0195000, 104.7431000, 'Cerah', 1005, 28, 63, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (492, 12, '2026-06-11 08:00:00', 68, 46.2, 30.6, 207, -2.9972000, 104.7294000, 'Cerah', 1010, 30, 64, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (493, 13, '2026-06-11 08:00:00', 28, 20.2, 12.6, 63, -2.9431000, 104.7251000, 'Cerah', 1014, 30, 66, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (494, 14, '2026-06-11 08:00:00', 21, 11.7, 9.5, 77, -2.8986000, 104.7014000, 'Cerah', 1008, 28, 58, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (495, 15, '2026-06-11 08:00:00', 110, 71.5, 49.5, 565, -2.9556000, 104.7377000, 'Cerah', 1009, 26, 58, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (496, 1, '2026-06-11 09:00:00', 95, 63.8, 42.8, 239, -2.9912000, 104.7479000, 'Cerah', 1006, 28, 51, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (497, 2, '2026-06-11 09:00:00', 80, 52, 36, 202, -2.9916000, 104.7485000, 'Cerah', 1015, 26, 53, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (498, 3, '2026-06-11 09:00:00', 66, 43.9, 29.7, 232, -2.9754000, 104.7505000, 'Cerah', 1014, 26, 65, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (499, 4, '2026-06-11 09:00:00', 70, 46.5, 31.5, 246, -2.9904000, 104.7592000, 'Cerah', 1009, 29, 56, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (500, 5, '2026-06-11 09:00:00', 65, 40.3, 29.3, 189, -2.9918000, 104.7634000, 'Cerah', 1013, 30, 52, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (501, 6, '2026-06-11 09:00:00', 24, 13.6, 10.8, 82, -3.0211000, 104.7925000, 'Cerah', 1011, 29, 50, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (502, 7, '2026-06-11 09:00:00', 73, 44.5, 32.9, 260, -2.9888000, 104.7570000, 'Cerah', 1010, 30, 65, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (503, 8, '2026-06-11 09:00:00', 155, 103.8, 69.8, 458, -2.9691000, 104.7885000, 'Cerah', 1005, 30, 69, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (504, 9, '2026-06-11 09:00:00', 66, 42.9, 29.7, 231, -2.9723000, 104.8118000, 'Cerah', 1012, 26, 61, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (505, 10, '2026-06-11 09:00:00', 137, 87.1, 61.7, 440, -3.0039000, 104.8152000, 'Cerah', 1005, 29, 58, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (506, 11, '2026-06-11 09:00:00', 89, 56.9, 40.1, 198, -3.0195000, 104.7431000, 'Cerah', 1015, 27, 61, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (507, 12, '2026-06-11 09:00:00', 83, 53, 37.4, 245, -2.9972000, 104.7294000, 'Cerah', 1013, 26, 54, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (508, 13, '2026-06-11 09:00:00', 27, 17.6, 12.2, 59, -2.9431000, 104.7251000, 'Cerah', 1010, 27, 63, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (509, 14, '2026-06-11 09:00:00', 30, 18.5, 13.5, 72, -2.8986000, 104.7014000, 'Cerah', 1011, 28, 59, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (510, 15, '2026-06-11 09:00:00', 123, 84, 55.4, 441, -2.9556000, 104.7377000, 'Cerah', 1009, 27, 50, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (511, 1, '2026-06-11 10:00:00', 54, 38.1, 24.3, 150, -2.9912000, 104.7479000, 'Cerah', 1015, 28, 64, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (512, 2, '2026-06-11 10:00:00', 49, 33.9, 22.1, 141, -2.9916000, 104.7485000, 'Cerah', 1012, 28, 69, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (513, 3, '2026-06-11 10:00:00', 58, 36.7, 26.1, 103, -2.9754000, 104.7505000, 'Cerah', 1014, 28, 58, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (514, 4, '2026-06-11 10:00:00', 38, 24.7, 17.1, 125, -2.9904000, 104.7592000, 'Cerah', 1014, 27, 57, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (515, 5, '2026-06-11 10:00:00', 64, 43.6, 28.8, 135, -2.9918000, 104.7634000, 'Cerah', 1010, 26, 57, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (516, 6, '2026-06-11 10:00:00', 5, 5, 2.3, 59, -3.0211000, 104.7925000, 'Cerah', 1011, 29, 69, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (517, 7, '2026-06-11 10:00:00', 52, 31.8, 23.4, 149, -2.9888000, 104.7570000, 'Cerah', 1013, 26, 59, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (518, 8, '2026-06-11 10:00:00', 99, 65.4, 44.6, 341, -2.9691000, 104.7885000, 'Cerah', 1005, 29, 53, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (519, 9, '2026-06-11 10:00:00', 58, 37.7, 26.1, 110, -2.9723000, 104.8118000, 'Cerah', 1010, 28, 57, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (520, 10, '2026-06-11 10:00:00', 109, 72.9, 49.1, 220, -3.0039000, 104.8152000, 'Cerah', 1008, 29, 54, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (521, 11, '2026-06-11 10:00:00', 47, 30.6, 21.2, 139, -3.0195000, 104.7431000, 'Cerah', 1011, 26, 60, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (522, 12, '2026-06-11 10:00:00', 57, 40.1, 25.7, 173, -2.9972000, 104.7294000, 'Cerah', 1008, 28, 70, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (523, 13, '2026-06-11 10:00:00', 14, 11.1, 6.3, 43, -2.9431000, 104.7251000, 'Cerah', 1014, 26, 53, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (524, 14, '2026-06-11 10:00:00', 17, 12.1, 7.7, 56, -2.8986000, 104.7014000, 'Cerah', 1009, 28, 51, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (525, 15, '2026-06-11 10:00:00', 94, 58.1, 42.3, 281, -2.9556000, 104.7377000, 'Cerah', 1006, 26, 68, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (526, 1, '2026-06-11 11:00:00', 62, 40.3, 27.9, 132, -2.9912000, 104.7479000, 'Cerah', 1015, 29, 50, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (527, 2, '2026-06-11 11:00:00', 46, 27.9, 20.7, 172, -2.9916000, 104.7485000, 'Cerah', 1011, 29, 68, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (528, 3, '2026-06-11 11:00:00', 36, 20.4, 16.2, 155, -2.9754000, 104.7505000, 'Cerah', 1011, 26, 54, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (529, 4, '2026-06-11 11:00:00', 35, 19.8, 15.8, 118, -2.9904000, 104.7592000, 'Cerah', 1010, 28, 53, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (530, 5, '2026-06-11 11:00:00', 53, 33.5, 23.9, 101, -2.9918000, 104.7634000, 'Cerah', 1007, 28, 59, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (531, 6, '2026-06-11 11:00:00', 10, 6.5, 4.5, 34, -3.0211000, 104.7925000, 'Cerah', 1015, 30, 60, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (532, 7, '2026-06-11 11:00:00', 44, 30.6, 19.8, 134, -2.9888000, 104.7570000, 'Cerah', 1015, 29, 63, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (533, 8, '2026-06-11 11:00:00', 105, 70.3, 47.3, 318, -2.9691000, 104.7885000, 'Cerah', 1010, 26, 55, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (534, 9, '2026-06-11 11:00:00', 50, 35.5, 22.5, 114, -2.9723000, 104.8118000, 'Cerah', 1015, 28, 70, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (535, 10, '2026-06-11 11:00:00', 101, 63.7, 45.5, 284, -3.0039000, 104.8152000, 'Cerah', 1011, 28, 55, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (536, 11, '2026-06-11 11:00:00', 60, 38, 27, 139, -3.0195000, 104.7431000, 'Cerah', 1014, 30, 70, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (537, 12, '2026-06-11 11:00:00', 38, 27.7, 17.1, 160, -2.9972000, 104.7294000, 'Cerah', 1006, 27, 60, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (538, 13, '2026-06-11 11:00:00', 16, 12.4, 7.2, 38, -2.9431000, 104.7251000, 'Cerah', 1005, 29, 54, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (539, 14, '2026-06-11 11:00:00', 11, 8.2, 5, 51, -2.8986000, 104.7014000, 'Cerah', 1011, 27, 56, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (540, 15, '2026-06-11 11:00:00', 106, 70.9, 47.7, 343, -2.9556000, 104.7377000, 'Cerah', 1011, 27, 63, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (541, 1, '2026-06-11 12:00:00', 57, 37.1, 25.7, 148, -2.9912000, 104.7479000, 'Cerah', 1007, 29, 59, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (542, 2, '2026-06-11 12:00:00', 62, 40.3, 27.9, 157, -2.9916000, 104.7485000, 'Cerah', 1005, 26, 52, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (543, 3, '2026-06-11 12:00:00', 60, 39, 27, 179, -2.9754000, 104.7505000, 'Cerah', 1007, 28, 67, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (544, 4, '2026-06-11 12:00:00', 39, 23.4, 17.6, 104, -2.9904000, 104.7592000, 'Cerah', 1008, 28, 63, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (545, 5, '2026-06-11 12:00:00', 60, 40, 27, 111, -2.9918000, 104.7634000, 'Cerah', 1013, 27, 63, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (546, 6, '2026-06-11 12:00:00', 16, 9.4, 7.2, 42, -3.0211000, 104.7925000, 'Cerah', 1014, 29, 60, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (547, 7, '2026-06-11 12:00:00', 56, 39.4, 25.2, 127, -2.9888000, 104.7570000, 'Cerah', 1013, 29, 68, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (548, 8, '2026-06-11 12:00:00', 74, 49.1, 33.3, 234, -2.9691000, 104.7885000, 'Cerah', 1005, 29, 50, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (549, 9, '2026-06-11 12:00:00', 47, 29.6, 21.2, 145, -2.9723000, 104.8118000, 'Cerah', 1009, 29, 56, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (550, 10, '2026-06-11 12:00:00', 98, 61.7, 44.1, 306, -3.0039000, 104.8152000, 'Cerah', 1012, 29, 50, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (551, 11, '2026-06-11 12:00:00', 53, 36.5, 23.9, 122, -3.0195000, 104.7431000, 'Cerah', 1006, 26, 52, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (552, 12, '2026-06-11 12:00:00', 39, 24.4, 17.6, 153, -2.9972000, 104.7294000, 'Cerah', 1012, 29, 63, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (553, 13, '2026-06-11 12:00:00', 7, 6.6, 3.2, 48, -2.9431000, 104.7251000, 'Cerah', 1013, 28, 64, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (554, 14, '2026-06-11 12:00:00', 15, 7.8, 6.8, 30, -2.8986000, 104.7014000, 'Cerah', 1010, 29, 51, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (555, 15, '2026-06-11 12:00:00', 100, 64, 45, 251, -2.9556000, 104.7377000, 'Cerah', 1007, 27, 69, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (556, 1, '2026-06-11 13:00:00', 37, 24.1, 16.7, 119, -2.9912000, 104.7479000, 'Hujan', 1006, 30, 93, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (557, 2, '2026-06-11 13:00:00', 43, 27, 19.4, 135, -2.9916000, 104.7485000, 'Berawan', 1009, 26, 60, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (558, 3, '2026-06-11 13:00:00', 49, 30.9, 22.1, 145, -2.9754000, 104.7505000, 'Berawan', 1015, 30, 56, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (559, 4, '2026-06-11 13:00:00', 59, 41.4, 26.6, 109, -2.9904000, 104.7592000, 'Gerimis', 1013, 28, 75, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (560, 5, '2026-06-11 13:00:00', 53, 34.5, 23.9, 126, -2.9918000, 104.7634000, 'Gerimis', 1010, 29, 82, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (561, 6, '2026-06-11 13:00:00', 7, 5, 3.2, 36, -3.0211000, 104.7925000, 'Berawan', 1012, 30, 56, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (562, 7, '2026-06-11 13:00:00', 49, 33.9, 22.1, 167, -2.9888000, 104.7570000, 'Gerimis', 1008, 30, 84, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (563, 8, '2026-06-11 13:00:00', 103, 69, 46.4, 271, -2.9691000, 104.7885000, 'Hujan', 1011, 27, 95, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (564, 9, '2026-06-11 13:00:00', 61, 37.7, 27.5, 119, -2.9723000, 104.8118000, 'Berawan', 1005, 29, 60, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (565, 10, '2026-06-11 13:00:00', 81, 54.7, 36.5, 250, -3.0039000, 104.8152000, 'Gerimis', 1011, 26, 73, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (566, 11, '2026-06-11 13:00:00', 38, 23.7, 17.1, 112, -3.0195000, 104.7431000, 'Hujan', 1013, 27, 89, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (567, 12, '2026-06-11 13:00:00', 56, 33.4, 25.2, 134, -2.9972000, 104.7294000, 'Hujan', 1010, 29, 84, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (568, 13, '2026-06-11 13:00:00', 18, 11.7, 8.1, 51, -2.9431000, 104.7251000, 'Gerimis', 1009, 30, 70, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (569, 14, '2026-06-11 13:00:00', 5, 5, 2.3, 42, -2.8986000, 104.7014000, 'Gerimis', 1015, 27, 82, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (570, 15, '2026-06-11 13:00:00', 71, 46.2, 32, 351, -2.9556000, 104.7377000, 'Gerimis', 1014, 29, 74, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (571, 1, '2026-06-11 14:00:00', 55, 33.8, 24.8, 136, -2.9912000, 104.7479000, 'Berawan', 1006, 28, 50, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (572, 2, '2026-06-11 14:00:00', 65, 40.3, 29.3, 108, -2.9916000, 104.7485000, 'Gerimis', 1011, 30, 74, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (573, 3, '2026-06-11 14:00:00', 46, 29.9, 20.7, 177, -2.9754000, 104.7505000, 'Berawan', 1006, 30, 59, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (574, 4, '2026-06-11 14:00:00', 56, 39.4, 25.2, 166, -2.9904000, 104.7592000, 'Berawan', 1015, 26, 55, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (575, 5, '2026-06-11 14:00:00', 38, 24.7, 17.1, 179, -2.9918000, 104.7634000, 'Hujan', 1008, 28, 93, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (576, 6, '2026-06-11 14:00:00', 8, 6.2, 3.6, 31, -3.0211000, 104.7925000, 'Berawan', 1006, 26, 54, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (577, 7, '2026-06-11 14:00:00', 59, 40.4, 26.6, 142, -2.9888000, 104.7570000, 'Hujan', 1009, 30, 90, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (578, 8, '2026-06-11 14:00:00', 95, 60.8, 42.8, 303, -2.9691000, 104.7885000, 'Berawan', 1008, 30, 51, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (579, 9, '2026-06-11 14:00:00', 38, 22.7, 17.1, 104, -2.9723000, 104.8118000, 'Berawan', 1012, 27, 67, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (580, 10, '2026-06-11 14:00:00', 95, 62.8, 42.8, 273, -3.0039000, 104.8152000, 'Gerimis', 1009, 26, 83, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (581, 11, '2026-06-11 14:00:00', 46, 26.9, 20.7, 176, -3.0195000, 104.7431000, 'Berawan', 1015, 26, 67, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (582, 12, '2026-06-11 14:00:00', 43, 29, 19.4, 120, -2.9972000, 104.7294000, 'Berawan', 1008, 29, 58, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (583, 13, '2026-06-11 14:00:00', 13, 7.5, 5.9, 42, -2.9431000, 104.7251000, 'Berawan', 1013, 26, 64, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (584, 14, '2026-06-11 14:00:00', 8, 5, 3.6, 55, -2.8986000, 104.7014000, 'Gerimis', 1007, 27, 75, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (585, 15, '2026-06-11 14:00:00', 84, 51.6, 37.8, 289, -2.9556000, 104.7377000, 'Gerimis', 1011, 27, 70, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (586, 1, '2026-06-11 15:00:00', 46, 32.9, 20.7, 128, -2.9912000, 104.7479000, 'Hujan', 1007, 28, 93, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (587, 2, '2026-06-11 15:00:00', 50, 31.5, 22.5, 114, -2.9916000, 104.7485000, 'Berawan', 1012, 29, 64, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (588, 3, '2026-06-11 15:00:00', 43, 26, 19.4, 169, -2.9754000, 104.7505000, 'Hujan', 1011, 27, 95, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (589, 4, '2026-06-11 15:00:00', 52, 32.8, 23.4, 153, -2.9904000, 104.7592000, 'Gerimis', 1012, 27, 83, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (590, 5, '2026-06-11 15:00:00', 52, 34.8, 23.4, 135, -2.9918000, 104.7634000, 'Berawan', 1010, 26, 68, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (591, 6, '2026-06-11 15:00:00', 9, 5, 4.1, 60, -3.0211000, 104.7925000, 'Berawan', 1005, 28, 53, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (592, 7, '2026-06-11 15:00:00', 58, 40.7, 26.1, 159, -2.9888000, 104.7570000, 'Gerimis', 1014, 30, 81, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (593, 8, '2026-06-11 15:00:00', 95, 62.8, 42.8, 368, -2.9691000, 104.7885000, 'Berawan', 1013, 26, 61, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (594, 9, '2026-06-11 15:00:00', 37, 25.1, 16.7, 153, -2.9723000, 104.8118000, 'Gerimis', 1008, 28, 79, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (595, 10, '2026-06-11 15:00:00', 91, 55.2, 41, 254, -3.0039000, 104.8152000, 'Berawan', 1008, 30, 58, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (596, 11, '2026-06-11 15:00:00', 40, 24, 18, 163, -3.0195000, 104.7431000, 'Berawan', 1006, 30, 50, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (597, 12, '2026-06-11 15:00:00', 65, 40.3, 29.3, 103, -2.9972000, 104.7294000, 'Berawan', 1006, 26, 68, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (598, 13, '2026-06-11 15:00:00', 6, 5.9, 2.7, 38, -2.9431000, 104.7251000, 'Berawan', 1012, 28, 52, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (599, 14, '2026-06-11 15:00:00', 7, 5.6, 3.2, 40, -2.8986000, 104.7014000, 'Gerimis', 1015, 26, 81, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (600, 15, '2026-06-11 15:00:00', 80, 52, 36, 258, -2.9556000, 104.7377000, 'Berawan', 1015, 28, 51, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (601, 1, '2026-06-11 16:00:00', 61, 38.7, 27.5, 179, -2.9912000, 104.7479000, 'Berawan', 1007, 30, 66, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (602, 2, '2026-06-11 16:00:00', 49, 30.9, 22.1, 121, -2.9916000, 104.7485000, 'Berawan', 1008, 28, 51, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (603, 3, '2026-06-11 16:00:00', 59, 37.4, 26.6, 117, -2.9754000, 104.7505000, 'Berawan', 1015, 28, 58, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (604, 4, '2026-06-11 16:00:00', 52, 33.8, 23.4, 156, -2.9904000, 104.7592000, 'Berawan', 1009, 29, 52, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (605, 5, '2026-06-11 16:00:00', 45, 30.3, 20.3, 112, -2.9918000, 104.7634000, 'Berawan', 1011, 27, 64, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (606, 6, '2026-06-11 16:00:00', 16, 8.4, 7.2, 32, -3.0211000, 104.7925000, 'Gerimis', 1015, 28, 71, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (607, 7, '2026-06-11 16:00:00', 44, 31.6, 19.8, 105, -2.9888000, 104.7570000, 'Berawan', 1008, 26, 70, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (608, 8, '2026-06-11 16:00:00', 71, 51.2, 32, 326, -2.9691000, 104.7885000, 'Berawan', 1008, 30, 53, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (609, 9, '2026-06-11 16:00:00', 52, 34.8, 23.4, 173, -2.9723000, 104.8118000, 'Berawan', 1015, 27, 58, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (610, 10, '2026-06-11 16:00:00', 81, 51.7, 36.5, 364, -3.0039000, 104.8152000, 'Hujan', 1005, 28, 88, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (611, 11, '2026-06-11 16:00:00', 45, 30.3, 20.3, 124, -3.0195000, 104.7431000, 'Gerimis', 1009, 30, 76, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (612, 12, '2026-06-11 16:00:00', 42, 30.3, 18.9, 158, -2.9972000, 104.7294000, 'Berawan', 1008, 29, 65, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (613, 13, '2026-06-11 16:00:00', 5, 5, 2.3, 45, -2.9431000, 104.7251000, 'Berawan', 1014, 26, 55, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (614, 14, '2026-06-11 16:00:00', 7, 5, 3.2, 43, -2.8986000, 104.7014000, 'Hujan', 1012, 27, 87, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (615, 15, '2026-06-11 16:00:00', 103, 63, 46.4, 289, -2.9556000, 104.7377000, 'Berawan', 1010, 28, 66, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (616, 1, '2026-06-11 17:00:00', 72, 44.8, 32.4, 267, -2.9912000, 104.7479000, 'Cerah', 1013, 27, 52, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (617, 2, '2026-06-11 17:00:00', 81, 54.7, 36.5, 201, -2.9916000, 104.7485000, 'Cerah', 1012, 30, 57, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (618, 3, '2026-06-11 17:00:00', 78, 49.7, 35.1, 262, -2.9754000, 104.7505000, 'Cerah', 1014, 30, 64, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (619, 4, '2026-06-11 17:00:00', 87, 53.6, 39.2, 245, -2.9904000, 104.7592000, 'Cerah', 1008, 28, 67, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (620, 5, '2026-06-11 17:00:00', 90, 55.5, 40.5, 265, -2.9918000, 104.7634000, 'Cerah', 1013, 27, 64, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (621, 6, '2026-06-11 17:00:00', 22, 16.3, 9.9, 54, -3.0211000, 104.7925000, 'Cerah', 1005, 30, 51, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (622, 7, '2026-06-11 17:00:00', 76, 51.4, 34.2, 239, -2.9888000, 104.7570000, 'Cerah', 1012, 27, 63, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (623, 8, '2026-06-11 17:00:00', 116, 76.4, 52.2, 509, -2.9691000, 104.7885000, 'Cerah', 1008, 29, 69, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (624, 9, '2026-06-11 17:00:00', 74, 49.1, 33.3, 253, -2.9723000, 104.8118000, 'Cerah', 1006, 26, 70, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (625, 10, '2026-06-11 17:00:00', 156, 102.4, 70.2, 562, -3.0039000, 104.8152000, 'Cerah', 1010, 27, 64, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (626, 11, '2026-06-11 17:00:00', 73, 48.5, 32.9, 260, -3.0195000, 104.7431000, 'Cerah', 1005, 28, 55, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (627, 12, '2026-06-11 17:00:00', 92, 61.8, 41.4, 186, -2.9972000, 104.7294000, 'Cerah', 1005, 29, 66, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (628, 13, '2026-06-11 17:00:00', 21, 13.7, 9.5, 54, -2.9431000, 104.7251000, 'Cerah', 1015, 30, 62, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (629, 14, '2026-06-11 17:00:00', 29, 19.9, 13.1, 71, -2.8986000, 104.7014000, 'Cerah', 1015, 27, 61, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (630, 15, '2026-06-11 17:00:00', 152, 99.8, 68.4, 545, -2.9556000, 104.7377000, 'Cerah', 1010, 30, 63, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (631, 1, '2026-06-11 18:00:00', 90, 56.5, 40.5, 200, -2.9912000, 104.7479000, 'Cerah', 1005, 28, 51, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (632, 2, '2026-06-11 18:00:00', 67, 43.6, 30.2, 230, -2.9916000, 104.7485000, 'Cerah', 1014, 28, 66, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (633, 3, '2026-06-11 18:00:00', 78, 51.7, 35.1, 188, -2.9754000, 104.7505000, 'Cerah', 1013, 26, 55, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (634, 4, '2026-06-11 18:00:00', 88, 57.2, 39.6, 245, -2.9904000, 104.7592000, 'Cerah', 1011, 28, 65, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (635, 5, '2026-06-11 18:00:00', 92, 59.8, 41.4, 257, -2.9918000, 104.7634000, 'Cerah', 1013, 29, 62, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (636, 6, '2026-06-11 18:00:00', 16, 11.4, 7.2, 85, -3.0211000, 104.7925000, 'Cerah', 1009, 27, 62, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (637, 7, '2026-06-11 18:00:00', 68, 46.2, 30.6, 218, -2.9888000, 104.7570000, 'Cerah', 1015, 30, 52, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (638, 8, '2026-06-11 18:00:00', 123, 83, 55.4, 559, -2.9691000, 104.7885000, 'Cerah', 1012, 26, 53, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (639, 9, '2026-06-11 18:00:00', 87, 54.6, 39.2, 246, -2.9723000, 104.8118000, 'Cerah', 1011, 26, 57, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (640, 10, '2026-06-11 18:00:00', 131, 80.2, 59, 530, -3.0039000, 104.8152000, 'Cerah', 1011, 26, 52, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (641, 11, '2026-06-11 18:00:00', 73, 47.5, 32.9, 232, -3.0195000, 104.7431000, 'Cerah', 1009, 30, 51, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (642, 12, '2026-06-11 18:00:00', 66, 39.9, 29.7, 201, -2.9972000, 104.7294000, 'Cerah', 1009, 26, 64, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (643, 13, '2026-06-11 18:00:00', 27, 16.6, 12.2, 68, -2.9431000, 104.7251000, 'Cerah', 1015, 26, 51, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (644, 14, '2026-06-11 18:00:00', 16, 12.4, 7.2, 89, -2.8986000, 104.7014000, 'Cerah', 1013, 30, 66, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (645, 15, '2026-06-11 18:00:00', 156, 106.4, 70.2, 567, -2.9556000, 104.7377000, 'Cerah', 1009, 26, 65, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (646, 1, '2026-06-11 19:00:00', 90, 56.5, 40.5, 212, -2.9912000, 104.7479000, 'Cerah', 1015, 30, 55, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (647, 2, '2026-06-11 19:00:00', 75, 49.8, 33.8, 182, -2.9916000, 104.7485000, 'Cerah', 1012, 27, 52, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (648, 3, '2026-06-11 19:00:00', 74, 49.1, 33.3, 207, -2.9754000, 104.7505000, 'Cerah', 1014, 30, 65, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (649, 4, '2026-06-11 19:00:00', 81, 55.7, 36.5, 255, -2.9904000, 104.7592000, 'Cerah', 1008, 27, 66, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (650, 5, '2026-06-11 19:00:00', 73, 47.5, 32.9, 192, -2.9918000, 104.7634000, 'Cerah', 1014, 29, 57, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (651, 6, '2026-06-11 19:00:00', 24, 16.6, 10.8, 89, -3.0211000, 104.7925000, 'Cerah', 1010, 30, 70, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (652, 7, '2026-06-11 19:00:00', 79, 50.4, 35.6, 229, -2.9888000, 104.7570000, 'Cerah', 1005, 29, 62, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (653, 8, '2026-06-11 19:00:00', 124, 85.6, 55.8, 437, -2.9691000, 104.7885000, 'Cerah', 1005, 29, 68, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (654, 9, '2026-06-11 19:00:00', 72, 43.8, 32.4, 216, -2.9723000, 104.8118000, 'Cerah', 1008, 27, 59, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (655, 10, '2026-06-11 19:00:00', 128, 82.2, 57.6, 430, -3.0039000, 104.8152000, 'Cerah', 1006, 28, 52, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (656, 11, '2026-06-11 19:00:00', 70, 43.5, 31.5, 264, -3.0195000, 104.7431000, 'Cerah', 1005, 27, 52, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (657, 12, '2026-06-11 19:00:00', 85, 57.3, 38.3, 239, -2.9972000, 104.7294000, 'Cerah', 1015, 30, 66, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (658, 13, '2026-06-11 19:00:00', 28, 17.2, 12.6, 74, -2.9431000, 104.7251000, 'Cerah', 1015, 30, 51, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (659, 14, '2026-06-11 19:00:00', 30, 18.5, 13.5, 86, -2.8986000, 104.7014000, 'Berawan', 1005, 26, 52, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (660, 15, '2026-06-11 19:00:00', 141, 86.7, 63.5, 520, -2.9556000, 104.7377000, 'Cerah', 1011, 30, 68, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (661, 1, '2026-06-11 20:00:00', 86, 52.9, 38.7, 226, -2.9912000, 104.7479000, 'Cerah', 1005, 26, 61, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (662, 2, '2026-06-11 20:00:00', 78, 47.7, 35.1, 252, -2.9916000, 104.7485000, 'Cerah', 1005, 26, 58, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (663, 3, '2026-06-11 20:00:00', 69, 46.9, 31.1, 183, -2.9754000, 104.7505000, 'Cerah', 1005, 26, 54, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (664, 4, '2026-06-11 20:00:00', 81, 52.7, 36.5, 244, -2.9904000, 104.7592000, 'Berawan', 1012, 30, 60, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (665, 5, '2026-06-11 20:00:00', 91, 56.2, 41, 226, -2.9918000, 104.7634000, 'Berawan', 1008, 29, 52, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (666, 6, '2026-06-11 20:00:00', 17, 11.1, 7.7, 68, -3.0211000, 104.7925000, 'Cerah', 1014, 26, 58, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (667, 7, '2026-06-11 20:00:00', 66, 41.9, 29.7, 232, -2.9888000, 104.7570000, 'Cerah', 1013, 28, 67, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (668, 8, '2026-06-11 20:00:00', 135, 83.8, 60.8, 456, -2.9691000, 104.7885000, 'Cerah', 1013, 26, 50, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (669, 9, '2026-06-11 20:00:00', 81, 53.7, 36.5, 195, -2.9723000, 104.8118000, 'Cerah', 1011, 26, 63, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (670, 10, '2026-06-11 20:00:00', 141, 92.7, 63.5, 478, -3.0039000, 104.8152000, 'Cerah', 1012, 28, 52, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (671, 11, '2026-06-11 20:00:00', 84, 54.6, 37.8, 248, -3.0195000, 104.7431000, 'Cerah', 1005, 26, 60, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (672, 12, '2026-06-11 20:00:00', 69, 43.9, 31.1, 212, -2.9972000, 104.7294000, 'Cerah', 1005, 30, 54, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (673, 13, '2026-06-11 20:00:00', 20, 12, 9, 86, -2.9431000, 104.7251000, 'Cerah', 1013, 26, 60, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (674, 14, '2026-06-11 20:00:00', 27, 15.6, 12.2, 89, -2.8986000, 104.7014000, 'Cerah', 1015, 30, 70, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (675, 15, '2026-06-11 20:00:00', 127, 80.6, 57.2, 384, -2.9556000, 104.7377000, 'Cerah', 1006, 26, 54, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (676, 1, '2026-06-11 21:00:00', 58, 34.7, 26.1, 118, -2.9912000, 104.7479000, 'Cerah', 1009, 30, 63, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (677, 2, '2026-06-11 21:00:00', 40, 24, 18, 120, -2.9916000, 104.7485000, 'Cerah', 1012, 30, 53, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (678, 3, '2026-06-11 21:00:00', 54, 32.1, 24.3, 157, -2.9754000, 104.7505000, 'Cerah', 1011, 29, 53, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (679, 4, '2026-06-11 21:00:00', 63, 39, 28.4, 131, -2.9904000, 104.7592000, 'Cerah', 1009, 27, 59, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (680, 5, '2026-06-11 21:00:00', 43, 29, 19.4, 121, -2.9918000, 104.7634000, 'Cerah', 1006, 26, 61, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (681, 6, '2026-06-11 21:00:00', 17, 12.1, 7.7, 42, -3.0211000, 104.7925000, 'Cerah', 1013, 30, 56, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (682, 7, '2026-06-11 21:00:00', 52, 30.8, 23.4, 113, -2.9888000, 104.7570000, 'Berawan', 1007, 26, 50, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (683, 8, '2026-06-11 21:00:00', 73, 49.5, 32.9, 365, -2.9691000, 104.7885000, 'Cerah', 1015, 29, 56, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (684, 9, '2026-06-11 21:00:00', 50, 31.5, 22.5, 140, -2.9723000, 104.8118000, 'Berawan', 1014, 27, 64, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (685, 10, '2026-06-11 21:00:00', 82, 52.3, 36.9, 286, -3.0039000, 104.8152000, 'Berawan', 1012, 28, 62, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (686, 11, '2026-06-11 21:00:00', 49, 29.9, 22.1, 179, -3.0195000, 104.7431000, 'Cerah', 1012, 30, 62, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (687, 12, '2026-06-11 21:00:00', 53, 37.5, 23.9, 126, -2.9972000, 104.7294000, 'Cerah', 1013, 26, 67, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (688, 13, '2026-06-11 21:00:00', 7, 5, 3.2, 57, -2.9431000, 104.7251000, 'Cerah', 1008, 26, 51, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (689, 14, '2026-06-11 21:00:00', 5, 5, 2.3, 52, -2.8986000, 104.7014000, 'Cerah', 1014, 30, 68, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (690, 15, '2026-06-11 21:00:00', 86, 50.9, 38.7, 255, -2.9556000, 104.7377000, 'Berawan', 1009, 29, 70, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (691, 1, '2026-06-11 22:00:00', 65, 39.3, 29.3, 154, -2.9912000, 104.7479000, 'Cerah', 1008, 27, 61, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (692, 2, '2026-06-11 22:00:00', 41, 27.7, 18.5, 148, -2.9916000, 104.7485000, 'Cerah', 1015, 30, 51, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (693, 3, '2026-06-11 22:00:00', 49, 32.9, 22.1, 176, -2.9754000, 104.7505000, 'Berawan', 1008, 29, 59, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (694, 4, '2026-06-11 22:00:00', 45, 27.3, 20.3, 125, -2.9904000, 104.7592000, 'Cerah', 1008, 29, 60, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (695, 5, '2026-06-11 22:00:00', 49, 33.9, 22.1, 128, -2.9918000, 104.7634000, 'Cerah', 1007, 29, 58, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (696, 6, '2026-06-11 22:00:00', 15, 10.8, 6.8, 35, -3.0211000, 104.7925000, 'Cerah', 1010, 26, 51, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (697, 7, '2026-06-11 22:00:00', 45, 32.3, 20.3, 129, -2.9888000, 104.7570000, 'Cerah', 1014, 26, 64, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (698, 8, '2026-06-11 22:00:00', 95, 60.8, 42.8, 341, -2.9691000, 104.7885000, 'Berawan', 1012, 30, 52, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (699, 9, '2026-06-11 22:00:00', 53, 32.5, 23.9, 164, -2.9723000, 104.8118000, 'Cerah', 1011, 30, 59, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (700, 10, '2026-06-11 22:00:00', 75, 53.8, 33.8, 279, -3.0039000, 104.8152000, 'Cerah', 1013, 29, 54, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (701, 11, '2026-06-11 22:00:00', 56, 37.4, 25.2, 160, -3.0195000, 104.7431000, 'Cerah', 1006, 29, 56, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (702, 12, '2026-06-11 22:00:00', 51, 33.2, 23, 175, -2.9972000, 104.7294000, 'Berawan', 1012, 26, 56, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (703, 13, '2026-06-11 22:00:00', 11, 6.2, 5, 47, -2.9431000, 104.7251000, 'Cerah', 1013, 30, 63, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (704, 14, '2026-06-11 22:00:00', 18, 13.7, 8.1, 60, -2.8986000, 104.7014000, 'Cerah', 1006, 27, 53, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (705, 15, '2026-06-11 22:00:00', 93, 59.5, 41.9, 276, -2.9556000, 104.7377000, 'Cerah', 1005, 30, 55, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (706, 1, '2026-06-11 23:00:00', 64, 43.6, 28.8, 132, -2.9912000, 104.7479000, 'Berawan', 1015, 28, 69, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (707, 2, '2026-06-11 23:00:00', 62, 41.3, 27.9, 101, -2.9916000, 104.7485000, 'Cerah', 1005, 28, 63, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (708, 3, '2026-06-11 23:00:00', 57, 38.1, 25.7, 177, -2.9754000, 104.7505000, 'Berawan', 1015, 30, 50, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (709, 4, '2026-06-11 23:00:00', 46, 29.9, 20.7, 135, -2.9904000, 104.7592000, 'Cerah', 1005, 29, 63, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (710, 5, '2026-06-11 23:00:00', 51, 34.2, 23, 151, -2.9918000, 104.7634000, 'Berawan', 1011, 27, 58, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (711, 6, '2026-06-11 23:00:00', 10, 5, 4.5, 45, -3.0211000, 104.7925000, 'Cerah', 1011, 30, 50, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (712, 7, '2026-06-11 23:00:00', 38, 24.7, 17.1, 113, -2.9888000, 104.7570000, 'Cerah', 1010, 27, 65, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (713, 8, '2026-06-11 23:00:00', 103, 64, 46.4, 356, -2.9691000, 104.7885000, 'Cerah', 1013, 29, 54, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (714, 9, '2026-06-11 23:00:00', 47, 28.6, 21.2, 136, -2.9723000, 104.8118000, 'Cerah', 1006, 26, 62, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (715, 10, '2026-06-11 23:00:00', 100, 67, 45, 346, -3.0039000, 104.8152000, 'Cerah', 1008, 26, 54, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (716, 11, '2026-06-11 23:00:00', 44, 25.6, 19.8, 165, -3.0195000, 104.7431000, 'Cerah', 1006, 29, 64, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (717, 12, '2026-06-11 23:00:00', 52, 31.8, 23.4, 125, -2.9972000, 104.7294000, 'Cerah', 1015, 30, 51, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (718, 13, '2026-06-11 23:00:00', 8, 5.2, 3.6, 60, -2.9431000, 104.7251000, 'Berawan', 1010, 29, 57, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (719, 14, '2026-06-11 23:00:00', 15, 9.8, 6.8, 58, -2.8986000, 104.7014000, 'Cerah', 1011, 29, 53, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (720, 15, '2026-06-11 23:00:00', 84, 59.6, 37.8, 305, -2.9556000, 104.7377000, 'Cerah', 1015, 27, 69, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (721, 1, '2026-06-12 00:00:00', 58, 37.7, 26.1, 123, -2.9912000, 104.7479000, 'Cerah', 1015, 29, 63, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (722, 2, '2026-06-12 00:00:00', 44, 27.6, 19.8, 136, -2.9916000, 104.7485000, 'Cerah', 1006, 29, 57, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (723, 3, '2026-06-12 00:00:00', 63, 41, 28.4, 151, -2.9754000, 104.7505000, 'Cerah', 1013, 28, 69, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (724, 4, '2026-06-12 00:00:00', 59, 35.4, 26.6, 106, -2.9904000, 104.7592000, 'Cerah', 1007, 30, 54, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (725, 5, '2026-06-12 00:00:00', 40, 23, 18, 124, -2.9918000, 104.7634000, 'Berawan', 1005, 29, 63, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (726, 6, '2026-06-12 00:00:00', 14, 10.1, 6.3, 55, -3.0211000, 104.7925000, 'Cerah', 1009, 27, 70, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (727, 7, '2026-06-12 00:00:00', 40, 29, 18, 115, -2.9888000, 104.7570000, 'Berawan', 1007, 30, 65, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (728, 8, '2026-06-12 00:00:00', 102, 64.3, 45.9, 253, -2.9691000, 104.7885000, 'Cerah', 1010, 27, 50, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (729, 9, '2026-06-12 00:00:00', 36, 21.4, 16.2, 141, -2.9723000, 104.8118000, 'Cerah', 1006, 29, 59, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (730, 10, '2026-06-12 00:00:00', 109, 73.9, 49.1, 221, -3.0039000, 104.8152000, 'Cerah', 1011, 30, 53, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (731, 11, '2026-06-12 00:00:00', 41, 25.7, 18.5, 175, -3.0195000, 104.7431000, 'Berawan', 1012, 26, 63, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (732, 12, '2026-06-12 00:00:00', 45, 31.3, 20.3, 126, -2.9972000, 104.7294000, 'Cerah', 1009, 30, 61, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (733, 13, '2026-06-12 00:00:00', 15, 9.8, 6.8, 31, -2.9431000, 104.7251000, 'Cerah', 1010, 29, 65, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (734, 14, '2026-06-12 00:00:00', 9, 5, 4.1, 35, -2.8986000, 104.7014000, 'Cerah', 1009, 27, 53, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (735, 1, '2026-06-12 01:00:00', 63, 40, 28.4, 111, -2.9912000, 104.7479000, 'Cerah', 1014, 26, 52, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (736, 2, '2026-06-12 01:00:00', 57, 34.1, 25.7, 144, -2.9916000, 104.7485000, 'Berawan', 1005, 30, 51, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (737, 3, '2026-06-12 01:00:00', 51, 32.2, 23, 119, -2.9754000, 104.7505000, 'Cerah', 1015, 27, 65, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (738, 4, '2026-06-12 01:00:00', 36, 20.4, 16.2, 149, -2.9904000, 104.7592000, 'Cerah', 1005, 28, 55, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (739, 5, '2026-06-12 01:00:00', 40, 27, 18, 158, -2.9918000, 104.7634000, 'Cerah', 1010, 28, 52, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (740, 6, '2026-06-12 01:00:00', 11, 9.2, 5, 54, -3.0211000, 104.7925000, 'Cerah', 1014, 27, 70, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (741, 7, '2026-06-12 01:00:00', 54, 33.1, 24.3, 143, -2.9888000, 104.7570000, 'Berawan', 1013, 30, 62, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (742, 8, '2026-06-12 01:00:00', 108, 75.2, 48.6, 222, -2.9691000, 104.7885000, 'Cerah', 1012, 27, 58, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (743, 9, '2026-06-12 01:00:00', 39, 22.4, 17.6, 117, -2.9723000, 104.8118000, 'Cerah', 1008, 26, 63, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (744, 10, '2026-06-12 01:00:00', 106, 71.9, 47.7, 370, -3.0039000, 104.8152000, 'Cerah', 1006, 26, 56, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (745, 11, '2026-06-12 01:00:00', 35, 24.8, 15.8, 161, -3.0195000, 104.7431000, 'Cerah', 1011, 28, 63, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (746, 12, '2026-06-12 01:00:00', 65, 42.3, 29.3, 116, -2.9972000, 104.7294000, 'Berawan', 1014, 27, 58, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (747, 13, '2026-06-12 01:00:00', 7, 6.6, 3.2, 47, -2.9431000, 104.7251000, 'Berawan', 1005, 30, 50, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (748, 14, '2026-06-12 01:00:00', 12, 9.8, 5.4, 31, -2.8986000, 104.7014000, 'Cerah', 1008, 28, 70, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (749, 1, '2026-06-12 02:00:00', 57, 34.1, 25.7, 148, -2.9912000, 104.7479000, 'Cerah', 1006, 28, 58, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (750, 2, '2026-06-12 02:00:00', 47, 27.6, 21.2, 116, -2.9916000, 104.7485000, 'Cerah', 1014, 26, 60, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (751, 3, '2026-06-12 02:00:00', 58, 39.7, 26.1, 124, -2.9754000, 104.7505000, 'Cerah', 1014, 26, 51, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (752, 4, '2026-06-12 02:00:00', 62, 41.3, 27.9, 148, -2.9904000, 104.7592000, 'Cerah', 1012, 27, 68, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (753, 5, '2026-06-12 02:00:00', 45, 26.3, 20.3, 143, -2.9918000, 104.7634000, 'Cerah', 1013, 29, 59, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (754, 6, '2026-06-12 02:00:00', 13, 9.5, 5.9, 46, -3.0211000, 104.7925000, 'Cerah', 1008, 29, 51, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (755, 7, '2026-06-12 02:00:00', 59, 36.4, 26.6, 125, -2.9888000, 104.7570000, 'Cerah', 1010, 30, 50, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (756, 8, '2026-06-12 02:00:00', 80, 47, 36, 313, -2.9691000, 104.7885000, 'Cerah', 1012, 30, 65, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (757, 9, '2026-06-12 02:00:00', 39, 28.4, 17.6, 105, -2.9723000, 104.8118000, 'Berawan', 1008, 26, 66, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (758, 10, '2026-06-12 02:00:00', 78, 47.7, 35.1, 240, -3.0039000, 104.8152000, 'Berawan', 1011, 30, 56, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (759, 11, '2026-06-12 02:00:00', 61, 40.7, 27.5, 152, -3.0195000, 104.7431000, 'Cerah', 1011, 28, 58, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (760, 12, '2026-06-12 02:00:00', 43, 29, 19.4, 159, -2.9972000, 104.7294000, 'Cerah', 1011, 27, 57, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (761, 13, '2026-06-12 02:00:00', 5, 5, 2.3, 37, -2.9431000, 104.7251000, 'Cerah', 1007, 28, 67, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (762, 14, '2026-06-12 02:00:00', 11, 7.2, 5, 55, -2.8986000, 104.7014000, 'Cerah', 1013, 26, 70, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (763, 1, '2026-06-12 03:00:00', 62, 42.3, 27.9, 177, -2.9912000, 104.7479000, 'Berawan', 1014, 27, 60, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (764, 2, '2026-06-12 03:00:00', 42, 26.3, 18.9, 143, -2.9916000, 104.7485000, 'Berawan', 1005, 26, 53, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (765, 3, '2026-06-12 03:00:00', 56, 37.4, 25.2, 142, -2.9754000, 104.7505000, 'Cerah', 1005, 28, 63, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (766, 4, '2026-06-12 03:00:00', 53, 37.5, 23.9, 148, -2.9904000, 104.7592000, 'Cerah', 1007, 26, 56, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (767, 5, '2026-06-12 03:00:00', 35, 22.8, 15.8, 167, -2.9918000, 104.7634000, 'Berawan', 1014, 27, 65, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (768, 6, '2026-06-12 03:00:00', 12, 9.8, 5.4, 43, -3.0211000, 104.7925000, 'Cerah', 1006, 28, 58, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (769, 7, '2026-06-12 03:00:00', 60, 39, 27, 130, -2.9888000, 104.7570000, 'Cerah', 1007, 26, 62, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (770, 8, '2026-06-12 03:00:00', 94, 56.1, 42.3, 343, -2.9691000, 104.7885000, 'Berawan', 1005, 29, 58, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (771, 9, '2026-06-12 03:00:00', 64, 39.6, 28.8, 180, -2.9723000, 104.8118000, 'Cerah', 1008, 27, 59, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (772, 10, '2026-06-12 03:00:00', 93, 64.5, 41.9, 273, -3.0039000, 104.8152000, 'Cerah', 1006, 30, 64, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (773, 11, '2026-06-12 03:00:00', 51, 31.2, 23, 126, -3.0195000, 104.7431000, 'Berawan', 1013, 30, 51, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (774, 12, '2026-06-12 03:00:00', 43, 30, 19.4, 101, -2.9972000, 104.7294000, 'Berawan', 1009, 27, 54, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (775, 13, '2026-06-12 03:00:00', 14, 8.1, 6.3, 33, -2.9431000, 104.7251000, 'Cerah', 1014, 29, 62, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (776, 14, '2026-06-12 03:00:00', 11, 6.2, 5, 40, -2.8986000, 104.7014000, 'Cerah', 1010, 29, 63, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (777, 1, '2026-06-12 04:00:00', 37, 27.1, 16.7, 132, -2.9912000, 104.7479000, 'Cerah', 1006, 26, 56, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (778, 2, '2026-06-12 04:00:00', 41, 27.7, 18.5, 173, -2.9916000, 104.7485000, 'Cerah', 1014, 26, 57, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (779, 3, '2026-06-12 04:00:00', 52, 34.8, 23.4, 119, -2.9754000, 104.7505000, 'Berawan', 1010, 27, 70, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (780, 4, '2026-06-12 04:00:00', 50, 29.5, 22.5, 125, -2.9904000, 104.7592000, 'Cerah', 1009, 27, 66, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (781, 5, '2026-06-12 04:00:00', 55, 35.8, 24.8, 147, -2.9918000, 104.7634000, 'Cerah', 1006, 29, 54, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (782, 6, '2026-06-12 04:00:00', 12, 7.8, 5.4, 46, -3.0211000, 104.7925000, 'Cerah', 1014, 28, 59, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (783, 7, '2026-06-12 04:00:00', 50, 31.5, 22.5, 177, -2.9888000, 104.7570000, 'Cerah', 1010, 26, 55, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (784, 8, '2026-06-12 04:00:00', 108, 73.2, 48.6, 371, -2.9691000, 104.7885000, 'Cerah', 1006, 30, 62, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (785, 9, '2026-06-12 04:00:00', 58, 40.7, 26.1, 109, -2.9723000, 104.8118000, 'Cerah', 1007, 30, 60, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (786, 10, '2026-06-12 04:00:00', 96, 57.4, 43.2, 339, -3.0039000, 104.8152000, 'Cerah', 1013, 27, 50, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (787, 11, '2026-06-12 04:00:00', 60, 38, 27, 163, -3.0195000, 104.7431000, 'Cerah', 1007, 29, 61, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (788, 12, '2026-06-12 04:00:00', 52, 35.8, 23.4, 124, -2.9972000, 104.7294000, 'Berawan', 1014, 28, 57, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (789, 13, '2026-06-12 04:00:00', 5, 5, 2.3, 57, -2.9431000, 104.7251000, 'Cerah', 1014, 29, 68, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (790, 14, '2026-06-12 04:00:00', 11, 5.2, 5, 53, -2.8986000, 104.7014000, 'Cerah', 1009, 30, 64, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (791, 1, '2026-06-12 05:00:00', 36, 21.4, 16.2, 163, -2.9912000, 104.7479000, 'Cerah', 1007, 27, 50, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (792, 2, '2026-06-12 05:00:00', 64, 41.6, 28.8, 130, -2.9916000, 104.7485000, 'Berawan', 1014, 30, 70, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (793, 3, '2026-06-12 05:00:00', 57, 38.1, 25.7, 144, -2.9754000, 104.7505000, 'Cerah', 1008, 26, 60, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (794, 4, '2026-06-12 05:00:00', 39, 23.4, 17.6, 148, -2.9904000, 104.7592000, 'Berawan', 1007, 26, 54, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (795, 5, '2026-06-12 05:00:00', 60, 39, 27, 111, -2.9918000, 104.7634000, 'Cerah', 1011, 27, 68, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (796, 6, '2026-06-12 05:00:00', 6, 5, 2.7, 45, -3.0211000, 104.7925000, 'Cerah', 1005, 26, 66, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (797, 7, '2026-06-12 05:00:00', 53, 33.5, 23.9, 167, -2.9888000, 104.7570000, 'Cerah', 1008, 28, 57, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (798, 8, '2026-06-12 05:00:00', 93, 62.5, 41.9, 380, -2.9691000, 104.7885000, 'Cerah', 1014, 29, 52, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (799, 9, '2026-06-12 05:00:00', 38, 24.7, 17.1, 133, -2.9723000, 104.8118000, 'Cerah', 1015, 27, 70, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (800, 10, '2026-06-12 05:00:00', 78, 46.7, 35.1, 271, -3.0039000, 104.8152000, 'Berawan', 1014, 28, 62, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (801, 11, '2026-06-12 05:00:00', 60, 39, 27, 118, -3.0195000, 104.7431000, 'Cerah', 1009, 28, 56, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (802, 12, '2026-06-12 05:00:00', 48, 31.2, 21.6, 136, -2.9972000, 104.7294000, 'Cerah', 1010, 28, 70, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (803, 13, '2026-06-12 05:00:00', 16, 12.4, 7.2, 30, -2.9431000, 104.7251000, 'Cerah', 1011, 28, 52, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (804, 14, '2026-06-12 05:00:00', 6, 5, 2.7, 31, -2.8986000, 104.7014000, 'Berawan', 1010, 26, 68, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (805, 1, '2026-06-12 06:00:00', 35, 25.8, 15.8, 134, -2.9912000, 104.7479000, 'Cerah', 1007, 29, 53, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (806, 2, '2026-06-12 06:00:00', 50, 32.5, 22.5, 160, -2.9916000, 104.7485000, 'Cerah', 1011, 29, 66, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (807, 3, '2026-06-12 06:00:00', 43, 29, 19.4, 169, -2.9754000, 104.7505000, 'Cerah', 1015, 26, 70, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (808, 4, '2026-06-12 06:00:00', 61, 39.7, 27.5, 118, -2.9904000, 104.7592000, 'Cerah', 1009, 27, 70, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (809, 5, '2026-06-12 06:00:00', 50, 31.5, 22.5, 114, -2.9918000, 104.7634000, 'Cerah', 1011, 28, 51, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (810, 6, '2026-06-12 06:00:00', 16, 11.4, 7.2, 56, -3.0211000, 104.7925000, 'Cerah', 1012, 26, 58, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (811, 7, '2026-06-12 06:00:00', 36, 22.4, 16.2, 164, -2.9888000, 104.7570000, 'Cerah', 1007, 26, 54, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (812, 8, '2026-06-12 06:00:00', 99, 60.4, 44.6, 365, -2.9691000, 104.7885000, 'Cerah', 1013, 28, 61, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (813, 9, '2026-06-12 06:00:00', 56, 33.4, 25.2, 116, -2.9723000, 104.8118000, 'Cerah', 1005, 27, 56, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (814, 10, '2026-06-12 06:00:00', 103, 70, 46.4, 225, -3.0039000, 104.8152000, 'Cerah', 1011, 30, 58, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (815, 11, '2026-06-12 06:00:00', 54, 33.1, 24.3, 108, -3.0195000, 104.7431000, 'Cerah', 1005, 29, 51, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (816, 12, '2026-06-12 06:00:00', 63, 41, 28.4, 173, -2.9972000, 104.7294000, 'Cerah', 1007, 28, 50, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (817, 13, '2026-06-12 06:00:00', 10, 8.5, 4.5, 53, -2.9431000, 104.7251000, 'Cerah', 1013, 28, 65, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (818, 14, '2026-06-12 06:00:00', 7, 6.6, 3.2, 55, -2.8986000, 104.7014000, 'Cerah', 1005, 26, 69, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (819, 1, '2026-06-12 07:00:00', 78, 52.7, 35.1, 233, -2.9912000, 104.7479000, 'Cerah', 1005, 27, 57, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (820, 2, '2026-06-12 07:00:00', 88, 57.2, 39.6, 208, -2.9916000, 104.7485000, 'Cerah', 1015, 27, 70, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (821, 3, '2026-06-12 07:00:00', 66, 44.9, 29.7, 231, -2.9754000, 104.7505000, 'Cerah', 1006, 27, 61, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (822, 4, '2026-06-12 07:00:00', 68, 43.2, 30.6, 232, -2.9904000, 104.7592000, 'Cerah', 1015, 29, 60, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (823, 5, '2026-06-12 07:00:00', 82, 56.3, 36.9, 255, -2.9918000, 104.7634000, 'Cerah', 1009, 28, 69, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (824, 6, '2026-06-12 07:00:00', 20, 14, 9, 57, -3.0211000, 104.7925000, 'Cerah', 1008, 29, 67, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (825, 7, '2026-06-12 07:00:00', 82, 52.3, 36.9, 224, -2.9888000, 104.7570000, 'Cerah', 1014, 26, 51, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (826, 8, '2026-06-12 07:00:00', 120, 76, 54, 439, -2.9691000, 104.7885000, 'Cerah', 1015, 28, 66, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (827, 9, '2026-06-12 07:00:00', 85, 56.3, 38.3, 238, -2.9723000, 104.8118000, 'Cerah', 1007, 26, 57, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (828, 10, '2026-06-12 07:00:00', 136, 90.4, 61.2, 489, -3.0039000, 104.8152000, 'Cerah', 1014, 30, 56, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (829, 11, '2026-06-12 07:00:00', 87, 54.6, 39.2, 241, -3.0195000, 104.7431000, 'Cerah', 1010, 29, 70, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (830, 12, '2026-06-12 07:00:00', 82, 56.3, 36.9, 233, -2.9972000, 104.7294000, 'Cerah', 1007, 28, 65, 83, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (831, 13, '2026-06-12 07:00:00', 23, 17, 10.4, 79, -2.9431000, 104.7251000, 'Cerah', 1010, 28, 57, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (832, 14, '2026-06-12 07:00:00', 21, 12.7, 9.5, 68, -2.8986000, 104.7014000, 'Cerah', 1010, 29, 59, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (833, 1, '2026-06-12 08:00:00', 74, 45.1, 33.3, 245, -2.9912000, 104.7479000, 'Cerah', 1012, 28, 52, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (834, 2, '2026-06-12 08:00:00', 81, 54.7, 36.5, 219, -2.9916000, 104.7485000, 'Cerah', 1008, 27, 54, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (835, 3, '2026-06-12 08:00:00', 74, 47.1, 33.3, 180, -2.9754000, 104.7505000, 'Cerah', 1008, 28, 69, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (836, 4, '2026-06-12 08:00:00', 93, 60.5, 41.9, 248, -2.9904000, 104.7592000, 'Cerah', 1008, 30, 60, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (837, 5, '2026-06-12 08:00:00', 66, 40.9, 29.7, 227, -2.9918000, 104.7634000, 'Cerah', 1008, 30, 52, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (838, 6, '2026-06-12 08:00:00', 22, 12.3, 9.9, 88, -3.0211000, 104.7925000, 'Cerah', 1014, 27, 60, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (839, 7, '2026-06-12 08:00:00', 67, 44.6, 30.2, 232, -2.9888000, 104.7570000, 'Cerah', 1007, 29, 57, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (840, 8, '2026-06-12 08:00:00', 158, 102.7, 71.1, 429, -2.9691000, 104.7885000, 'Cerah', 1013, 28, 56, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (841, 9, '2026-06-12 08:00:00', 69, 46.9, 31.1, 232, -2.9723000, 104.8118000, 'Cerah', 1014, 30, 69, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (842, 10, '2026-06-12 08:00:00', 149, 92.9, 67.1, 473, -3.0039000, 104.8152000, 'Cerah', 1013, 30, 63, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (843, 11, '2026-06-12 08:00:00', 81, 49.7, 36.5, 219, -3.0195000, 104.7431000, 'Cerah', 1010, 27, 66, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (844, 12, '2026-06-12 08:00:00', 84, 51.6, 37.8, 269, -2.9972000, 104.7294000, 'Cerah', 1009, 30, 66, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (845, 13, '2026-06-12 08:00:00', 19, 14.4, 8.6, 57, -2.9431000, 104.7251000, 'Cerah', 1010, 28, 54, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (846, 14, '2026-06-12 08:00:00', 23, 13, 10.4, 78, -2.8986000, 104.7014000, 'Cerah', 1009, 30, 53, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (847, 1, '2026-06-12 09:00:00', 73, 47.5, 32.9, 212, -2.9912000, 104.7479000, 'Cerah', 1005, 29, 57, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (848, 2, '2026-06-12 09:00:00', 92, 56.8, 41.4, 225, -2.9916000, 104.7485000, 'Cerah', 1006, 27, 55, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (849, 3, '2026-06-12 09:00:00', 87, 54.6, 39.2, 191, -2.9754000, 104.7505000, 'Cerah', 1005, 29, 56, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (850, 4, '2026-06-12 09:00:00', 80, 52, 36, 262, -2.9904000, 104.7592000, 'Cerah', 1009, 28, 56, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (851, 5, '2026-06-12 09:00:00', 73, 45.5, 32.9, 198, -2.9918000, 104.7634000, 'Cerah', 1012, 30, 50, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (852, 6, '2026-06-12 09:00:00', 16, 10.4, 7.2, 83, -3.0211000, 104.7925000, 'Cerah', 1006, 26, 50, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (853, 7, '2026-06-12 09:00:00', 83, 51, 37.4, 268, -2.9888000, 104.7570000, 'Cerah', 1005, 30, 67, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (854, 8, '2026-06-12 09:00:00', 150, 94.5, 67.5, 488, -2.9691000, 104.7885000, 'Cerah', 1008, 27, 51, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (855, 9, '2026-06-12 09:00:00', 83, 52, 37.4, 236, -2.9723000, 104.8118000, 'Cerah', 1009, 30, 62, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (856, 10, '2026-06-12 09:00:00', 150, 98.5, 67.5, 413, -3.0039000, 104.8152000, 'Cerah', 1012, 30, 63, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (857, 11, '2026-06-12 09:00:00', 80, 49, 36, 205, -3.0195000, 104.7431000, 'Cerah', 1008, 29, 70, 91, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (858, 12, '2026-06-12 09:00:00', 68, 47.2, 30.6, 228, -2.9972000, 104.7294000, 'Cerah', 1007, 27, 58, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (859, 13, '2026-06-12 09:00:00', 22, 15.3, 9.9, 85, -2.9431000, 104.7251000, 'Cerah', 1008, 26, 70, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (860, 14, '2026-06-12 09:00:00', 25, 15.3, 11.3, 61, -2.8986000, 104.7014000, 'Cerah', 1008, 30, 60, 100, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (861, 1, '2026-06-12 10:00:00', 58, 38.7, 26.1, 169, -2.9912000, 104.7479000, 'Cerah', 1012, 28, 60, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (862, 2, '2026-06-12 10:00:00', 40, 24, 18, 118, -2.9916000, 104.7485000, 'Cerah', 1010, 26, 51, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (863, 3, '2026-06-12 10:00:00', 54, 37.1, 24.3, 173, -2.9754000, 104.7505000, 'Cerah', 1006, 27, 62, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (864, 4, '2026-06-12 10:00:00', 45, 32.3, 20.3, 109, -2.9904000, 104.7592000, 'Cerah', 1006, 29, 67, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (865, 5, '2026-06-12 10:00:00', 39, 27.4, 17.6, 117, -2.9918000, 104.7634000, 'Cerah', 1011, 29, 57, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (866, 6, '2026-06-12 10:00:00', 6, 5, 2.7, 42, -3.0211000, 104.7925000, 'Cerah', 1015, 26, 58, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (867, 7, '2026-06-12 10:00:00', 38, 24.7, 17.1, 161, -2.9888000, 104.7570000, 'Cerah', 1012, 29, 70, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (868, 8, '2026-06-12 10:00:00', 74, 47.1, 33.3, 307, -2.9691000, 104.7885000, 'Cerah', 1008, 30, 63, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (869, 9, '2026-06-12 10:00:00', 40, 23, 18, 147, -2.9723000, 104.8118000, 'Cerah', 1013, 28, 68, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (870, 10, '2026-06-12 10:00:00', 94, 62.1, 42.3, 344, -3.0039000, 104.8152000, 'Cerah', 1010, 29, 61, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (871, 11, '2026-06-12 10:00:00', 55, 38.8, 24.8, 130, -3.0195000, 104.7431000, 'Cerah', 1007, 28, 59, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (872, 12, '2026-06-12 10:00:00', 47, 29.6, 21.2, 178, -2.9972000, 104.7294000, 'Cerah', 1006, 27, 65, 88, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (873, 13, '2026-06-12 10:00:00', 13, 8.5, 5.9, 45, -2.9431000, 104.7251000, 'Cerah', 1005, 28, 52, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (874, 14, '2026-06-12 10:00:00', 14, 7.1, 6.3, 47, -2.8986000, 104.7014000, 'Cerah', 1009, 26, 52, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (875, 1, '2026-06-12 11:00:00', 39, 23.4, 17.6, 128, -2.9912000, 104.7479000, 'Cerah', 1007, 30, 57, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (876, 2, '2026-06-12 11:00:00', 39, 23.4, 17.6, 160, -2.9916000, 104.7485000, 'Cerah', 1006, 27, 53, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (877, 3, '2026-06-12 11:00:00', 48, 34.2, 21.6, 140, -2.9754000, 104.7505000, 'Cerah', 1010, 30, 70, 90, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (878, 4, '2026-06-12 11:00:00', 47, 33.6, 21.2, 130, -2.9904000, 104.7592000, 'Cerah', 1010, 30, 69, 82, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (879, 5, '2026-06-12 11:00:00', 35, 20.8, 15.8, 126, -2.9918000, 104.7634000, 'Cerah', 1006, 29, 58, 86, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (880, 6, '2026-06-12 11:00:00', 9, 5, 4.1, 45, -3.0211000, 104.7925000, 'Cerah', 1007, 26, 70, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (881, 7, '2026-06-12 11:00:00', 51, 33.2, 23, 113, -2.9888000, 104.7570000, 'Cerah', 1015, 29, 59, 98, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (882, 8, '2026-06-12 11:00:00', 75, 44.8, 33.8, 318, -2.9691000, 104.7885000, 'Cerah', 1012, 28, 70, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (883, 9, '2026-06-12 11:00:00', 64, 42.6, 28.8, 104, -2.9723000, 104.8118000, 'Cerah', 1013, 28, 70, 81, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (884, 10, '2026-06-12 11:00:00', 88, 59.2, 39.6, 295, -3.0039000, 104.8152000, 'Cerah', 1012, 29, 69, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (885, 11, '2026-06-12 11:00:00', 37, 23.1, 16.7, 163, -3.0195000, 104.7431000, 'Cerah', 1010, 30, 69, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (886, 12, '2026-06-12 11:00:00', 37, 23.1, 16.7, 180, -2.9972000, 104.7294000, 'Cerah', 1007, 30, 62, 84, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (887, 13, '2026-06-12 11:00:00', 8, 7.2, 3.6, 48, -2.9431000, 104.7251000, 'Cerah', 1012, 27, 65, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (888, 14, '2026-06-12 11:00:00', 14, 10.1, 6.3, 30, -2.8986000, 104.7014000, 'Cerah', 1014, 28, 65, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (889, 1, '2026-06-12 12:00:00', 54, 34.1, 24.3, 110, -2.9912000, 104.7479000, 'Cerah', 1008, 26, 70, 85, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (890, 2, '2026-06-12 12:00:00', 42, 27.3, 18.9, 139, -2.9916000, 104.7485000, 'Cerah', 1008, 28, 57, 87, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (891, 3, '2026-06-12 12:00:00', 56, 35.4, 25.2, 153, -2.9754000, 104.7505000, 'Cerah', 1007, 26, 54, 96, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (892, 4, '2026-06-12 12:00:00', 41, 25.7, 18.5, 120, -2.9904000, 104.7592000, 'Cerah', 1005, 26, 52, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (893, 5, '2026-06-12 12:00:00', 36, 22.4, 16.2, 166, -2.9918000, 104.7634000, 'Cerah', 1010, 28, 53, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (894, 6, '2026-06-12 12:00:00', 13, 9.5, 5.9, 38, -3.0211000, 104.7925000, 'Cerah', 1006, 26, 54, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (895, 7, '2026-06-12 12:00:00', 56, 34.4, 25.2, 174, -2.9888000, 104.7570000, 'Cerah', 1012, 26, 66, 80, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (896, 8, '2026-06-12 12:00:00', 78, 54.7, 35.1, 339, -2.9691000, 104.7885000, 'Cerah', 1010, 28, 68, 95, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (897, 9, '2026-06-12 12:00:00', 45, 28.3, 20.3, 157, -2.9723000, 104.8118000, 'Cerah', 1008, 29, 50, 92, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (898, 10, '2026-06-12 12:00:00', 103, 66, 46.4, 264, -3.0039000, 104.8152000, 'Cerah', 1008, 28, 61, 94, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (899, 11, '2026-06-12 12:00:00', 35, 19.8, 15.8, 134, -3.0195000, 104.7431000, 'Cerah', 1007, 29, 51, 93, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (900, 12, '2026-06-12 12:00:00', 47, 31.6, 21.2, 174, -2.9972000, 104.7294000, 'Cerah', 1012, 30, 65, 97, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (901, 13, '2026-06-12 12:00:00', 15, 9.8, 6.8, 53, -2.9431000, 104.7251000, 'Cerah', 1008, 29, 55, 89, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `sensor_data` VALUES (902, 14, '2026-06-12 12:00:00', 5, 5, 2.3, 34, -2.8986000, 104.7014000, 'Cerah', 1015, 29, 60, 99, '2026-06-12 12:01:29', '2026-06-12 12:01:29');

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NULL DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `sessions_user_id_index`(`user_id` ASC) USING BTREE,
  INDEX `sessions_last_activity_index`(`last_activity` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sessions
-- ----------------------------
INSERT INTO `sessions` VALUES ('KhzSJ6shmkSY5qMZeCs4RIuU2I1xDCrOgTwEDeU4', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJsTnZZVnNSQ09makhybmlqWWcyNjlqbjdDcDNQcHZhQWZrR2Zyb3N5IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfSwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOjF9', 1781270435);

-- ----------------------------
-- Table structure for telemetry_logs
-- ----------------------------
DROP TABLE IF EXISTS `telemetry_logs`;
CREATE TABLE `telemetry_logs`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `device_id` bigint UNSIGNED NOT NULL,
  `pm25` double NOT NULL,
  `pm10` double NOT NULL,
  `mq135` double NOT NULL,
  `humidity` double NOT NULL,
  `pressure` double NOT NULL,
  `weather` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `telemetry_logs_device_id_foreign`(`device_id` ASC) USING BTREE,
  CONSTRAINT `telemetry_logs_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 903 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of telemetry_logs
-- ----------------------------
INSERT INTO `telemetry_logs` VALUES (1, 1, 53, 37.5, 179, 59, 1010, 'Cerah', '2026-06-10 00:00:00');
INSERT INTO `telemetry_logs` VALUES (2, 2, 45, 31.3, 132, 51, 1007, 'Cerah', '2026-06-10 00:00:00');
INSERT INTO `telemetry_logs` VALUES (3, 3, 61, 37.7, 175, 52, 1011, 'Cerah', '2026-06-10 00:00:00');
INSERT INTO `telemetry_logs` VALUES (4, 4, 60, 38, 153, 51, 1006, 'Cerah', '2026-06-10 00:00:00');
INSERT INTO `telemetry_logs` VALUES (5, 5, 52, 33.8, 124, 55, 1013, 'Berawan', '2026-06-10 00:00:00');
INSERT INTO `telemetry_logs` VALUES (6, 6, 15, 7.8, 51, 70, 1005, 'Cerah', '2026-06-10 00:00:00');
INSERT INTO `telemetry_logs` VALUES (7, 7, 42, 28.3, 135, 59, 1010, 'Cerah', '2026-06-10 00:00:00');
INSERT INTO `telemetry_logs` VALUES (8, 8, 79, 56.4, 264, 69, 1005, 'Berawan', '2026-06-10 00:00:00');
INSERT INTO `telemetry_logs` VALUES (9, 9, 58, 35.7, 152, 53, 1007, 'Cerah', '2026-06-10 00:00:00');
INSERT INTO `telemetry_logs` VALUES (10, 10, 99, 60.4, 233, 54, 1006, 'Cerah', '2026-06-10 00:00:00');
INSERT INTO `telemetry_logs` VALUES (11, 11, 64, 41.6, 147, 58, 1009, 'Cerah', '2026-06-10 00:00:00');
INSERT INTO `telemetry_logs` VALUES (12, 12, 61, 40.7, 171, 63, 1013, 'Cerah', '2026-06-10 00:00:00');
INSERT INTO `telemetry_logs` VALUES (13, 13, 5, 5, 40, 56, 1009, 'Cerah', '2026-06-10 00:00:00');
INSERT INTO `telemetry_logs` VALUES (14, 14, 17, 13.1, 44, 64, 1013, 'Cerah', '2026-06-10 00:00:00');
INSERT INTO `telemetry_logs` VALUES (15, 15, 72, 43.8, 275, 53, 1006, 'Cerah', '2026-06-10 00:00:00');
INSERT INTO `telemetry_logs` VALUES (16, 1, 43, 28, 151, 57, 1005, 'Berawan', '2026-06-10 01:00:00');
INSERT INTO `telemetry_logs` VALUES (17, 2, 44, 25.6, 143, 57, 1005, 'Cerah', '2026-06-10 01:00:00');
INSERT INTO `telemetry_logs` VALUES (18, 3, 37, 22.1, 136, 63, 1011, 'Cerah', '2026-06-10 01:00:00');
INSERT INTO `telemetry_logs` VALUES (19, 4, 50, 34.5, 105, 64, 1005, 'Cerah', '2026-06-10 01:00:00');
INSERT INTO `telemetry_logs` VALUES (20, 5, 53, 35.5, 111, 63, 1012, 'Berawan', '2026-06-10 01:00:00');
INSERT INTO `telemetry_logs` VALUES (21, 6, 10, 5, 38, 70, 1014, 'Cerah', '2026-06-10 01:00:00');
INSERT INTO `telemetry_logs` VALUES (22, 7, 61, 37.7, 149, 61, 1007, 'Cerah', '2026-06-10 01:00:00');
INSERT INTO `telemetry_logs` VALUES (23, 8, 74, 43.1, 233, 55, 1010, 'Cerah', '2026-06-10 01:00:00');
INSERT INTO `telemetry_logs` VALUES (24, 9, 44, 31.6, 116, 67, 1008, 'Cerah', '2026-06-10 01:00:00');
INSERT INTO `telemetry_logs` VALUES (25, 10, 89, 54.9, 349, 65, 1008, 'Cerah', '2026-06-10 01:00:00');
INSERT INTO `telemetry_logs` VALUES (26, 11, 42, 25.3, 156, 68, 1013, 'Cerah', '2026-06-10 01:00:00');
INSERT INTO `telemetry_logs` VALUES (27, 12, 61, 37.7, 148, 58, 1012, 'Cerah', '2026-06-10 01:00:00');
INSERT INTO `telemetry_logs` VALUES (28, 13, 14, 10.1, 48, 50, 1011, 'Cerah', '2026-06-10 01:00:00');
INSERT INTO `telemetry_logs` VALUES (29, 14, 7, 5, 31, 52, 1014, 'Cerah', '2026-06-10 01:00:00');
INSERT INTO `telemetry_logs` VALUES (30, 15, 86, 56.9, 308, 54, 1014, 'Cerah', '2026-06-10 01:00:00');
INSERT INTO `telemetry_logs` VALUES (31, 1, 40, 29, 151, 66, 1010, 'Cerah', '2026-06-10 02:00:00');
INSERT INTO `telemetry_logs` VALUES (32, 2, 51, 31.2, 104, 66, 1005, 'Berawan', '2026-06-10 02:00:00');
INSERT INTO `telemetry_logs` VALUES (33, 3, 53, 35.5, 171, 59, 1008, 'Cerah', '2026-06-10 02:00:00');
INSERT INTO `telemetry_logs` VALUES (34, 4, 51, 32.2, 100, 70, 1014, 'Cerah', '2026-06-10 02:00:00');
INSERT INTO `telemetry_logs` VALUES (35, 5, 43, 31, 140, 62, 1007, 'Berawan', '2026-06-10 02:00:00');
INSERT INTO `telemetry_logs` VALUES (36, 6, 11, 7.2, 52, 68, 1010, 'Cerah', '2026-06-10 02:00:00');
INSERT INTO `telemetry_logs` VALUES (37, 7, 57, 34.1, 119, 54, 1009, 'Berawan', '2026-06-10 02:00:00');
INSERT INTO `telemetry_logs` VALUES (38, 8, 84, 59.6, 345, 68, 1012, 'Cerah', '2026-06-10 02:00:00');
INSERT INTO `telemetry_logs` VALUES (39, 9, 53, 32.5, 122, 52, 1007, 'Berawan', '2026-06-10 02:00:00');
INSERT INTO `telemetry_logs` VALUES (40, 10, 107, 71.6, 290, 54, 1011, 'Cerah', '2026-06-10 02:00:00');
INSERT INTO `telemetry_logs` VALUES (41, 11, 40, 26, 118, 64, 1014, 'Cerah', '2026-06-10 02:00:00');
INSERT INTO `telemetry_logs` VALUES (42, 12, 36, 26.4, 165, 70, 1009, 'Cerah', '2026-06-10 02:00:00');
INSERT INTO `telemetry_logs` VALUES (43, 13, 11, 8.2, 38, 61, 1011, 'Berawan', '2026-06-10 02:00:00');
INSERT INTO `telemetry_logs` VALUES (44, 14, 5, 5, 40, 61, 1012, 'Cerah', '2026-06-10 02:00:00');
INSERT INTO `telemetry_logs` VALUES (45, 15, 85, 55.3, 368, 56, 1009, 'Cerah', '2026-06-10 02:00:00');
INSERT INTO `telemetry_logs` VALUES (46, 1, 62, 37.3, 176, 61, 1010, 'Cerah', '2026-06-10 03:00:00');
INSERT INTO `telemetry_logs` VALUES (47, 2, 43, 25, 154, 53, 1015, 'Cerah', '2026-06-10 03:00:00');
INSERT INTO `telemetry_logs` VALUES (48, 3, 50, 31.5, 129, 59, 1005, 'Cerah', '2026-06-10 03:00:00');
INSERT INTO `telemetry_logs` VALUES (49, 4, 63, 40, 121, 51, 1007, 'Cerah', '2026-06-10 03:00:00');
INSERT INTO `telemetry_logs` VALUES (50, 5, 55, 36.8, 169, 65, 1006, 'Berawan', '2026-06-10 03:00:00');
INSERT INTO `telemetry_logs` VALUES (51, 6, 14, 7.1, 48, 51, 1014, 'Cerah', '2026-06-10 03:00:00');
INSERT INTO `telemetry_logs` VALUES (52, 7, 53, 35.5, 141, 66, 1012, 'Cerah', '2026-06-10 03:00:00');
INSERT INTO `telemetry_logs` VALUES (53, 8, 105, 72.3, 255, 60, 1010, 'Cerah', '2026-06-10 03:00:00');
INSERT INTO `telemetry_logs` VALUES (54, 9, 37, 21.1, 165, 52, 1015, 'Cerah', '2026-06-10 03:00:00');
INSERT INTO `telemetry_logs` VALUES (55, 10, 92, 64.8, 320, 67, 1014, 'Berawan', '2026-06-10 03:00:00');
INSERT INTO `telemetry_logs` VALUES (56, 11, 59, 39.4, 103, 67, 1014, 'Cerah', '2026-06-10 03:00:00');
INSERT INTO `telemetry_logs` VALUES (57, 12, 57, 36.1, 115, 58, 1007, 'Cerah', '2026-06-10 03:00:00');
INSERT INTO `telemetry_logs` VALUES (58, 13, 6, 5, 40, 67, 1014, 'Cerah', '2026-06-10 03:00:00');
INSERT INTO `telemetry_logs` VALUES (59, 14, 6, 5, 46, 64, 1013, 'Cerah', '2026-06-10 03:00:00');
INSERT INTO `telemetry_logs` VALUES (60, 15, 98, 63.7, 342, 59, 1014, 'Cerah', '2026-06-10 03:00:00');
INSERT INTO `telemetry_logs` VALUES (61, 1, 55, 33.8, 141, 55, 1013, 'Berawan', '2026-06-10 04:00:00');
INSERT INTO `telemetry_logs` VALUES (62, 2, 65, 39.3, 137, 50, 1013, 'Cerah', '2026-06-10 04:00:00');
INSERT INTO `telemetry_logs` VALUES (63, 3, 57, 38.1, 167, 53, 1008, 'Cerah', '2026-06-10 04:00:00');
INSERT INTO `telemetry_logs` VALUES (64, 4, 40, 28, 138, 64, 1011, 'Berawan', '2026-06-10 04:00:00');
INSERT INTO `telemetry_logs` VALUES (65, 5, 50, 33.5, 168, 66, 1015, 'Cerah', '2026-06-10 04:00:00');
INSERT INTO `telemetry_logs` VALUES (66, 6, 15, 9.8, 55, 55, 1015, 'Berawan', '2026-06-10 04:00:00');
INSERT INTO `telemetry_logs` VALUES (67, 7, 52, 35.8, 124, 54, 1014, 'Cerah', '2026-06-10 04:00:00');
INSERT INTO `telemetry_logs` VALUES (68, 8, 96, 66.4, 345, 62, 1014, 'Cerah', '2026-06-10 04:00:00');
INSERT INTO `telemetry_logs` VALUES (69, 9, 57, 39.1, 143, 62, 1012, 'Cerah', '2026-06-10 04:00:00');
INSERT INTO `telemetry_logs` VALUES (70, 10, 85, 54.3, 371, 61, 1005, 'Cerah', '2026-06-10 04:00:00');
INSERT INTO `telemetry_logs` VALUES (71, 11, 36, 22.4, 170, 60, 1015, 'Cerah', '2026-06-10 04:00:00');
INSERT INTO `telemetry_logs` VALUES (72, 12, 45, 27.3, 159, 56, 1010, 'Cerah', '2026-06-10 04:00:00');
INSERT INTO `telemetry_logs` VALUES (73, 13, 17, 9.1, 55, 52, 1014, 'Cerah', '2026-06-10 04:00:00');
INSERT INTO `telemetry_logs` VALUES (74, 14, 7, 5, 35, 66, 1012, 'Cerah', '2026-06-10 04:00:00');
INSERT INTO `telemetry_logs` VALUES (75, 15, 95, 64.8, 340, 64, 1009, 'Cerah', '2026-06-10 04:00:00');
INSERT INTO `telemetry_logs` VALUES (76, 1, 63, 43, 156, 57, 1015, 'Cerah', '2026-06-10 05:00:00');
INSERT INTO `telemetry_logs` VALUES (77, 2, 61, 41.7, 160, 58, 1005, 'Cerah', '2026-06-10 05:00:00');
INSERT INTO `telemetry_logs` VALUES (78, 3, 58, 40.7, 164, 65, 1008, 'Cerah', '2026-06-10 05:00:00');
INSERT INTO `telemetry_logs` VALUES (79, 4, 65, 41.3, 180, 57, 1010, 'Cerah', '2026-06-10 05:00:00');
INSERT INTO `telemetry_logs` VALUES (80, 5, 64, 43.6, 147, 50, 1015, 'Cerah', '2026-06-10 05:00:00');
INSERT INTO `telemetry_logs` VALUES (81, 6, 15, 9.8, 42, 54, 1009, 'Cerah', '2026-06-10 05:00:00');
INSERT INTO `telemetry_logs` VALUES (82, 7, 60, 38, 137, 56, 1006, 'Cerah', '2026-06-10 05:00:00');
INSERT INTO `telemetry_logs` VALUES (83, 8, 95, 56.8, 318, 56, 1013, 'Cerah', '2026-06-10 05:00:00');
INSERT INTO `telemetry_logs` VALUES (84, 9, 45, 30.3, 176, 57, 1014, 'Cerah', '2026-06-10 05:00:00');
INSERT INTO `telemetry_logs` VALUES (85, 10, 89, 59.9, 313, 57, 1011, 'Cerah', '2026-06-10 05:00:00');
INSERT INTO `telemetry_logs` VALUES (86, 11, 65, 41.3, 127, 57, 1013, 'Cerah', '2026-06-10 05:00:00');
INSERT INTO `telemetry_logs` VALUES (87, 12, 64, 42.6, 172, 68, 1008, 'Cerah', '2026-06-10 05:00:00');
INSERT INTO `telemetry_logs` VALUES (88, 13, 9, 5.9, 50, 50, 1015, 'Cerah', '2026-06-10 05:00:00');
INSERT INTO `telemetry_logs` VALUES (89, 14, 11, 8.2, 57, 63, 1008, 'Berawan', '2026-06-10 05:00:00');
INSERT INTO `telemetry_logs` VALUES (90, 15, 85, 53.3, 307, 56, 1015, 'Cerah', '2026-06-10 05:00:00');
INSERT INTO `telemetry_logs` VALUES (91, 1, 51, 32.2, 151, 63, 1005, 'Cerah', '2026-06-10 06:00:00');
INSERT INTO `telemetry_logs` VALUES (92, 2, 38, 21.7, 107, 66, 1013, 'Cerah', '2026-06-10 06:00:00');
INSERT INTO `telemetry_logs` VALUES (93, 3, 35, 20.8, 176, 54, 1013, 'Cerah', '2026-06-10 06:00:00');
INSERT INTO `telemetry_logs` VALUES (94, 4, 49, 31.9, 115, 69, 1015, 'Cerah', '2026-06-10 06:00:00');
INSERT INTO `telemetry_logs` VALUES (95, 5, 44, 25.6, 153, 68, 1014, 'Cerah', '2026-06-10 06:00:00');
INSERT INTO `telemetry_logs` VALUES (96, 6, 6, 5.9, 31, 68, 1008, 'Cerah', '2026-06-10 06:00:00');
INSERT INTO `telemetry_logs` VALUES (97, 7, 36, 21.4, 180, 56, 1010, 'Cerah', '2026-06-10 06:00:00');
INSERT INTO `telemetry_logs` VALUES (98, 8, 85, 55.3, 362, 64, 1014, 'Cerah', '2026-06-10 06:00:00');
INSERT INTO `telemetry_logs` VALUES (99, 9, 55, 34.8, 172, 58, 1010, 'Cerah', '2026-06-10 06:00:00');
INSERT INTO `telemetry_logs` VALUES (100, 10, 74, 48.1, 322, 51, 1008, 'Cerah', '2026-06-10 06:00:00');
INSERT INTO `telemetry_logs` VALUES (101, 11, 59, 40.4, 166, 50, 1013, 'Cerah', '2026-06-10 06:00:00');
INSERT INTO `telemetry_logs` VALUES (102, 12, 36, 26.4, 179, 55, 1011, 'Cerah', '2026-06-10 06:00:00');
INSERT INTO `telemetry_logs` VALUES (103, 13, 9, 5.9, 42, 70, 1011, 'Cerah', '2026-06-10 06:00:00');
INSERT INTO `telemetry_logs` VALUES (104, 14, 15, 7.8, 54, 65, 1014, 'Cerah', '2026-06-10 06:00:00');
INSERT INTO `telemetry_logs` VALUES (105, 15, 94, 63.1, 245, 63, 1005, 'Cerah', '2026-06-10 06:00:00');
INSERT INTO `telemetry_logs` VALUES (106, 1, 93, 63.5, 234, 70, 1006, 'Cerah', '2026-06-10 07:00:00');
INSERT INTO `telemetry_logs` VALUES (107, 2, 72, 49.8, 269, 51, 1009, 'Cerah', '2026-06-10 07:00:00');
INSERT INTO `telemetry_logs` VALUES (108, 3, 89, 57.9, 202, 59, 1009, 'Cerah', '2026-06-10 07:00:00');
INSERT INTO `telemetry_logs` VALUES (109, 4, 89, 55.9, 186, 70, 1008, 'Cerah', '2026-06-10 07:00:00');
INSERT INTO `telemetry_logs` VALUES (110, 5, 80, 52, 226, 68, 1009, 'Cerah', '2026-06-10 07:00:00');
INSERT INTO `telemetry_logs` VALUES (111, 6, 25, 14.3, 63, 70, 1005, 'Cerah', '2026-06-10 07:00:00');
INSERT INTO `telemetry_logs` VALUES (112, 7, 73, 47.5, 252, 56, 1009, 'Cerah', '2026-06-10 07:00:00');
INSERT INTO `telemetry_logs` VALUES (113, 8, 110, 74.5, 455, 61, 1006, 'Cerah', '2026-06-10 07:00:00');
INSERT INTO `telemetry_logs` VALUES (114, 9, 73, 48.5, 209, 70, 1008, 'Cerah', '2026-06-10 07:00:00');
INSERT INTO `telemetry_logs` VALUES (115, 10, 132, 82.8, 460, 58, 1005, 'Cerah', '2026-06-10 07:00:00');
INSERT INTO `telemetry_logs` VALUES (116, 11, 83, 57, 237, 68, 1005, 'Cerah', '2026-06-10 07:00:00');
INSERT INTO `telemetry_logs` VALUES (117, 12, 94, 64.1, 267, 60, 1011, 'Cerah', '2026-06-10 07:00:00');
INSERT INTO `telemetry_logs` VALUES (118, 13, 26, 17.9, 50, 54, 1014, 'Cerah', '2026-06-10 07:00:00');
INSERT INTO `telemetry_logs` VALUES (119, 14, 27, 17.6, 74, 69, 1015, 'Cerah', '2026-06-10 07:00:00');
INSERT INTO `telemetry_logs` VALUES (120, 15, 141, 91.7, 423, 53, 1010, 'Cerah', '2026-06-10 07:00:00');
INSERT INTO `telemetry_logs` VALUES (121, 1, 84, 53.6, 223, 52, 1011, 'Cerah', '2026-06-10 08:00:00');
INSERT INTO `telemetry_logs` VALUES (122, 2, 89, 57.9, 214, 51, 1007, 'Cerah', '2026-06-10 08:00:00');
INSERT INTO `telemetry_logs` VALUES (123, 3, 65, 44.3, 260, 63, 1008, 'Cerah', '2026-06-10 08:00:00');
INSERT INTO `telemetry_logs` VALUES (124, 4, 71, 49.2, 249, 63, 1005, 'Cerah', '2026-06-10 08:00:00');
INSERT INTO `telemetry_logs` VALUES (125, 5, 68, 41.2, 236, 69, 1007, 'Cerah', '2026-06-10 08:00:00');
INSERT INTO `telemetry_logs` VALUES (126, 6, 19, 13.4, 76, 50, 1009, 'Cerah', '2026-06-10 08:00:00');
INSERT INTO `telemetry_logs` VALUES (127, 7, 87, 57.6, 249, 54, 1010, 'Cerah', '2026-06-10 08:00:00');
INSERT INTO `telemetry_logs` VALUES (128, 8, 150, 96.5, 533, 65, 1009, 'Cerah', '2026-06-10 08:00:00');
INSERT INTO `telemetry_logs` VALUES (129, 9, 67, 44.6, 267, 52, 1014, 'Cerah', '2026-06-10 08:00:00');
INSERT INTO `telemetry_logs` VALUES (130, 10, 157, 104.1, 472, 56, 1011, 'Cerah', '2026-06-10 08:00:00');
INSERT INTO `telemetry_logs` VALUES (131, 11, 68, 43.2, 255, 51, 1008, 'Cerah', '2026-06-10 08:00:00');
INSERT INTO `telemetry_logs` VALUES (132, 12, 89, 58.9, 215, 58, 1005, 'Cerah', '2026-06-10 08:00:00');
INSERT INTO `telemetry_logs` VALUES (133, 13, 16, 9.4, 50, 57, 1012, 'Cerah', '2026-06-10 08:00:00');
INSERT INTO `telemetry_logs` VALUES (134, 14, 18, 9.7, 60, 53, 1006, 'Cerah', '2026-06-10 08:00:00');
INSERT INTO `telemetry_logs` VALUES (135, 15, 141, 95.7, 568, 69, 1009, 'Cerah', '2026-06-10 08:00:00');
INSERT INTO `telemetry_logs` VALUES (136, 1, 72, 48.8, 215, 63, 1008, 'Cerah', '2026-06-10 09:00:00');
INSERT INTO `telemetry_logs` VALUES (137, 2, 88, 56.2, 266, 68, 1008, 'Cerah', '2026-06-10 09:00:00');
INSERT INTO `telemetry_logs` VALUES (138, 3, 68, 43.2, 208, 63, 1013, 'Cerah', '2026-06-10 09:00:00');
INSERT INTO `telemetry_logs` VALUES (139, 4, 68, 41.2, 236, 63, 1012, 'Cerah', '2026-06-10 09:00:00');
INSERT INTO `telemetry_logs` VALUES (140, 5, 94, 61.1, 212, 53, 1006, 'Cerah', '2026-06-10 09:00:00');
INSERT INTO `telemetry_logs` VALUES (141, 6, 16, 12.4, 57, 69, 1014, 'Cerah', '2026-06-10 09:00:00');
INSERT INTO `telemetry_logs` VALUES (142, 7, 71, 48.2, 182, 62, 1009, 'Cerah', '2026-06-10 09:00:00');
INSERT INTO `telemetry_logs` VALUES (143, 8, 147, 99.6, 408, 70, 1014, 'Cerah', '2026-06-10 09:00:00');
INSERT INTO `telemetry_logs` VALUES (144, 9, 71, 48.2, 206, 69, 1010, 'Cerah', '2026-06-10 09:00:00');
INSERT INTO `telemetry_logs` VALUES (145, 10, 119, 76.4, 467, 54, 1013, 'Cerah', '2026-06-10 09:00:00');
INSERT INTO `telemetry_logs` VALUES (146, 11, 69, 47.9, 193, 55, 1007, 'Cerah', '2026-06-10 09:00:00');
INSERT INTO `telemetry_logs` VALUES (147, 12, 80, 50, 187, 53, 1015, 'Cerah', '2026-06-10 09:00:00');
INSERT INTO `telemetry_logs` VALUES (148, 13, 25, 14.3, 74, 52, 1007, 'Cerah', '2026-06-10 09:00:00');
INSERT INTO `telemetry_logs` VALUES (149, 14, 23, 13, 70, 70, 1011, 'Cerah', '2026-06-10 09:00:00');
INSERT INTO `telemetry_logs` VALUES (150, 15, 124, 75.6, 442, 63, 1007, 'Cerah', '2026-06-10 09:00:00');
INSERT INTO `telemetry_logs` VALUES (151, 1, 39, 27.4, 150, 52, 1007, 'Cerah', '2026-06-10 10:00:00');
INSERT INTO `telemetry_logs` VALUES (152, 2, 44, 27.6, 161, 58, 1013, 'Cerah', '2026-06-10 10:00:00');
INSERT INTO `telemetry_logs` VALUES (153, 3, 38, 25.7, 108, 60, 1012, 'Cerah', '2026-06-10 10:00:00');
INSERT INTO `telemetry_logs` VALUES (154, 4, 61, 39.7, 104, 52, 1013, 'Cerah', '2026-06-10 10:00:00');
INSERT INTO `telemetry_logs` VALUES (155, 5, 46, 27.9, 161, 65, 1012, 'Cerah', '2026-06-10 10:00:00');
INSERT INTO `telemetry_logs` VALUES (156, 6, 14, 9.1, 45, 63, 1008, 'Cerah', '2026-06-10 10:00:00');
INSERT INTO `telemetry_logs` VALUES (157, 7, 62, 41.3, 151, 67, 1007, 'Cerah', '2026-06-10 10:00:00');
INSERT INTO `telemetry_logs` VALUES (158, 8, 109, 69.9, 352, 56, 1012, 'Cerah', '2026-06-10 10:00:00');
INSERT INTO `telemetry_logs` VALUES (159, 9, 50, 34.5, 143, 58, 1005, 'Cerah', '2026-06-10 10:00:00');
INSERT INTO `telemetry_logs` VALUES (160, 10, 71, 42.2, 222, 62, 1015, 'Cerah', '2026-06-10 10:00:00');
INSERT INTO `telemetry_logs` VALUES (161, 11, 37, 21.1, 167, 50, 1015, 'Cerah', '2026-06-10 10:00:00');
INSERT INTO `telemetry_logs` VALUES (162, 12, 53, 34.5, 179, 67, 1006, 'Cerah', '2026-06-10 10:00:00');
INSERT INTO `telemetry_logs` VALUES (163, 13, 9, 7.9, 37, 66, 1014, 'Cerah', '2026-06-10 10:00:00');
INSERT INTO `telemetry_logs` VALUES (164, 14, 5, 5.3, 56, 54, 1013, 'Cerah', '2026-06-10 10:00:00');
INSERT INTO `telemetry_logs` VALUES (165, 15, 107, 71.6, 241, 60, 1005, 'Cerah', '2026-06-10 10:00:00');
INSERT INTO `telemetry_logs` VALUES (166, 1, 64, 38.6, 115, 60, 1011, 'Cerah', '2026-06-10 11:00:00');
INSERT INTO `telemetry_logs` VALUES (167, 2, 45, 30.3, 125, 57, 1011, 'Cerah', '2026-06-10 11:00:00');
INSERT INTO `telemetry_logs` VALUES (168, 3, 58, 35.7, 108, 68, 1013, 'Cerah', '2026-06-10 11:00:00');
INSERT INTO `telemetry_logs` VALUES (169, 4, 46, 31.9, 152, 55, 1009, 'Cerah', '2026-06-10 11:00:00');
INSERT INTO `telemetry_logs` VALUES (170, 5, 62, 42.3, 100, 54, 1006, 'Cerah', '2026-06-10 11:00:00');
INSERT INTO `telemetry_logs` VALUES (171, 6, 7, 6.6, 37, 64, 1009, 'Cerah', '2026-06-10 11:00:00');
INSERT INTO `telemetry_logs` VALUES (172, 7, 36, 21.4, 114, 61, 1014, 'Cerah', '2026-06-10 11:00:00');
INSERT INTO `telemetry_logs` VALUES (173, 8, 107, 73.6, 244, 51, 1013, 'Cerah', '2026-06-10 11:00:00');
INSERT INTO `telemetry_logs` VALUES (174, 9, 51, 33.2, 176, 55, 1009, 'Cerah', '2026-06-10 11:00:00');
INSERT INTO `telemetry_logs` VALUES (175, 10, 90, 54.5, 315, 56, 1012, 'Cerah', '2026-06-10 11:00:00');
INSERT INTO `telemetry_logs` VALUES (176, 11, 62, 39.3, 135, 51, 1011, 'Cerah', '2026-06-10 11:00:00');
INSERT INTO `telemetry_logs` VALUES (177, 12, 39, 27.4, 139, 52, 1009, 'Cerah', '2026-06-10 11:00:00');
INSERT INTO `telemetry_logs` VALUES (178, 13, 6, 5, 33, 63, 1008, 'Cerah', '2026-06-10 11:00:00');
INSERT INTO `telemetry_logs` VALUES (179, 14, 13, 6.5, 44, 65, 1005, 'Cerah', '2026-06-10 11:00:00');
INSERT INTO `telemetry_logs` VALUES (180, 15, 110, 73.5, 296, 51, 1010, 'Cerah', '2026-06-10 11:00:00');
INSERT INTO `telemetry_logs` VALUES (181, 1, 41, 26.7, 107, 62, 1011, 'Cerah', '2026-06-10 12:00:00');
INSERT INTO `telemetry_logs` VALUES (182, 2, 41, 23.7, 146, 60, 1014, 'Cerah', '2026-06-10 12:00:00');
INSERT INTO `telemetry_logs` VALUES (183, 3, 53, 33.5, 132, 61, 1012, 'Cerah', '2026-06-10 12:00:00');
INSERT INTO `telemetry_logs` VALUES (184, 4, 44, 31.6, 110, 61, 1010, 'Cerah', '2026-06-10 12:00:00');
INSERT INTO `telemetry_logs` VALUES (185, 5, 44, 27.6, 119, 57, 1007, 'Cerah', '2026-06-10 12:00:00');
INSERT INTO `telemetry_logs` VALUES (186, 6, 14, 9.1, 48, 56, 1009, 'Cerah', '2026-06-10 12:00:00');
INSERT INTO `telemetry_logs` VALUES (187, 7, 56, 35.4, 116, 60, 1009, 'Cerah', '2026-06-10 12:00:00');
INSERT INTO `telemetry_logs` VALUES (188, 8, 71, 44.2, 320, 68, 1005, 'Cerah', '2026-06-10 12:00:00');
INSERT INTO `telemetry_logs` VALUES (189, 9, 52, 33.8, 146, 66, 1012, 'Cerah', '2026-06-10 12:00:00');
INSERT INTO `telemetry_logs` VALUES (190, 10, 89, 62.9, 221, 60, 1010, 'Cerah', '2026-06-10 12:00:00');
INSERT INTO `telemetry_logs` VALUES (191, 11, 48, 28.2, 148, 63, 1010, 'Cerah', '2026-06-10 12:00:00');
INSERT INTO `telemetry_logs` VALUES (192, 12, 50, 32.5, 128, 59, 1014, 'Cerah', '2026-06-10 12:00:00');
INSERT INTO `telemetry_logs` VALUES (193, 13, 12, 6.8, 57, 66, 1006, 'Cerah', '2026-06-10 12:00:00');
INSERT INTO `telemetry_logs` VALUES (194, 14, 7, 6.6, 35, 61, 1012, 'Cerah', '2026-06-10 12:00:00');
INSERT INTO `telemetry_logs` VALUES (195, 15, 81, 48.7, 348, 67, 1007, 'Cerah', '2026-06-10 12:00:00');
INSERT INTO `telemetry_logs` VALUES (196, 1, 58, 39.7, 111, 56, 1015, 'Berawan', '2026-06-10 13:00:00');
INSERT INTO `telemetry_logs` VALUES (197, 2, 57, 39.1, 123, 70, 1013, 'Gerimis', '2026-06-10 13:00:00');
INSERT INTO `telemetry_logs` VALUES (198, 3, 52, 33.8, 172, 69, 1007, 'Berawan', '2026-06-10 13:00:00');
INSERT INTO `telemetry_logs` VALUES (199, 4, 37, 27.1, 163, 54, 1006, 'Berawan', '2026-06-10 13:00:00');
INSERT INTO `telemetry_logs` VALUES (200, 5, 59, 40.4, 170, 69, 1005, 'Berawan', '2026-06-10 13:00:00');
INSERT INTO `telemetry_logs` VALUES (201, 6, 17, 12.1, 42, 61, 1008, 'Berawan', '2026-06-10 13:00:00');
INSERT INTO `telemetry_logs` VALUES (202, 7, 55, 37.8, 178, 72, 1015, 'Gerimis', '2026-06-10 13:00:00');
INSERT INTO `telemetry_logs` VALUES (203, 8, 103, 67, 379, 53, 1006, 'Berawan', '2026-06-10 13:00:00');
INSERT INTO `telemetry_logs` VALUES (204, 9, 35, 24.8, 100, 61, 1014, 'Berawan', '2026-06-10 13:00:00');
INSERT INTO `telemetry_logs` VALUES (205, 10, 104, 65.6, 335, 93, 1005, 'Hujan', '2026-06-10 13:00:00');
INSERT INTO `telemetry_logs` VALUES (206, 11, 48, 28.2, 110, 70, 1012, 'Berawan', '2026-06-10 13:00:00');
INSERT INTO `telemetry_logs` VALUES (207, 12, 48, 28.2, 127, 53, 1010, 'Berawan', '2026-06-10 13:00:00');
INSERT INTO `telemetry_logs` VALUES (208, 13, 16, 10.4, 45, 66, 1013, 'Berawan', '2026-06-10 13:00:00');
INSERT INTO `telemetry_logs` VALUES (209, 14, 14, 8.1, 37, 54, 1012, 'Berawan', '2026-06-10 13:00:00');
INSERT INTO `telemetry_logs` VALUES (210, 15, 83, 52, 341, 84, 1008, 'Gerimis', '2026-06-10 13:00:00');
INSERT INTO `telemetry_logs` VALUES (211, 1, 35, 22.8, 155, 76, 1007, 'Gerimis', '2026-06-10 14:00:00');
INSERT INTO `telemetry_logs` VALUES (212, 2, 56, 36.4, 133, 60, 1013, 'Berawan', '2026-06-10 14:00:00');
INSERT INTO `telemetry_logs` VALUES (213, 3, 55, 32.8, 106, 53, 1006, 'Berawan', '2026-06-10 14:00:00');
INSERT INTO `telemetry_logs` VALUES (214, 4, 56, 33.4, 106, 62, 1008, 'Berawan', '2026-06-10 14:00:00');
INSERT INTO `telemetry_logs` VALUES (215, 5, 36, 24.4, 142, 51, 1007, 'Berawan', '2026-06-10 14:00:00');
INSERT INTO `telemetry_logs` VALUES (216, 6, 5, 5, 53, 78, 1014, 'Gerimis', '2026-06-10 14:00:00');
INSERT INTO `telemetry_logs` VALUES (217, 7, 40, 23, 178, 83, 1015, 'Hujan', '2026-06-10 14:00:00');
INSERT INTO `telemetry_logs` VALUES (218, 8, 105, 64.3, 265, 64, 1012, 'Berawan', '2026-06-10 14:00:00');
INSERT INTO `telemetry_logs` VALUES (219, 9, 57, 36.1, 179, 50, 1014, 'Berawan', '2026-06-10 14:00:00');
INSERT INTO `telemetry_logs` VALUES (220, 10, 96, 63.4, 282, 70, 1008, 'Berawan', '2026-06-10 14:00:00');
INSERT INTO `telemetry_logs` VALUES (221, 11, 59, 37.4, 115, 76, 1010, 'Gerimis', '2026-06-10 14:00:00');
INSERT INTO `telemetry_logs` VALUES (222, 12, 35, 24.8, 164, 81, 1013, 'Gerimis', '2026-06-10 14:00:00');
INSERT INTO `telemetry_logs` VALUES (223, 13, 6, 5.9, 45, 85, 1011, 'Hujan', '2026-06-10 14:00:00');
INSERT INTO `telemetry_logs` VALUES (224, 14, 16, 12.4, 33, 65, 1009, 'Berawan', '2026-06-10 14:00:00');
INSERT INTO `telemetry_logs` VALUES (225, 15, 110, 66.5, 293, 70, 1012, 'Gerimis', '2026-06-10 14:00:00');
INSERT INTO `telemetry_logs` VALUES (226, 1, 40, 23, 149, 80, 1005, 'Hujan', '2026-06-10 15:00:00');
INSERT INTO `telemetry_logs` VALUES (227, 2, 41, 24.7, 167, 77, 1009, 'Gerimis', '2026-06-10 15:00:00');
INSERT INTO `telemetry_logs` VALUES (228, 3, 59, 41.4, 158, 58, 1008, 'Berawan', '2026-06-10 15:00:00');
INSERT INTO `telemetry_logs` VALUES (229, 4, 60, 41, 101, 59, 1005, 'Berawan', '2026-06-10 15:00:00');
INSERT INTO `telemetry_logs` VALUES (230, 5, 53, 34.5, 132, 60, 1013, 'Berawan', '2026-06-10 15:00:00');
INSERT INTO `telemetry_logs` VALUES (231, 6, 8, 5, 59, 83, 1006, 'Gerimis', '2026-06-10 15:00:00');
INSERT INTO `telemetry_logs` VALUES (232, 7, 51, 35.2, 177, 67, 1008, 'Berawan', '2026-06-10 15:00:00');
INSERT INTO `telemetry_logs` VALUES (233, 8, 73, 50.5, 229, 57, 1014, 'Berawan', '2026-06-10 15:00:00');
INSERT INTO `telemetry_logs` VALUES (234, 9, 36, 25.4, 155, 76, 1015, 'Gerimis', '2026-06-10 15:00:00');
INSERT INTO `telemetry_logs` VALUES (235, 10, 94, 63.1, 248, 63, 1010, 'Berawan', '2026-06-10 15:00:00');
INSERT INTO `telemetry_logs` VALUES (236, 11, 63, 38, 104, 62, 1005, 'Berawan', '2026-06-10 15:00:00');
INSERT INTO `telemetry_logs` VALUES (237, 12, 39, 26.4, 164, 61, 1009, 'Berawan', '2026-06-10 15:00:00');
INSERT INTO `telemetry_logs` VALUES (238, 13, 9, 7.9, 50, 84, 1005, 'Gerimis', '2026-06-10 15:00:00');
INSERT INTO `telemetry_logs` VALUES (239, 14, 13, 7.5, 40, 67, 1012, 'Berawan', '2026-06-10 15:00:00');
INSERT INTO `telemetry_logs` VALUES (240, 15, 88, 56.2, 343, 84, 1013, 'Gerimis', '2026-06-10 15:00:00');
INSERT INTO `telemetry_logs` VALUES (241, 1, 62, 41.3, 108, 64, 1010, 'Berawan', '2026-06-10 16:00:00');
INSERT INTO `telemetry_logs` VALUES (242, 2, 36, 22.4, 114, 89, 1008, 'Hujan', '2026-06-10 16:00:00');
INSERT INTO `telemetry_logs` VALUES (243, 3, 61, 37.7, 150, 95, 1005, 'Hujan', '2026-06-10 16:00:00');
INSERT INTO `telemetry_logs` VALUES (244, 4, 59, 35.4, 161, 88, 1014, 'Hujan', '2026-06-10 16:00:00');
INSERT INTO `telemetry_logs` VALUES (245, 5, 44, 30.6, 159, 54, 1008, 'Berawan', '2026-06-10 16:00:00');
INSERT INTO `telemetry_logs` VALUES (246, 6, 7, 5.6, 54, 81, 1010, 'Gerimis', '2026-06-10 16:00:00');
INSERT INTO `telemetry_logs` VALUES (247, 7, 41, 24.7, 128, 69, 1008, 'Berawan', '2026-06-10 16:00:00');
INSERT INTO `telemetry_logs` VALUES (248, 8, 108, 65.2, 232, 69, 1012, 'Berawan', '2026-06-10 16:00:00');
INSERT INTO `telemetry_logs` VALUES (249, 9, 46, 29.9, 156, 61, 1013, 'Berawan', '2026-06-10 16:00:00');
INSERT INTO `telemetry_logs` VALUES (250, 10, 98, 68.7, 359, 72, 1008, 'Gerimis', '2026-06-10 16:00:00');
INSERT INTO `telemetry_logs` VALUES (251, 11, 60, 41, 165, 57, 1005, 'Berawan', '2026-06-10 16:00:00');
INSERT INTO `telemetry_logs` VALUES (252, 12, 44, 31.6, 116, 76, 1006, 'Gerimis', '2026-06-10 16:00:00');
INSERT INTO `telemetry_logs` VALUES (253, 13, 12, 9.8, 38, 77, 1011, 'Gerimis', '2026-06-10 16:00:00');
INSERT INTO `telemetry_logs` VALUES (254, 14, 8, 7.2, 52, 79, 1005, 'Gerimis', '2026-06-10 16:00:00');
INSERT INTO `telemetry_logs` VALUES (255, 15, 71, 47.2, 370, 83, 1012, 'Hujan', '2026-06-10 16:00:00');
INSERT INTO `telemetry_logs` VALUES (256, 1, 84, 52.6, 233, 66, 1005, 'Cerah', '2026-06-10 17:00:00');
INSERT INTO `telemetry_logs` VALUES (257, 2, 77, 47.1, 255, 69, 1015, 'Cerah', '2026-06-10 17:00:00');
INSERT INTO `telemetry_logs` VALUES (258, 3, 76, 48.4, 215, 68, 1014, 'Cerah', '2026-06-10 17:00:00');
INSERT INTO `telemetry_logs` VALUES (259, 4, 69, 42.9, 224, 64, 1009, 'Cerah', '2026-06-10 17:00:00');
INSERT INTO `telemetry_logs` VALUES (260, 5, 90, 60.5, 255, 63, 1010, 'Cerah', '2026-06-10 17:00:00');
INSERT INTO `telemetry_logs` VALUES (261, 6, 17, 9.1, 68, 60, 1013, 'Cerah', '2026-06-10 17:00:00');
INSERT INTO `telemetry_logs` VALUES (262, 7, 77, 53.1, 259, 65, 1010, 'Cerah', '2026-06-10 17:00:00');
INSERT INTO `telemetry_logs` VALUES (263, 8, 145, 94.3, 532, 64, 1011, 'Cerah', '2026-06-10 17:00:00');
INSERT INTO `telemetry_logs` VALUES (264, 9, 95, 60.8, 246, 51, 1009, 'Cerah', '2026-06-10 17:00:00');
INSERT INTO `telemetry_logs` VALUES (265, 10, 115, 76.8, 425, 62, 1014, 'Cerah', '2026-06-10 17:00:00');
INSERT INTO `telemetry_logs` VALUES (266, 11, 74, 46.1, 212, 57, 1013, 'Cerah', '2026-06-10 17:00:00');
INSERT INTO `telemetry_logs` VALUES (267, 12, 66, 41.9, 233, 66, 1013, 'Cerah', '2026-06-10 17:00:00');
INSERT INTO `telemetry_logs` VALUES (268, 13, 18, 11.7, 82, 57, 1010, 'Cerah', '2026-06-10 17:00:00');
INSERT INTO `telemetry_logs` VALUES (269, 14, 29, 18.9, 74, 62, 1006, 'Cerah', '2026-06-10 17:00:00');
INSERT INTO `telemetry_logs` VALUES (270, 15, 143, 97, 564, 60, 1008, 'Cerah', '2026-06-10 17:00:00');
INSERT INTO `telemetry_logs` VALUES (271, 1, 77, 49.1, 199, 70, 1005, 'Cerah', '2026-06-10 18:00:00');
INSERT INTO `telemetry_logs` VALUES (272, 2, 95, 59.8, 201, 59, 1010, 'Cerah', '2026-06-10 18:00:00');
INSERT INTO `telemetry_logs` VALUES (273, 3, 92, 61.8, 265, 69, 1010, 'Cerah', '2026-06-10 18:00:00');
INSERT INTO `telemetry_logs` VALUES (274, 4, 69, 46.9, 186, 63, 1005, 'Cerah', '2026-06-10 18:00:00');
INSERT INTO `telemetry_logs` VALUES (275, 5, 84, 55.6, 203, 65, 1008, 'Cerah', '2026-06-10 18:00:00');
INSERT INTO `telemetry_logs` VALUES (276, 6, 21, 11.7, 81, 59, 1011, 'Cerah', '2026-06-10 18:00:00');
INSERT INTO `telemetry_logs` VALUES (277, 7, 74, 47.1, 198, 67, 1008, 'Cerah', '2026-06-10 18:00:00');
INSERT INTO `telemetry_logs` VALUES (278, 8, 143, 91, 478, 58, 1008, 'Cerah', '2026-06-10 18:00:00');
INSERT INTO `telemetry_logs` VALUES (279, 9, 83, 57, 192, 67, 1015, 'Cerah', '2026-06-10 18:00:00');
INSERT INTO `telemetry_logs` VALUES (280, 10, 155, 98.8, 546, 53, 1014, 'Cerah', '2026-06-10 18:00:00');
INSERT INTO `telemetry_logs` VALUES (281, 11, 65, 42.3, 242, 61, 1009, 'Cerah', '2026-06-10 18:00:00');
INSERT INTO `telemetry_logs` VALUES (282, 12, 76, 49.4, 248, 61, 1015, 'Cerah', '2026-06-10 18:00:00');
INSERT INTO `telemetry_logs` VALUES (283, 13, 22, 12.3, 90, 70, 1006, 'Cerah', '2026-06-10 18:00:00');
INSERT INTO `telemetry_logs` VALUES (284, 14, 23, 17, 76, 54, 1013, 'Cerah', '2026-06-10 18:00:00');
INSERT INTO `telemetry_logs` VALUES (285, 15, 127, 77.6, 554, 62, 1007, 'Cerah', '2026-06-10 18:00:00');
INSERT INTO `telemetry_logs` VALUES (286, 1, 73, 49.5, 195, 66, 1010, 'Cerah', '2026-06-10 19:00:00');
INSERT INTO `telemetry_logs` VALUES (287, 2, 67, 46.6, 250, 63, 1008, 'Berawan', '2026-06-10 19:00:00');
INSERT INTO `telemetry_logs` VALUES (288, 3, 75, 45.8, 232, 58, 1013, 'Cerah', '2026-06-10 19:00:00');
INSERT INTO `telemetry_logs` VALUES (289, 4, 86, 54.9, 266, 50, 1008, 'Cerah', '2026-06-10 19:00:00');
INSERT INTO `telemetry_logs` VALUES (290, 5, 75, 45.8, 206, 56, 1007, 'Cerah', '2026-06-10 19:00:00');
INSERT INTO `telemetry_logs` VALUES (291, 6, 28, 20.2, 52, 59, 1011, 'Cerah', '2026-06-10 19:00:00');
INSERT INTO `telemetry_logs` VALUES (292, 7, 66, 45.9, 200, 70, 1012, 'Cerah', '2026-06-10 19:00:00');
INSERT INTO `telemetry_logs` VALUES (293, 8, 160, 100, 401, 52, 1015, 'Berawan', '2026-06-10 19:00:00');
INSERT INTO `telemetry_logs` VALUES (294, 9, 67, 44.6, 208, 53, 1013, 'Cerah', '2026-06-10 19:00:00');
INSERT INTO `telemetry_logs` VALUES (295, 10, 112, 71.8, 455, 51, 1012, 'Berawan', '2026-06-10 19:00:00');
INSERT INTO `telemetry_logs` VALUES (296, 11, 67, 46.6, 257, 53, 1014, 'Cerah', '2026-06-10 19:00:00');
INSERT INTO `telemetry_logs` VALUES (297, 12, 94, 59.1, 241, 56, 1012, 'Cerah', '2026-06-10 19:00:00');
INSERT INTO `telemetry_logs` VALUES (298, 13, 27, 19.6, 81, 58, 1015, 'Cerah', '2026-06-10 19:00:00');
INSERT INTO `telemetry_logs` VALUES (299, 14, 26, 16.9, 60, 69, 1009, 'Cerah', '2026-06-10 19:00:00');
INSERT INTO `telemetry_logs` VALUES (300, 15, 137, 88.1, 503, 65, 1009, 'Cerah', '2026-06-10 19:00:00');
INSERT INTO `telemetry_logs` VALUES (301, 1, 70, 46.5, 243, 53, 1005, 'Cerah', '2026-06-10 20:00:00');
INSERT INTO `telemetry_logs` VALUES (302, 2, 75, 46.8, 229, 58, 1011, 'Berawan', '2026-06-10 20:00:00');
INSERT INTO `telemetry_logs` VALUES (303, 3, 72, 46.8, 238, 60, 1011, 'Cerah', '2026-06-10 20:00:00');
INSERT INTO `telemetry_logs` VALUES (304, 4, 75, 50.8, 228, 68, 1011, 'Cerah', '2026-06-10 20:00:00');
INSERT INTO `telemetry_logs` VALUES (305, 5, 91, 56.2, 237, 60, 1012, 'Cerah', '2026-06-10 20:00:00');
INSERT INTO `telemetry_logs` VALUES (306, 6, 30, 19.5, 70, 65, 1014, 'Cerah', '2026-06-10 20:00:00');
INSERT INTO `telemetry_logs` VALUES (307, 7, 73, 49.5, 218, 62, 1011, 'Cerah', '2026-06-10 20:00:00');
INSERT INTO `telemetry_logs` VALUES (308, 8, 141, 93.7, 396, 67, 1009, 'Cerah', '2026-06-10 20:00:00');
INSERT INTO `telemetry_logs` VALUES (309, 9, 67, 46.6, 266, 69, 1007, 'Cerah', '2026-06-10 20:00:00');
INSERT INTO `telemetry_logs` VALUES (310, 10, 137, 85.1, 405, 54, 1014, 'Berawan', '2026-06-10 20:00:00');
INSERT INTO `telemetry_logs` VALUES (311, 11, 90, 57.5, 217, 61, 1013, 'Berawan', '2026-06-10 20:00:00');
INSERT INTO `telemetry_logs` VALUES (312, 12, 83, 54, 228, 58, 1010, 'Cerah', '2026-06-10 20:00:00');
INSERT INTO `telemetry_logs` VALUES (313, 13, 25, 14.3, 72, 66, 1011, 'Berawan', '2026-06-10 20:00:00');
INSERT INTO `telemetry_logs` VALUES (314, 14, 29, 19.9, 50, 60, 1010, 'Cerah', '2026-06-10 20:00:00');
INSERT INTO `telemetry_logs` VALUES (315, 15, 128, 87.2, 392, 54, 1009, 'Cerah', '2026-06-10 20:00:00');
INSERT INTO `telemetry_logs` VALUES (316, 1, 62, 43.3, 120, 60, 1007, 'Cerah', '2026-06-10 21:00:00');
INSERT INTO `telemetry_logs` VALUES (317, 2, 59, 36.4, 162, 58, 1011, 'Cerah', '2026-06-10 21:00:00');
INSERT INTO `telemetry_logs` VALUES (318, 3, 58, 34.7, 139, 67, 1015, 'Berawan', '2026-06-10 21:00:00');
INSERT INTO `telemetry_logs` VALUES (319, 4, 47, 28.6, 124, 69, 1011, 'Cerah', '2026-06-10 21:00:00');
INSERT INTO `telemetry_logs` VALUES (320, 5, 50, 33.5, 113, 63, 1010, 'Cerah', '2026-06-10 21:00:00');
INSERT INTO `telemetry_logs` VALUES (321, 6, 16, 10.4, 44, 70, 1014, 'Cerah', '2026-06-10 21:00:00');
INSERT INTO `telemetry_logs` VALUES (322, 7, 62, 38.3, 167, 56, 1011, 'Cerah', '2026-06-10 21:00:00');
INSERT INTO `telemetry_logs` VALUES (323, 8, 83, 50, 310, 54, 1009, 'Cerah', '2026-06-10 21:00:00');
INSERT INTO `telemetry_logs` VALUES (324, 9, 39, 22.4, 144, 53, 1008, 'Cerah', '2026-06-10 21:00:00');
INSERT INTO `telemetry_logs` VALUES (325, 10, 104, 63.6, 380, 69, 1007, 'Cerah', '2026-06-10 21:00:00');
INSERT INTO `telemetry_logs` VALUES (326, 11, 52, 33.8, 159, 64, 1014, 'Cerah', '2026-06-10 21:00:00');
INSERT INTO `telemetry_logs` VALUES (327, 12, 42, 26.3, 100, 50, 1006, 'Cerah', '2026-06-10 21:00:00');
INSERT INTO `telemetry_logs` VALUES (328, 13, 5, 5, 32, 51, 1011, 'Berawan', '2026-06-10 21:00:00');
INSERT INTO `telemetry_logs` VALUES (329, 14, 14, 7.1, 44, 51, 1014, 'Berawan', '2026-06-10 21:00:00');
INSERT INTO `telemetry_logs` VALUES (330, 15, 110, 75.5, 257, 67, 1010, 'Cerah', '2026-06-10 21:00:00');
INSERT INTO `telemetry_logs` VALUES (331, 1, 36, 20.4, 152, 54, 1006, 'Cerah', '2026-06-10 22:00:00');
INSERT INTO `telemetry_logs` VALUES (332, 2, 56, 38.4, 107, 70, 1009, 'Cerah', '2026-06-10 22:00:00');
INSERT INTO `telemetry_logs` VALUES (333, 3, 62, 38.3, 132, 70, 1011, 'Cerah', '2026-06-10 22:00:00');
INSERT INTO `telemetry_logs` VALUES (334, 4, 49, 29.9, 171, 69, 1006, 'Berawan', '2026-06-10 22:00:00');
INSERT INTO `telemetry_logs` VALUES (335, 5, 65, 43.3, 178, 69, 1009, 'Cerah', '2026-06-10 22:00:00');
INSERT INTO `telemetry_logs` VALUES (336, 6, 7, 5, 42, 50, 1011, 'Cerah', '2026-06-10 22:00:00');
INSERT INTO `telemetry_logs` VALUES (337, 7, 61, 42.7, 105, 59, 1011, 'Cerah', '2026-06-10 22:00:00');
INSERT INTO `telemetry_logs` VALUES (338, 8, 85, 57.3, 294, 66, 1014, 'Cerah', '2026-06-10 22:00:00');
INSERT INTO `telemetry_logs` VALUES (339, 9, 48, 34.2, 178, 50, 1006, 'Cerah', '2026-06-10 22:00:00');
INSERT INTO `telemetry_logs` VALUES (340, 10, 102, 61.3, 355, 70, 1006, 'Berawan', '2026-06-10 22:00:00');
INSERT INTO `telemetry_logs` VALUES (341, 11, 50, 29.5, 165, 53, 1010, 'Cerah', '2026-06-10 22:00:00');
INSERT INTO `telemetry_logs` VALUES (342, 12, 53, 36.5, 177, 59, 1008, 'Cerah', '2026-06-10 22:00:00');
INSERT INTO `telemetry_logs` VALUES (343, 13, 9, 5.9, 54, 55, 1014, 'Cerah', '2026-06-10 22:00:00');
INSERT INTO `telemetry_logs` VALUES (344, 14, 11, 7.2, 45, 59, 1006, 'Cerah', '2026-06-10 22:00:00');
INSERT INTO `telemetry_logs` VALUES (345, 15, 79, 50.4, 322, 58, 1012, 'Cerah', '2026-06-10 22:00:00');
INSERT INTO `telemetry_logs` VALUES (346, 1, 42, 28.3, 136, 59, 1007, 'Cerah', '2026-06-10 23:00:00');
INSERT INTO `telemetry_logs` VALUES (347, 2, 63, 43, 152, 65, 1007, 'Cerah', '2026-06-10 23:00:00');
INSERT INTO `telemetry_logs` VALUES (348, 3, 39, 24.4, 121, 52, 1005, 'Cerah', '2026-06-10 23:00:00');
INSERT INTO `telemetry_logs` VALUES (349, 4, 57, 35.1, 155, 64, 1010, 'Cerah', '2026-06-10 23:00:00');
INSERT INTO `telemetry_logs` VALUES (350, 5, 61, 40.7, 147, 58, 1015, 'Cerah', '2026-06-10 23:00:00');
INSERT INTO `telemetry_logs` VALUES (351, 6, 17, 13.1, 45, 60, 1010, 'Cerah', '2026-06-10 23:00:00');
INSERT INTO `telemetry_logs` VALUES (352, 7, 49, 30.9, 140, 60, 1006, 'Cerah', '2026-06-10 23:00:00');
INSERT INTO `telemetry_logs` VALUES (353, 8, 93, 56.5, 371, 58, 1008, 'Cerah', '2026-06-10 23:00:00');
INSERT INTO `telemetry_logs` VALUES (354, 9, 58, 38.7, 169, 56, 1015, 'Cerah', '2026-06-10 23:00:00');
INSERT INTO `telemetry_logs` VALUES (355, 10, 84, 49.6, 257, 60, 1009, 'Cerah', '2026-06-10 23:00:00');
INSERT INTO `telemetry_logs` VALUES (356, 11, 41, 25.7, 162, 63, 1009, 'Cerah', '2026-06-10 23:00:00');
INSERT INTO `telemetry_logs` VALUES (357, 12, 37, 26.1, 125, 69, 1011, 'Cerah', '2026-06-10 23:00:00');
INSERT INTO `telemetry_logs` VALUES (358, 13, 9, 5, 46, 61, 1010, 'Cerah', '2026-06-10 23:00:00');
INSERT INTO `telemetry_logs` VALUES (359, 14, 8, 5, 43, 59, 1007, 'Cerah', '2026-06-10 23:00:00');
INSERT INTO `telemetry_logs` VALUES (360, 15, 82, 49.3, 289, 69, 1005, 'Cerah', '2026-06-10 23:00:00');
INSERT INTO `telemetry_logs` VALUES (361, 1, 63, 38, 100, 50, 1013, 'Cerah', '2026-06-11 00:00:00');
INSERT INTO `telemetry_logs` VALUES (362, 2, 54, 38.1, 122, 57, 1005, 'Cerah', '2026-06-11 00:00:00');
INSERT INTO `telemetry_logs` VALUES (363, 3, 54, 34.1, 118, 57, 1012, 'Cerah', '2026-06-11 00:00:00');
INSERT INTO `telemetry_logs` VALUES (364, 4, 36, 20.4, 178, 56, 1012, 'Cerah', '2026-06-11 00:00:00');
INSERT INTO `telemetry_logs` VALUES (365, 5, 60, 39, 140, 67, 1014, 'Cerah', '2026-06-11 00:00:00');
INSERT INTO `telemetry_logs` VALUES (366, 6, 16, 9.4, 52, 65, 1005, 'Berawan', '2026-06-11 00:00:00');
INSERT INTO `telemetry_logs` VALUES (367, 7, 49, 31.9, 150, 52, 1012, 'Cerah', '2026-06-11 00:00:00');
INSERT INTO `telemetry_logs` VALUES (368, 8, 83, 49, 260, 59, 1014, 'Cerah', '2026-06-11 00:00:00');
INSERT INTO `telemetry_logs` VALUES (369, 9, 57, 37.1, 106, 63, 1015, 'Berawan', '2026-06-11 00:00:00');
INSERT INTO `telemetry_logs` VALUES (370, 10, 82, 58.3, 352, 58, 1009, 'Berawan', '2026-06-11 00:00:00');
INSERT INTO `telemetry_logs` VALUES (371, 11, 57, 37.1, 129, 62, 1014, 'Cerah', '2026-06-11 00:00:00');
INSERT INTO `telemetry_logs` VALUES (372, 12, 65, 41.3, 175, 66, 1014, 'Cerah', '2026-06-11 00:00:00');
INSERT INTO `telemetry_logs` VALUES (373, 13, 16, 12.4, 55, 66, 1006, 'Cerah', '2026-06-11 00:00:00');
INSERT INTO `telemetry_logs` VALUES (374, 14, 12, 8.8, 37, 64, 1014, 'Berawan', '2026-06-11 00:00:00');
INSERT INTO `telemetry_logs` VALUES (375, 15, 81, 49.7, 355, 53, 1014, 'Cerah', '2026-06-11 00:00:00');
INSERT INTO `telemetry_logs` VALUES (376, 1, 45, 31.3, 117, 56, 1005, 'Cerah', '2026-06-11 01:00:00');
INSERT INTO `telemetry_logs` VALUES (377, 2, 60, 42, 178, 50, 1010, 'Cerah', '2026-06-11 01:00:00');
INSERT INTO `telemetry_logs` VALUES (378, 3, 61, 38.7, 121, 69, 1009, 'Cerah', '2026-06-11 01:00:00');
INSERT INTO `telemetry_logs` VALUES (379, 4, 51, 35.2, 172, 58, 1006, 'Cerah', '2026-06-11 01:00:00');
INSERT INTO `telemetry_logs` VALUES (380, 5, 47, 30.6, 172, 60, 1005, 'Cerah', '2026-06-11 01:00:00');
INSERT INTO `telemetry_logs` VALUES (381, 6, 6, 5, 51, 64, 1012, 'Cerah', '2026-06-11 01:00:00');
INSERT INTO `telemetry_logs` VALUES (382, 7, 46, 31.9, 179, 63, 1015, 'Berawan', '2026-06-11 01:00:00');
INSERT INTO `telemetry_logs` VALUES (383, 8, 90, 60.5, 255, 58, 1012, 'Cerah', '2026-06-11 01:00:00');
INSERT INTO `telemetry_logs` VALUES (384, 9, 49, 33.9, 155, 55, 1006, 'Cerah', '2026-06-11 01:00:00');
INSERT INTO `telemetry_logs` VALUES (385, 10, 98, 61.7, 324, 62, 1010, 'Cerah', '2026-06-11 01:00:00');
INSERT INTO `telemetry_logs` VALUES (386, 11, 50, 35.5, 116, 66, 1011, 'Berawan', '2026-06-11 01:00:00');
INSERT INTO `telemetry_logs` VALUES (387, 12, 45, 31.3, 127, 55, 1006, 'Cerah', '2026-06-11 01:00:00');
INSERT INTO `telemetry_logs` VALUES (388, 13, 8, 6.2, 43, 67, 1014, 'Cerah', '2026-06-11 01:00:00');
INSERT INTO `telemetry_logs` VALUES (389, 14, 7, 5, 56, 50, 1013, 'Cerah', '2026-06-11 01:00:00');
INSERT INTO `telemetry_logs` VALUES (390, 15, 107, 65.6, 265, 64, 1009, 'Cerah', '2026-06-11 01:00:00');
INSERT INTO `telemetry_logs` VALUES (391, 1, 38, 22.7, 105, 60, 1005, 'Cerah', '2026-06-11 02:00:00');
INSERT INTO `telemetry_logs` VALUES (392, 2, 44, 26.6, 107, 57, 1015, 'Berawan', '2026-06-11 02:00:00');
INSERT INTO `telemetry_logs` VALUES (393, 3, 63, 40, 142, 62, 1006, 'Cerah', '2026-06-11 02:00:00');
INSERT INTO `telemetry_logs` VALUES (394, 4, 49, 33.9, 160, 67, 1007, 'Cerah', '2026-06-11 02:00:00');
INSERT INTO `telemetry_logs` VALUES (395, 5, 63, 40, 117, 58, 1011, 'Cerah', '2026-06-11 02:00:00');
INSERT INTO `telemetry_logs` VALUES (396, 6, 16, 8.4, 56, 59, 1015, 'Cerah', '2026-06-11 02:00:00');
INSERT INTO `telemetry_logs` VALUES (397, 7, 48, 28.2, 145, 56, 1012, 'Cerah', '2026-06-11 02:00:00');
INSERT INTO `telemetry_logs` VALUES (398, 8, 106, 69.9, 365, 51, 1011, 'Cerah', '2026-06-11 02:00:00');
INSERT INTO `telemetry_logs` VALUES (399, 9, 62, 41.3, 130, 56, 1008, 'Cerah', '2026-06-11 02:00:00');
INSERT INTO `telemetry_logs` VALUES (400, 10, 85, 55.3, 361, 70, 1006, 'Cerah', '2026-06-11 02:00:00');
INSERT INTO `telemetry_logs` VALUES (401, 11, 60, 39, 156, 59, 1010, 'Berawan', '2026-06-11 02:00:00');
INSERT INTO `telemetry_logs` VALUES (402, 12, 50, 33.5, 141, 60, 1006, 'Cerah', '2026-06-11 02:00:00');
INSERT INTO `telemetry_logs` VALUES (403, 13, 5, 5, 58, 61, 1014, 'Cerah', '2026-06-11 02:00:00');
INSERT INTO `telemetry_logs` VALUES (404, 14, 7, 5, 39, 65, 1012, 'Cerah', '2026-06-11 02:00:00');
INSERT INTO `telemetry_logs` VALUES (405, 15, 71, 43.2, 322, 68, 1006, 'Cerah', '2026-06-11 02:00:00');
INSERT INTO `telemetry_logs` VALUES (406, 1, 58, 35.7, 112, 62, 1006, 'Cerah', '2026-06-11 03:00:00');
INSERT INTO `telemetry_logs` VALUES (407, 2, 39, 23.4, 162, 66, 1014, 'Cerah', '2026-06-11 03:00:00');
INSERT INTO `telemetry_logs` VALUES (408, 3, 42, 29.3, 165, 68, 1014, 'Cerah', '2026-06-11 03:00:00');
INSERT INTO `telemetry_logs` VALUES (409, 4, 53, 31.5, 162, 53, 1011, 'Berawan', '2026-06-11 03:00:00');
INSERT INTO `telemetry_logs` VALUES (410, 5, 52, 36.8, 103, 61, 1012, 'Cerah', '2026-06-11 03:00:00');
INSERT INTO `telemetry_logs` VALUES (411, 6, 11, 9.2, 35, 52, 1014, 'Cerah', '2026-06-11 03:00:00');
INSERT INTO `telemetry_logs` VALUES (412, 7, 63, 44, 174, 51, 1011, 'Cerah', '2026-06-11 03:00:00');
INSERT INTO `telemetry_logs` VALUES (413, 8, 83, 55, 231, 53, 1015, 'Cerah', '2026-06-11 03:00:00');
INSERT INTO `telemetry_logs` VALUES (414, 9, 49, 31.9, 173, 67, 1007, 'Cerah', '2026-06-11 03:00:00');
INSERT INTO `telemetry_logs` VALUES (415, 10, 89, 62.9, 283, 57, 1012, 'Cerah', '2026-06-11 03:00:00');
INSERT INTO `telemetry_logs` VALUES (416, 11, 40, 23, 155, 66, 1015, 'Berawan', '2026-06-11 03:00:00');
INSERT INTO `telemetry_logs` VALUES (417, 12, 40, 23, 132, 68, 1008, 'Cerah', '2026-06-11 03:00:00');
INSERT INTO `telemetry_logs` VALUES (418, 13, 18, 11.7, 31, 70, 1012, 'Cerah', '2026-06-11 03:00:00');
INSERT INTO `telemetry_logs` VALUES (419, 14, 10, 8.5, 31, 64, 1008, 'Cerah', '2026-06-11 03:00:00');
INSERT INTO `telemetry_logs` VALUES (420, 15, 108, 74.2, 241, 55, 1014, 'Berawan', '2026-06-11 03:00:00');
INSERT INTO `telemetry_logs` VALUES (421, 1, 63, 39, 121, 60, 1012, 'Cerah', '2026-06-11 04:00:00');
INSERT INTO `telemetry_logs` VALUES (422, 2, 42, 26.3, 167, 50, 1013, 'Cerah', '2026-06-11 04:00:00');
INSERT INTO `telemetry_logs` VALUES (423, 3, 43, 29, 102, 70, 1006, 'Cerah', '2026-06-11 04:00:00');
INSERT INTO `telemetry_logs` VALUES (424, 4, 47, 28.6, 149, 59, 1012, 'Berawan', '2026-06-11 04:00:00');
INSERT INTO `telemetry_logs` VALUES (425, 5, 40, 27, 142, 62, 1011, 'Cerah', '2026-06-11 04:00:00');
INSERT INTO `telemetry_logs` VALUES (426, 6, 17, 9.1, 39, 59, 1008, 'Berawan', '2026-06-11 04:00:00');
INSERT INTO `telemetry_logs` VALUES (427, 7, 44, 30.6, 166, 56, 1010, 'Cerah', '2026-06-11 04:00:00');
INSERT INTO `telemetry_logs` VALUES (428, 8, 90, 56.5, 378, 61, 1007, 'Cerah', '2026-06-11 04:00:00');
INSERT INTO `telemetry_logs` VALUES (429, 9, 35, 21.8, 174, 52, 1007, 'Berawan', '2026-06-11 04:00:00');
INSERT INTO `telemetry_logs` VALUES (430, 10, 71, 42.2, 255, 53, 1005, 'Cerah', '2026-06-11 04:00:00');
INSERT INTO `telemetry_logs` VALUES (431, 11, 52, 33.8, 118, 62, 1006, 'Berawan', '2026-06-11 04:00:00');
INSERT INTO `telemetry_logs` VALUES (432, 12, 43, 28, 167, 57, 1007, 'Cerah', '2026-06-11 04:00:00');
INSERT INTO `telemetry_logs` VALUES (433, 13, 16, 10.4, 50, 62, 1005, 'Cerah', '2026-06-11 04:00:00');
INSERT INTO `telemetry_logs` VALUES (434, 14, 17, 11.1, 33, 60, 1015, 'Cerah', '2026-06-11 04:00:00');
INSERT INTO `telemetry_logs` VALUES (435, 15, 101, 64.7, 314, 67, 1010, 'Cerah', '2026-06-11 04:00:00');
INSERT INTO `telemetry_logs` VALUES (436, 1, 45, 30.3, 157, 62, 1010, 'Cerah', '2026-06-11 05:00:00');
INSERT INTO `telemetry_logs` VALUES (437, 2, 44, 29.6, 128, 63, 1011, 'Berawan', '2026-06-11 05:00:00');
INSERT INTO `telemetry_logs` VALUES (438, 3, 39, 25.4, 139, 51, 1007, 'Cerah', '2026-06-11 05:00:00');
INSERT INTO `telemetry_logs` VALUES (439, 4, 57, 35.1, 137, 56, 1008, 'Cerah', '2026-06-11 05:00:00');
INSERT INTO `telemetry_logs` VALUES (440, 5, 39, 22.4, 177, 55, 1011, 'Cerah', '2026-06-11 05:00:00');
INSERT INTO `telemetry_logs` VALUES (441, 6, 5, 5, 58, 59, 1013, 'Cerah', '2026-06-11 05:00:00');
INSERT INTO `telemetry_logs` VALUES (442, 7, 40, 28, 119, 68, 1013, 'Berawan', '2026-06-11 05:00:00');
INSERT INTO `telemetry_logs` VALUES (443, 8, 105, 64.3, 324, 63, 1013, 'Cerah', '2026-06-11 05:00:00');
INSERT INTO `telemetry_logs` VALUES (444, 9, 57, 35.1, 132, 59, 1011, 'Cerah', '2026-06-11 05:00:00');
INSERT INTO `telemetry_logs` VALUES (445, 10, 93, 62.5, 237, 66, 1010, 'Cerah', '2026-06-11 05:00:00');
INSERT INTO `telemetry_logs` VALUES (446, 11, 55, 32.8, 158, 57, 1006, 'Cerah', '2026-06-11 05:00:00');
INSERT INTO `telemetry_logs` VALUES (447, 12, 55, 34.8, 128, 60, 1008, 'Cerah', '2026-06-11 05:00:00');
INSERT INTO `telemetry_logs` VALUES (448, 13, 15, 11.8, 39, 53, 1009, 'Cerah', '2026-06-11 05:00:00');
INSERT INTO `telemetry_logs` VALUES (449, 14, 14, 10.1, 44, 65, 1009, 'Cerah', '2026-06-11 05:00:00');
INSERT INTO `telemetry_logs` VALUES (450, 15, 83, 57, 268, 69, 1013, 'Cerah', '2026-06-11 05:00:00');
INSERT INTO `telemetry_logs` VALUES (451, 1, 37, 23.1, 106, 69, 1009, 'Cerah', '2026-06-11 06:00:00');
INSERT INTO `telemetry_logs` VALUES (452, 2, 57, 38.1, 100, 53, 1006, 'Cerah', '2026-06-11 06:00:00');
INSERT INTO `telemetry_logs` VALUES (453, 3, 62, 42.3, 124, 68, 1011, 'Cerah', '2026-06-11 06:00:00');
INSERT INTO `telemetry_logs` VALUES (454, 4, 63, 43, 127, 59, 1006, 'Cerah', '2026-06-11 06:00:00');
INSERT INTO `telemetry_logs` VALUES (455, 5, 43, 30, 109, 53, 1007, 'Cerah', '2026-06-11 06:00:00');
INSERT INTO `telemetry_logs` VALUES (456, 6, 18, 10.7, 53, 53, 1008, 'Cerah', '2026-06-11 06:00:00');
INSERT INTO `telemetry_logs` VALUES (457, 7, 41, 29.7, 117, 58, 1013, 'Cerah', '2026-06-11 06:00:00');
INSERT INTO `telemetry_logs` VALUES (458, 8, 70, 49.5, 347, 65, 1011, 'Cerah', '2026-06-11 06:00:00');
INSERT INTO `telemetry_logs` VALUES (459, 9, 45, 29.3, 136, 56, 1013, 'Cerah', '2026-06-11 06:00:00');
INSERT INTO `telemetry_logs` VALUES (460, 10, 87, 59.6, 339, 65, 1014, 'Cerah', '2026-06-11 06:00:00');
INSERT INTO `telemetry_logs` VALUES (461, 11, 37, 24.1, 166, 55, 1010, 'Cerah', '2026-06-11 06:00:00');
INSERT INTO `telemetry_logs` VALUES (462, 12, 42, 24.3, 102, 63, 1007, 'Cerah', '2026-06-11 06:00:00');
INSERT INTO `telemetry_logs` VALUES (463, 13, 13, 6.5, 49, 58, 1012, 'Cerah', '2026-06-11 06:00:00');
INSERT INTO `telemetry_logs` VALUES (464, 14, 15, 8.8, 40, 57, 1015, 'Cerah', '2026-06-11 06:00:00');
INSERT INTO `telemetry_logs` VALUES (465, 15, 96, 66.4, 324, 67, 1008, 'Cerah', '2026-06-11 06:00:00');
INSERT INTO `telemetry_logs` VALUES (466, 1, 88, 58.2, 215, 63, 1006, 'Cerah', '2026-06-11 07:00:00');
INSERT INTO `telemetry_logs` VALUES (467, 2, 87, 54.6, 264, 50, 1006, 'Cerah', '2026-06-11 07:00:00');
INSERT INTO `telemetry_logs` VALUES (468, 3, 77, 49.1, 226, 56, 1014, 'Cerah', '2026-06-11 07:00:00');
INSERT INTO `telemetry_logs` VALUES (469, 4, 79, 51.4, 269, 67, 1012, 'Cerah', '2026-06-11 07:00:00');
INSERT INTO `telemetry_logs` VALUES (470, 5, 89, 55.9, 242, 61, 1012, 'Cerah', '2026-06-11 07:00:00');
INSERT INTO `telemetry_logs` VALUES (471, 6, 23, 14, 75, 54, 1009, 'Cerah', '2026-06-11 07:00:00');
INSERT INTO `telemetry_logs` VALUES (472, 7, 77, 48.1, 234, 55, 1011, 'Cerah', '2026-06-11 07:00:00');
INSERT INTO `telemetry_logs` VALUES (473, 8, 123, 81, 515, 55, 1010, 'Cerah', '2026-06-11 07:00:00');
INSERT INTO `telemetry_logs` VALUES (474, 9, 78, 48.7, 222, 53, 1007, 'Cerah', '2026-06-11 07:00:00');
INSERT INTO `telemetry_logs` VALUES (475, 10, 155, 102.8, 390, 53, 1005, 'Cerah', '2026-06-11 07:00:00');
INSERT INTO `telemetry_logs` VALUES (476, 11, 70, 42.5, 232, 68, 1013, 'Cerah', '2026-06-11 07:00:00');
INSERT INTO `telemetry_logs` VALUES (477, 12, 77, 47.1, 201, 63, 1009, 'Cerah', '2026-06-11 07:00:00');
INSERT INTO `telemetry_logs` VALUES (478, 13, 27, 19.6, 55, 69, 1013, 'Cerah', '2026-06-11 07:00:00');
INSERT INTO `telemetry_logs` VALUES (479, 14, 22, 12.3, 58, 52, 1007, 'Cerah', '2026-06-11 07:00:00');
INSERT INTO `telemetry_logs` VALUES (480, 15, 145, 91.3, 501, 61, 1013, 'Cerah', '2026-06-11 07:00:00');
INSERT INTO `telemetry_logs` VALUES (481, 1, 92, 57.8, 249, 63, 1008, 'Cerah', '2026-06-11 08:00:00');
INSERT INTO `telemetry_logs` VALUES (482, 2, 70, 45.5, 244, 50, 1005, 'Cerah', '2026-06-11 08:00:00');
INSERT INTO `telemetry_logs` VALUES (483, 3, 87, 56.6, 192, 61, 1012, 'Cerah', '2026-06-11 08:00:00');
INSERT INTO `telemetry_logs` VALUES (484, 4, 94, 60.1, 211, 51, 1013, 'Cerah', '2026-06-11 08:00:00');
INSERT INTO `telemetry_logs` VALUES (485, 5, 67, 44.6, 191, 50, 1015, 'Cerah', '2026-06-11 08:00:00');
INSERT INTO `telemetry_logs` VALUES (486, 6, 26, 18.9, 52, 61, 1011, 'Cerah', '2026-06-11 08:00:00');
INSERT INTO `telemetry_logs` VALUES (487, 7, 94, 61.1, 199, 64, 1014, 'Cerah', '2026-06-11 08:00:00');
INSERT INTO `telemetry_logs` VALUES (488, 8, 146, 94.9, 415, 51, 1007, 'Cerah', '2026-06-11 08:00:00');
INSERT INTO `telemetry_logs` VALUES (489, 9, 78, 53.7, 187, 60, 1008, 'Cerah', '2026-06-11 08:00:00');
INSERT INTO `telemetry_logs` VALUES (490, 10, 114, 70.1, 494, 67, 1014, 'Cerah', '2026-06-11 08:00:00');
INSERT INTO `telemetry_logs` VALUES (491, 11, 85, 56.3, 240, 63, 1005, 'Cerah', '2026-06-11 08:00:00');
INSERT INTO `telemetry_logs` VALUES (492, 12, 68, 46.2, 207, 64, 1010, 'Cerah', '2026-06-11 08:00:00');
INSERT INTO `telemetry_logs` VALUES (493, 13, 28, 20.2, 63, 66, 1014, 'Cerah', '2026-06-11 08:00:00');
INSERT INTO `telemetry_logs` VALUES (494, 14, 21, 11.7, 77, 58, 1008, 'Cerah', '2026-06-11 08:00:00');
INSERT INTO `telemetry_logs` VALUES (495, 15, 110, 71.5, 565, 58, 1009, 'Cerah', '2026-06-11 08:00:00');
INSERT INTO `telemetry_logs` VALUES (496, 1, 95, 63.8, 239, 51, 1006, 'Cerah', '2026-06-11 09:00:00');
INSERT INTO `telemetry_logs` VALUES (497, 2, 80, 52, 202, 53, 1015, 'Cerah', '2026-06-11 09:00:00');
INSERT INTO `telemetry_logs` VALUES (498, 3, 66, 43.9, 232, 65, 1014, 'Cerah', '2026-06-11 09:00:00');
INSERT INTO `telemetry_logs` VALUES (499, 4, 70, 46.5, 246, 56, 1009, 'Cerah', '2026-06-11 09:00:00');
INSERT INTO `telemetry_logs` VALUES (500, 5, 65, 40.3, 189, 52, 1013, 'Cerah', '2026-06-11 09:00:00');
INSERT INTO `telemetry_logs` VALUES (501, 6, 24, 13.6, 82, 50, 1011, 'Cerah', '2026-06-11 09:00:00');
INSERT INTO `telemetry_logs` VALUES (502, 7, 73, 44.5, 260, 65, 1010, 'Cerah', '2026-06-11 09:00:00');
INSERT INTO `telemetry_logs` VALUES (503, 8, 155, 103.8, 458, 69, 1005, 'Cerah', '2026-06-11 09:00:00');
INSERT INTO `telemetry_logs` VALUES (504, 9, 66, 42.9, 231, 61, 1012, 'Cerah', '2026-06-11 09:00:00');
INSERT INTO `telemetry_logs` VALUES (505, 10, 137, 87.1, 440, 58, 1005, 'Cerah', '2026-06-11 09:00:00');
INSERT INTO `telemetry_logs` VALUES (506, 11, 89, 56.9, 198, 61, 1015, 'Cerah', '2026-06-11 09:00:00');
INSERT INTO `telemetry_logs` VALUES (507, 12, 83, 53, 245, 54, 1013, 'Cerah', '2026-06-11 09:00:00');
INSERT INTO `telemetry_logs` VALUES (508, 13, 27, 17.6, 59, 63, 1010, 'Cerah', '2026-06-11 09:00:00');
INSERT INTO `telemetry_logs` VALUES (509, 14, 30, 18.5, 72, 59, 1011, 'Cerah', '2026-06-11 09:00:00');
INSERT INTO `telemetry_logs` VALUES (510, 15, 123, 84, 441, 50, 1009, 'Cerah', '2026-06-11 09:00:00');
INSERT INTO `telemetry_logs` VALUES (511, 1, 54, 38.1, 150, 64, 1015, 'Cerah', '2026-06-11 10:00:00');
INSERT INTO `telemetry_logs` VALUES (512, 2, 49, 33.9, 141, 69, 1012, 'Cerah', '2026-06-11 10:00:00');
INSERT INTO `telemetry_logs` VALUES (513, 3, 58, 36.7, 103, 58, 1014, 'Cerah', '2026-06-11 10:00:00');
INSERT INTO `telemetry_logs` VALUES (514, 4, 38, 24.7, 125, 57, 1014, 'Cerah', '2026-06-11 10:00:00');
INSERT INTO `telemetry_logs` VALUES (515, 5, 64, 43.6, 135, 57, 1010, 'Cerah', '2026-06-11 10:00:00');
INSERT INTO `telemetry_logs` VALUES (516, 6, 5, 5, 59, 69, 1011, 'Cerah', '2026-06-11 10:00:00');
INSERT INTO `telemetry_logs` VALUES (517, 7, 52, 31.8, 149, 59, 1013, 'Cerah', '2026-06-11 10:00:00');
INSERT INTO `telemetry_logs` VALUES (518, 8, 99, 65.4, 341, 53, 1005, 'Cerah', '2026-06-11 10:00:00');
INSERT INTO `telemetry_logs` VALUES (519, 9, 58, 37.7, 110, 57, 1010, 'Cerah', '2026-06-11 10:00:00');
INSERT INTO `telemetry_logs` VALUES (520, 10, 109, 72.9, 220, 54, 1008, 'Cerah', '2026-06-11 10:00:00');
INSERT INTO `telemetry_logs` VALUES (521, 11, 47, 30.6, 139, 60, 1011, 'Cerah', '2026-06-11 10:00:00');
INSERT INTO `telemetry_logs` VALUES (522, 12, 57, 40.1, 173, 70, 1008, 'Cerah', '2026-06-11 10:00:00');
INSERT INTO `telemetry_logs` VALUES (523, 13, 14, 11.1, 43, 53, 1014, 'Cerah', '2026-06-11 10:00:00');
INSERT INTO `telemetry_logs` VALUES (524, 14, 17, 12.1, 56, 51, 1009, 'Cerah', '2026-06-11 10:00:00');
INSERT INTO `telemetry_logs` VALUES (525, 15, 94, 58.1, 281, 68, 1006, 'Cerah', '2026-06-11 10:00:00');
INSERT INTO `telemetry_logs` VALUES (526, 1, 62, 40.3, 132, 50, 1015, 'Cerah', '2026-06-11 11:00:00');
INSERT INTO `telemetry_logs` VALUES (527, 2, 46, 27.9, 172, 68, 1011, 'Cerah', '2026-06-11 11:00:00');
INSERT INTO `telemetry_logs` VALUES (528, 3, 36, 20.4, 155, 54, 1011, 'Cerah', '2026-06-11 11:00:00');
INSERT INTO `telemetry_logs` VALUES (529, 4, 35, 19.8, 118, 53, 1010, 'Cerah', '2026-06-11 11:00:00');
INSERT INTO `telemetry_logs` VALUES (530, 5, 53, 33.5, 101, 59, 1007, 'Cerah', '2026-06-11 11:00:00');
INSERT INTO `telemetry_logs` VALUES (531, 6, 10, 6.5, 34, 60, 1015, 'Cerah', '2026-06-11 11:00:00');
INSERT INTO `telemetry_logs` VALUES (532, 7, 44, 30.6, 134, 63, 1015, 'Cerah', '2026-06-11 11:00:00');
INSERT INTO `telemetry_logs` VALUES (533, 8, 105, 70.3, 318, 55, 1010, 'Cerah', '2026-06-11 11:00:00');
INSERT INTO `telemetry_logs` VALUES (534, 9, 50, 35.5, 114, 70, 1015, 'Cerah', '2026-06-11 11:00:00');
INSERT INTO `telemetry_logs` VALUES (535, 10, 101, 63.7, 284, 55, 1011, 'Cerah', '2026-06-11 11:00:00');
INSERT INTO `telemetry_logs` VALUES (536, 11, 60, 38, 139, 70, 1014, 'Cerah', '2026-06-11 11:00:00');
INSERT INTO `telemetry_logs` VALUES (537, 12, 38, 27.7, 160, 60, 1006, 'Cerah', '2026-06-11 11:00:00');
INSERT INTO `telemetry_logs` VALUES (538, 13, 16, 12.4, 38, 54, 1005, 'Cerah', '2026-06-11 11:00:00');
INSERT INTO `telemetry_logs` VALUES (539, 14, 11, 8.2, 51, 56, 1011, 'Cerah', '2026-06-11 11:00:00');
INSERT INTO `telemetry_logs` VALUES (540, 15, 106, 70.9, 343, 63, 1011, 'Cerah', '2026-06-11 11:00:00');
INSERT INTO `telemetry_logs` VALUES (541, 1, 57, 37.1, 148, 59, 1007, 'Cerah', '2026-06-11 12:00:00');
INSERT INTO `telemetry_logs` VALUES (542, 2, 62, 40.3, 157, 52, 1005, 'Cerah', '2026-06-11 12:00:00');
INSERT INTO `telemetry_logs` VALUES (543, 3, 60, 39, 179, 67, 1007, 'Cerah', '2026-06-11 12:00:00');
INSERT INTO `telemetry_logs` VALUES (544, 4, 39, 23.4, 104, 63, 1008, 'Cerah', '2026-06-11 12:00:00');
INSERT INTO `telemetry_logs` VALUES (545, 5, 60, 40, 111, 63, 1013, 'Cerah', '2026-06-11 12:00:00');
INSERT INTO `telemetry_logs` VALUES (546, 6, 16, 9.4, 42, 60, 1014, 'Cerah', '2026-06-11 12:00:00');
INSERT INTO `telemetry_logs` VALUES (547, 7, 56, 39.4, 127, 68, 1013, 'Cerah', '2026-06-11 12:00:00');
INSERT INTO `telemetry_logs` VALUES (548, 8, 74, 49.1, 234, 50, 1005, 'Cerah', '2026-06-11 12:00:00');
INSERT INTO `telemetry_logs` VALUES (549, 9, 47, 29.6, 145, 56, 1009, 'Cerah', '2026-06-11 12:00:00');
INSERT INTO `telemetry_logs` VALUES (550, 10, 98, 61.7, 306, 50, 1012, 'Cerah', '2026-06-11 12:00:00');
INSERT INTO `telemetry_logs` VALUES (551, 11, 53, 36.5, 122, 52, 1006, 'Cerah', '2026-06-11 12:00:00');
INSERT INTO `telemetry_logs` VALUES (552, 12, 39, 24.4, 153, 63, 1012, 'Cerah', '2026-06-11 12:00:00');
INSERT INTO `telemetry_logs` VALUES (553, 13, 7, 6.6, 48, 64, 1013, 'Cerah', '2026-06-11 12:00:00');
INSERT INTO `telemetry_logs` VALUES (554, 14, 15, 7.8, 30, 51, 1010, 'Cerah', '2026-06-11 12:00:00');
INSERT INTO `telemetry_logs` VALUES (555, 15, 100, 64, 251, 69, 1007, 'Cerah', '2026-06-11 12:00:00');
INSERT INTO `telemetry_logs` VALUES (556, 1, 37, 24.1, 119, 93, 1006, 'Hujan', '2026-06-11 13:00:00');
INSERT INTO `telemetry_logs` VALUES (557, 2, 43, 27, 135, 60, 1009, 'Berawan', '2026-06-11 13:00:00');
INSERT INTO `telemetry_logs` VALUES (558, 3, 49, 30.9, 145, 56, 1015, 'Berawan', '2026-06-11 13:00:00');
INSERT INTO `telemetry_logs` VALUES (559, 4, 59, 41.4, 109, 75, 1013, 'Gerimis', '2026-06-11 13:00:00');
INSERT INTO `telemetry_logs` VALUES (560, 5, 53, 34.5, 126, 82, 1010, 'Gerimis', '2026-06-11 13:00:00');
INSERT INTO `telemetry_logs` VALUES (561, 6, 7, 5, 36, 56, 1012, 'Berawan', '2026-06-11 13:00:00');
INSERT INTO `telemetry_logs` VALUES (562, 7, 49, 33.9, 167, 84, 1008, 'Gerimis', '2026-06-11 13:00:00');
INSERT INTO `telemetry_logs` VALUES (563, 8, 103, 69, 271, 95, 1011, 'Hujan', '2026-06-11 13:00:00');
INSERT INTO `telemetry_logs` VALUES (564, 9, 61, 37.7, 119, 60, 1005, 'Berawan', '2026-06-11 13:00:00');
INSERT INTO `telemetry_logs` VALUES (565, 10, 81, 54.7, 250, 73, 1011, 'Gerimis', '2026-06-11 13:00:00');
INSERT INTO `telemetry_logs` VALUES (566, 11, 38, 23.7, 112, 89, 1013, 'Hujan', '2026-06-11 13:00:00');
INSERT INTO `telemetry_logs` VALUES (567, 12, 56, 33.4, 134, 84, 1010, 'Hujan', '2026-06-11 13:00:00');
INSERT INTO `telemetry_logs` VALUES (568, 13, 18, 11.7, 51, 70, 1009, 'Gerimis', '2026-06-11 13:00:00');
INSERT INTO `telemetry_logs` VALUES (569, 14, 5, 5, 42, 82, 1015, 'Gerimis', '2026-06-11 13:00:00');
INSERT INTO `telemetry_logs` VALUES (570, 15, 71, 46.2, 351, 74, 1014, 'Gerimis', '2026-06-11 13:00:00');
INSERT INTO `telemetry_logs` VALUES (571, 1, 55, 33.8, 136, 50, 1006, 'Berawan', '2026-06-11 14:00:00');
INSERT INTO `telemetry_logs` VALUES (572, 2, 65, 40.3, 108, 74, 1011, 'Gerimis', '2026-06-11 14:00:00');
INSERT INTO `telemetry_logs` VALUES (573, 3, 46, 29.9, 177, 59, 1006, 'Berawan', '2026-06-11 14:00:00');
INSERT INTO `telemetry_logs` VALUES (574, 4, 56, 39.4, 166, 55, 1015, 'Berawan', '2026-06-11 14:00:00');
INSERT INTO `telemetry_logs` VALUES (575, 5, 38, 24.7, 179, 93, 1008, 'Hujan', '2026-06-11 14:00:00');
INSERT INTO `telemetry_logs` VALUES (576, 6, 8, 6.2, 31, 54, 1006, 'Berawan', '2026-06-11 14:00:00');
INSERT INTO `telemetry_logs` VALUES (577, 7, 59, 40.4, 142, 90, 1009, 'Hujan', '2026-06-11 14:00:00');
INSERT INTO `telemetry_logs` VALUES (578, 8, 95, 60.8, 303, 51, 1008, 'Berawan', '2026-06-11 14:00:00');
INSERT INTO `telemetry_logs` VALUES (579, 9, 38, 22.7, 104, 67, 1012, 'Berawan', '2026-06-11 14:00:00');
INSERT INTO `telemetry_logs` VALUES (580, 10, 95, 62.8, 273, 83, 1009, 'Gerimis', '2026-06-11 14:00:00');
INSERT INTO `telemetry_logs` VALUES (581, 11, 46, 26.9, 176, 67, 1015, 'Berawan', '2026-06-11 14:00:00');
INSERT INTO `telemetry_logs` VALUES (582, 12, 43, 29, 120, 58, 1008, 'Berawan', '2026-06-11 14:00:00');
INSERT INTO `telemetry_logs` VALUES (583, 13, 13, 7.5, 42, 64, 1013, 'Berawan', '2026-06-11 14:00:00');
INSERT INTO `telemetry_logs` VALUES (584, 14, 8, 5, 55, 75, 1007, 'Gerimis', '2026-06-11 14:00:00');
INSERT INTO `telemetry_logs` VALUES (585, 15, 84, 51.6, 289, 70, 1011, 'Gerimis', '2026-06-11 14:00:00');
INSERT INTO `telemetry_logs` VALUES (586, 1, 46, 32.9, 128, 93, 1007, 'Hujan', '2026-06-11 15:00:00');
INSERT INTO `telemetry_logs` VALUES (587, 2, 50, 31.5, 114, 64, 1012, 'Berawan', '2026-06-11 15:00:00');
INSERT INTO `telemetry_logs` VALUES (588, 3, 43, 26, 169, 95, 1011, 'Hujan', '2026-06-11 15:00:00');
INSERT INTO `telemetry_logs` VALUES (589, 4, 52, 32.8, 153, 83, 1012, 'Gerimis', '2026-06-11 15:00:00');
INSERT INTO `telemetry_logs` VALUES (590, 5, 52, 34.8, 135, 68, 1010, 'Berawan', '2026-06-11 15:00:00');
INSERT INTO `telemetry_logs` VALUES (591, 6, 9, 5, 60, 53, 1005, 'Berawan', '2026-06-11 15:00:00');
INSERT INTO `telemetry_logs` VALUES (592, 7, 58, 40.7, 159, 81, 1014, 'Gerimis', '2026-06-11 15:00:00');
INSERT INTO `telemetry_logs` VALUES (593, 8, 95, 62.8, 368, 61, 1013, 'Berawan', '2026-06-11 15:00:00');
INSERT INTO `telemetry_logs` VALUES (594, 9, 37, 25.1, 153, 79, 1008, 'Gerimis', '2026-06-11 15:00:00');
INSERT INTO `telemetry_logs` VALUES (595, 10, 91, 55.2, 254, 58, 1008, 'Berawan', '2026-06-11 15:00:00');
INSERT INTO `telemetry_logs` VALUES (596, 11, 40, 24, 163, 50, 1006, 'Berawan', '2026-06-11 15:00:00');
INSERT INTO `telemetry_logs` VALUES (597, 12, 65, 40.3, 103, 68, 1006, 'Berawan', '2026-06-11 15:00:00');
INSERT INTO `telemetry_logs` VALUES (598, 13, 6, 5.9, 38, 52, 1012, 'Berawan', '2026-06-11 15:00:00');
INSERT INTO `telemetry_logs` VALUES (599, 14, 7, 5.6, 40, 81, 1015, 'Gerimis', '2026-06-11 15:00:00');
INSERT INTO `telemetry_logs` VALUES (600, 15, 80, 52, 258, 51, 1015, 'Berawan', '2026-06-11 15:00:00');
INSERT INTO `telemetry_logs` VALUES (601, 1, 61, 38.7, 179, 66, 1007, 'Berawan', '2026-06-11 16:00:00');
INSERT INTO `telemetry_logs` VALUES (602, 2, 49, 30.9, 121, 51, 1008, 'Berawan', '2026-06-11 16:00:00');
INSERT INTO `telemetry_logs` VALUES (603, 3, 59, 37.4, 117, 58, 1015, 'Berawan', '2026-06-11 16:00:00');
INSERT INTO `telemetry_logs` VALUES (604, 4, 52, 33.8, 156, 52, 1009, 'Berawan', '2026-06-11 16:00:00');
INSERT INTO `telemetry_logs` VALUES (605, 5, 45, 30.3, 112, 64, 1011, 'Berawan', '2026-06-11 16:00:00');
INSERT INTO `telemetry_logs` VALUES (606, 6, 16, 8.4, 32, 71, 1015, 'Gerimis', '2026-06-11 16:00:00');
INSERT INTO `telemetry_logs` VALUES (607, 7, 44, 31.6, 105, 70, 1008, 'Berawan', '2026-06-11 16:00:00');
INSERT INTO `telemetry_logs` VALUES (608, 8, 71, 51.2, 326, 53, 1008, 'Berawan', '2026-06-11 16:00:00');
INSERT INTO `telemetry_logs` VALUES (609, 9, 52, 34.8, 173, 58, 1015, 'Berawan', '2026-06-11 16:00:00');
INSERT INTO `telemetry_logs` VALUES (610, 10, 81, 51.7, 364, 88, 1005, 'Hujan', '2026-06-11 16:00:00');
INSERT INTO `telemetry_logs` VALUES (611, 11, 45, 30.3, 124, 76, 1009, 'Gerimis', '2026-06-11 16:00:00');
INSERT INTO `telemetry_logs` VALUES (612, 12, 42, 30.3, 158, 65, 1008, 'Berawan', '2026-06-11 16:00:00');
INSERT INTO `telemetry_logs` VALUES (613, 13, 5, 5, 45, 55, 1014, 'Berawan', '2026-06-11 16:00:00');
INSERT INTO `telemetry_logs` VALUES (614, 14, 7, 5, 43, 87, 1012, 'Hujan', '2026-06-11 16:00:00');
INSERT INTO `telemetry_logs` VALUES (615, 15, 103, 63, 289, 66, 1010, 'Berawan', '2026-06-11 16:00:00');
INSERT INTO `telemetry_logs` VALUES (616, 1, 72, 44.8, 267, 52, 1013, 'Cerah', '2026-06-11 17:00:00');
INSERT INTO `telemetry_logs` VALUES (617, 2, 81, 54.7, 201, 57, 1012, 'Cerah', '2026-06-11 17:00:00');
INSERT INTO `telemetry_logs` VALUES (618, 3, 78, 49.7, 262, 64, 1014, 'Cerah', '2026-06-11 17:00:00');
INSERT INTO `telemetry_logs` VALUES (619, 4, 87, 53.6, 245, 67, 1008, 'Cerah', '2026-06-11 17:00:00');
INSERT INTO `telemetry_logs` VALUES (620, 5, 90, 55.5, 265, 64, 1013, 'Cerah', '2026-06-11 17:00:00');
INSERT INTO `telemetry_logs` VALUES (621, 6, 22, 16.3, 54, 51, 1005, 'Cerah', '2026-06-11 17:00:00');
INSERT INTO `telemetry_logs` VALUES (622, 7, 76, 51.4, 239, 63, 1012, 'Cerah', '2026-06-11 17:00:00');
INSERT INTO `telemetry_logs` VALUES (623, 8, 116, 76.4, 509, 69, 1008, 'Cerah', '2026-06-11 17:00:00');
INSERT INTO `telemetry_logs` VALUES (624, 9, 74, 49.1, 253, 70, 1006, 'Cerah', '2026-06-11 17:00:00');
INSERT INTO `telemetry_logs` VALUES (625, 10, 156, 102.4, 562, 64, 1010, 'Cerah', '2026-06-11 17:00:00');
INSERT INTO `telemetry_logs` VALUES (626, 11, 73, 48.5, 260, 55, 1005, 'Cerah', '2026-06-11 17:00:00');
INSERT INTO `telemetry_logs` VALUES (627, 12, 92, 61.8, 186, 66, 1005, 'Cerah', '2026-06-11 17:00:00');
INSERT INTO `telemetry_logs` VALUES (628, 13, 21, 13.7, 54, 62, 1015, 'Cerah', '2026-06-11 17:00:00');
INSERT INTO `telemetry_logs` VALUES (629, 14, 29, 19.9, 71, 61, 1015, 'Cerah', '2026-06-11 17:00:00');
INSERT INTO `telemetry_logs` VALUES (630, 15, 152, 99.8, 545, 63, 1010, 'Cerah', '2026-06-11 17:00:00');
INSERT INTO `telemetry_logs` VALUES (631, 1, 90, 56.5, 200, 51, 1005, 'Cerah', '2026-06-11 18:00:00');
INSERT INTO `telemetry_logs` VALUES (632, 2, 67, 43.6, 230, 66, 1014, 'Cerah', '2026-06-11 18:00:00');
INSERT INTO `telemetry_logs` VALUES (633, 3, 78, 51.7, 188, 55, 1013, 'Cerah', '2026-06-11 18:00:00');
INSERT INTO `telemetry_logs` VALUES (634, 4, 88, 57.2, 245, 65, 1011, 'Cerah', '2026-06-11 18:00:00');
INSERT INTO `telemetry_logs` VALUES (635, 5, 92, 59.8, 257, 62, 1013, 'Cerah', '2026-06-11 18:00:00');
INSERT INTO `telemetry_logs` VALUES (636, 6, 16, 11.4, 85, 62, 1009, 'Cerah', '2026-06-11 18:00:00');
INSERT INTO `telemetry_logs` VALUES (637, 7, 68, 46.2, 218, 52, 1015, 'Cerah', '2026-06-11 18:00:00');
INSERT INTO `telemetry_logs` VALUES (638, 8, 123, 83, 559, 53, 1012, 'Cerah', '2026-06-11 18:00:00');
INSERT INTO `telemetry_logs` VALUES (639, 9, 87, 54.6, 246, 57, 1011, 'Cerah', '2026-06-11 18:00:00');
INSERT INTO `telemetry_logs` VALUES (640, 10, 131, 80.2, 530, 52, 1011, 'Cerah', '2026-06-11 18:00:00');
INSERT INTO `telemetry_logs` VALUES (641, 11, 73, 47.5, 232, 51, 1009, 'Cerah', '2026-06-11 18:00:00');
INSERT INTO `telemetry_logs` VALUES (642, 12, 66, 39.9, 201, 64, 1009, 'Cerah', '2026-06-11 18:00:00');
INSERT INTO `telemetry_logs` VALUES (643, 13, 27, 16.6, 68, 51, 1015, 'Cerah', '2026-06-11 18:00:00');
INSERT INTO `telemetry_logs` VALUES (644, 14, 16, 12.4, 89, 66, 1013, 'Cerah', '2026-06-11 18:00:00');
INSERT INTO `telemetry_logs` VALUES (645, 15, 156, 106.4, 567, 65, 1009, 'Cerah', '2026-06-11 18:00:00');
INSERT INTO `telemetry_logs` VALUES (646, 1, 90, 56.5, 212, 55, 1015, 'Cerah', '2026-06-11 19:00:00');
INSERT INTO `telemetry_logs` VALUES (647, 2, 75, 49.8, 182, 52, 1012, 'Cerah', '2026-06-11 19:00:00');
INSERT INTO `telemetry_logs` VALUES (648, 3, 74, 49.1, 207, 65, 1014, 'Cerah', '2026-06-11 19:00:00');
INSERT INTO `telemetry_logs` VALUES (649, 4, 81, 55.7, 255, 66, 1008, 'Cerah', '2026-06-11 19:00:00');
INSERT INTO `telemetry_logs` VALUES (650, 5, 73, 47.5, 192, 57, 1014, 'Cerah', '2026-06-11 19:00:00');
INSERT INTO `telemetry_logs` VALUES (651, 6, 24, 16.6, 89, 70, 1010, 'Cerah', '2026-06-11 19:00:00');
INSERT INTO `telemetry_logs` VALUES (652, 7, 79, 50.4, 229, 62, 1005, 'Cerah', '2026-06-11 19:00:00');
INSERT INTO `telemetry_logs` VALUES (653, 8, 124, 85.6, 437, 68, 1005, 'Cerah', '2026-06-11 19:00:00');
INSERT INTO `telemetry_logs` VALUES (654, 9, 72, 43.8, 216, 59, 1008, 'Cerah', '2026-06-11 19:00:00');
INSERT INTO `telemetry_logs` VALUES (655, 10, 128, 82.2, 430, 52, 1006, 'Cerah', '2026-06-11 19:00:00');
INSERT INTO `telemetry_logs` VALUES (656, 11, 70, 43.5, 264, 52, 1005, 'Cerah', '2026-06-11 19:00:00');
INSERT INTO `telemetry_logs` VALUES (657, 12, 85, 57.3, 239, 66, 1015, 'Cerah', '2026-06-11 19:00:00');
INSERT INTO `telemetry_logs` VALUES (658, 13, 28, 17.2, 74, 51, 1015, 'Cerah', '2026-06-11 19:00:00');
INSERT INTO `telemetry_logs` VALUES (659, 14, 30, 18.5, 86, 52, 1005, 'Berawan', '2026-06-11 19:00:00');
INSERT INTO `telemetry_logs` VALUES (660, 15, 141, 86.7, 520, 68, 1011, 'Cerah', '2026-06-11 19:00:00');
INSERT INTO `telemetry_logs` VALUES (661, 1, 86, 52.9, 226, 61, 1005, 'Cerah', '2026-06-11 20:00:00');
INSERT INTO `telemetry_logs` VALUES (662, 2, 78, 47.7, 252, 58, 1005, 'Cerah', '2026-06-11 20:00:00');
INSERT INTO `telemetry_logs` VALUES (663, 3, 69, 46.9, 183, 54, 1005, 'Cerah', '2026-06-11 20:00:00');
INSERT INTO `telemetry_logs` VALUES (664, 4, 81, 52.7, 244, 60, 1012, 'Berawan', '2026-06-11 20:00:00');
INSERT INTO `telemetry_logs` VALUES (665, 5, 91, 56.2, 226, 52, 1008, 'Berawan', '2026-06-11 20:00:00');
INSERT INTO `telemetry_logs` VALUES (666, 6, 17, 11.1, 68, 58, 1014, 'Cerah', '2026-06-11 20:00:00');
INSERT INTO `telemetry_logs` VALUES (667, 7, 66, 41.9, 232, 67, 1013, 'Cerah', '2026-06-11 20:00:00');
INSERT INTO `telemetry_logs` VALUES (668, 8, 135, 83.8, 456, 50, 1013, 'Cerah', '2026-06-11 20:00:00');
INSERT INTO `telemetry_logs` VALUES (669, 9, 81, 53.7, 195, 63, 1011, 'Cerah', '2026-06-11 20:00:00');
INSERT INTO `telemetry_logs` VALUES (670, 10, 141, 92.7, 478, 52, 1012, 'Cerah', '2026-06-11 20:00:00');
INSERT INTO `telemetry_logs` VALUES (671, 11, 84, 54.6, 248, 60, 1005, 'Cerah', '2026-06-11 20:00:00');
INSERT INTO `telemetry_logs` VALUES (672, 12, 69, 43.9, 212, 54, 1005, 'Cerah', '2026-06-11 20:00:00');
INSERT INTO `telemetry_logs` VALUES (673, 13, 20, 12, 86, 60, 1013, 'Cerah', '2026-06-11 20:00:00');
INSERT INTO `telemetry_logs` VALUES (674, 14, 27, 15.6, 89, 70, 1015, 'Cerah', '2026-06-11 20:00:00');
INSERT INTO `telemetry_logs` VALUES (675, 15, 127, 80.6, 384, 54, 1006, 'Cerah', '2026-06-11 20:00:00');
INSERT INTO `telemetry_logs` VALUES (676, 1, 58, 34.7, 118, 63, 1009, 'Cerah', '2026-06-11 21:00:00');
INSERT INTO `telemetry_logs` VALUES (677, 2, 40, 24, 120, 53, 1012, 'Cerah', '2026-06-11 21:00:00');
INSERT INTO `telemetry_logs` VALUES (678, 3, 54, 32.1, 157, 53, 1011, 'Cerah', '2026-06-11 21:00:00');
INSERT INTO `telemetry_logs` VALUES (679, 4, 63, 39, 131, 59, 1009, 'Cerah', '2026-06-11 21:00:00');
INSERT INTO `telemetry_logs` VALUES (680, 5, 43, 29, 121, 61, 1006, 'Cerah', '2026-06-11 21:00:00');
INSERT INTO `telemetry_logs` VALUES (681, 6, 17, 12.1, 42, 56, 1013, 'Cerah', '2026-06-11 21:00:00');
INSERT INTO `telemetry_logs` VALUES (682, 7, 52, 30.8, 113, 50, 1007, 'Berawan', '2026-06-11 21:00:00');
INSERT INTO `telemetry_logs` VALUES (683, 8, 73, 49.5, 365, 56, 1015, 'Cerah', '2026-06-11 21:00:00');
INSERT INTO `telemetry_logs` VALUES (684, 9, 50, 31.5, 140, 64, 1014, 'Berawan', '2026-06-11 21:00:00');
INSERT INTO `telemetry_logs` VALUES (685, 10, 82, 52.3, 286, 62, 1012, 'Berawan', '2026-06-11 21:00:00');
INSERT INTO `telemetry_logs` VALUES (686, 11, 49, 29.9, 179, 62, 1012, 'Cerah', '2026-06-11 21:00:00');
INSERT INTO `telemetry_logs` VALUES (687, 12, 53, 37.5, 126, 67, 1013, 'Cerah', '2026-06-11 21:00:00');
INSERT INTO `telemetry_logs` VALUES (688, 13, 7, 5, 57, 51, 1008, 'Cerah', '2026-06-11 21:00:00');
INSERT INTO `telemetry_logs` VALUES (689, 14, 5, 5, 52, 68, 1014, 'Cerah', '2026-06-11 21:00:00');
INSERT INTO `telemetry_logs` VALUES (690, 15, 86, 50.9, 255, 70, 1009, 'Berawan', '2026-06-11 21:00:00');
INSERT INTO `telemetry_logs` VALUES (691, 1, 65, 39.3, 154, 61, 1008, 'Cerah', '2026-06-11 22:00:00');
INSERT INTO `telemetry_logs` VALUES (692, 2, 41, 27.7, 148, 51, 1015, 'Cerah', '2026-06-11 22:00:00');
INSERT INTO `telemetry_logs` VALUES (693, 3, 49, 32.9, 176, 59, 1008, 'Berawan', '2026-06-11 22:00:00');
INSERT INTO `telemetry_logs` VALUES (694, 4, 45, 27.3, 125, 60, 1008, 'Cerah', '2026-06-11 22:00:00');
INSERT INTO `telemetry_logs` VALUES (695, 5, 49, 33.9, 128, 58, 1007, 'Cerah', '2026-06-11 22:00:00');
INSERT INTO `telemetry_logs` VALUES (696, 6, 15, 10.8, 35, 51, 1010, 'Cerah', '2026-06-11 22:00:00');
INSERT INTO `telemetry_logs` VALUES (697, 7, 45, 32.3, 129, 64, 1014, 'Cerah', '2026-06-11 22:00:00');
INSERT INTO `telemetry_logs` VALUES (698, 8, 95, 60.8, 341, 52, 1012, 'Berawan', '2026-06-11 22:00:00');
INSERT INTO `telemetry_logs` VALUES (699, 9, 53, 32.5, 164, 59, 1011, 'Cerah', '2026-06-11 22:00:00');
INSERT INTO `telemetry_logs` VALUES (700, 10, 75, 53.8, 279, 54, 1013, 'Cerah', '2026-06-11 22:00:00');
INSERT INTO `telemetry_logs` VALUES (701, 11, 56, 37.4, 160, 56, 1006, 'Cerah', '2026-06-11 22:00:00');
INSERT INTO `telemetry_logs` VALUES (702, 12, 51, 33.2, 175, 56, 1012, 'Berawan', '2026-06-11 22:00:00');
INSERT INTO `telemetry_logs` VALUES (703, 13, 11, 6.2, 47, 63, 1013, 'Cerah', '2026-06-11 22:00:00');
INSERT INTO `telemetry_logs` VALUES (704, 14, 18, 13.7, 60, 53, 1006, 'Cerah', '2026-06-11 22:00:00');
INSERT INTO `telemetry_logs` VALUES (705, 15, 93, 59.5, 276, 55, 1005, 'Cerah', '2026-06-11 22:00:00');
INSERT INTO `telemetry_logs` VALUES (706, 1, 64, 43.6, 132, 69, 1015, 'Berawan', '2026-06-11 23:00:00');
INSERT INTO `telemetry_logs` VALUES (707, 2, 62, 41.3, 101, 63, 1005, 'Cerah', '2026-06-11 23:00:00');
INSERT INTO `telemetry_logs` VALUES (708, 3, 57, 38.1, 177, 50, 1015, 'Berawan', '2026-06-11 23:00:00');
INSERT INTO `telemetry_logs` VALUES (709, 4, 46, 29.9, 135, 63, 1005, 'Cerah', '2026-06-11 23:00:00');
INSERT INTO `telemetry_logs` VALUES (710, 5, 51, 34.2, 151, 58, 1011, 'Berawan', '2026-06-11 23:00:00');
INSERT INTO `telemetry_logs` VALUES (711, 6, 10, 5, 45, 50, 1011, 'Cerah', '2026-06-11 23:00:00');
INSERT INTO `telemetry_logs` VALUES (712, 7, 38, 24.7, 113, 65, 1010, 'Cerah', '2026-06-11 23:00:00');
INSERT INTO `telemetry_logs` VALUES (713, 8, 103, 64, 356, 54, 1013, 'Cerah', '2026-06-11 23:00:00');
INSERT INTO `telemetry_logs` VALUES (714, 9, 47, 28.6, 136, 62, 1006, 'Cerah', '2026-06-11 23:00:00');
INSERT INTO `telemetry_logs` VALUES (715, 10, 100, 67, 346, 54, 1008, 'Cerah', '2026-06-11 23:00:00');
INSERT INTO `telemetry_logs` VALUES (716, 11, 44, 25.6, 165, 64, 1006, 'Cerah', '2026-06-11 23:00:00');
INSERT INTO `telemetry_logs` VALUES (717, 12, 52, 31.8, 125, 51, 1015, 'Cerah', '2026-06-11 23:00:00');
INSERT INTO `telemetry_logs` VALUES (718, 13, 8, 5.2, 60, 57, 1010, 'Berawan', '2026-06-11 23:00:00');
INSERT INTO `telemetry_logs` VALUES (719, 14, 15, 9.8, 58, 53, 1011, 'Cerah', '2026-06-11 23:00:00');
INSERT INTO `telemetry_logs` VALUES (720, 15, 84, 59.6, 305, 69, 1015, 'Cerah', '2026-06-11 23:00:00');
INSERT INTO `telemetry_logs` VALUES (721, 1, 58, 37.7, 123, 63, 1015, 'Cerah', '2026-06-12 00:00:00');
INSERT INTO `telemetry_logs` VALUES (722, 2, 44, 27.6, 136, 57, 1006, 'Cerah', '2026-06-12 00:00:00');
INSERT INTO `telemetry_logs` VALUES (723, 3, 63, 41, 151, 69, 1013, 'Cerah', '2026-06-12 00:00:00');
INSERT INTO `telemetry_logs` VALUES (724, 4, 59, 35.4, 106, 54, 1007, 'Cerah', '2026-06-12 00:00:00');
INSERT INTO `telemetry_logs` VALUES (725, 5, 40, 23, 124, 63, 1005, 'Berawan', '2026-06-12 00:00:00');
INSERT INTO `telemetry_logs` VALUES (726, 6, 14, 10.1, 55, 70, 1009, 'Cerah', '2026-06-12 00:00:00');
INSERT INTO `telemetry_logs` VALUES (727, 7, 40, 29, 115, 65, 1007, 'Berawan', '2026-06-12 00:00:00');
INSERT INTO `telemetry_logs` VALUES (728, 8, 102, 64.3, 253, 50, 1010, 'Cerah', '2026-06-12 00:00:00');
INSERT INTO `telemetry_logs` VALUES (729, 9, 36, 21.4, 141, 59, 1006, 'Cerah', '2026-06-12 00:00:00');
INSERT INTO `telemetry_logs` VALUES (730, 10, 109, 73.9, 221, 53, 1011, 'Cerah', '2026-06-12 00:00:00');
INSERT INTO `telemetry_logs` VALUES (731, 11, 41, 25.7, 175, 63, 1012, 'Berawan', '2026-06-12 00:00:00');
INSERT INTO `telemetry_logs` VALUES (732, 12, 45, 31.3, 126, 61, 1009, 'Cerah', '2026-06-12 00:00:00');
INSERT INTO `telemetry_logs` VALUES (733, 13, 15, 9.8, 31, 65, 1010, 'Cerah', '2026-06-12 00:00:00');
INSERT INTO `telemetry_logs` VALUES (734, 14, 9, 5, 35, 53, 1009, 'Cerah', '2026-06-12 00:00:00');
INSERT INTO `telemetry_logs` VALUES (735, 1, 63, 40, 111, 52, 1014, 'Cerah', '2026-06-12 01:00:00');
INSERT INTO `telemetry_logs` VALUES (736, 2, 57, 34.1, 144, 51, 1005, 'Berawan', '2026-06-12 01:00:00');
INSERT INTO `telemetry_logs` VALUES (737, 3, 51, 32.2, 119, 65, 1015, 'Cerah', '2026-06-12 01:00:00');
INSERT INTO `telemetry_logs` VALUES (738, 4, 36, 20.4, 149, 55, 1005, 'Cerah', '2026-06-12 01:00:00');
INSERT INTO `telemetry_logs` VALUES (739, 5, 40, 27, 158, 52, 1010, 'Cerah', '2026-06-12 01:00:00');
INSERT INTO `telemetry_logs` VALUES (740, 6, 11, 9.2, 54, 70, 1014, 'Cerah', '2026-06-12 01:00:00');
INSERT INTO `telemetry_logs` VALUES (741, 7, 54, 33.1, 143, 62, 1013, 'Berawan', '2026-06-12 01:00:00');
INSERT INTO `telemetry_logs` VALUES (742, 8, 108, 75.2, 222, 58, 1012, 'Cerah', '2026-06-12 01:00:00');
INSERT INTO `telemetry_logs` VALUES (743, 9, 39, 22.4, 117, 63, 1008, 'Cerah', '2026-06-12 01:00:00');
INSERT INTO `telemetry_logs` VALUES (744, 10, 106, 71.9, 370, 56, 1006, 'Cerah', '2026-06-12 01:00:00');
INSERT INTO `telemetry_logs` VALUES (745, 11, 35, 24.8, 161, 63, 1011, 'Cerah', '2026-06-12 01:00:00');
INSERT INTO `telemetry_logs` VALUES (746, 12, 65, 42.3, 116, 58, 1014, 'Berawan', '2026-06-12 01:00:00');
INSERT INTO `telemetry_logs` VALUES (747, 13, 7, 6.6, 47, 50, 1005, 'Berawan', '2026-06-12 01:00:00');
INSERT INTO `telemetry_logs` VALUES (748, 14, 12, 9.8, 31, 70, 1008, 'Cerah', '2026-06-12 01:00:00');
INSERT INTO `telemetry_logs` VALUES (749, 1, 57, 34.1, 148, 58, 1006, 'Cerah', '2026-06-12 02:00:00');
INSERT INTO `telemetry_logs` VALUES (750, 2, 47, 27.6, 116, 60, 1014, 'Cerah', '2026-06-12 02:00:00');
INSERT INTO `telemetry_logs` VALUES (751, 3, 58, 39.7, 124, 51, 1014, 'Cerah', '2026-06-12 02:00:00');
INSERT INTO `telemetry_logs` VALUES (752, 4, 62, 41.3, 148, 68, 1012, 'Cerah', '2026-06-12 02:00:00');
INSERT INTO `telemetry_logs` VALUES (753, 5, 45, 26.3, 143, 59, 1013, 'Cerah', '2026-06-12 02:00:00');
INSERT INTO `telemetry_logs` VALUES (754, 6, 13, 9.5, 46, 51, 1008, 'Cerah', '2026-06-12 02:00:00');
INSERT INTO `telemetry_logs` VALUES (755, 7, 59, 36.4, 125, 50, 1010, 'Cerah', '2026-06-12 02:00:00');
INSERT INTO `telemetry_logs` VALUES (756, 8, 80, 47, 313, 65, 1012, 'Cerah', '2026-06-12 02:00:00');
INSERT INTO `telemetry_logs` VALUES (757, 9, 39, 28.4, 105, 66, 1008, 'Berawan', '2026-06-12 02:00:00');
INSERT INTO `telemetry_logs` VALUES (758, 10, 78, 47.7, 240, 56, 1011, 'Berawan', '2026-06-12 02:00:00');
INSERT INTO `telemetry_logs` VALUES (759, 11, 61, 40.7, 152, 58, 1011, 'Cerah', '2026-06-12 02:00:00');
INSERT INTO `telemetry_logs` VALUES (760, 12, 43, 29, 159, 57, 1011, 'Cerah', '2026-06-12 02:00:00');
INSERT INTO `telemetry_logs` VALUES (761, 13, 5, 5, 37, 67, 1007, 'Cerah', '2026-06-12 02:00:00');
INSERT INTO `telemetry_logs` VALUES (762, 14, 11, 7.2, 55, 70, 1013, 'Cerah', '2026-06-12 02:00:00');
INSERT INTO `telemetry_logs` VALUES (763, 1, 62, 42.3, 177, 60, 1014, 'Berawan', '2026-06-12 03:00:00');
INSERT INTO `telemetry_logs` VALUES (764, 2, 42, 26.3, 143, 53, 1005, 'Berawan', '2026-06-12 03:00:00');
INSERT INTO `telemetry_logs` VALUES (765, 3, 56, 37.4, 142, 63, 1005, 'Cerah', '2026-06-12 03:00:00');
INSERT INTO `telemetry_logs` VALUES (766, 4, 53, 37.5, 148, 56, 1007, 'Cerah', '2026-06-12 03:00:00');
INSERT INTO `telemetry_logs` VALUES (767, 5, 35, 22.8, 167, 65, 1014, 'Berawan', '2026-06-12 03:00:00');
INSERT INTO `telemetry_logs` VALUES (768, 6, 12, 9.8, 43, 58, 1006, 'Cerah', '2026-06-12 03:00:00');
INSERT INTO `telemetry_logs` VALUES (769, 7, 60, 39, 130, 62, 1007, 'Cerah', '2026-06-12 03:00:00');
INSERT INTO `telemetry_logs` VALUES (770, 8, 94, 56.1, 343, 58, 1005, 'Berawan', '2026-06-12 03:00:00');
INSERT INTO `telemetry_logs` VALUES (771, 9, 64, 39.6, 180, 59, 1008, 'Cerah', '2026-06-12 03:00:00');
INSERT INTO `telemetry_logs` VALUES (772, 10, 93, 64.5, 273, 64, 1006, 'Cerah', '2026-06-12 03:00:00');
INSERT INTO `telemetry_logs` VALUES (773, 11, 51, 31.2, 126, 51, 1013, 'Berawan', '2026-06-12 03:00:00');
INSERT INTO `telemetry_logs` VALUES (774, 12, 43, 30, 101, 54, 1009, 'Berawan', '2026-06-12 03:00:00');
INSERT INTO `telemetry_logs` VALUES (775, 13, 14, 8.1, 33, 62, 1014, 'Cerah', '2026-06-12 03:00:00');
INSERT INTO `telemetry_logs` VALUES (776, 14, 11, 6.2, 40, 63, 1010, 'Cerah', '2026-06-12 03:00:00');
INSERT INTO `telemetry_logs` VALUES (777, 1, 37, 27.1, 132, 56, 1006, 'Cerah', '2026-06-12 04:00:00');
INSERT INTO `telemetry_logs` VALUES (778, 2, 41, 27.7, 173, 57, 1014, 'Cerah', '2026-06-12 04:00:00');
INSERT INTO `telemetry_logs` VALUES (779, 3, 52, 34.8, 119, 70, 1010, 'Berawan', '2026-06-12 04:00:00');
INSERT INTO `telemetry_logs` VALUES (780, 4, 50, 29.5, 125, 66, 1009, 'Cerah', '2026-06-12 04:00:00');
INSERT INTO `telemetry_logs` VALUES (781, 5, 55, 35.8, 147, 54, 1006, 'Cerah', '2026-06-12 04:00:00');
INSERT INTO `telemetry_logs` VALUES (782, 6, 12, 7.8, 46, 59, 1014, 'Cerah', '2026-06-12 04:00:00');
INSERT INTO `telemetry_logs` VALUES (783, 7, 50, 31.5, 177, 55, 1010, 'Cerah', '2026-06-12 04:00:00');
INSERT INTO `telemetry_logs` VALUES (784, 8, 108, 73.2, 371, 62, 1006, 'Cerah', '2026-06-12 04:00:00');
INSERT INTO `telemetry_logs` VALUES (785, 9, 58, 40.7, 109, 60, 1007, 'Cerah', '2026-06-12 04:00:00');
INSERT INTO `telemetry_logs` VALUES (786, 10, 96, 57.4, 339, 50, 1013, 'Cerah', '2026-06-12 04:00:00');
INSERT INTO `telemetry_logs` VALUES (787, 11, 60, 38, 163, 61, 1007, 'Cerah', '2026-06-12 04:00:00');
INSERT INTO `telemetry_logs` VALUES (788, 12, 52, 35.8, 124, 57, 1014, 'Berawan', '2026-06-12 04:00:00');
INSERT INTO `telemetry_logs` VALUES (789, 13, 5, 5, 57, 68, 1014, 'Cerah', '2026-06-12 04:00:00');
INSERT INTO `telemetry_logs` VALUES (790, 14, 11, 5.2, 53, 64, 1009, 'Cerah', '2026-06-12 04:00:00');
INSERT INTO `telemetry_logs` VALUES (791, 1, 36, 21.4, 163, 50, 1007, 'Cerah', '2026-06-12 05:00:00');
INSERT INTO `telemetry_logs` VALUES (792, 2, 64, 41.6, 130, 70, 1014, 'Berawan', '2026-06-12 05:00:00');
INSERT INTO `telemetry_logs` VALUES (793, 3, 57, 38.1, 144, 60, 1008, 'Cerah', '2026-06-12 05:00:00');
INSERT INTO `telemetry_logs` VALUES (794, 4, 39, 23.4, 148, 54, 1007, 'Berawan', '2026-06-12 05:00:00');
INSERT INTO `telemetry_logs` VALUES (795, 5, 60, 39, 111, 68, 1011, 'Cerah', '2026-06-12 05:00:00');
INSERT INTO `telemetry_logs` VALUES (796, 6, 6, 5, 45, 66, 1005, 'Cerah', '2026-06-12 05:00:00');
INSERT INTO `telemetry_logs` VALUES (797, 7, 53, 33.5, 167, 57, 1008, 'Cerah', '2026-06-12 05:00:00');
INSERT INTO `telemetry_logs` VALUES (798, 8, 93, 62.5, 380, 52, 1014, 'Cerah', '2026-06-12 05:00:00');
INSERT INTO `telemetry_logs` VALUES (799, 9, 38, 24.7, 133, 70, 1015, 'Cerah', '2026-06-12 05:00:00');
INSERT INTO `telemetry_logs` VALUES (800, 10, 78, 46.7, 271, 62, 1014, 'Berawan', '2026-06-12 05:00:00');
INSERT INTO `telemetry_logs` VALUES (801, 11, 60, 39, 118, 56, 1009, 'Cerah', '2026-06-12 05:00:00');
INSERT INTO `telemetry_logs` VALUES (802, 12, 48, 31.2, 136, 70, 1010, 'Cerah', '2026-06-12 05:00:00');
INSERT INTO `telemetry_logs` VALUES (803, 13, 16, 12.4, 30, 52, 1011, 'Cerah', '2026-06-12 05:00:00');
INSERT INTO `telemetry_logs` VALUES (804, 14, 6, 5, 31, 68, 1010, 'Berawan', '2026-06-12 05:00:00');
INSERT INTO `telemetry_logs` VALUES (805, 1, 35, 25.8, 134, 53, 1007, 'Cerah', '2026-06-12 06:00:00');
INSERT INTO `telemetry_logs` VALUES (806, 2, 50, 32.5, 160, 66, 1011, 'Cerah', '2026-06-12 06:00:00');
INSERT INTO `telemetry_logs` VALUES (807, 3, 43, 29, 169, 70, 1015, 'Cerah', '2026-06-12 06:00:00');
INSERT INTO `telemetry_logs` VALUES (808, 4, 61, 39.7, 118, 70, 1009, 'Cerah', '2026-06-12 06:00:00');
INSERT INTO `telemetry_logs` VALUES (809, 5, 50, 31.5, 114, 51, 1011, 'Cerah', '2026-06-12 06:00:00');
INSERT INTO `telemetry_logs` VALUES (810, 6, 16, 11.4, 56, 58, 1012, 'Cerah', '2026-06-12 06:00:00');
INSERT INTO `telemetry_logs` VALUES (811, 7, 36, 22.4, 164, 54, 1007, 'Cerah', '2026-06-12 06:00:00');
INSERT INTO `telemetry_logs` VALUES (812, 8, 99, 60.4, 365, 61, 1013, 'Cerah', '2026-06-12 06:00:00');
INSERT INTO `telemetry_logs` VALUES (813, 9, 56, 33.4, 116, 56, 1005, 'Cerah', '2026-06-12 06:00:00');
INSERT INTO `telemetry_logs` VALUES (814, 10, 103, 70, 225, 58, 1011, 'Cerah', '2026-06-12 06:00:00');
INSERT INTO `telemetry_logs` VALUES (815, 11, 54, 33.1, 108, 51, 1005, 'Cerah', '2026-06-12 06:00:00');
INSERT INTO `telemetry_logs` VALUES (816, 12, 63, 41, 173, 50, 1007, 'Cerah', '2026-06-12 06:00:00');
INSERT INTO `telemetry_logs` VALUES (817, 13, 10, 8.5, 53, 65, 1013, 'Cerah', '2026-06-12 06:00:00');
INSERT INTO `telemetry_logs` VALUES (818, 14, 7, 6.6, 55, 69, 1005, 'Cerah', '2026-06-12 06:00:00');
INSERT INTO `telemetry_logs` VALUES (819, 1, 78, 52.7, 233, 57, 1005, 'Cerah', '2026-06-12 07:00:00');
INSERT INTO `telemetry_logs` VALUES (820, 2, 88, 57.2, 208, 70, 1015, 'Cerah', '2026-06-12 07:00:00');
INSERT INTO `telemetry_logs` VALUES (821, 3, 66, 44.9, 231, 61, 1006, 'Cerah', '2026-06-12 07:00:00');
INSERT INTO `telemetry_logs` VALUES (822, 4, 68, 43.2, 232, 60, 1015, 'Cerah', '2026-06-12 07:00:00');
INSERT INTO `telemetry_logs` VALUES (823, 5, 82, 56.3, 255, 69, 1009, 'Cerah', '2026-06-12 07:00:00');
INSERT INTO `telemetry_logs` VALUES (824, 6, 20, 14, 57, 67, 1008, 'Cerah', '2026-06-12 07:00:00');
INSERT INTO `telemetry_logs` VALUES (825, 7, 82, 52.3, 224, 51, 1014, 'Cerah', '2026-06-12 07:00:00');
INSERT INTO `telemetry_logs` VALUES (826, 8, 120, 76, 439, 66, 1015, 'Cerah', '2026-06-12 07:00:00');
INSERT INTO `telemetry_logs` VALUES (827, 9, 85, 56.3, 238, 57, 1007, 'Cerah', '2026-06-12 07:00:00');
INSERT INTO `telemetry_logs` VALUES (828, 10, 136, 90.4, 489, 56, 1014, 'Cerah', '2026-06-12 07:00:00');
INSERT INTO `telemetry_logs` VALUES (829, 11, 87, 54.6, 241, 70, 1010, 'Cerah', '2026-06-12 07:00:00');
INSERT INTO `telemetry_logs` VALUES (830, 12, 82, 56.3, 233, 65, 1007, 'Cerah', '2026-06-12 07:00:00');
INSERT INTO `telemetry_logs` VALUES (831, 13, 23, 17, 79, 57, 1010, 'Cerah', '2026-06-12 07:00:00');
INSERT INTO `telemetry_logs` VALUES (832, 14, 21, 12.7, 68, 59, 1010, 'Cerah', '2026-06-12 07:00:00');
INSERT INTO `telemetry_logs` VALUES (833, 1, 74, 45.1, 245, 52, 1012, 'Cerah', '2026-06-12 08:00:00');
INSERT INTO `telemetry_logs` VALUES (834, 2, 81, 54.7, 219, 54, 1008, 'Cerah', '2026-06-12 08:00:00');
INSERT INTO `telemetry_logs` VALUES (835, 3, 74, 47.1, 180, 69, 1008, 'Cerah', '2026-06-12 08:00:00');
INSERT INTO `telemetry_logs` VALUES (836, 4, 93, 60.5, 248, 60, 1008, 'Cerah', '2026-06-12 08:00:00');
INSERT INTO `telemetry_logs` VALUES (837, 5, 66, 40.9, 227, 52, 1008, 'Cerah', '2026-06-12 08:00:00');
INSERT INTO `telemetry_logs` VALUES (838, 6, 22, 12.3, 88, 60, 1014, 'Cerah', '2026-06-12 08:00:00');
INSERT INTO `telemetry_logs` VALUES (839, 7, 67, 44.6, 232, 57, 1007, 'Cerah', '2026-06-12 08:00:00');
INSERT INTO `telemetry_logs` VALUES (840, 8, 158, 102.7, 429, 56, 1013, 'Cerah', '2026-06-12 08:00:00');
INSERT INTO `telemetry_logs` VALUES (841, 9, 69, 46.9, 232, 69, 1014, 'Cerah', '2026-06-12 08:00:00');
INSERT INTO `telemetry_logs` VALUES (842, 10, 149, 92.9, 473, 63, 1013, 'Cerah', '2026-06-12 08:00:00');
INSERT INTO `telemetry_logs` VALUES (843, 11, 81, 49.7, 219, 66, 1010, 'Cerah', '2026-06-12 08:00:00');
INSERT INTO `telemetry_logs` VALUES (844, 12, 84, 51.6, 269, 66, 1009, 'Cerah', '2026-06-12 08:00:00');
INSERT INTO `telemetry_logs` VALUES (845, 13, 19, 14.4, 57, 54, 1010, 'Cerah', '2026-06-12 08:00:00');
INSERT INTO `telemetry_logs` VALUES (846, 14, 23, 13, 78, 53, 1009, 'Cerah', '2026-06-12 08:00:00');
INSERT INTO `telemetry_logs` VALUES (847, 1, 73, 47.5, 212, 57, 1005, 'Cerah', '2026-06-12 09:00:00');
INSERT INTO `telemetry_logs` VALUES (848, 2, 92, 56.8, 225, 55, 1006, 'Cerah', '2026-06-12 09:00:00');
INSERT INTO `telemetry_logs` VALUES (849, 3, 87, 54.6, 191, 56, 1005, 'Cerah', '2026-06-12 09:00:00');
INSERT INTO `telemetry_logs` VALUES (850, 4, 80, 52, 262, 56, 1009, 'Cerah', '2026-06-12 09:00:00');
INSERT INTO `telemetry_logs` VALUES (851, 5, 73, 45.5, 198, 50, 1012, 'Cerah', '2026-06-12 09:00:00');
INSERT INTO `telemetry_logs` VALUES (852, 6, 16, 10.4, 83, 50, 1006, 'Cerah', '2026-06-12 09:00:00');
INSERT INTO `telemetry_logs` VALUES (853, 7, 83, 51, 268, 67, 1005, 'Cerah', '2026-06-12 09:00:00');
INSERT INTO `telemetry_logs` VALUES (854, 8, 150, 94.5, 488, 51, 1008, 'Cerah', '2026-06-12 09:00:00');
INSERT INTO `telemetry_logs` VALUES (855, 9, 83, 52, 236, 62, 1009, 'Cerah', '2026-06-12 09:00:00');
INSERT INTO `telemetry_logs` VALUES (856, 10, 150, 98.5, 413, 63, 1012, 'Cerah', '2026-06-12 09:00:00');
INSERT INTO `telemetry_logs` VALUES (857, 11, 80, 49, 205, 70, 1008, 'Cerah', '2026-06-12 09:00:00');
INSERT INTO `telemetry_logs` VALUES (858, 12, 68, 47.2, 228, 58, 1007, 'Cerah', '2026-06-12 09:00:00');
INSERT INTO `telemetry_logs` VALUES (859, 13, 22, 15.3, 85, 70, 1008, 'Cerah', '2026-06-12 09:00:00');
INSERT INTO `telemetry_logs` VALUES (860, 14, 25, 15.3, 61, 60, 1008, 'Cerah', '2026-06-12 09:00:00');
INSERT INTO `telemetry_logs` VALUES (861, 1, 58, 38.7, 169, 60, 1012, 'Cerah', '2026-06-12 10:00:00');
INSERT INTO `telemetry_logs` VALUES (862, 2, 40, 24, 118, 51, 1010, 'Cerah', '2026-06-12 10:00:00');
INSERT INTO `telemetry_logs` VALUES (863, 3, 54, 37.1, 173, 62, 1006, 'Cerah', '2026-06-12 10:00:00');
INSERT INTO `telemetry_logs` VALUES (864, 4, 45, 32.3, 109, 67, 1006, 'Cerah', '2026-06-12 10:00:00');
INSERT INTO `telemetry_logs` VALUES (865, 5, 39, 27.4, 117, 57, 1011, 'Cerah', '2026-06-12 10:00:00');
INSERT INTO `telemetry_logs` VALUES (866, 6, 6, 5, 42, 58, 1015, 'Cerah', '2026-06-12 10:00:00');
INSERT INTO `telemetry_logs` VALUES (867, 7, 38, 24.7, 161, 70, 1012, 'Cerah', '2026-06-12 10:00:00');
INSERT INTO `telemetry_logs` VALUES (868, 8, 74, 47.1, 307, 63, 1008, 'Cerah', '2026-06-12 10:00:00');
INSERT INTO `telemetry_logs` VALUES (869, 9, 40, 23, 147, 68, 1013, 'Cerah', '2026-06-12 10:00:00');
INSERT INTO `telemetry_logs` VALUES (870, 10, 94, 62.1, 344, 61, 1010, 'Cerah', '2026-06-12 10:00:00');
INSERT INTO `telemetry_logs` VALUES (871, 11, 55, 38.8, 130, 59, 1007, 'Cerah', '2026-06-12 10:00:00');
INSERT INTO `telemetry_logs` VALUES (872, 12, 47, 29.6, 178, 65, 1006, 'Cerah', '2026-06-12 10:00:00');
INSERT INTO `telemetry_logs` VALUES (873, 13, 13, 8.5, 45, 52, 1005, 'Cerah', '2026-06-12 10:00:00');
INSERT INTO `telemetry_logs` VALUES (874, 14, 14, 7.1, 47, 52, 1009, 'Cerah', '2026-06-12 10:00:00');
INSERT INTO `telemetry_logs` VALUES (875, 1, 39, 23.4, 128, 57, 1007, 'Cerah', '2026-06-12 11:00:00');
INSERT INTO `telemetry_logs` VALUES (876, 2, 39, 23.4, 160, 53, 1006, 'Cerah', '2026-06-12 11:00:00');
INSERT INTO `telemetry_logs` VALUES (877, 3, 48, 34.2, 140, 70, 1010, 'Cerah', '2026-06-12 11:00:00');
INSERT INTO `telemetry_logs` VALUES (878, 4, 47, 33.6, 130, 69, 1010, 'Cerah', '2026-06-12 11:00:00');
INSERT INTO `telemetry_logs` VALUES (879, 5, 35, 20.8, 126, 58, 1006, 'Cerah', '2026-06-12 11:00:00');
INSERT INTO `telemetry_logs` VALUES (880, 6, 9, 5, 45, 70, 1007, 'Cerah', '2026-06-12 11:00:00');
INSERT INTO `telemetry_logs` VALUES (881, 7, 51, 33.2, 113, 59, 1015, 'Cerah', '2026-06-12 11:00:00');
INSERT INTO `telemetry_logs` VALUES (882, 8, 75, 44.8, 318, 70, 1012, 'Cerah', '2026-06-12 11:00:00');
INSERT INTO `telemetry_logs` VALUES (883, 9, 64, 42.6, 104, 70, 1013, 'Cerah', '2026-06-12 11:00:00');
INSERT INTO `telemetry_logs` VALUES (884, 10, 88, 59.2, 295, 69, 1012, 'Cerah', '2026-06-12 11:00:00');
INSERT INTO `telemetry_logs` VALUES (885, 11, 37, 23.1, 163, 69, 1010, 'Cerah', '2026-06-12 11:00:00');
INSERT INTO `telemetry_logs` VALUES (886, 12, 37, 23.1, 180, 62, 1007, 'Cerah', '2026-06-12 11:00:00');
INSERT INTO `telemetry_logs` VALUES (887, 13, 8, 7.2, 48, 65, 1012, 'Cerah', '2026-06-12 11:00:00');
INSERT INTO `telemetry_logs` VALUES (888, 14, 14, 10.1, 30, 65, 1014, 'Cerah', '2026-06-12 11:00:00');
INSERT INTO `telemetry_logs` VALUES (889, 1, 54, 34.1, 110, 70, 1008, 'Cerah', '2026-06-12 12:00:00');
INSERT INTO `telemetry_logs` VALUES (890, 2, 42, 27.3, 139, 57, 1008, 'Cerah', '2026-06-12 12:00:00');
INSERT INTO `telemetry_logs` VALUES (891, 3, 56, 35.4, 153, 54, 1007, 'Cerah', '2026-06-12 12:00:00');
INSERT INTO `telemetry_logs` VALUES (892, 4, 41, 25.7, 120, 52, 1005, 'Cerah', '2026-06-12 12:00:00');
INSERT INTO `telemetry_logs` VALUES (893, 5, 36, 22.4, 166, 53, 1010, 'Cerah', '2026-06-12 12:00:00');
INSERT INTO `telemetry_logs` VALUES (894, 6, 13, 9.5, 38, 54, 1006, 'Cerah', '2026-06-12 12:00:00');
INSERT INTO `telemetry_logs` VALUES (895, 7, 56, 34.4, 174, 66, 1012, 'Cerah', '2026-06-12 12:00:00');
INSERT INTO `telemetry_logs` VALUES (896, 8, 78, 54.7, 339, 68, 1010, 'Cerah', '2026-06-12 12:00:00');
INSERT INTO `telemetry_logs` VALUES (897, 9, 45, 28.3, 157, 50, 1008, 'Cerah', '2026-06-12 12:00:00');
INSERT INTO `telemetry_logs` VALUES (898, 10, 103, 66, 264, 61, 1008, 'Cerah', '2026-06-12 12:00:00');
INSERT INTO `telemetry_logs` VALUES (899, 11, 35, 19.8, 134, 51, 1007, 'Cerah', '2026-06-12 12:00:00');
INSERT INTO `telemetry_logs` VALUES (900, 12, 47, 31.6, 174, 65, 1012, 'Cerah', '2026-06-12 12:00:00');
INSERT INTO `telemetry_logs` VALUES (901, 13, 15, 9.8, 53, 55, 1008, 'Cerah', '2026-06-12 12:00:00');
INSERT INTO `telemetry_logs` VALUES (902, 14, 5, 5, 34, 60, 1015, 'Cerah', '2026-06-12 12:00:00');

-- ----------------------------
-- Table structure for upload_logs
-- ----------------------------
DROP TABLE IF EXISTS `upload_logs`;
CREATE TABLE `upload_logs`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `device_id` bigint UNSIGNED NULL DEFAULT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `error_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `ip_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `upload_logs_device_id_foreign`(`device_id` ASC) USING BTREE,
  CONSTRAINT `upload_logs_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of upload_logs
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Viewer / Operator',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `preferences` json NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `two_factor_secret` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `two_factor_recovery_codes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `users_email_unique`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'Super Admin', 'admin@smartcity.com', 'Super Admin', 'active', '{\"theme\": \"dark\", \"widgets\": [\"telemetry\", \"alerts\", \"users\", \"devices\", \"analytics\", \"security\"], \"bookmarks\": [1, 5, 11]}', NULL, '$2y$12$cU/evExyQipziZOpxqfk/effQRalsYSia34W8vZxqifqlSMo6jPWG', NULL, NULL, NULL, NULL, '2026-06-12 12:01:28', '2026-06-12 12:01:28');
INSERT INTO `users` VALUES (2, 'Petugas Monitoring', 'operator@smartcity.com', 'Petugas Monitoring', 'active', '{\"theme\": \"dark\", \"widgets\": [\"telemetry\", \"alerts\", \"analytics\"], \"bookmarks\": [1, 7]}', NULL, '$2y$12$IPUDioBazR3cE6lUjVK12.HvLz0t818MirDGVMJafKLoeRtjN0cLW', NULL, NULL, NULL, NULL, '2026-06-12 12:01:28', '2026-06-12 12:01:28');
INSERT INTO `users` VALUES (3, 'Viewer / Operator', 'viewer@smartcity.com', 'Viewer / Operator', 'active', '{\"theme\": \"dark\", \"widgets\": [\"telemetry\", \"analytics\"], \"bookmarks\": [5]}', NULL, '$2y$12$YWV0NfiNCjuoxPpakHHlzuMz/5/2i8fsSdlnHxbV3v4W11GBaPMju', NULL, NULL, NULL, NULL, '2026-06-12 12:01:28', '2026-06-12 12:01:28');
INSERT INTO `users` VALUES (4, 'Teknisi Lapangan', 'teknisi@smartcity.com', 'Teknisi Lapangan', 'active', '{\"theme\": \"dark\", \"widgets\": [\"tickets\", \"health\"], \"bookmarks\": [1, 5, 15]}', NULL, '$2y$12$tzsRMD.LYdCEHRYbYubUdOL4HtIFleYnXmvWCbGeMHAN/mq3jt02W', NULL, NULL, NULL, NULL, '2026-06-12 12:01:29', '2026-06-12 12:01:29');
INSERT INTO `users` VALUES (5, 'Suspended Operator', 'suspended@smartcity.com', 'Petugas Monitoring', 'suspended', NULL, NULL, '$2y$12$PS793HUr8pM2RClffbOY8eS0bvWutZ3.BZZ1vK9oyudLheTz6iTxm', NULL, NULL, NULL, NULL, '2026-06-12 12:01:29', '2026-06-12 12:01:29');

SET FOREIGN_KEY_CHECKS = 1;
