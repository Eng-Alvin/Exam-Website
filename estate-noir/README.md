# ESTATE.NOIR

A luxury real estate listing platform. Browse, list, and manage premium properties with a curated dark aesthetic.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS v4
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (jsonwebtoken + bcryptjs)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`)

### 1. Clone & install

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment

```bash
# server/.env is pre-configured for local development
# Edit server/.env to change MONGO_URI or JWT_SECRET for production
```

### 3. Run

**Terminal 1 — API server:**
```bash
cd server
npm run dev
# → API live at http://localhost:5000
```

**Terminal 2 — React client:**
```bash
cd client
npm run dev
# → App live at http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✓ | Get current user |
| PUT | `/api/auth/profile` | ✓ | Update profile |
| PUT | `/api/auth/password` | ✓ | Change password |
| GET | `/api/estates` | — | List all estates (filterable) |
| GET | `/api/estates/mine` | ✓ | My listings |
| GET | `/api/estates/:id` | — | Single estate |
| POST | `/api/estates` | ✓ | Create estate |
| PUT | `/api/estates/:id` | ✓+owner | Update estate |
| DELETE | `/api/estates/:id` | ✓+owner | Delete estate |

## Features

- JWT authentication with protected routes
- Full CRUD for property listings
- Search & filter by city, price range, and category
- Personal portfolio dashboard
- Profile & password management
- Responsive ESTATE.NOIR dark luxury design
