<div align="center">

# 🎓 EduVerse

### *The Next-Generation E-Learning Management System*

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://www.mongodb.com/mern-stack)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<br/>

*A feature-rich, full-stack e-learning platform with real-time chat, role-based dashboards, Google OAuth, course management, progress tracking, certificates, and a stunning glassmorphism UI.*

<br/>

[Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Project Structure](#-project-structure)

---

</div>

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based authentication** with secure token management
- **Google OAuth 2.0** via Firebase Authentication (sign in with one click)
- **Role-based access control** — Student, Instructor, and Admin
- **Rate limiting** to prevent brute-force attacks
- **Helmet.js** security headers
- **Password hashing** with bcryptjs

### 👨‍🎓 Student Portal
- **Personalized Dashboard** with enrollment stats, progress overview, and learning streaks
- **Course Catalog** with search, category filters, and detailed course pages
- **Interactive Course Player** — video lessons with module-by-module navigation
- **Progress Tracking** — automatic lesson completion tracking with visual progress bars
- **Certificates** — auto-generated completion certificates with unique verification
- **Wishlist & Cart** — save courses for later or enroll directly
- **Reviews & Ratings** — rate and review completed courses

### 👨‍🏫 Instructor Portal
- **Instructor Dashboard** with student engagement metrics
- **Course Builder** — create courses with modules, lessons, video content, and assignments
- **Submission Review** — review and grade student assignment submissions
- **Analytics** — detailed charts for enrollment trends, ratings, and course performance

### 🛡️ Admin Panel
- **Admin Dashboard** with platform-wide metrics and KPIs
- **User Management** — view, search, and manage all platform users
- **Course Oversight** — monitor all courses across the platform
- **Platform Analytics** — enrollment trends and usage statistics

### 💬 Real-Time Chat
- **Live messaging** powered by Socket.IO
- **Online presence** indicators (who's online right now)
- **Conversation history** with persistent message storage
- **Typing indicators** and real-time delivery

### 🎨 Modern UI/UX
- **Glassmorphism design** with translucent cards and frosted glass effects
- **Dark theme** with neon accent colors and smooth gradients
- **Framer Motion animations** — page transitions, hover effects, micro-interactions
- **Particle backgrounds** and glowing orb visual effects
- **Fully responsive** — optimized for desktop, tablet, and mobile
- **Lottie animations** for engaging loading states
- **Swiper carousels** for featured content

---

## 🛠 Tech Stack

<table>
<tr>
<td align="center" width="50%">

### Frontend
| Technology | Purpose |
|:--|:--|
| **React 18** | UI library with hooks |
| **Vite 5** | Lightning-fast build tool |
| **Tailwind CSS 3** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **React Router v6** | Client-side routing |
| **Socket.IO Client** | Real-time communication |
| **Chart.js** | Data visualization |
| **Firebase SDK** | Google OAuth |
| **Axios** | HTTP client |
| **Lucide React** | Icon library |
| **Swiper** | Touch slider/carousel |
| **React Hot Toast** | Notification toasts |
| **Lottie Player** | JSON animations |

</td>
<td align="center" width="50%">

### Backend
| Technology | Purpose |
|:--|:--|
| **Node.js** | Runtime environment |
| **Express 4** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose 8** | ODM for MongoDB |
| **Socket.IO** | WebSocket server |
| **Firebase Admin** | Token verification |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Multer** | File upload handling |
| **Helmet** | Security headers |
| **Morgan** | HTTP request logging |
| **Express Rate Limit** | API rate limiting |
| **Express Validator** | Input validation |

</td>
</tr>
</table>

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT (React + Vite)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Pages   │  │Components│  │ Context  │  │  Firebase    │   │
│  │(Student, │  │(Navbar,  │  │(Auth,    │  │  (Google     │   │
│  │Instructor│  │ Sidebar, │  │ Socket)  │  │   OAuth)     │   │
│  │ Admin)   │  │ UI Kit)  │  │          │  │              │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│       │              │             │                │           │
│       └──────────────┴─────────────┴────────────────┘           │
│                           │  Axios + Socket.IO                  │
└───────────────────────────┼─────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              │ Dev: Vite Proxy (/api→:5000)│
              │ Prod: VITE_API_URL env var │
              └─────────────┬─────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                    SERVER (Express + Node.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Routes  │  │Controllers│ │Middleware │  │   Socket.IO  │   │
│  │ (8 API   │  │(Business  │ │(Auth,     │  │  (Real-time  │   │
│  │endpoints)│  │  Logic)   │ │ Upload,   │  │   Chat)      │   │
│  │          │  │           │ │ Validate) │  │              │   │
│  └────┬─────┘  └────┬─────┘ └────┬──────┘  └──────┬───────┘   │
│       └──────────────┴────────────┴────────────────┘           │
│                           │  Mongoose ODM                       │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │   MongoDB     │
                    │   (Atlas)     │
                    └───────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** — local install or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
- **Firebase Project** — [Create one](https://console.firebase.google.com/) (for Google OAuth)
- **Git** ([Download](https://git-scm.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/SanjayCheekati/eduverse.git
cd eduverse
```

### 2. Install Dependencies

```bash
# Install all dependencies (root + server + client)
npm run install-all
```

### 3. Environment Setup

#### Server (`server/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/elearning_lms
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
FIREBASE_PROJECT_ID=your-firebase-project-id
CLIENT_URL=http://localhost:5173
```

#### Client (`client/.env`)

```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

> 📋 Copy from the `.env.example` files provided in each directory.

### 4. Firebase Setup (for Google Sign-In)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → **Sign-in method** → **Google** → Enable
4. Go to **Project Settings** → **General** → scroll to **Your apps** → Add a Web app
5. Copy the Firebase config values into `client/.env`
6. Copy the **Project ID** into `server/.env`

### 5. Seed the Database

```bash
cd server
node seed.js
```

This populates the database with:
- 👤 Sample users (students, instructors, admin)
- 📚 12 courses across 6 categories with 252 lessons
- 📝 Course content with descriptions and video URLs

**Default Login Credentials:**

| Role | Email | Password |
|:--|:--|:--|
| Student | `student@eduverse.com` | `password123` |
| Instructor | `angela@eduverse.com` | `password123` |
| Admin | `admin@eduverse.com` | `password123` |

### 6. Run the Application

```bash
# From project root — starts both server and client
npm run dev
```

| Service | URL |
|:--|:--|
| 🌐 Frontend | [http://localhost:5173](http://localhost:5173) |
| ⚙️ Backend API | [http://localhost:5000](http://localhost:5000) |
| 💚 Health Check | [http://localhost:5000/api/health](http://localhost:5000/api/health) |

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|:--|:--|:--|:--|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login with email/password | ❌ |
| `POST` | `/api/auth/google` | Google OAuth sign-in | ❌ |
| `GET` | `/api/auth/me` | Get current user profile | ✅ |
| `PUT` | `/api/auth/profile` | Update profile | ✅ |
| `PUT` | `/api/auth/password` | Change password | ✅ |

### Courses
| Method | Endpoint | Description | Auth |
|:--|:--|:--|:--|
| `GET` | `/api/courses` | List all courses (with filters) | ❌ |
| `GET` | `/api/courses/:id` | Get course details | ❌ |
| `POST` | `/api/courses` | Create course | ✅ Instructor |
| `PUT` | `/api/courses/:id` | Update course | ✅ Instructor |
| `DELETE` | `/api/courses/:id` | Delete course | ✅ Instructor |
| `PUT` | `/api/courses/:id/publish` | Toggle publish status | ✅ Instructor |
| `GET` | `/api/courses/instructor/me` | Get instructor's courses | ✅ Instructor |
| `POST` | `/api/courses/:id/modules` | Add module to course | ✅ Instructor |
| `POST` | `/api/courses/:id/modules/:mid/lessons` | Add lesson to module | ✅ Instructor |

### Enrollments
| Method | Endpoint | Description | Auth |
|:--|:--|:--|:--|
| `POST` | `/api/enrollments/:courseId` | Enroll in a course | ✅ Student |
| `GET` | `/api/enrollments/my` | Get enrolled courses | ✅ Student |
| `PUT` | `/api/enrollments/:courseId/progress` | Update lesson progress | ✅ Student |
| `GET` | `/api/enrollments/:courseId/certificate` | Get certificate | ✅ Student |

### Reviews
| Method | Endpoint | Description | Auth |
|:--|:--|:--|:--|
| `GET` | `/api/reviews/course/:courseId` | Get course reviews | ❌ |
| `POST` | `/api/reviews/course/:courseId` | Add review | ✅ Student |
| `PUT` | `/api/reviews/:id` | Update review | ✅ Student |
| `DELETE` | `/api/reviews/:id` | Delete review | ✅ Student |

### Wishlist & Cart
| Method | Endpoint | Description | Auth |
|:--|:--|:--|:--|
| `GET` | `/api/shop/wishlist` | Get wishlist | ✅ |
| `POST` | `/api/shop/wishlist/:courseId` | Toggle wishlist | ✅ |
| `GET` | `/api/shop/cart` | Get cart | ✅ |
| `POST` | `/api/shop/cart/:courseId` | Add to cart | ✅ |
| `DELETE` | `/api/shop/cart/:courseId` | Remove from cart | ✅ |

### Other
| Method | Endpoint | Description | Auth |
|:--|:--|:--|:--|
| `GET` | `/api/users` | List users (admin) | ✅ Admin |
| `POST` | `/api/upload` | Upload file | ✅ |
| `POST` | `/api/submissions` | Submit assignment | ✅ Student |
| `GET` | `/api/health` | Server health check | ❌ |

---

## 📁 Project Structure

```
eduverse/
├── 📄 package.json              # Root scripts (dev, install-all)
├── 📄 .gitignore                # Git ignore rules
│
├── 🖥️ client/                   # React Frontend
│   ├── 📄 index.html            # Entry HTML
│   ├── 📄 vite.config.js        # Vite config + API proxy
│   ├── 📄 tailwind.config.js    # Tailwind theme
│   ├── 📄 postcss.config.js     # PostCSS plugins
│   ├── 📄 .env.example          # Environment template
│   └── src/
│       ├── 📄 main.jsx          # React entry point
│       ├── 📄 App.jsx           # Root component + routing
│       ├── 📄 index.css         # Global styles
│       ├── config/
│       │   └── 🔥 firebase.js   # Firebase initialization
│       ├── context/
│       │   ├── 🔐 AuthContext.jsx    # Auth state management
│       │   └── 🔌 SocketContext.jsx  # WebSocket management
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Sidebar.jsx
│       │   │   └── DashboardLayout.jsx
│       │   └── ui/
│       │       ├── Loader.jsx
│       │       ├── ParticleField.jsx
│       │       ├── GlowOrbs.jsx
│       │       ├── AnimatedCounter.jsx
│       │       └── PageTransition.jsx
│       ├── pages/
│       │   ├── Landing.jsx       # Home page
│       │   ├── Login.jsx         # Login (+ Google OAuth)
│       │   ├── Register.jsx      # Register (+ Google OAuth)
│       │   ├── CourseCatalog.jsx  # Browse courses
│       │   ├── CourseDetail.jsx   # Course details
│       │   ├── Profile.jsx       # User profile
│       │   ├── Chat.jsx          # Real-time chat
│       │   ├── Wishlist.jsx      # Wishlist
│       │   ├── Cart.jsx          # Shopping cart
│       │   ├── student/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── MyCourses.jsx
│       │   │   ├── Progress.jsx
│       │   │   ├── CourseLearning.jsx
│       │   │   ├── Certificates.jsx
│       │   │   └── CertificateView.jsx
│       │   ├── instructor/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── ManageCourses.jsx
│       │   │   ├── CreateCourse.jsx
│       │   │   ├── Submissions.jsx
│       │   │   └── Analytics.jsx
│       │   └── admin/
│       │       ├── Dashboard.jsx
│       │       ├── Users.jsx
│       │       └── Analytics.jsx
│       └── utils/
│           └── api.js            # Axios API client
│
└── ⚙️ server/                   # Express Backend
    ├── 📄 server.js             # App entry + Socket.IO setup
    ├── 📄 seed.js               # Database seeder
    ├── 📄 addCourseContent.js   # Course content populator
    ├── 📄 .env.example          # Environment template
    ├── config/
    │   └── db.js                # MongoDB connection
    ├── controllers/
    │   ├── authController.js    # Auth + Google OAuth
    │   ├── courseController.js  # Course CRUD
    │   ├── enrollmentController.js
    │   ├── submissionController.js
    │   ├── userController.js
    │   ├── reviewController.js
    │   └── wishlistCartController.js
    ├── middleware/
    │   ├── auth.js              # JWT verification
    │   └── upload.js            # Multer file upload
    ├── models/
    │   ├── User.js              # User schema
    │   ├── Course.js            # Course schema
    │   ├── Enrollment.js        # Enrollment schema
    │   ├── Submission.js        # Submission schema
    │   ├── Review.js            # Review schema
    │   ├── Message.js           # Chat message schema
    │   └── Notification.js      # Notification schema
    ├── routes/
    │   ├── authRoutes.js
    │   ├── courseRoutes.js
    │   ├── enrollmentRoutes.js
    │   ├── submissionRoutes.js
    │   ├── userRoutes.js
    │   ├── reviewRoutes.js
    │   ├── wishlistCartRoutes.js
    │   └── uploadRoutes.js
    ├── socket/
    │   └── socketHandler.js     # Real-time event handling
    ├── utils/
    │   └── generateToken.js     # JWT token generator
    └── uploads/                 # User file uploads
        └── avatars/
```

---

## 🗄️ Database Schema

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    User      │     │   Course     │     │  Enrollment  │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ name         │────▶│ instructor   │     │ student      │
│ email        │     │ title        │◀────│ course       │
│ password     │     │ description  │     │ progress     │
│ googleId     │     │ category     │     │ completedAt  │
│ authProvider │     │ level        │     │ certificate  │
│ role         │     │ price        │     └──────────────┘
│ avatar       │     │ modules[]    │
│ enrolledCourses│   │  └─lessons[] │     ┌──────────────┐
│ createdCourses │   │ thumbnail    │     │   Review     │
│ wishlist     │     │ enrollCount  │     ├──────────────┤
│ cart         │     │ rating       │     │ user         │
└──────────────┘     │ isPublished  │     │ course       │
                     └──────────────┘     │ rating       │
┌──────────────┐                          │ comment      │
│  Message     │     ┌──────────────┐     │ helpful      │
├──────────────┤     │ Submission   │     └──────────────┘
│ sender       │     ├──────────────┤
│ receiver     │     │ student      │     ┌──────────────┐
│ content      │     │ course       │     │ Notification │
│ read         │     │ lesson       │     ├──────────────┤
│ timestamp    │     │ content      │     │ user         │
└──────────────┘     │ grade        │     │ type         │
                     │ feedback     │     │ message      │
                     └──────────────┘     │ read         │
                                          └──────────────┘
```

---

## ⚡ Real-Time Features (Socket.IO)

| Event | Direction | Description |
|:--|:--|:--|
| `connection` | Client → Server | Authenticate & join |
| `sendMessage` | Client → Server | Send chat message |
| `receiveMessage` | Server → Client | Receive chat message |
| `getOnlineUsers` | Client → Server | Request online users list |
| `onlineUsers` | Server → Client | Broadcast online users |
| `typing` | Bidirectional | Typing indicator |
| `messageRead` | Client → Server | Mark message as read |
| `disconnect` | Client → Server | User goes offline |

---

## 🔧 Available Scripts

| Command | Description |
|:--|:--|
| `npm run dev` | Start both server & client concurrently |
| `npm run server` | Start backend only (with nodemon) |
| `npm run client` | Start frontend only (Vite dev server) |
| `npm run install-all` | Install all dependencies |
| `cd server && node seed.js` | Seed database with sample data |
| `cd client && npm run build` | Build frontend for production |

---

## 🌐 Deployment Guide (Both on Vercel)

The app is deployed as **two separate Vercel projects**:
- **Backend** (Express API) → Vercel Serverless Functions
- **Frontend** (React SPA) → Vercel Static Site

> **Note:** Socket.IO (real-time chat) does not work on Vercel serverless. All other features (auth, courses, enrollments, quizzes, etc.) work perfectly.

---

### Step 1: Deploy the Backend on Vercel

1. Go to [vercel.com](https://vercel.com/) and sign in with GitHub
2. Click **Add New → Project** → Import your repo (`SanjayCheekati/eduverse`)
3. Configure the project:

   | Setting | Value |
   |:--|:--|
   | **Project Name** | `eduverse-api` |
   | **Root Directory** | `server` |
   | **Framework Preset** | Other |

   > Leave Build Command and Output Directory empty — Vercel auto-detects from `vercel.json`.

4. Add **Environment Variables**:

   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/elearning_lms
   JWT_SECRET=<your-strong-secret-key>
   JWT_EXPIRE=30d
   FIREBASE_PROJECT_ID=<your-firebase-project-id>
   CLIENT_URL=https://eduverse.vercel.app
   ```

   > Set `CLIENT_URL` to your frontend Vercel URL (you'll create it in Step 2 — update this after).

5. Click **Deploy**
6. Copy the deployed URL (e.g., `https://eduverse-api.vercel.app`)
7. Verify it works: visit `https://eduverse-api.vercel.app/api/health`

---

### Step 2: Deploy the Frontend on Vercel

1. Click **Add New → Project** → Import the **same repo** again
2. Configure the project:

   | Setting | Value |
   |:--|:--|
   | **Project Name** | `eduverse` |
   | **Root Directory** | `client` |
   | **Framework Preset** | Vite |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

3. Add **Environment Variables**:

   ```
   VITE_API_URL=https://eduverse-api.vercel.app/api
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

   > `VITE_API_URL` must point to your backend URL from Step 1, **ending with `/api`**.

4. Click **Deploy**

---

### Step 3: Update CORS & Firebase

1. **Update backend `CLIENT_URL`**: Go to Vercel → `eduverse-api` project → Settings → Environment Variables → set `CLIENT_URL` to your frontend URL (e.g., `https://eduverse.vercel.app`). Then redeploy.

2. **Update Firebase authorized domains**:
   - Go to [Firebase Console](https://console.firebase.google.com/) → Authentication → Settings → Authorized domains
   - Add both domains: `eduverse.vercel.app` and `eduverse-api.vercel.app`

3. **Redeploy** the backend after updating `CLIENT_URL`

---

### Step 4: Seed the Production Database (Optional)

```bash
# Set your production MongoDB URI temporarily
export MONGO_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/elearning_lms"
cd server
node seed.js
```

---

### Deployment Checklist

- [ ] MongoDB Atlas cluster is set up with network access allowed (`0.0.0.0/0`)
- [ ] Backend deployed on Vercel with `server` as root directory
- [ ] `https://eduverse-api.vercel.app/api/health` returns `{"status":"OK"}`
- [ ] Frontend deployed on Vercel with `client` as root directory
- [ ] `VITE_API_URL` on frontend points to backend (`https://..../api`)
- [ ] `CLIENT_URL` on backend points to frontend URL
- [ ] Firebase authorized domains include both Vercel domains
- [ ] `JWT_SECRET` is a strong, unique value (not the default)
- [ ] Tested login, course browsing, and enrollment on production

---

## 📄 License

This project is built for educational purposes.

---

<div align="center">

**Built with ❤️ using the MERN Stack**

*EduVerse — Where Learning Meets Innovation*

</div>
