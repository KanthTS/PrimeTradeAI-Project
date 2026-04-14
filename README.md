# PrimeTradeAI Full-Stack Assignment

Production-style full-stack application with JWT auth, role-based authorization, task CRUD, API versioning, and React frontend integration.

## Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: bcrypt password hashing + JWT
- Security: helmet, hpp, mongo sanitize, xss clean, validation
- API Docs: Swagger (`/api-docs`) + Postman collection
- Frontend: React + Vite + React Router + Axios

## Project Structure

- `backend/` - REST API server
- `frontend/` - React app

---

## Backend Setup

1. Open terminal in `backend/`
2. Copy `.env.example` to `.env`
3. Configure:
   - `MONGO_URI`
   - `JWT_SECRET`
4. Install dependencies:

```bash
npm install
```

5. Start development server:

```bash
npm run dev
```

Backend runs at `http://localhost:5001`.

### API Versioning

All APIs are under:

- ` /api/v1/auth/*`
- ` /api/v1/tasks/*`

### Core Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (protected)
- `GET /api/v1/auth/admin-only` (admin role only)
- `POST /api/v1/tasks` (protected)
- `GET /api/v1/tasks` (protected, admin gets all)
- `GET /api/v1/tasks/:id` (protected)
- `PUT /api/v1/tasks/:id` (protected)
- `DELETE /api/v1/tasks/:id` (protected)

### API Documentation

- Swagger UI: `http://localhost:5001/api-docs`
- Postman Collection: `backend/docs/postman_collection.json`

### Database Schema (MongoDB)

#### User

- `name` (String)
- `email` (String, unique)
- `password` (hashed)
- `role` (`user` | `admin`)
- `timestamps`

#### Task

- `title` (String)
- `description` (String)
- `status` (`pending` | `in-progress` | `done`)
- `owner` (ObjectId -> User)
- `timestamps`

---

## Frontend Setup

1. Open terminal in `frontend/`
2. Copy `.env.example` to `.env`
3. Install dependencies:

```bash
npm install
```

4. Start app:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Frontend Features

- User registration and login UI
- JWT token storage and protected route handling
- Dashboard (authenticated)
- Task CRUD operations integrated with backend API
- API success/error response rendering

---

## Security Practices Implemented

- Password hashing with `bcryptjs`
- JWT authentication middleware
- Role-based access control (`user`, `admin`)
- Input validation with `express-validator`
- Request sanitization (`express-mongo-sanitize`, `xss-clean`)
- Security headers (`helmet`)
- Parameter pollution protection (`hpp`)

---

## Scalability Notes

Current architecture is modular and ready to scale by:

1. Splitting modules into independent services (`auth`, `tasks`, `notifications`) when traffic grows.
2. Introducing Redis caching for frequent read endpoints (`GET /tasks`).
3. Running multiple stateless API instances behind a load balancer.
4. Adding centralized logging/monitoring (Winston + ELK/Datadog).
5. Containerizing backend/frontend with Docker and orchestrating deployments with Kubernetes.

---

## Deliverables Checklist

- [x] Authentication APIs with hashing + JWT
- [x] Role-based authorization
- [x] CRUD APIs for secondary entity (tasks)
- [x] API versioning + error handling + validation
- [x] Swagger + Postman documentation
- [x] Database schema with MongoDB
- [x] Basic frontend integration (register/login/protected dashboard/CRUD)
- [x] Scalability strategy notes
