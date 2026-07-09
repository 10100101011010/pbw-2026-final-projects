# ARCHITECTURE.md

# System Architecture

---

# Project Name

Campus Information Portal CMS

Version 1.0

---

# 1. Overview

Campus Information Portal CMS merupakan aplikasi web berbasis React JS dan Supabase yang menggunakan arsitektur Client-Server.

Frontend bertanggung jawab terhadap tampilan dan interaksi pengguna, sedangkan Supabase bertanggung jawab terhadap autentikasi, database PostgreSQL, dan penyimpanan data.

Sistem dibangun menggunakan pendekatan modular sehingga setiap bagian memiliki tanggung jawab yang jelas.

---

# 2. High Level Architecture

                    Browser

                        │

                        ▼

                 React Application

                        │

        ┌───────────────┼───────────────┐

        ▼               ▼               ▼

   React Router      Components      Context

                        │

                        ▼

                     Hooks

                        │

                        ▼

                    Services

                        │

                        ▼

                 Supabase Client

                        │

        ┌───────────────┼───────────────┐

        ▼               ▼               ▼

 Authentication     PostgreSQL      Storage

---

# 3. Architecture Style

Project menggunakan arsitektur Layered Architecture.

Setiap layer memiliki tanggung jawab masing-masing.

Presentation Layer

↓

Business Logic Layer

↓

Service Layer

↓

Database Layer

---

# 4. Layer Explanation

## Presentation Layer

Folder:

src/pages

src/components

Berfungsi sebagai tampilan website.

Layer ini tidak berhubungan langsung dengan database.

Tugasnya:

- Menampilkan data
- Mengambil input user
- Memanggil Hook

---

## Business Logic Layer

Folder:

src/hooks

Hook bertugas:

- Mengambil data
- Loading State
- Error Handling
- State Management

Hook menjadi penghubung antara Component dan Service.

---

## Service Layer

Folder:

src/services

Layer ini berhubungan langsung dengan Supabase.

Semua query database berada pada layer ini.

Contoh:

postService

categoryService

attachmentService

---

## Database Layer

Supabase PostgreSQL

Semua data disimpan dalam:

- users
- posts
- categories
- attachments

---

# 5. Frontend Architecture

Frontend dibangun menggunakan React JS.

Struktur:

React

↓

React Router

↓

Layouts

↓

Pages

↓

Components

↓

Hooks

↓

Services

↓

Supabase

---

# 6. Routing Architecture

Public Website

/

↓

Home

/news

↓

News Page

/events

↓

Events Page

/post/:slug

↓

Detail Post

/search

↓

Search Result

---

Admin

/admin/login

↓

Login

/admin/dashboard

↓

Dashboard

/admin/posts

↓

Posts

/admin/categories

↓

Categories

/admin/settings

↓

Settings

---

# 7. Folder Responsibility

components

Reusable UI Component.

hooks

Mengelola state dan data fetching.

layouts

Template halaman.

pages

Halaman utama.

router

Routing aplikasi.

services

CRUD Database.

utils

Utility Function.

contexts

Authentication & Theme.

styles

Global CSS.

supabase

Konfigurasi Supabase Client.

---

# 8. Data Flow

Administrator membuat artikel.

↓

Component menerima input.

↓

Hook memanggil Service.

↓

Service menjalankan Query Supabase.

↓

Supabase menyimpan data.

↓

Service mengembalikan data.

↓

Hook memperbarui State.

↓

Component melakukan Render.

---

# 9. Authentication Flow

Admin

↓

Login Form

↓

AuthContext

↓

Supabase Auth

↓

JWT Session

↓

Protected Route

↓

Dashboard

---

# 10. Public Flow

Visitor

↓

Home

↓

Search / Category

↓

Post Detail

↓

Attachment

---

# 11. Database Communication

React tidak pernah mengakses database secara langsung.

Semua komunikasi dilakukan melalui:

Service

↓

Supabase Client

↓

REST API

↓

PostgreSQL

---

# 12. Component Communication

Parent

↓

Props

↓

Child

↓

Event

↓

Parent

Tidak menggunakan Redux karena ukuran project masih menengah.

State dikelola menggunakan React Hook.

---

# 13. Attachment Flow

Administrator

↓

Input URL Attachment

↓

Create Post

↓

Attachment Service

↓

attachments Table

↓

Post Detail

↓

Download File

---

# 14. Category Flow

Administrator

↓

Category

↓

Post

↓

Category Filter

↓

Homepage

↓

Category Page

---

# 15. Search Flow

User

↓

Search Bar

↓

Hook

↓

postService.search()

↓

Supabase

↓

Result

↓

Search Page

---

# 16. Dashboard Flow

Dashboard

↓

Statistics Service

↓

Posts

↓

Categories

↓

Dashboard Card

---

# 17. Advantages

Modular.

Reusable Component.

Easy Maintenance.

Scalable.

Easy Testing.

Clear Separation of Responsibility.

---

# 18. Future Architecture

Planned Improvements

Supabase Storage

↓

Image Upload

Multi Role

↓

Admin

Editor

Super Admin

Analytics

↓

Dashboard

Email Notification

↓

SMTP

Push Notification

↓

Firebase

---

# 19. Conclusion

Project menggunakan arsitektur modular berbasis React dan Supabase.

Seluruh logika aplikasi dipisahkan ke dalam beberapa layer sehingga memudahkan proses pengembangan, debugging, serta penambahan fitur baru di masa mendatang.

Dengan struktur ini setiap folder memiliki tanggung jawab yang jelas sehingga project mudah dipahami baik oleh developer baru maupun developer yang melanjutkan pengembangan.