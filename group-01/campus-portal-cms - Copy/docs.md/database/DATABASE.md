# ============================================================
# 009_storage_setup.md
# Supabase Storage Configuration
# Campus Information Portal CMS
# ============================================================

## Tujuan

Supabase Storage digunakan untuk menyimpan file fisik.

Database hanya menyimpan metadata seperti:

- file_name
- file_path
- file_size
- file_type

Sedangkan file asli berada di Storage Bucket.

---

# Bucket

Project menggunakan 2 bucket.

## 1. attachments

Digunakan untuk menyimpan:

- PDF
- DOCX
- XLSX
- PPTX
- ZIP
- Gambar Lampiran

Contoh:

attachments/

├── announcements/
│   └── surat-edaran.pdf
│
├── news/
│   └── poster.jpg
│
├── events/
│   └── seminar-ai.pdf
│
└── scholarships/
    └── syarat.pdf

Visibility:

Private

Karena file akan diakses menggunakan Supabase API.

---

## 2. avatars

Digunakan untuk:

Foto Admin
Foto Editor

Contoh

avatars/

admin1.jpg

editor1.png

Visibility:

Public

Karena avatar akan ditampilkan di dashboard.

---

# Folder Structure

attachments/

announcements/

news/

events/

scholarships/

academic-calendar/

circular-letters/

---

# Upload Flow

Admin memilih file

↓

React Upload

↓

Supabase Storage

↓

Storage menghasilkan path

↓

Database menyimpan:

file_name

file_path

file_size

file_type

---

# Download Flow

User klik

"Download Surat"

↓

React membaca

attachments.file_path

↓

Supabase membuat Signed URL

↓

Browser download file

---

# Allowed File Types

PDF

DOCX

DOC

XLSX

XLS

PPTX

ZIP

PNG

JPG

JPEG

WEBP

---

# Maksimum Ukuran

Image

5 MB

Document

20 MB

ZIP

50 MB

---

# Naming Convention

Gunakan nama acak (UUID).

Contoh

550e8400-e29b-41d4.pdf

Jangan memakai:

Surat Edaran Final Revisi Banget.pdf

Karena rawan konflik nama.

---

# Keamanan

Storage Bucket:

attachments

Private

Semua akses dilakukan melalui Signed URL.

Storage Bucket:

avatars

Public

Karena hanya berisi foto profil.

---

# Future Improvements

- Image Compression
- Automatic Thumbnail
- Multiple Image Gallery
- Drag & Drop Upload
- Versioning File
- File Preview

# DATABASE.md

# Campus Information Portal CMS

Database Documentation

Version 1.0

---

# Overview

Database menggunakan PostgreSQL yang disediakan oleh Supabase.

Seluruh data aplikasi disimpan secara terstruktur menggunakan relational database sehingga setiap tabel saling berhubungan menggunakan Foreign Key.

Database dirancang agar mudah dikembangkan apabila di masa mendatang ditambahkan fitur seperti komentar, tag, multi user, analytics, maupun notification.

---

# Database Engine

Database

PostgreSQL

Platform

Supabase

---

# Database Tables

Sistem menggunakan empat tabel utama.

1. users

2. categories

3. posts

4. attachments

Hubungan antar tabel bersifat relational.

---

# Entity Relationship Diagram (ERD)

users

│

├──────────────┐

│              │

▼              │

posts          │

│              │

│              │

▼              │

attachments    │

▲

│

categories

---

# Table : users

Digunakan untuk menyimpan informasi administrator.

Kolom

id

UUID

Primary Key

---

full_name

TEXT

Nama lengkap administrator.

---

email

TEXT

Email login administrator.

---

password

Disimpan menggunakan Supabase Authentication.

---

created_at

Timestamp

---

updated_at

Timestamp

---

Primary Key

id

---

Relationship

users (1)

↓

posts (Many)

---

# Table : categories

Digunakan untuk mengelompokkan artikel.

Contoh kategori:

Announcements

News

Events

Scholarships

Academic Calendar

Circular Letters

---

Kolom

id

UUID

Primary Key

---

name

TEXT

Nama kategori.

---

slug

TEXT

Digunakan pada URL.

Contoh

/news

/events

---

created_at

Timestamp

---

updated_at

Timestamp

---

Primary Key

id

---

Relationship

categories (1)

↓

posts (Many)

---

# Table : posts

Merupakan tabel utama.

Seluruh artikel disimpan pada tabel ini.

---

Kolom

id

UUID

Primary Key

---

title

TEXT

Judul artikel.

---

slug

TEXT

Slug URL.

Contoh

/pengumuman-libur

---

excerpt

TEXT

Ringkasan artikel.

---

content

TEXT

Isi artikel.

---

category_id

UUID

Foreign Key

↓

categories.id

---

author_id

UUID

Foreign Key

↓

users.id

---

cover_url

TEXT

URL Cover Image.

---

status

TEXT

Nilai

draft

published

archived

---

published_at

Timestamp

---

created_at

Timestamp

---

updated_at

Timestamp

---

Relationship

posts (1)

↓

attachments (Many)

---

# Table : attachments

Digunakan untuk menyimpan dokumen.

Contoh

PDF

DOCX

XLSX

ZIP

Link Google Drive

dan sebagainya.

---

Kolom

id

UUID

Primary Key

---

post_id

UUID

Foreign Key

↓

posts.id

---

file_name

TEXT

Nama file.

---

file_path

TEXT

Lokasi file.

Saat ini digunakan untuk URL.

Ke depan dapat digunakan untuk Supabase Storage.

---

file_url

TEXT

URL file.

---

file_type

TEXT

Ekstensi file.

Contoh

pdf

docx

xlsx

---

file_size

BIGINT

Ukuran file.

---

created_at

Timestamp

---

updated_at

Timestamp

---

Relationship

posts (1)

↓

attachments (Many)

---

# Foreign Keys

posts.category_id

↓

categories.id

---

posts.author_id

↓

users.id

---

attachments.post_id

↓

posts.id

---

# Cascade Rules

Attachment

ON DELETE CASCADE

Artinya

Apabila sebuah Post dihapus

↓

Seluruh Attachment ikut dihapus.

---

# Trigger

Semua tabel memiliki trigger

set_updated_at()

Tujuan

Mengubah updated_at secara otomatis setiap data diupdate.

---

# Index

posts

slug

category_id

status

published_at

---

categories

slug

---

attachments

post_id

---

# CRUD Flow

Administrator

↓

Create Post

↓

posts

↓

Create Attachment

↓

attachments

↓

Publish

↓

Website

---

# Category Flow

Administrator

↓

Category

↓

Post

↓

Homepage

↓

Category Section

↓

Detail

---

# Search Flow

Search

↓

posts.title

OR

posts.content

↓

Result

---

# Publish Flow

Draft

↓

Publish

↓

published_at diisi otomatis

↓

Homepage

---

# Attachment Flow

Administrator

↓

Tambah URL File

↓

attachments

↓

Detail Post

↓

Download

---

# Data Integrity

Setiap Post wajib memiliki:

Title

Category

Status

Slug

---

Setiap Attachment wajib memiliki:

Post

Nama File

File Path

URL File

---

# Current Database

Tables

4

Relationships

3

Primary Keys

4

Foreign Keys

3

Triggers

4

Indexes

Beberapa

---

# Future Tables

comments

tags

post_tags

notifications

analytics

roles

permissions

bookmarks

media

settings

---

# Future Improvements

Supabase Storage

Image Compression

Attachment Versioning

Recycle Bin

Soft Delete

Audit Log

Role Permission

---

# Conclusion

Database dirancang menggunakan konsep Relational Database sehingga setiap entitas saling terhubung menggunakan Foreign Key.

Dengan struktur ini proses CRUD menjadi lebih mudah, performa query tetap baik, serta database siap dikembangkan menjadi sistem yang lebih besar di masa mendatang.