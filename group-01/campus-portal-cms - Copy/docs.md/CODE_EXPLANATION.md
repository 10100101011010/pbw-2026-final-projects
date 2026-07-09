
# CODE_EXPLANATION.md

# Campus Information Portal CMS
## Complete Source Code Documentation

> Author: Sandy Rizqul Akbar
> Version: 1.0

---

# Introduction

Dokumen ini menjelaskan arsitektur dan fungsi setiap bagian source code pada project Campus Information Portal CMS.

Dokumentasi mencakup:

- Struktur project
- Alur data
- Penjelasan folder
- Penjelasan file
- Hubungan antar file
- Dependency
- Best Practice
- Cara pengembangan

---

# Overall Application Flow

Browser
↓
main.jsx
↓
App.jsx
↓
AppRouter
↓
Layout
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
PostgreSQL
↓
Service
↓
Hook
↓
Component
↓
Browser

---

# ROOT FILES

## src/main.jsx

### Fungsi
Entry point aplikasi React.

### Tanggung Jawab
- Membuat React Root
- Mengimpor CSS global
- Menjalankan App
- Mengaktifkan StrictMode

### Dipanggil Oleh
Browser

### Memanggil
- App.jsx
- styles/index.css

---

## src/App.jsx

### Fungsi
Root Component aplikasi.

### Tanggung Jawab
- Memasang ThemeProvider
- Memasang AuthProvider
- Menjalankan Router

---

# ROUTER

## router/AppRouter.jsx

Mengatur seluruh URL aplikasi.

### Public
- /
- /news
- /events
- /announcements
- /scholarships
- /academic-calendar
- /circular-letters
- /search
- /post/:slug

### Admin
- /admin/login
- /admin/dashboard
- /admin/posts
- /admin/posts/create
- /admin/posts/:id/edit
- /admin/categories
- /admin/profile
- /admin/settings

---

## router/ProtectedRoute.jsx

Melindungi seluruh halaman administrator.

---

## router/PublicRoute.jsx

Template route publik.

---

# LAYOUTS

## layouts/PublicLayout.jsx

Menampilkan:
- Navbar
- Outlet
- Footer

---

## layouts/AdminLayout.jsx

Menampilkan:
- Sidebar
- DashboardHeader
- Outlet

---

# CONTEXTS

## AuthContext.jsx

Mengelola:
- Login
- Logout
- Session
- Current User

---

## ThemeContext.jsx

Mengelola tema aplikasi.

---

# COMPONENTS

## components/common

Reusable component:

- Button
- Input
- Textarea
- Select
- Modal
- Pagination
- Toast
- LoadingSkeleton
- Breadcrumb
- EmptyState
- ErrorState

Semua hanya bertugas menampilkan UI dan menerima props.

---

## components/public

Komponen website publik:

- Navbar
- Footer
- HeroBanner
- SearchBar
- PostCard
- CategoryBadge
- CategorySection
- SidebarPosts
- RelatedPosts
- ShareButtons
- SectionTitle
- CategoryPostsPage

### Contoh: PostCard.jsx

Fungsi:
Menampilkan ringkasan artikel.

Digunakan oleh:
- Home
- Search
- Category
- Related Posts

Props:
- post

Menampilkan:
- Cover
- Category
- Title
- Excerpt
- Published Date

---

## components/admin

Komponen dashboard:

- Sidebar
- DashboardHeader
- DashboardCard
- StatCard
- DataTable
- ConfirmDialog
- RecentPostsTable

---

## components/editor

RichTextEditor berbasis TipTap.

---

# PAGES

## pages/public

Berisi seluruh halaman website publik.

Contoh:
- HomePage
- NewsPage
- EventsPage
- AnnouncementsPage
- ScholarshipsPage
- AcademicCalendarPage
- CircularLettersPage
- SearchResultPage
- PostDetailPage
- NotFoundPage

Semua halaman mengambil data melalui Hook lalu merender Component.

---

## pages/admin

Berisi dashboard administrator.

Halaman:
- LoginPage
- DashboardPage
- PostsPage
- CreatePostPage
- EditPostPage
- CategoriesPage
- ProfilePage
- SettingsPage

---

# HOOKS

Semua Hook bertugas mengambil data dan mengelola state.

Contoh:

## useLatestPosts.js

Mengambil artikel terbaru.

Flow:
Page
↓
Hook
↓
Service
↓
Supabase

---

## useCategoryPosts.js

Mengambil artikel berdasarkan kategori.

---

## useCategories.js

Mengambil seluruh kategori.

---

# SERVICES

Service adalah satu-satunya layer yang berkomunikasi dengan Supabase.

## postService.js

Mengelola:
- CRUD Post
- Search
- Publish
- Archive
- Statistics
- Related Posts
- Recent Posts
- Latest By Category

## categoryService.js

Mengelola:
- Get All
- Get By Id
- Get By Slug
- Total Categories

## attachmentService.js

Mengelola:
- Create
- Update
- Delete
- Get By Post

## publicPostService.js

Mengelola query khusus website publik.

---

# SUPABASE

Folder:
src/supabase

Berisi:
- supabaseClient.js

Fungsi:
Menghubungkan React dengan Supabase.

---

# UTILS

Berisi helper function.

Contoh:

- slugify.js
- generateSlug.js
- formatDate.js
- mergePostsCategory.js

Semua utility tidak bergantung pada React.

---

# COMPLETE REQUEST LIFECYCLE

User klik halaman

↓

Router

↓

Page

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

State

↓

Component

↓

Browser

---

# DEPENDENCY RULE

Page
→ Hook

Hook
→ Service

Service
→ Supabase

Component
→ Tidak boleh query database langsung

Utility
→ Tidak boleh menggunakan React

---

# BEST PRACTICES

- Pisahkan UI dan Business Logic.
- Semua query berada di Service.
- Gunakan Hook untuk data fetching.
- Gunakan Component reusable.
- Hindari duplikasi kode.
- Gunakan Utility untuk fungsi umum.

---

# FUTURE IMPROVEMENTS

- Supabase Storage
- Multi Role
- Analytics Dashboard
- Notification
- View Counter
- SEO
- Dark Mode
- Featured Posts
- Comments
- Tags
- Bookmark

---

# CONCLUSION

Project menggunakan arsitektur modular dengan pemisahan yang jelas antara UI, Business Logic, Service, dan Database sehingga mudah dikembangkan, dipelihara, dan dipahami oleh developer lain.

# CHAPTER 1

# Complete Project Workflow

Dokumen ini menjelaskan bagaimana seluruh aplikasi bekerja dari saat pengguna membuka website hingga data ditampilkan di browser.

---

## Public Website Workflow

Pengguna membuka browser

↓

Memasukkan URL

↓

React Application dijalankan

↓

React Router membaca URL

↓

Router memilih halaman

↓

Layout dimuat

↓

Page dijalankan

↓

Hook dipanggil

↓

Service dipanggil

↓

Supabase menerima request

↓

PostgreSQL menjalankan query

↓

Data dikembalikan ke Service

↓

Service mengembalikan data ke Hook

↓

Hook memperbarui State

↓

Component melakukan Render

↓

Browser menampilkan halaman

---

## Admin Workflow

Administrator Login

↓

AuthContext

↓

Supabase Authentication

↓

Session dibuat

↓

ProtectedRoute

↓

Dashboard

↓

Administrator membuat Post

↓

Hook

↓

Post Service

↓

Supabase

↓

Database

↓

Response

↓

UI diperbarui

---

## Attachment Workflow

Administrator

↓

Tambah Attachment

↓

Attachment Service

↓

Table attachments

↓

Post Detail

↓

Download File

---

## Search Workflow

User

↓

SearchBar

↓

SearchResultPage

↓

Hook

↓

postService.search()

↓

Supabase

↓

Result

↓

PostCard

↓

Browser

---

## Category Workflow

User

↓

Homepage

↓

CategorySection

↓

useCategoryPosts()

↓

postService.getLatestByCategory()

↓

mergePostsCategory()

↓

Render PostCard

---

## Latest Posts Workflow

Homepage

↓

useLatestPosts()

↓

postService.getLatest()

↓

mergePostsCategory()

↓

Pagination

↓

Render Card

---

## Dashboard Workflow

DashboardPage

↓

postService.getStatistics()

↓

categoryService.getTotalCategories()

↓

DashboardCard

↓

Browser

---

## CRUD Workflow

Create

↓

Form

↓

Validation

↓

Service

↓

Supabase

↓

Database

↓

Success

---

Read

↓

Service

↓

Hook

↓

State

↓

UI

---

Update

↓

Edit Form

↓

Validation

↓

Update Service

↓

Database

↓

Refresh UI

---

Delete

↓

Confirm Dialog

↓

Delete Service

↓

Database

↓

Reload Data

---

## Component Communication

Parent Component

↓

Props

↓

Child Component

↓

Event

↓

Parent Component

---

## Hook Communication

Page

↓

Hook

↓

Service

↓

Database

↓

Hook

↓

Page

---

## Service Communication

Hook

↓

Service

↓

Supabase Client

↓

REST API

↓

PostgreSQL

---

## Utility Communication

Component

↓

Utility

↓

Return Result

↓

Component

Contoh:

formatDate()

slugify()

mergePostsCategory()

readingTime()

---

## Authentication Flow

Login

↓

Supabase Auth

↓

Session

↓

Auth Context

↓

Protected Route

↓

Dashboard

---

## Logout Flow

Logout

↓

Supabase

↓

Session Removed

↓

Redirect Login

---

## Error Handling Flow

Service Error

↓

Throw Error

↓

Hook

↓

Catch

↓

Component

↓

Alert / Toast

---

## Loading Flow

Request

↓

Loading = true

↓

Service

↓

Loading = false

↓

Render

---

## State Flow

User Action

↓

State Update

↓

Re-render

↓

Browser Update

---

## Summary

Seluruh project menggunakan pola:

UI

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

UI

Sehingga seluruh logika aplikasi terpisah dengan jelas antara tampilan, business logic, dan akses database.

# CHAPTER 2

# Root Files & Router

Bab ini menjelaskan file-file utama yang menjadi fondasi aplikasi. File pada bagian ini selalu dijalankan terlebih dahulu sebelum halaman lainnya.

---

# 2.1 main.jsx

Lokasi

src/main.jsx

---

## Fungsi

Merupakan entry point dari aplikasi React.

Semua proses aplikasi dimulai dari file ini.

Browser pertama kali akan menjalankan file ini sebelum React membuat seluruh komponen.

---

## Import

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

import './styles/index.css'
```

---

## Penjelasan Import

StrictMode

Digunakan untuk membantu proses development.

StrictMode akan menjalankan beberapa proses sebanyak dua kali ketika mode development aktif.

Tujuannya agar developer mengetahui adanya side effect.

---

createRoot()

Digunakan React 18 untuk membuat Root React.

Seluruh aplikasi nantinya akan dirender pada

```
<div id="root"></div>
```

yang berada di file index.html.

---

App.jsx

Merupakan Root Component.

Seluruh aplikasi dimulai dari sini.

---

index.css

CSS Global.

Tailwind juga diaktifkan melalui file ini.

---

## Cara Kerja

Browser

↓

main.jsx

↓

createRoot()

↓

App.jsx

↓

React Application

---

## Output

Seluruh aplikasi berhasil dirender.

---

# 2.2 App.jsx

Lokasi

src/App.jsx

---

## Fungsi

Root Component.

App bertugas menyusun Provider global.

---

## Source

App hanya memiliki beberapa Provider.

Contoh

Theme Provider

↓

Auth Provider

↓

Router

---

## Flow

App

↓

ThemeProvider

↓

AuthProvider

↓

AppRouter

---

## Mengapa menggunakan Provider?

Provider memungkinkan seluruh halaman mengakses data global.

Contohnya

AuthContext

digunakan oleh

Dashboard

Navbar

ProtectedRoute

Login

tanpa perlu mengirim props satu per satu.

---

## Dependency

Memanggil

ThemeContext

AuthContext

AppRouter

---

# 2.3 AppRouter.jsx

Lokasi

src/router/AppRouter.jsx

---

## Fungsi

Mengatur seluruh URL website.

Router merupakan navigasi utama aplikasi.

---

## Public Route

/

↓

Home

---

/news

↓

News

---

/events

↓

Events

---

/announcements

↓

Announcements

---

/academic-calendar

↓

Academic Calendar

---

/circular-letters

↓

Circular Letters

---

/scholarships

↓

Scholarships

---

/post/:slug

↓

Detail Artikel

---

/search

↓

Search

---

## Admin Route

/admin/login

↓

Login

---

/admin/dashboard

↓

Dashboard

---

/admin/posts

↓

Posts

---

/admin/posts/create

↓

Create Post

---

/admin/posts/:id/edit

↓

Edit Post

---

/admin/categories

↓

Categories

---

/admin/profile

↓

Profile

---

/admin/settings

↓

Settings

---

## Route Hierarchy

Browser

↓

BrowserRouter

↓

Routes

↓

Route

↓

Layout

↓

Page

---

## Kenapa memakai Layout?

Supaya Navbar

Footer

Sidebar

tidak ditulis berulang.

---

## Dependency

App.jsx

↓

AppRouter

↓

Layout

↓

Page

---

# 2.4 ProtectedRoute.jsx

Lokasi

src/router/ProtectedRoute.jsx

---

## Fungsi

Melindungi halaman administrator.

User yang belum login tidak boleh membuka dashboard.

---

## Flow

User membuka

/admin/dashboard

↓

ProtectedRoute

↓

Cek Session

↓

Jika Login

↓

Dashboard

↓

Jika Tidak

↓

Redirect Login

---

## Dependency

AuthContext

Navigate

Outlet

---

## Keuntungan

Lebih aman.

Semua halaman admin otomatis terlindungi.

---

# 2.5 PublicRoute.jsx

Lokasi

src/router/PublicRoute.jsx

---

## Fungsi

Digunakan untuk halaman publik.

Saat ini hanya sebagai wrapper.

Ke depan dapat digunakan untuk:

- Maintenance Mode

- Language

- Analytics

- Tracking

---

# Browser Lifecycle

Browser

↓

main.jsx

↓

App.jsx

↓

AppRouter

↓

Layout

↓

Page

↓

Hook

↓

Service

↓

Supabase

↓

Database

↓

Return

↓

Component

↓

Browser

---

# Dependency Diagram

main.jsx

↓

App.jsx

↓

AppRouter

↓

Layout

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

---

# Best Practice

Root file tidak boleh berisi Business Logic.

Router hanya bertugas mengatur URL.

Layout hanya bertugas mengatur Template.

Page bertugas mengatur halaman.

Component bertugas menampilkan UI.

Hook bertugas mengelola State.

Service bertugas mengakses Database.

Utility bertugas membantu proses perhitungan atau formatting.

---

# Summary

File-file pada bab ini merupakan pondasi utama aplikasi.

Tanpa file tersebut aplikasi tidak dapat dijalankan karena seluruh proses React dimulai dari main.jsx kemudian diteruskan ke App.jsx dan AppRouter sebelum halaman lain dijalankan.

# CHAPTER 3

# Components

---

# Overview

Folder components merupakan kumpulan seluruh komponen antarmuka (UI) yang digunakan pada aplikasi.

Project menggunakan konsep **Reusable Component**, yaitu satu komponen dapat digunakan pada banyak halaman.

Keuntungan pendekatan ini:

- Mengurangi duplikasi kode
- Konsisten
- Mudah dipelihara
- Mudah dikembangkan
- Lebih mudah melakukan debugging

Struktur folder:

```
components
│
├── admin
├── common
├── editor
└── public
```

---

# Component Lifecycle

Page

↓

Component

↓

Props

↓

Render

↓

Browser

---

# COMPONENTS / COMMON

Folder:

```
src/components/common
```

Berisi komponen yang dapat digunakan oleh Admin maupun Public Website.

---

# Button.jsx

## Fungsi

Komponen tombol universal.

Digunakan hampir di seluruh aplikasi.

---

## Digunakan Oleh

Dashboard

Posts

Categories

Profile

Settings

Create Post

Edit Post

Attachment

Modal

Confirm Dialog

---

## Props

children

Isi tombol.

---

type

button

submit

reset

---

disabled

Mengaktifkan atau menonaktifkan tombol.

---

className

Class Tailwind tambahan.

---

onClick

Function ketika tombol ditekan.

---

## Flow

User Click

↓

Button

↓

onClick()

↓

Parent Component

---

## Kelebihan

Satu komponen dapat digunakan di seluruh aplikasi.

---

# Input.jsx

## Fungsi

Input text universal.

---

## Digunakan Oleh

Login

Profile

Create Post

Edit Post

Attachment

Search

Category

---

## Props

id

label

value

onChange

placeholder

type

error

---

## Output

Input HTML dengan styling Tailwind.

---

# Textarea.jsx

Digunakan untuk input panjang.

Contoh

Excerpt

Content

Description

---

# Select.jsx

Digunakan untuk Dropdown.

Contoh

Category

Status

Role

---

# Modal.jsx

Popup universal.

Digunakan ketika aplikasi membutuhkan dialog.

---

# Pagination.jsx

Mengatur perpindahan halaman.

Flow

User

↓

Next

↓

State

↓

Hook

↓

Service

↓

Database

↓

Page Baru

---

# Breadcrumb.jsx

Menampilkan lokasi halaman.

Contoh

Dashboard

>

Posts

>

Create

---

# LoadingSkeleton.jsx

Placeholder ketika data sedang dimuat.

---

# Toast.jsx

Menampilkan notifikasi.

Saat ini masih sederhana.

Ke depan dapat diganti menggunakan react-hot-toast.

---

# EmptyState.jsx

Ditampilkan ketika data kosong.

Contoh

Belum ada artikel.

---

# ErrorState.jsx

Ditampilkan ketika request gagal.

---

# COMPONENTS / PUBLIC

Folder

```
components/public
```

Berisi seluruh komponen website publik.

---

# Navbar.jsx

Menampilkan navigasi website.

Menu

Home

Announcements

News

Events

Scholarships

Academic Calendar

Circular Letters

Search

---

Flow

User

↓

Klik Menu

↓

React Router

↓

Page

---

# Footer.jsx

Footer website.

Berisi informasi singkat website.

---

# HeroBanner.jsx

Banner utama Homepage.

Menampilkan

Judul

Subtitle

---

# SectionTitle.jsx

Judul section.

Contoh

Latest Posts

News

Events

Scholarships

---

# SearchBar.jsx

Komponen pencarian.

Flow

User Input

↓

Submit

↓

Navigate

↓

SearchResultPage

↓

Search Service

↓

Database

↓

Result

---

# CategoryBadge.jsx

Badge kategori.

Contoh

News

Events

Announcement

Scholarship

Academic Calendar

---

# PostCard.jsx

## Fungsi

Komponen terpenting pada Website.

Digunakan untuk menampilkan ringkasan artikel.

---

## Digunakan Oleh

Home

Category Section

Search

Related Posts

Category Page

Latest Posts

---

## Props

post

---

## Menampilkan

Cover

Kategori

Judul

Excerpt

Tanggal

---

## Dependency

CategoryBadge

formatDate()

React Router Link

---

## Flow

Post

↓

Category

↓

Cover

↓

Title

↓

Excerpt

↓

Date

↓

Render

---

# CategorySection.jsx

Menampilkan daftar artikel berdasarkan kategori.

Contoh

News

Events

Announcement

---

Flow

Hook

↓

Data

↓

Loop

↓

PostCard

---

# SidebarPosts.jsx

Menampilkan artikel terbaru pada sidebar.

---

# RelatedPosts.jsx

Menampilkan artikel yang memiliki kategori sama.

---

# ShareButtons.jsx

Membagikan artikel.

Saat ini mendukung copy link.

Ke depan dapat ditambah:

Facebook

Twitter

LinkedIn

WhatsApp

Telegram

---

# CategoryPostsPage.jsx

Template halaman kategori.

Digunakan oleh:

News

Events

Announcement

Scholarships

Academic Calendar

Circular Letters

---

# COMPONENTS / ADMIN

Folder

```
components/admin
```

Komponen dashboard administrator.

---

# Sidebar.jsx

Navigasi Dashboard.

Menu

Dashboard

Posts

Categories

Profile

Settings

Logout

---

# DashboardHeader.jsx

Header Dashboard.

Menampilkan

Nama User

Logout

Theme

---

# DashboardCard.jsx

Card statistik.

Contoh

Total Posts

Total Categories

Draft

Published

---

# StatCard.jsx

Versi card statistik yang reusable.

---

# RecentPostsTable.jsx

Tabel artikel terbaru.

Digunakan Dashboard.

---

# DataTable.jsx

Komponen tabel universal.

Digunakan oleh

Posts

Categories

Attachment

---

# ConfirmDialog.jsx

Dialog konfirmasi.

Digunakan sebelum Delete.

---

# COMPONENTS / EDITOR

Folder

```
components/editor
```

---

# RichTextEditor.jsx

Menggunakan TipTap.

Digunakan pada

Create Post

Edit Post

---

## Fungsi

Mengubah textarea biasa menjadi editor modern.

Mendukung

Bold

Italic

Heading

List

Paragraph

Link

---

# Component Relationship

Page

↓

Component

↓

Child Component

↓

Utility

↓

Browser

---

# Props Flow

Parent

↓

Props

↓

Child

↓

Render

---

# Event Flow

Click

↓

Component

↓

Parent

↓

Hook

↓

Service

↓

Database

---

# Best Practice

Component tidak boleh langsung mengakses database.

Component hanya menerima data melalui Props.

Component tidak menyimpan Business Logic.

Component hanya bertugas merender tampilan.

---

# Summary

Folder Components merupakan lapisan Presentation Layer pada aplikasi.

Seluruh tampilan website maupun dashboard dibangun menggunakan komponen reusable sehingga kode menjadi lebih rapi, konsisten, dan mudah dipelihara.

# CHAPTER 4

# Pages

---

# Overview

Folder Pages merupakan kumpulan seluruh halaman aplikasi.

Setiap URL pada React Router akan mengarah ke sebuah Page.

Page memiliki tanggung jawab sebagai penghubung antara:

- Component
- Hook
- Service

Page tidak melakukan query database secara langsung.

Semua query dilakukan melalui Hook dan Service.

---

# Struktur

src/pages

│

├── admin

└── public

---

# PAGE LIFECYCLE

Browser

↓

Router

↓

Page

↓

Hook

↓

Service

↓

Database

↓

Service

↓

Hook

↓

State

↓

Component

↓

Browser

---

# PUBLIC PAGES

Folder

src/pages/public

---

# HomePage.jsx

## Fungsi

Halaman utama website.

Merupakan halaman pertama yang dibuka oleh pengguna.

---

## Komponen

HeroBanner

SearchBar

SectionTitle

Pagination

PostCard

CategorySection

---

## Hook

useLatestPosts()

---

## Service

postService.getLatest()

---

## Menampilkan

Latest Posts

News

Announcements

Events

Scholarships

Academic Calendar

Circular Letters

---

## Flow

Browser

↓

HomePage

↓

useLatestPosts()

↓

postService

↓

Supabase

↓

Posts

↓

PostCard

↓

Browser

---

# PostDetailPage.jsx

## Fungsi

Menampilkan isi artikel secara lengkap.

---

## Mengambil Data

Slug URL

↓

Hook

↓

Service

↓

Database

---

## Komponen

Breadcrumb

ShareButtons

RelatedPosts

SidebarPosts

Attachment List

---

## Menampilkan

Title

Cover

Category

Content

Author

Publish Date

Attachment

Related Posts

---

## Flow

User klik artikel

↓

React Router

↓

Slug

↓

Database

↓

Post Detail

↓

Browser

---

# SearchResultPage.jsx

## Fungsi

Menampilkan hasil pencarian.

---

## Input

Keyword

---

## Service

postService.search()

---

## Output

Daftar PostCard.

---

# NewsPage.jsx

## Fungsi

Menampilkan seluruh artikel kategori News.

---

## Menggunakan

CategoryPostsPage

Slug

news

---

# EventsPage.jsx

Sama seperti News.

Slug

events

---

# AnnouncementsPage.jsx

Slug

announcements

---

# ScholarshipsPage.jsx

Slug

scholarships

---

# AcademicCalendarPage.jsx

Slug

academic-calendar

---

# CircularLettersPage.jsx

Slug

circular-letters

---

# CategoryPostsPage

Template halaman kategori.

Digunakan oleh seluruh halaman kategori.

Keuntungan

Tidak perlu membuat kode yang sama berkali-kali.

---

# NotFoundPage.jsx

Ditampilkan ketika URL tidak ditemukan.

---

# ADMIN PAGES

Folder

src/pages/admin

---

# LoginPage.jsx

## Fungsi

Login Administrator.

---

## Menggunakan

Input

Button

AuthContext

---

## Flow

Input

↓

Login

↓

Supabase Auth

↓

Dashboard

---

# DashboardPage.jsx

## Fungsi

Halaman utama Administrator.

---

## Menampilkan

Total Posts

Total Categories

Published

Draft

Recent Posts

---

## Service

postService.getStatistics()

categoryService.getTotalCategories()

---

## Flow

Dashboard

↓

Statistics

↓

Card

↓

Browser

---

# PostsPage.jsx

## Fungsi

Menampilkan seluruh artikel.

---

## Komponen

DataTable

Pagination

Search

Delete

Edit

Publish

---

## Service

postService.getAll()

---

## Flow

Database

↓

Posts

↓

Table

↓

Action

---

# CreatePostPage.jsx

## Fungsi

Membuat artikel baru.

---

## Komponen

Input

Textarea

RichTextEditor

Select

Attachment

Button

---

## Service

postService.create()

attachmentService.create()

---

## Flow

Input

↓

Validation

↓

Create Post

↓

Create Attachment

↓

Success

↓

Redirect

---

# EditPostPage.jsx

## Fungsi

Mengubah artikel.

---

## Komponen

Sama seperti CreatePost.

---

## Service

postService.update()

attachmentService.update()

attachmentService.remove()

---

## Flow

Load Data

↓

Form

↓

Update

↓

Success

↓

Redirect

---

# CategoriesPage.jsx

## Fungsi

Mengelola kategori.

---

## Fitur

Tambah

Edit

Delete

---

## Service

categoryService

---

# ProfilePage.jsx

## Fungsi

Mengubah data profil administrator.

Saat ini masih sederhana.

---

# SettingsPage.jsx

## Fungsi

Konfigurasi aplikasi.

Saat ini masih berupa placeholder.

---

# PAGE RESPONSIBILITY

Page bertugas

✔ Memanggil Hook

✔ Menggabungkan Component

✔ Mengatur Layout

✔ Mengatur Navigasi

Page tidak boleh

✘ Query Database

✘ Menulis SQL

✘ Mengakses Supabase secara langsung

---

# PAGE RELATIONSHIP

Router

↓

Page

↓

Hook

↓

Service

↓

Database

↓

Hook

↓

Component

↓

Browser

---

# BEST PRACTICE

Satu Page memiliki satu tanggung jawab.

Gunakan Hook untuk data.

Gunakan Component untuk UI.

Gunakan Service untuk Database.

---

# Summary

Folder Pages merupakan pusat alur aplikasi.

Setiap halaman bertugas menggabungkan Component, Hook, dan Service sehingga pengguna dapat berinteraksi dengan sistem tanpa mengetahui proses di belakang layar.

Pages menjadi penghubung antara antarmuka pengguna dengan business logic yang berada pada Hook dan Service.