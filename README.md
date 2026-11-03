# 🌍 UnityPulse - Social Development Events (Server)

Welcome to the backend server repository for **UnityPulse** — a platform dedicated to organizing, managing, and participating in social development and community drives. This server handles database operations, secure user authentication verification via JWKS, and API management using **Node.js**, **Express.js**, and **MongoDB**.

---

## 🔗 Project Links

- **Live Server Base URL:** [https://social-unitypulse-server.vercel.app](https://social-unitypulse-server.vercel.app)
- **Frontend Live Site:** [https://social-unitypulse.vercel.app](https://social-unitypulse.vercel.app)
- **Client Repository:** [https://github.com/asad4405/social-development-events-client](https://github.com/asad4405/social-development-events-client)

---

## ✨ Features & Functionalities

- **🔐 Dynamic JWKS Verification:** Custom middleware (`verifyToken`) utilizing `jose` to verify JWT tokens against Better Auth's dynamic JWKS endpoint (`${process.env.CLIENT_URL}/api/auth/jwks`).
- **📅 Event CRUD Operations:** Full capabilities to Create, Read, Update, and Delete community events.
- **🙋 Dynamic Event Joining System:** Allows authenticated users to RSVP/join events with duplicate registration prevention logic.
- **📊 User Dashboard Data:** Dedicated API endpoints to fetch events created or joined by specific users.
- **⚡ Fast Database Queries:** Powered by native MongoDB Driver with optimized search and sort operations.
- **☁️ Serverless Ready:** Fully configured for deployment on Vercel with exported Express application handlers.

---

## 🛠️ Tech Stack & Dependencies

- **Runtime Environment:** Node.js
- **Web Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **Security & Authentication:** `jose` (JWT Verification via Remote JWKS)
- **Middleware & Utilities:** `cors`, `dotenv`, `mongodb`

---

## 📡 API Endpoints Overview

### 🔓 Public Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check route |
| `GET` | `/events` | Fetch all upcoming events (sorted chronologically) |
| `GET` | `/events/:id` | Fetch detailed information for a single event |
| `GET` | `/join-event/:eventId` | Fetch all volunteers/users who joined a specific event |

### 🔒 Protected Routes (Requires Bearer Token)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/event-create` | Create a new event |
| `GET` | `/events/manage/:userId` | Fetch events created by a specific user |
| `PATCH` | `/events/:id` | Update an existing event |
| `DELETE` | `/events/:id` | Delete an event |
| `POST` | `/join-event` | Join/RSVP to an event |
| `GET` | `/joined-event/:userId` | Fetch events joined by a specific user |

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory and add the following configuration:

```env
PORT=8000
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
CLIENT_URL=[https://social-unitypulse.vercel.app](https://social-unitypulse.vercel.app)