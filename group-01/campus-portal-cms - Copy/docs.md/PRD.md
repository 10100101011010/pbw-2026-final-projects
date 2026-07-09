# PRD.md

# Product Requirements Document

---

# Project Information

## Project Name

Campus Information Portal CMS

---

## Version

1.0

---

## Author

Sandy Rizqul Akbar

Universitas Gunadarma

Information Systems

2026

---

# 1. Background

Sebagian besar kampus masih menyebarkan informasi menggunakan berbagai media yang terpisah, seperti website, grup WhatsApp, Telegram, email, maupun media sosial. Hal ini menyebabkan informasi sulit dicari, tidak terstruktur, dan sering terlewat oleh mahasiswa.

Administrator juga mengalami kesulitan dalam mengelola berbagai jenis informasi karena harus menggunakan sistem yang berbeda-beda atau bahkan mengunggah informasi secara manual.

Oleh karena itu dibuat sebuah sistem bernama **Campus Information Portal CMS** sebagai pusat pengelolaan seluruh informasi kampus.

---

# 2. Problem Statement

Permasalahan utama yang ingin diselesaikan adalah:

- Informasi kampus tersebar di banyak media.
- Tidak ada sistem manajemen konten yang terpusat.
- Sulit mengelompokkan berita berdasarkan kategori.
- Dokumen kampus tidak terorganisir.
- Administrator membutuhkan proses upload yang lebih cepat.
- Mahasiswa kesulitan mencari informasi lama.

---

# 3. Objectives

Tujuan utama sistem ini adalah:

- Membuat portal informasi kampus yang terpusat.
- Mempermudah administrator mengelola konten.
- Menyediakan kategori informasi yang jelas.
- Menyediakan sistem attachment dokumen.
- Mempermudah mahasiswa mencari informasi.

---

# 4. Target Users

## Administrator

Administrator bertugas:

- Login
- Membuat kategori
- Membuat artikel
- Mengedit artikel
- Menghapus artikel
- Mengelola attachment
- Publish artikel

---

## Mahasiswa

Mahasiswa dapat:

- Membaca berita
- Mencari artikel
- Download dokumen
- Melihat kalender akademik
- Membaca surat edaran

---

## Pengunjung

Pengunjung umum dapat:

- Membaca informasi publik
- Search artikel
- Melihat event

---

# 5. Scope

## In Scope

### Authentication

- Login Administrator

---

### Category

- Create Category
- Update Category
- Delete Category
- List Category

---

### Post

- Create Post
- Edit Post
- Delete Post
- Publish
- Draft
- Archive

---

### Attachment

- Tambah Attachment
- Edit Attachment
- Delete Attachment
- Download Attachment

---

### Public Website

- Home
- Latest Posts
- Search
- Detail Post
- Related Posts
- Recent Posts
- Category Section
- Category Page

---

### Dashboard

- Total Posts
- Total Categories
- Total Draft
- Total Published

---

# 6. Out of Scope

Fitur yang belum termasuk:

- Multi Admin
- Notification
- Email Broadcast
- Comment
- Rating
- View Counter
- Analytics
- Push Notification

---

# 7. Functional Requirements

## Authentication

Administrator harus dapat login menggunakan email dan password.

---

## Category Management

Administrator harus dapat:

- Menambah kategori
- Mengubah kategori
- Menghapus kategori

---

## Post Management

Administrator harus dapat:

- Membuat artikel
- Menyimpan draft
- Publish artikel
- Archive artikel

---

## Attachment Management

Administrator dapat:

- Menambahkan link dokumen
- Menghapus attachment
- Mengubah attachment

---

## Search

Pengguna dapat mencari artikel berdasarkan:

- Judul
- Isi artikel

---

## Category Filter

Pengguna dapat melihat artikel berdasarkan kategori.

---

## Rich Text Editor

Administrator dapat membuat artikel menggunakan editor teks.

---

# 8. Non Functional Requirements

## Performance

- Halaman dimuat kurang dari 3 detik.
- Query database efisien.

---

## Security

- Authentication menggunakan Supabase Auth.
- Data administrator tidak dapat diakses publik.
- SQL Injection dicegah oleh Supabase.

---

## Availability

Website dapat diakses selama server aktif.

---

## Scalability

Sistem dapat dikembangkan menjadi:

- Multi User
- Multi Role
- Multi Campus

---

## Maintainability

Struktur project dipisahkan menjadi:

- Components
- Services
- Hooks
- Pages
- Layouts
- Utils

agar mudah dipelihara.

---

# 9. User Flow

Administrator

Login

↓

Dashboard

↓

Create Post

↓

Tambah Attachment

↓

Publish

↓

Website

---

Mahasiswa

Home

↓

Search

↓

Detail Post

↓

Download Attachment

---

# 10. Success Criteria

Project dianggap berhasil apabila:

- Administrator dapat mengelola seluruh konten.
- Artikel berhasil dipublikasikan.
- Attachment dapat diakses.
- Search berjalan.
- Kategori berjalan.
- Dashboard menampilkan statistik.
- Website responsif.

---

# 11. Risks

Risiko yang mungkin terjadi:

- Attachment rusak.
- URL dokumen tidak valid.
- Storage penuh.
- Kesalahan input administrator.

---

# 12. Future Improvements

- Upload langsung ke Supabase Storage
- Multi Role
- Analytics Dashboard
- Email Notification
- Featured Post
- SEO
- Dark Mode
- View Counter
- Comments
- Tags
- Bookmark
- Mobile Application

---

# 13. Conclusion

Campus Information Portal CMS merupakan sistem Content Management System berbasis React dan Supabase yang dirancang untuk mempermudah pengelolaan informasi kampus secara terpusat.

Dengan adanya sistem ini administrator dapat mengelola berita, pengumuman, kalender akademik, surat edaran, maupun dokumen lainnya secara lebih cepat, sedangkan mahasiswa dapat memperoleh informasi secara mudah melalui website publik.

Project ini dirancang menggunakan arsitektur modular sehingga mudah dikembangkan di masa mendatang.