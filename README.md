# 📚 JKKNIU Library Management System

<div align="center">

![JKKNIU LMS](https://img.shields.io/badge/JKKNIU-Library%20Management%20System-1a56db?style=for-the-badge&logo=bookstack&logoColor=white)

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

A full-stack **MERN** web application for managing student information at **Jatiya Kabi Kazi Nazrul Islam University (JKKNIU)** Library. Features JWT authentication, email OTP verification, photo uploads, and full CRUD operations.

[🔴 Live Demo](#) · [🐛 Report Bug](mailto:ahplabon36@gmail.com) · [💡 Request Feature](mailto:ahplabon36@gmail.com)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Author](#-author)
- [License](#-license)

---

## 📖 About the Project

The **JKKNIU Library Management System** is a comprehensive web platform designed to digitize and streamline student registration and information management for the university library. Students can register with their personal and academic details, verify their identity via email OTP, and manage their profiles through a secure dashboard.

Admins can view all students, update records, and delete accounts — all protected by role-based JWT authentication.

---

## ✨ Features

### 🔐 Authentication & Security
- **Student Registration** with full profile (name, roll, email, password, photo, gender, session, department, phone)
- **Email OTP Verification** — 6-digit OTP sent via Nodemailer, expires in 10 minutes
- **JWT Authentication** — secure access & protected routes
- **Forgot Password** — OTP-based password reset via email
- **Resend OTP** — for users who missed the verification email
- **Role-Based Access Control** — student vs. admin permissions

### 👤 Student Management (CRUD)
- **Create** — Register new student with photo upload
- **Read** — View all students (admin) or own profile (student)
- **Update** — Edit profile details and profile photo
- **Delete** — Admin-only student account deletion

### 📷 Media
- Profile photo upload via **Cloudinary** CDN
- Automatic image resizing (400×400, crop-fill)
- Old photo cleanup on update/delete

### 🎨 UI/UX
- Responsive design — works on desktop and mobile
- Real-time toast notifications (success/error)
- Search/filter students by name, roll, or department
- Clean, professional dashboard interface

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | REST API framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **jsonwebtoken** | JWT auth tokens |
| **bcryptjs** | Password hashing |
| **Nodemailer** | Sending OTP emails |
| **Multer** | File upload handling |
| **Cloudinary** | Cloud image storage |
| **express-async-handler** | Async error handling |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Vite** | Build tool |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client |
| **React Hook Form** | Form management |
| **React Hot Toast** | Toast notifications |
| **Context API** | Global auth state |

### DevOps & Deployment
| Service | Purpose |
|---|---|
| **MongoDB Atlas** | Cloud database (M0 free) |
| **Render** | Backend hosting |
| **Vercel** | Frontend hosting |
| **GitHub** | Version control |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                CLIENT LAYER (React + Vite)           │
│   Register │ VerifyOTP │ Login │ Dashboard │ Edit    │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / JWT Bearer Token
┌──────────────────────▼──────────────────────────────┐
│            API GATEWAY (Express.js Router)           │
│     Rate Limiting · CORS · Multer · JWT Middleware   │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌─────▼──────┐ ┌───▼────────┐
│ Auth Service │ │ OTP Service│ │Student CRUD│
│ JWT · bcrypt │ │ Nodemailer │ │ File Svc   │
└───────┬──────┘ └─────┬──────┘ └───┬────────┘
        │              │             │
┌───────▼──────────────▼─────────────▼───────────────┐
│              MIDDLEWARE LAYER                        │
│   verifyToken · isAdmin · validateInput · errors    │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│           DATABASE LAYER (MongoDB Atlas)             │
│    users collection │ otps collection (TTL index)   │
└─────────────────────────────────────────────────────┘

External Services:
  Gmail (SMTP) ──► OTP emails
  Cloudinary   ──► Photo storage / CDN
```

### Auth Flow
```
Register → Email OTP sent → Verify OTP → Login → JWT issued
    → Protected routes → Logout
    
Forgot Password → OTP sent → Verify OTP → Reset Password → Login
```

---

## 📁 Project Structure

```
jkkniu-lms/
│
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── cloudinary.js         # Cloudinary + Multer storage
│   ├── controllers/
│   │   ├── authController.js     # register, login, OTP, reset
│   │   └── studentController.js  # CRUD operations
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT protect + adminOnly
│   │   ├── uploadMiddleware.js   # Multer file filter
│   │   └── errorMiddleware.js    # Global error handler
│   ├── models/
│   │   ├── User.js               # Student/User schema
│   │   └── Otp.js                # OTP schema with TTL index
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/*
│   │   └── studentRoutes.js      # /api/students/*
│   ├── utils/
│   │   ├── sendEmail.js          # Nodemailer OTP email
│   │   └── generateToken.js      # JWT token generator
│   ├── .env                      # Environment variables
│   ├── server.js                 # App entry point
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── axios.js          # Axios instance + interceptors
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state
    │   ├── pages/
    │   │   ├── Register.jsx
    │   │   ├── VerifyOtp.jsx
    │   │   ├── Login.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   ├── ResetPassword.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── EditStudent.jsx
    │   ├── App.jsx               # Routes
    │   └── main.jsx
    ├── vercel.json               # SPA routing fix
    ├── .env
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v8+
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free)
- A [Cloudinary](https://cloudinary.com/) account (free)
- A Gmail account with [App Password](https://support.google.com/accounts/answer/185833) enabled

---

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/jkkniu-lms.git
cd jkkniu-lms
```

**2. Install backend dependencies**
```bash
cd backend
npm install
```

**3. Install frontend dependencies**
```bash
cd ../frontend
npm install
```

---

### Environment Variables

#### Backend — `backend/.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/jkkniu_lms?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password

CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend — `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ Never commit your `.env` files to GitHub. They are already included in `.gitignore`.

---

### Running the App

**Start the backend server**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Start the frontend (new terminal)**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

Open your browser at [http://localhost:5173](http://localhost:5173)

---

## 📡 API Documentation

### Base URL
```
Local:      http://localhost:5000/api
Production: https://jkkniu-lms-backend.onrender.com/api
```

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register new student (multipart/form-data) |
| `POST` | `/verify-otp` | ❌ | Verify email with OTP |
| `POST` | `/resend-otp` | ❌ | Resend verification OTP |
| `POST` | `/login` | ❌ | Login and get JWT token |
| `POST` | `/forgot-password` | ❌ | Send password reset OTP |
| `POST` | `/reset-password` | ❌ | Reset password with OTP |
| `GET`  | `/me` | ✅ | Get logged-in user profile |

### Student Routes — `/api/students`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/` | ✅ | Any | Get all students (admin) / own profile (student) |
| `GET` | `/:id` | ✅ | Any | Get single student by ID |
| `PUT` | `/:id` | ✅ | Self/Admin | Update student profile |
| `DELETE` | `/:id` | ✅ | Admin only | Delete student account |

### Request Examples

**Register**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -F "name=Asif Hasan" \
  -F "roll=2021331001" \
  -F "email=ahplabon36@gmail.com" \
  -F "password=secret123" \
  -F "gender=Male" \
  -F "session=2021-22" \
  -F "dept=CSE" \
  -F "phone=+8801608414825" \
  -F "photo=@/path/to/photo.jpg"
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahplabon36@gmail.com","password":"secret123"}'
```

**Get profile (authenticated)**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

## 🌐 Deployment

This project is deployed using free-tier services:

| Layer | Service | URL |
|---|---|---|
| Database | MongoDB Atlas | Cloud cluster |
| Backend | Render | `https://jkkniu-lms-backend.onrender.com` |
| Frontend | Vercel | `https://jkkniu-lms.vercel.app` |

### Quick Deploy Steps

1. **MongoDB Atlas** — Create free M0 cluster, whitelist `0.0.0.0/0`, get connection URI
2. **Render** — Connect GitHub repo, add all env variables, deploy as Web Service
3. **Vercel** — Connect GitHub repo, add `VITE_API_URL` env variable, deploy
4. **Update** `CLIENT_URL` on Render with your Vercel URL

Detailed deployment guide: see [DEPLOYMENT.md](./DEPLOYMENT.md) *(or ask the developer)*

> 💡 **Free tier note:** Render free services sleep after 15 minutes of inactivity. Use [UptimeRobot](https://uptimerobot.com) to keep it awake with a free ping monitor.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/AmazingFeature`
3. Commit your changes — `git commit -m 'Add some AmazingFeature'`
4. Push to the branch — `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 🐛 Known Issues & Limitations

- Free Render tier has ~30 second cold start after inactivity
- Photo upload limited to 2MB per file
- OTP expires after 10 minutes and must be re-requested
- Admin accounts must be created manually via database (no admin signup UI)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License — Copyright (c) 2025 Asif Hasan
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software.
```

---

## 👨‍💻 Author

<div align="center">

### Asif Hasan

**Full Stack Developer | MERN · Python · FastAPI · AI**

*Fresher developer passionate about building clean, scalable web applications*

[![Email](https://img.shields.io/badge/Email-ahplabon36@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ahplabon36@gmail.com)
[![Phone](https://img.shields.io/badge/Phone-+8801608414825-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](tel:+8801608414825)
[![GitHub](https://img.shields.io/badge/GitHub-YOUR__USERNAME-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/YOUR_USERNAME)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Asif%20Hasan-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/YOUR_PROFILE)

*Built with ❤️ from Chattogram, Bangladesh*

</div>

---

<div align="center">

⭐ **If you found this project helpful, please give it a star!** ⭐

*© 2025 Asif Hasan — JKKNIU Library Management System*

</div>
