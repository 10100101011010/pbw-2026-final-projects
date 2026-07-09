# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# 🎓 Campus Information Portal CMS

> A modern Content Management System (CMS) for managing campus announcements, news, events, scholarships, academic calendars, and circular letters.

---

# 📖 Overview

Campus Information Portal CMS adalah aplikasi berbasis React dan Supabase yang dirancang untuk memudahkan administrator kampus dalam mengelola seluruh informasi akademik maupun non-akademik melalui satu dashboard.

Sistem ini memisahkan aplikasi menjadi dua bagian utama:

- Public Website
- Admin Dashboard

Public Website digunakan oleh mahasiswa maupun pengunjung untuk membaca informasi.

Admin Dashboard digunakan administrator untuk melakukan pengelolaan konten.

---

# 🎯 Objectives

Project ini dibuat untuk:

- Mengelola informasi kampus secara terpusat.
- Mempermudah publikasi berita.
- Mengurangi proses upload manual.
- Menyediakan dashboard administrasi.
- Menyediakan sistem attachment dokumen.
- Menampilkan informasi berdasarkan kategori.

---

# 🚀 Main Features

## Public Website

- Home Page
- Latest Posts
- Category Section
- Search Article
- Detail Post
- Related Posts
- Recent Posts
- Attachment Download
- Pagination
- Category Page

---

## Admin Dashboard

- Login
- Dashboard
- CRUD Categories
- CRUD Posts
- Rich Text Editor
- Cover Image
- Attachment Management
- Publish Draft Archive
- Search
- Statistics

---

# 🛠 Technology Stack

## Frontend

- React JS
- React Router DOM
- Tailwind CSS
- TipTap Editor

## Backend

- Supabase

## Database

- PostgreSQL

## Authentication

- Supabase Auth

## Storage

- Supabase Storage (planned)

---

# 📁 Project Structure

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
└── App.jsx
```

Penjelasan lengkap terdapat pada:

```
FOLDER_STRUCTURE.md
```

---

# 📚 Documentation

Project documentation:

- README.md
- PRD.md
- DATABASE.md
- ARCHITECTURE.md
- USERFLOW.md
- FEATURES.md
- API.md
- SERVICES.md
- COMPONENTS.md
- HOOKS.md
- WORKFLOW.md
- DEVELOPER_GUIDE.md
- ADMIN_GUIDE.md
- CODE_EXPLANATION.md

---

# ⚙ Installation

Clone repository

```bash
git clone <repository-url>
```

Masuk folder project

```bash
cd campus-portal-cms
```

Install dependency

```bash
npm install
```

Jalankan project

```bash
npm run dev
```

---

# Environment Variables

Buat file

```
.env
```

Contoh

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

# Roles

Administrator dapat:

- Login
- Membuat kategori
- Membuat artikel
- Mengedit artikel
- Menghapus artikel
- Mengupload attachment
- Publish artikel

User umum dapat:

- Membaca artikel
- Download attachment
- Search artikel
- Filter kategori

---

# Database

Menggunakan PostgreSQL pada Supabase.

Tabel utama:

- users
- categories
- posts
- attachments

Relasi database dijelaskan pada:

```
DATABASE.md
```

---

# Current Status

✅ Authentication

✅ Dashboard

✅ CRUD Category

✅ CRUD Post

✅ Rich Text Editor

✅ Search

✅ Pagination

✅ Related Posts

✅ Recent Posts

✅ Attachments

✅ Category Filter

---

# Future Development

- Upload ke Supabase Storage
- Dashboard Analytics
- Dark Mode
- Toast Notification
- View Counter
- Role Management
- Featured Posts
- SEO Optimization

---

# Author

Sandy Rizqul Akbar

Information Systems

Universitas Gunadarma

2026