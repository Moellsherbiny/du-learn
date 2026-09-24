# DU Learn

> Learning Management System for Interactive Education

DU Learn is a web-based **Learning Management System (LMS)** developed as an academic graduation project at Damietta University.

The platform provides an integrated environment for managing courses, modules, lessons, assessments, student progress, communication, gamification, authentication, and account security.

---

## 📌 Project Overview

DU Learn is designed to provide students and teachers with a structured and interactive digital learning environment.

The system supports different user roles and provides dedicated functionality for students, teachers, and administrators.

The main focus of the project is to demonstrate the development of a modern educational platform using a separate frontend and backend architecture.

---

## 🎯 Project Goals

The main goals of DU Learn are:

- Building a complete Learning Management System.
- Managing courses, modules, and lessons.
- Providing online assessments and quizzes.
- Tracking student learning progress.
- Providing communication features.
- Integrating gamification features.
- Implementing secure authentication.
- Providing email verification and password recovery.
- Applying security mechanisms to sensitive operations.
- Building a modern and maintainable web application architecture.

---

# ✨ Features

## 🔐 Authentication

DU Learn provides a complete authentication system including:

- User registration.
- Login and logout.
- Email and password authentication.
- JWT authentication.
- Access and refresh tokens.
- HttpOnly authentication cookies.
- Current authenticated user.
- Email verification using OTP.
- Resend verification OTP.
- Password reset using OTP.
- Change password.
- Profile management.

---

## 📧 Email Verification

New accounts can be verified using a one-time password (OTP) sent to the user's email.

### Verification Flow

```text
Registration
     │
     ▼
Create Account
     │
     ▼
Generate OTP
     │
     ▼
Send OTP Email
     │
     ▼
Verify OTP
     │
     ▼
Email Verified

# DU Learn

> Learning Management System for Interactive Education

DU Learn is a web-based **Learning Management System (LMS)** developed as an academic graduation project at Damietta University.

The platform provides an integrated environment for managing courses, modules, lessons, assessments, student progress, communication, gamification, authentication, and account security.

---

## 📌 Project Overview

DU Learn is designed to provide students and teachers with a structured and interactive digital learning environment.

The system supports different user roles and provides dedicated functionality for students, teachers, and administrators.

The main focus of the project is to demonstrate the development of a modern educational platform using a separate frontend and backend architecture.

---

## 🎯 Project Goals

The main goals of DU Learn are:

- Building a complete Learning Management System.
- Managing courses, modules, and lessons.
- Providing online assessments and quizzes.
- Tracking student learning progress.
- Providing communication features.
- Integrating gamification features.
- Implementing secure authentication.
- Providing email verification and password recovery.
- Applying security mechanisms to sensitive operations.
- Building a modern and maintainable web application architecture.

---

# ✨ Features

## 🔐 Authentication

DU Learn provides a complete authentication system including:

- User registration.
- Login and logout.
- Email and password authentication.
- JWT authentication.
- Access and refresh tokens.
- HttpOnly authentication cookies.
- Current authenticated user.
- Email verification using OTP.
- Resend verification OTP.
- Password reset using OTP.
- Change password.
- Profile management.

---

## 📧 Email Verification

New accounts can be verified using a one-time password (OTP) sent to the user's email.

### Verification Flow

```text
Registration
     │
     ▼
Create Account
     │
     ▼
Generate OTP
     │
     ▼
Send OTP Email
     │
     ▼
Verify OTP
     │
     ▼
Email Verified

# 🖥️ Frontend Structure

The DU Learn frontend is built using **Next.js App Router**, **TypeScript**, and a component-based architecture.

The frontend is organized into pages, reusable components, server actions, hooks, API utilities, state management, and shared types.

```text
frontend/
│
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── verify-email/
│   │
│   ├── learn/
│   │   ├── courses/
│   │   │   └── [slug]/
│   │   ├── assessments/
│   │   │   └── [id]/
│   │   ├── messages/
│   │   │   └── [conversationId]/
│   │   ├── settings/
│   │   └── page.tsx
│   │
│   ├── courses/
│   │   └── [slug]/
│   │
│   ├── dashboard/
│   │
│   ├── layout.tsx
│   └── page.tsx
│
├── actions/
│   ├── auth/
│   │   ├── login.ts
│   │   ├── register.ts
│   │   ├── forgot-password.ts
│   │   ├── verify-email.ts
│   │   └── ...
│   │
│   ├── assessments/
│   │   ├── assessment/
│   │   │   ├── get-assessment.ts
│   │   │   └── get-assessments.ts
│   │   │
│   │   └── attempt/
│   │       ├── get-attempt.ts
│   │       ├── get-attempts.ts
│   │       ├── start-attempt.ts
│   │       ├── answer-question.ts
│   │       ├── submit-attempt.ts
│   │       └── abandon-attempt.ts
│   │
│   ├── courses/
│   ├── lessons/
│   ├── progress/
│   └── communications/
│
├── components/
│   ├── ui/
│   │
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── ...
│   │
│   ├── learn/
│   │   ├── header/
│   │   ├── breadcrumbs/
│   │   ├── course/
│   │   ├── lessons/
│   │   └── ...
│   │
│   ├── assessments/
│   │   ├── assessment-card.tsx
│   │   ├── assessment-question.tsx
│   │   ├── assessment-result.tsx
│   │   └── ...
│   │
│   ├── communications/
│   │   ├── messages-client.tsx
│   │   ├── conversation-client.tsx
│   │   └── ...
│   │
│   └── security/
│       └── turnstile-widget.tsx
│
├── hooks/
│   ├── use-turnstile.ts
│   └── ...
│
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   └── server.ts
│   │
│   ├── utils.ts
│   └── ...
│
├── stores/
│   └── auth-store.ts
│
├── types/
│   ├── assessment.ts
│   ├── auth.ts
│   ├── course.ts
│   ├── lesson.ts
│   ├── progress.ts
│   └── ...
│
├── public/
│   ├── images/
│   ├── icons/
│   └── ...
│
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── .env.local


# 🚀 Running the Project

DU Learn consists of two main applications:

- **Frontend:** Next.js
- **Backend:** Django REST Framework

Both applications need to be running at the same time during development.

---

# 📋 Requirements

Before running the project, make sure the following are installed:

- Node.js
- PNPM
- Python
- PostgreSQL
- Git

Recommended versions:

```text
Node.js 20+
Python 3.12+
PostgreSQL 15+
PNPM 9+