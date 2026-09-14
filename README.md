# MERN To-Do Dashboard

A full-stack to-do list application built with the MERN stack (MongoDB, Express, React, Node.js), featuring secure cookie-based authentication with JWT access/refresh token rotation.

## Live Demo

- **Frontend:** [mern-to-do-dashboard-axnp.vercel.app](https://mern-to-do-dashboard-axnp.vercel.app)
- **Backend API:** Hosted on Render

## Features

- User registration and login with hashed passwords (bcrypt)
- JWT-based authentication using short-lived access tokens and long-lived refresh tokens
- `httpOnly`, `secure` cookies for token storage (XSS-resistant)
- Automatic token refresh via axios interceptors
- Create, read, update, and delete to-do items
- Mark to-dos as complete/pending
- Responsive UI built with Tailwind CSS
- Client-side routing with React Router
- Toast notifications for errors and feedback
- Silent token refresh via axios response interceptors (expired access tokens are refreshed transparently and the original request is retried, with no visible interruption to the user)
- React error boundaries to gracefully catch and display rendering errors without crashing the app
- Input validation on both the frontend (form-level checks before submission) and backend (server-side checks on all incoming request data)

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- React Toastify
- Lucide React (icons)

### Backend
- Node.js + Express 5
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcrypt for password hashing
- cookie-parser
- CORS (configured for cross-origin cookie-based auth)

## Project Structure

```
MERN_To-Do-Dashboard/
├── frontend/          # React + Vite client
│   ├── src/
│   │   ├── api/       # Axios instances (auth + private, with interceptors)
│   │   ├── layouts/   # Route layout components
│   │   ├── pages/     # Route pages (auth, todos, 404, etc.)
│   │   └── components/
│   └── vercel.json    # SPA rewrite rules
└── backend/           # Express API server
    ├── config/        # Database connection
    ├── routes/        # Auth and todos routers
    └── server.js
```

## Getting Started

### Prerequisites
- Node.js 20+
- A MongoDB Atlas cluster (or local MongoDB instance)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/config/`:

```
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLIENT_URL=http://localhost:5173
PORT=5000
```

Run the dev server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```
VITE_API_URL=http://localhost:5000
```

Run the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Authentication Flow

1. On login/register, the server issues an **access token** (10 min expiry) and a **refresh token** (10 day expiry), both set as `httpOnly` cookies.
2. The refresh token is hashed with bcrypt before being stored in the database.
3. When an API request returns `401`, an axios response interceptor performs a **silent refresh**: it automatically calls `/auth/refresh` to obtain a new access token, then transparently retries the original request. Concurrent requests that fail while a refresh is already in progress are queued and resolved once the new token is available, avoiding duplicate refresh calls.
4. Cookies are scoped with `sameSite: "none"` and `secure: true` in production to support the cross-domain frontend/backend deployment.

## Error Handling & Validation

- **Error boundaries:** React error boundaries wrap route components to catch rendering errors and display a fallback UI instead of crashing the entire app.
- **Frontend validation:** Forms (login, register, todo creation) validate input client-side before submission, giving immediate feedback on issues like short passwords or missing fields.
- **Backend validation:** All routes independently validate incoming request data (required fields, types, length constraints) regardless of frontend checks, since client-side validation can be bypassed.

## Deployment Notes

- **Frontend** is deployed on Vercel with a root directory of `frontend` and SPA rewrites configured in `vercel.json` to support client-side routing.
- **Backend** is deployed on Render as a persistent Node server (not serverless), which avoids cold-start issues with the MongoDB connection and cookie-based auth.
- CORS on the backend allows the production frontend URL plus Vercel preview deployment URLs via a regex pattern.
- Environment variables are configured separately in each platform's dashboard and are not committed to the repository.

## Environment Variables Reference

### Backend
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `ACCESS_TOKEN_SECRET` | Secret used to sign short-lived access tokens |
| `REFRESH_TOKEN_SECRET` | Secret used to sign long-lived refresh tokens |
| `CLIENT_URL` | Deployed frontend URL, used for CORS |

### Frontend
| Variable | Description |
|---|---|
| `VITE_API_URL` | Deployed backend URL |

## License

MIT
