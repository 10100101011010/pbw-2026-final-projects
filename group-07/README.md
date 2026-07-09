# Group 07 - Sport Center Gunadarma

Sistem penyewaan lapangan olahraga di Kampus H Universitas Gunadarma. Dibuat untuk tugas akhir mata kuliah Pemrograman Berbasis Web.

## Anggota Kelompok

Anggota:
- Arkaansyah Dharma Wangsa (10124199)
- Dzahwan Bintang Febrian (10124731)
- Muhammad Gibran Ramadhan (10124867)
- Muhammad Raihan Agam (10124940)

## Tentang Project

Sport Center Gunadarma adalah website untuk mahasiswa yang mau menyewa lapangan olahraga di kampus. Penyewaannya gratis, tidak ada pembayaran. Mahasiswa tinggal pilih lapangan, tentukan jadwal, lalu datang ke lokasi dengan membawa KTM untuk verifikasi ke petugas.

Ada 5 lapangan yang bisa disewa:
- Lapangan A, B, C (semi-outdoor, mendukung voli/basket/futsal tergantung fasilitasnya)
- Lapangan Badminton 1 dan 2 (indoor)

## Alur Penggunaan

1. Mahasiswa daftar akun pakai NPM, lalu login.
2. Pilih lapangan dan olahraga yang mau dimainkan, tentukan tanggal dan jam.
3. Sistem otomatis menolak kalau jadwalnya bentrok dengan booking lain, atau di luar jam operasional (Senin-Jumat 09.00-20.00, Sabtu 12.00-17.00, Minggu libur).
4. Setelah booking berhasil, sistem memberi kode booking unik.
5. Mahasiswa datang ke sport center pada jam yang sudah dipesan, tunjukkan kode booking dan KTM ke petugas.
6. Petugas (login sebagai admin) mengetik kode booking di panel admin, mencocokkan nama dan NPM yang muncul dengan KTM fisik, lalu menekan tombol konfirmasi.
7. Kalau ada pembatalan, hanya admin yang bisa membatalkan booking dan wajib menulis alasannya, supaya mahasiswa tahu kenapa booking-nya dibatalkan.

## Teknologi yang Dipakai

- PHP native back end
- MySQL untuk database
- HTML, Tailwind CSS, dan JavaScript murni untuk front end

## Cara Menjalankan

1. Buka phpMyAdmin add database 'sportcenter_db' Import file `.sql` yang ada di folder project ke database MySQL.
2. Sesuaikan pengaturan koneksi database di file konfigurasi kalau perlu.
3. Taruh folder project di dalam htdocs (kalau pakai XAMPP) atau www (kalau pakai Laragon).
4. Jalankan Apache dan MySQL, lalu buka project-nya lewat browser.

Akun admin sudah tersedia dari awal untuk keperluan demo. Akun mahasiswa harus daftar sendiri lewat halaman registrasi.
