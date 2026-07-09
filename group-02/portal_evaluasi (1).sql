-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 09, 2026 at 11:22 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `portal_evaluasi`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `nama` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `nama`) VALUES
(1, 'admin', '202cb962ac59075b964b07152d234b70', 'Administrator');

-- --------------------------------------------------------

--
-- Table structure for table `dosen`
--

CREATE TABLE `dosen` (
  `id` int(11) NOT NULL,
  `nidn` varchar(20) DEFAULT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `departemen` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dosen`
--

INSERT INTO `dosen` (`id`, `nidn`, `nama`, `departemen`) VALUES
(1, '1010101', 'Dr. Ahmad Fauzi', 'Sistem Komputer'),
(2, '1010102', 'Dr. Siti Rahayu, M.Si.', 'Sistem Informasi'),
(3, '1010103', 'Dr. Budi Wijaya, M.T.', 'Sistem Komputer'),
(4, '1010104', 'Dr. Dewi Lestari, M.Pd.', 'Sistem Informasi'),
(5, '1010105', 'Dr. Rizky Fadillah, M.Eng.', 'Teknik Komputer'),
(6, '1010106', 'Dr. Citra Amelia, M.Kom.', 'Sistem Informasi'),
(7, '1010107', 'Dr. Andi Pratama, M.Sc.', 'Sistem Informasi'),
(8, '1010108', 'Dr. Maya Sari, M.T.', 'Teknik Komputer'),
(9, '1010109', 'Dr. Dedi Kurniawan, M.Kom.', 'Teknik Komputer');

-- --------------------------------------------------------

--
-- Table structure for table `evaluasi_dosen`
--

CREATE TABLE `evaluasi_dosen` (
  `id` int(11) NOT NULL,
  `mahasiswa_id` int(11) DEFAULT NULL,
  `dosen_id` int(11) DEFAULT NULL,
  `semester` varchar(20) DEFAULT NULL,
  `nilai_pengajaran` int(11) DEFAULT NULL CHECK (`nilai_pengajaran` between 1 and 5),
  `nilai_komunikasi` int(11) DEFAULT NULL CHECK (`nilai_komunikasi` between 1 and 5),
  `nilai_kedisiplinan` int(11) DEFAULT NULL CHECK (`nilai_kedisiplinan` between 1 and 5),
  `komentar` text DEFAULT NULL,
  `tanggal` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evaluasi_dosen`
--

INSERT INTO `evaluasi_dosen` (`id`, `mahasiswa_id`, `dosen_id`, `semester`, `nilai_pengajaran`, `nilai_komunikasi`, `nilai_kedisiplinan`, `komentar`, `tanggal`) VALUES
(13, 1, 1, 'Ganjil 2025/2026', 5, 4, 5, 'aka', '2026-07-07 11:13:38'),
(14, 3, 1, 'Ganjil 2025/2026', 5, 5, 5, 'y', '2026-07-07 11:17:15');

-- --------------------------------------------------------

--
-- Table structure for table `kelas`
--

CREATE TABLE `kelas` (
  `id` int(11) NOT NULL,
  `nama` varchar(50) DEFAULT NULL,
  `semester` varchar(20) DEFAULT NULL,
  `tahun_akademik` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kelas`
--

INSERT INTO `kelas` (`id`, `nama`, `semester`, `tahun_akademik`) VALUES
(1, '1KA20', 'Ganjil', '2025/2026'),
(2, '2KA34', 'Genap', '2025/2026'),
(3, '1KA19', 'Ganjil', '2025/2026'),
(4, '1DC24', 'Genap', '2025/2026'),
(5, '1KB28', 'Ganjil', '2025/2026'),
(6, '3DC08', 'Ganjil', '2025/2026'),
(7, '2KB04', 'Genap', '2025/2026'),
(8, '3KB11', 'Genap', '2025/2026'),
(9, '3DC02', 'Genap', '2025/2026'),
(10, '1KA34', 'Ganjil', '2023/2024');

-- --------------------------------------------------------

--
-- Table structure for table `mahasiswa`
--

CREATE TABLE `mahasiswa` (
  `id` int(11) NOT NULL,
  `npm` varchar(20) DEFAULT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `semester` varchar(20) DEFAULT NULL,
  `kelas_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mahasiswa`
--

INSERT INTO `mahasiswa` (`id`, `npm`, `nama`, `password`, `semester`, `kelas_id`) VALUES
(1, '10124226', 'Ayay', '202cb962ac59075b964b07152d234b70', 'Ganjil 2025/2026', 2),
(2, '10124669', 'Ulul', '202cb962ac59075b964b07152d234b70', 'Ganjil 2025/2026', 1),
(3, '11124084', 'Mpruy', '202cb962ac59075b964b07152d234b70', 'Ganjil 2025/2026', 3),
(4, '11124435', 'Minul', '202cb962ac59075b964b07152d234b70', 'Ganjil 2025/2026', 4),
(5, '10124456', 'Kikihengkerpro', '202cb962ac59075b964b07152d234b70', 'Ganjil 2025/2026', 7),
(6, '11124667', 'Sucipto', '202cb962ac59075b964b07152d234b70', 'Ganjil 2025/2026', 6);

-- --------------------------------------------------------

--
-- Table structure for table `matakuliah`
--

CREATE TABLE `matakuliah` (
  `id` int(11) NOT NULL,
  `kode` varchar(10) DEFAULT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `sks` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `matakuliah`
--

INSERT INTO `matakuliah` (`id`, `kode`, `nama`, `sks`) VALUES
(1, 'IT011328', 'Struktur dan Organisasi Data', 3),
(2, 'IT000201 ', 'Teknologi Kecerdasan Artificial', 2),
(3, 'IT012235', 'Sistem Digital', 2),
(4, 'IT014213 ', 'Matematika Informatika', 2),
(5, 'IT014347', 'Organisasi dan Arsitektur Komputer', 3),
(6, 'IT011211 ', 'Matematika Dasar 2', 2),
(7, 'IT011325 ', 'Sistem Operasi', 3),
(8, 'IT012283', 'Statistika dan Probabilitas Terapan ', 2);

-- --------------------------------------------------------

--
-- Table structure for table `pengampu_kelas`
--

CREATE TABLE `pengampu_kelas` (
  `id` int(11) NOT NULL,
  `dosen_id` int(11) DEFAULT NULL,
  `matkul_id` int(11) DEFAULT NULL,
  `kelas_id` int(11) DEFAULT NULL,
  `semester` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengampu_kelas`
--

INSERT INTO `pengampu_kelas` (`id`, `dosen_id`, `matkul_id`, `kelas_id`, `semester`) VALUES
(46, 1, 1, 1, 'Ganjil 2025/2026'),
(73, 1, 1, 2, 'Ganjil 2025/2026'),
(49, 1, 4, 2, 'Ganjil 2025/2026'),
(67, 1, 6, 8, 'Ganjil 2025/2026'),
(60, 1, 7, 5, 'Ganjil 2025/2026'),
(62, 2, 1, 6, 'Ganjil 2025/2026'),
(70, 2, 1, 9, 'Ganjil 2025/2026'),
(47, 2, 2, 1, 'Ganjil 2025/2026'),
(74, 2, 2, 2, 'Ganjil 2025/2026'),
(50, 2, 5, 2, 'Ganjil 2025/2026'),
(63, 3, 2, 6, 'Ganjil 2025/2026'),
(71, 3, 2, 9, 'Ganjil 2025/2026'),
(48, 3, 3, 1, 'Ganjil 2025/2026'),
(75, 3, 3, 2, 'Ganjil 2025/2026'),
(52, 3, 7, 3, 'Ganjil 2025/2026'),
(55, 4, 2, 4, 'Ganjil 2025/2026'),
(51, 4, 6, 2, 'Ganjil 2025/2026'),
(68, 4, 7, 8, 'Ganjil 2025/2026'),
(58, 5, 5, 5, 'Ganjil 2025/2026'),
(53, 5, 8, 3, 'Ganjil 2025/2026'),
(69, 5, 8, 8, 'Ganjil 2025/2026'),
(54, 6, 1, 3, 'Ganjil 2025/2026'),
(72, 6, 3, 9, 'Ganjil 2025/2026'),
(61, 6, 8, 6, 'Ganjil 2025/2026'),
(56, 7, 3, 4, 'Ganjil 2025/2026'),
(64, 7, 3, 7, 'Ganjil 2025/2026'),
(57, 8, 4, 4, 'Ganjil 2025/2026'),
(65, 8, 4, 7, 'Ganjil 2025/2026'),
(66, 9, 5, 7, 'Ganjil 2025/2026'),
(59, 9, 6, 5, 'Ganjil 2025/2026');

-- --------------------------------------------------------

--
-- Table structure for table `setting_evaluasi`
--

CREATE TABLE `setting_evaluasi` (
  `id` int(11) NOT NULL,
  `kategori` varchar(20) DEFAULT NULL,
  `pertanyaan` text DEFAULT NULL,
  `aktif` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `setting_evaluasi`
--

INSERT INTO `setting_evaluasi` (`id`, `kategori`, `pertanyaan`, `aktif`) VALUES
(1, 'dosen', 'Dosen menguasai materi dengan baik.', 1),
(2, 'dosen', 'Dosen menjelaskan materi dengan jelas.', 1),
(3, 'dosen', 'Dosen hadir tepat waktu.', 1),
(4, 'dosen', 'Dosen memberikan kesempatan bertanya.', 1),
(5, 'dosen', 'Dosen bersikap profesional.', 1),
(6, 'dosen', 'Dosen memberikan penilaian secara objektif.', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `dosen`
--
ALTER TABLE `dosen`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nidn` (`nidn`);

--
-- Indexes for table `evaluasi_dosen`
--
ALTER TABLE `evaluasi_dosen`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mahasiswa_id` (`mahasiswa_id`,`dosen_id`,`semester`),
  ADD KEY `dosen_id` (`dosen_id`);

--
-- Indexes for table `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nama` (`nama`);

--
-- Indexes for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `npm` (`npm`),
  ADD KEY `kelas_id` (`kelas_id`);

--
-- Indexes for table `matakuliah`
--
ALTER TABLE `matakuliah`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode` (`kode`);

--
-- Indexes for table `pengampu_kelas`
--
ALTER TABLE `pengampu_kelas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dosen_id` (`dosen_id`,`matkul_id`,`kelas_id`,`semester`),
  ADD KEY `matkul_id` (`matkul_id`),
  ADD KEY `kelas_id` (`kelas_id`);

--
-- Indexes for table `setting_evaluasi`
--
ALTER TABLE `setting_evaluasi`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `dosen`
--
ALTER TABLE `dosen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `evaluasi_dosen`
--
ALTER TABLE `evaluasi_dosen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `matakuliah`
--
ALTER TABLE `matakuliah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `pengampu_kelas`
--
ALTER TABLE `pengampu_kelas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `setting_evaluasi`
--
ALTER TABLE `setting_evaluasi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `evaluasi_dosen`
--
ALTER TABLE `evaluasi_dosen`
  ADD CONSTRAINT `evaluasi_dosen_ibfk_1` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluasi_dosen_ibfk_2` FOREIGN KEY (`dosen_id`) REFERENCES `dosen` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD CONSTRAINT `mahasiswa_ibfk_1` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `pengampu_kelas`
--
ALTER TABLE `pengampu_kelas`
  ADD CONSTRAINT `pengampu_kelas_ibfk_1` FOREIGN KEY (`dosen_id`) REFERENCES `dosen` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pengampu_kelas_ibfk_2` FOREIGN KEY (`matkul_id`) REFERENCES `matakuliah` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pengampu_kelas_ibfk_3` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
