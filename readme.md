# Pixelry

A Pinterest-inspired web application for discovering, sharing, and saving beautiful images and ideas.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

---

## Live Demo

[Deployment Link Here](https://your-deployment-url.com)

---

## Features

- User authentication (signup, login, JWT)
- Create, view, like, and save image "pins"
- Follow/unfollow users
- Infinite scroll and masonry grid layout
- Responsive design with Tailwind CSS
- Image uploads via Cloudinary
- User profiles and stats

---

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, Supabase, Cloudinary
- **Database:** PostgreSQL (via Supabase)
- **Other:** JWT, Multer, Lucide React icons

---

## Project Structure

```
Imgfly/
├── src/                # Frontend source code
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/             # Backend source code
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   ├── .env
│   └── .env.example
├── supabase/           # Database migrations
│   └── migrations/
│       └── 20250802112036_silver_rice.sql
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/imgfly.git
   cd imgfly
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `server/.env.example` to `server/.env` and fill in your credentials.

4. **Run the application:**
   ```sh
   npm run dev
   ```
   - This starts both frontend and backend servers.

---

## Environment Variables

See `server/.env.example` for required variables:

- Supabase credentials
- JWT secret
- Cloudinary credentials
- Server port

---

## Scripts

- `npm run dev` — Start frontend and backend in development mode
- `npm run client` — Start frontend only
- `npm run server` — Start backend only
- `npm run build` — Build frontend for production
- `npm run lint` — Run ESLint
- `npm run preview` — Preview production build

---

## Database Schema

See [`supabase/migrations/20250802112036_silver_rice.sql`](supabase/migrations/20250802112036_silver_rice.sql) for full schema:

- Tables: `users`, `pins`, `pin_likes`, `pin_saves`, `user_follows`
- Row Level Security and policies
- Indexes and triggers

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

---

## License

This project is licensed under the MIT License.