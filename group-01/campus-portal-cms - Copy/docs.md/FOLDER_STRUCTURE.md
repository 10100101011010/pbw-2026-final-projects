# FOLDER_STRUCTURE.md

# Campus Information Portal CMS

Folder Structure Documentation

Version 1.0

---

# Overview

Project menggunakan struktur modular.

Setiap folder memiliki tanggung jawab tertentu sehingga kode lebih mudah dipelihara, dibaca, dan dikembangkan.

```
src
│
├── components
├── contexts
├── hooks
├── layouts
├── pages
├── router
├── services
├── styles
├── supabase
├── utils
│
├── App.jsx
└── main.jsx
```

---

# Root Folder

Folder src merupakan pusat seluruh source code aplikasi.

Seluruh komponen aplikasi berada di dalam folder ini.

---

# main.jsx

Merupakan entry point aplikasi.

Tugas:

- Merender React
- Memasang ThemeProvider
- Memasang AuthProvider
- Menjalankan App

Alur

Browser

↓

main.jsx

↓

App.jsx

---

# App.jsx

Merupakan root component.

Tugas:

- Menghubungkan seluruh Context
- Menjalankan Router

Alur

App

↓

Theme Provider

↓

Auth Provider

↓

App Router

---

# components/

Folder ini berisi seluruh komponen yang dapat digunakan kembali (Reusable Component).

Komponen tidak mengambil data secara langsung dari database.

Komponen hanya menerima data melalui Props.

Struktur

```
components

admin/

common/

editor/

public/
```

---

# components/admin

Komponen khusus Dashboard Administrator.

Contoh

Sidebar

Dashboard Header

Dashboard Card

Data Table

Confirm Dialog

Stat Card

Recent Post Table

Digunakan oleh

Admin Layout

Dashboard

Posts

Categories

---

# components/common

Komponen umum yang digunakan baik oleh Admin maupun Public.

Contoh

Button

Input

Textarea

Select

Pagination

Loading

Modal

Toast

Breadcrumb

Keuntungan

Mengurangi duplikasi kode.

---

# components/editor

Berisi Rich Text Editor.

Saat ini menggunakan TipTap.

Digunakan pada

Create Post

Edit Post

---

# components/public

Komponen Website Publik.

Contoh

Navbar

Footer

Hero Banner

Post Card

Category Badge

Category Section

Sidebar Posts

Related Posts

Search Bar

Share Button

Section Title

---

# contexts/

Berisi Global State.

Saat ini

AuthContext

ThemeContext

Digunakan agar data dapat diakses oleh seluruh aplikasi.

---

# AuthContext

Mengelola

Login

Logout

Current User

Session

Protected Route

---

# ThemeContext

Mengatur

Light Mode

Dark Mode

Tema Website

---

# hooks/

Hook bertugas mengambil data.

Hook tidak berhubungan langsung dengan tampilan.

Contoh

useLatestPosts

useCategoryPosts

useCategories

Hook memanggil

↓

Service

↓

Supabase

↓

Return Data

↓

Component

---

# layouts/

Template halaman.

Digunakan agar Navbar, Sidebar, Footer tidak ditulis berulang.

Saat ini

Public Layout

Admin Layout

---

# Public Layout

Memiliki

Navbar

Footer

Outlet

---

# Admin Layout

Memiliki

Sidebar

Header

Outlet

---

# pages/

Berisi seluruh halaman aplikasi.

Halaman dibagi menjadi dua bagian.

```
pages

admin/

public/
```

---

# pages/admin

Halaman Dashboard Administrator.

Contoh

Dashboard

Posts

Categories

Create Post

Edit Post

Profile

Settings

Login

---

# pages/public

Halaman Website.

Contoh

Home

Detail

Search

News

Events

Announcements

Academic Calendar

Scholarships

Circular Letters

---

# router/

Mengatur seluruh routing aplikasi.

Saat ini terdiri dari

AppRouter

ProtectedRoute

PublicRoute

---

# AppRouter

Mendaftarkan seluruh URL aplikasi.

Contoh

/

/news

/events

/admin/dashboard

/post/:slug

---

# ProtectedRoute

Melindungi halaman administrator.

Jika belum login

↓

Redirect Login

---

# services/

Merupakan layer yang berhubungan langsung dengan database.

Semua query Supabase berada di sini.

Saat ini

postService

categoryService

attachmentService

publicPostService

---

# postService

Mengelola

CRUD Post

Search

Publish

Archive

Related

Recent

Category

---

# categoryService

Mengelola

CRUD Category

Total Category

---

# attachmentService

Mengelola

Attachment

Create

Update

Delete

Download

---

# publicPostService

Mengelola data yang digunakan Website Publik.

Contoh

Latest Post

Category Post

Detail

---

# styles/

Berisi CSS Global.

Saat ini

index.css

Menggunakan Tailwind CSS.

---

# supabase/

Konfigurasi koneksi database.

Saat ini

supabaseClient.js

Tugas

Membuat koneksi React

↓

Supabase

---

# utils/

Utility Function.

Berisi fungsi yang dapat digunakan kembali.

Contoh

slugify

generateSlug

formatDate

readingTime

mergePostsCategory

Utility tidak bergantung pada React.

---

# Folder Relationship

pages

↓

components

↓

hooks

↓

services

↓

supabase

↓

database

---

# Data Flow

Browser

↓

Router

↓

Page

↓

Component

↓

Hook

↓

Service

↓

Supabase

↓

Database

↓

Service

↓

Hook

↓

Component

↓

Browser

---

# Design Principle

Project menggunakan prinsip

Single Responsibility Principle

Setiap folder hanya memiliki satu tanggung jawab.

Contoh

Components

↓

UI

Hooks

↓

Business Logic

Services

↓

Database

Utils

↓

Helper Function

---

# Advantages

Modular

Reusable

Scalable

Maintainable

Easy Debugging

Easy Testing

Easy Collaboration

---

# Future Folder

assets

constants

config

types

middleware

storage

analytics

notification

---

# Conclusion

Struktur folder Campus Information Portal CMS dirancang menggunakan pendekatan modular sehingga setiap folder memiliki tanggung jawab yang jelas.

Dengan struktur ini proses pengembangan, debugging, serta penambahan fitur baru menjadi lebih mudah dibandingkan menggunakan struktur monolitik.