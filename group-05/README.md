# Gunadarma Thesis Guidance Scheduling System (GTGS)

> A modern web-based thesis supervision scheduling platform designed to streamline the appointment process between Universitas Gunadarma students and thesis supervisors.

---

# Project Overview

Gunadarma Thesis Guidance Scheduling System (GTGS) is a web-based information system that digitizes and automates the thesis supervision scheduling process between students and lecturers.

The primary objective of this project is to eliminate inefficient manual scheduling methods such as WhatsApp chats, email conversations, and informal appointment requests by providing a centralized scheduling platform.

The system allows students to request supervision appointments based on their assigned supervisors' availability while allowing lecturers to manage their consultation schedules efficiently.

GTGS is designed as a modern, scalable, and maintainable full-stack web application following current software engineering best practices.

This repository serves as the primary source code for the GTGS project.

---

# Background

The thesis supervision process in many universities is still performed manually through instant messaging applications, emails, or direct communication.

These approaches often introduce several problems:

- Schedule conflicts
- Missed appointments
- Lack of supervision history
- Poor documentation
- Difficult schedule management
- Inefficient communication between students and lecturers

GTGS addresses these issues by introducing an integrated scheduling platform specifically designed for Universitas Gunadarma.

Unlike generic calendar booking applications, GTGS incorporates academic validation rules before allowing students to request thesis supervision.

---

# Objectives

The objectives of GTGS are:

- Simplify thesis supervision scheduling.
- Reduce scheduling conflicts.
- Digitize supervision records.
- Provide centralized supervision history.
- Automate reminder notifications.
- Improve communication between students and supervisors.
- Ensure only eligible students may request supervision.
- Provide an intuitive and user-friendly experience.
- Build a scalable software architecture for future expansion.

---

# Scope

GTGS focuses exclusively on thesis supervision scheduling.

The system supports two primary users:

- Mahasiswa (Student)
- Dosen (Supervisor)

Administrative data management is assumed to be synchronized from the university academic information system and therefore is **not part of the application interface**.

The application includes:

- Student authentication
- Lecturer authentication
- Academic eligibility validation
- Thesis advisor management
- Availability scheduling
- Appointment booking
- Booking approval workflow
- Notification system
- Session history
- Supervision notes
- File attachment
- Reminder system

Future integrations such as direct synchronization with Gunadarma Academic Information System (AIS) are outside the MVP scope.

---

# Core Business Rules

The following business rules define the foundation of GTGS.

## Student Eligibility

A student is allowed to request supervision only if:

- Uses an official Universitas Gunadarma student email.
- Has completed at least **144 credits (SKS)**.
- Has completed **Penulisan Ilmiah (PI)**.
- Exception:
  Students enrolled in **Sarjana-Magister (Sar-Mag)** programs are exempt from the PI requirement.

---

## Thesis Supervisors

Each student may have:

- One supervisor
- Two supervisors

Students are **not allowed** to book lecturers who are not officially assigned as their thesis supervisors.

---

## Booking Rules

Students may create supervision requests only on available lecturer time slots.

The system prevents:

- Double booking
- Overlapping appointments
- Invalid time slots
- Booking outside lecturer availability

If a student has two supervisors, appointments with both lecturers are allowed, provided the schedules do not overlap.

---

## Lecturer Availability

Lecturers may create:

- One-time schedules
- Recurring weekly schedules

Recurring schedules may include exceptions such as:

- Holidays
- Seminars
- Meetings
- Leave

---

## Notification Rules

Automatic notifications are sent when:

- Booking created
- Booking approved
- Booking rejected
- Booking cancelled
- Schedule modified
- Reminder H-1 before supervision

Notifications are delivered via:

- In-App Notification
- Email

---

# System Features

## Student

- Login
- Dashboard
- Academic eligibility status
- View assigned supervisors
- View lecturer availability
- Request supervision
- Cancel booking
- View booking history
- Upload revision files
- View lecturer feedback
- Receive notifications

---

## Lecturer

- Login
- Dashboard
- Manage availability
- Recurring schedules
- Schedule exceptions
- Review booking requests
- Approve bookings
- Reject bookings
- Session notes
- Revision feedback
- Supervision history
- Notifications

---

# Technology Stack

## Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- React Hook Form
- Zod
- FullCalendar
- Framer Motion

---

## Backend

- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- Bcrypt
- Nodemailer
- node-cron

---

## Database

- PostgreSQL

---

## File Storage

- **PostgreSQL (binary storage via Prisma `Bytes` field)**

Uploaded files (e.g. revision PDFs) are stored directly in the database as binary data rather than through a third-party file storage provider. This keeps the stack self-contained and avoids managing external storage credentials. If file volume grows significantly in the future, this can be migrated to an object storage provider without changing the API contract exposed to the frontend.

---

# Deployment

Frontend

- Vercel

Backend

- Railway

Database

- Neon PostgreSQL (also used for file storage)

---

# System Architecture

GTGS adopts a modern three-tier architecture.

```
Browser

↓

React + Vite

↓

REST API

↓

Express.js

↓

Prisma ORM

↓

PostgreSQL (including binary file storage)

↓

SMTP Email Service
```

A detailed architecture explanation is available in:

```
docs/03_SYSTEM_ARCHITECTURE.md
```

---

# Project Structure

```
GTGS/

client/
server/
docs/
assets/

README.md

LICENSE

.gitignore
```

Detailed folder documentation:

```
docs/PROJECT_STRUCTURE.md
```

---

# Environment Variables

The application requires the following environment variables.

Server

```
DATABASE_URL=

JWT_SECRET=

JWT_REFRESH_SECRET=

CLIENT_URL=

SMTP_HOST=

SMTP_PORT=

SMTP_USER=

SMTP_PASS=
```

Client

```
VITE_API_URL=
```

Detailed explanations are available in:

```
docs/10_DEPLOYMENT.md
```

---

# Installation

Clone repository

```bash
git clone <repository-url>
```

Install frontend

```bash
cd client

npm install
```

Install backend

```bash
cd server

npm install
```

Configure environment variables.

Run Prisma migration.

```bash
npx prisma migrate dev
```

Run database seed.

```bash
npx prisma db seed
```

Start backend.

```bash
npm run dev
```

Start frontend.

```bash
npm run dev
```

---

# Build Guide

Development

```bash
npm run dev
```

Production Build

Frontend

```bash
npm run build
```

Backend

```bash
npm start
```

Before deployment ensure:

- Prisma migration completed
- Database seeded
- Environment variables configured
- Email service configured

---

# Documentation

Complete project documentation is located in the **docs/** directory.

```
docs/
00_SYSTEM_VISION.md

01_PROJECT_OVERVIEW.md

02_SRS.md

03_SYSTEM_ARCHITECTURE.md

04_DATABASE.md

05_API.md

06_UI_GUIDELINES.md

07_UX_FLOW.md

08_BUSINESS_RULES.md

09_TESTING_QA.md

10_DEPLOYMENT.md

11_AGENT_TASKS.md

12_AGENT_PROMPT.md

13_CODING_STANDARDS.md
```

---

# Development Workflow

Development should follow the documentation order.

```
Project Overview

↓

Software Requirement Specification

↓

Architecture

↓

Database Design

↓

API Design

↓

Frontend Development

↓

Backend Development

↓

Testing

↓

Deployment

↓

Maintenance
```

Do not skip any stage.

---

# Roadmap

Current MVP

- Authentication
- Scheduling
- Booking
- Approval
- Notification
- Session Log
- History

Version 1.1

- Thesis progress tracking
- Dashboard analytics
- Calendar improvements
- Better notification center

Version 2.0

- Gunadarma Academic Information System integration
- Single Sign-On (SSO)
- Google Calendar synchronization
- Mobile application
- Real-time messaging
- Migration to dedicated object storage for file attachments (if file volume requires it)

---

# UI & UX Principles

GTGS follows these design principles:

- Minimalist
- Professional
- Modern
- Responsive
- User Friendly
- Accessible
- Clean Layout
- Consistent Components
- Simple Navigation
- Mobile First

Color palette should be inspired by the official Universitas Gunadarma branding and logo located in:

```
assets/images/
```

Avoid excessive animations, unnecessary colors, and visual clutter.

---

# Contributing

Development should follow the coding standards described in:

```
docs/13_CODING_STANDARDS.md
```

All new features must include:

- Validation
- Error handling
- Documentation
- Testing

---

# License

This project is developed for educational purposes and software engineering research.

---

# Next Step

The next document to be completed is:

```
docs/01_PROJECT_OVERVIEW.md
```

which contains the complete project background, stakeholder analysis, problem statements, objectives, assumptions, constraints, and detailed project vision.