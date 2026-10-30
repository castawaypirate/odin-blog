# Author App

Vite + React 19 app for the blog author (author-only login/register, dashboard, and post create/edit/view screens).

## Setup

### 1) Scaffold
```bash
npm create vite@latest author-app -- --template react
cd author-app
npm install
```

### 2) Install dependencies
```bash
npm install react-router
```

### 3) Environment variables
Create `.env` in `author-app/`:
```env
VITE_AUTHOR_PARAM=your_author_param
```

`VITE_AUTHOR_PARAM` is sent as `requireRole` on login and checked against `AUTHOR_PARAM` in the API, so only authors can sign in. Registration also asks for the `AUTHOR_SECRET` value in the secret field.

### 4) Run
```bash
npm run dev
```

App runs on `http://localhost:3001`. In development, `/api` requests are proxied to `http://localhost:8000` (see `vite.config.js`).

## Routes

| Route       | Access      | Page       |
| ----------- | ----------- | ---------- |
| `/`         | Author only | Dashboard  |
| `/create`   | Author only | CreatePost |
| `/edit/:id` | Author only | EditPost   |
| `/post/:id` | Author only | ViewPost   |
| `/login`    | Public only | Login      |
| `/register` | Public only | Register   |

## Scripts
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
  }
```

## Notes

- Same auth model as `reader-app`: access token in memory, refresh token in an httpOnly cookie, and `withRetry` retries once after a 401.
- `Dashboard`, `CreatePost`, `EditPost` and `ViewPost` are placeholders for now.
