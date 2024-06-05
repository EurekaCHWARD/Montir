-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 03 Jun 2024 pada 07.20
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `be-montir`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admins`
--

DROP TABLE IF EXISTS `admins`;

CREATE TABLE `admins` (
  `id` varchar(16) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `admins`
--

INSERT INTO `admins` (`id`, `email`, `username`, `password`) VALUES
('2IEeKHYlYD0w7cmI', 'eureka69@gmail.com', 'Eureka69', '$2b$10$WJs/lNJTK2sEPwmz4NcL7uh3Gtz7kkPf6P0radHEEcgda6W0rnfD6'),
('d9xyA8QJ1AUR9o5B', 'johndoe@gmail.com', 'JohnDoe', '$2b$10$6sa9aOQYLm.OdMclr18mIOAFra0.53MLmGuzrSLC2K64Z53uhkUGm'),
('QyfZv0ASSkC10p9a', 'eureka@gmail.com', 'Eureka', '$2b$10$sDcPxEZinTgGaDi6CHBYc.bUBqIkHaozYCCsmi/Ll3rbPI3Ms8yk.');

-- --------------------------------------------------------

--
-- Struktur dari tabel `datas`
--

DROP TABLE IF EXISTS `datas`;

CREATE TABLE `datas` (
  `id` int(11) NOT NULL,
  `user_id` varchar(16) NOT NULL,
  `age` int(2) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `gender` tinyint(1) DEFAULT NULL,
  `bmi` float DEFAULT NULL,
  `stress_level` int(2) NOT NULL,
  `sleep_duration` float NOT NULL,
  `date` date NOT NULL DEFAULT (CURRENT_DATE())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` varchar(16) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `age` int(2) NOT NULL,
  `city` varchar(255) NOT NULL,
  `gender` tinyint(1) NOT NULL,
  `height` float NOT NULL,
  `weight` float NOT NULL,
  `bmi` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `datas`
--
ALTER TABLE `datas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `datas`
--
ALTER TABLE `datas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `datas`
--
ALTER TABLE `datas`
  ADD CONSTRAINT `datas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
