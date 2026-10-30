# Reader App

Vite + React 19 app for the blog reader (with user accounts, login/register, route guards).

## Setup

### 1) Scaffold
```bash
npm create vite@latest reader-app -- --template react
cd reader-app
npm install
```

### 2) Install dependencies
```bash
npm install react-router
```

### 3) Environment variables (optional)
If you want to use `VITE_API_BASE_URL`, create `.env` in `reader-app/`:
```env
VITE_API_BASE_URL=/api
```

Currently the app uses `/api` as the base URL (via `apiService`) and relies on the Vite dev proxy for local development.

### 4) Run
```bash
npm run dev
```

App runs on `http://localhost:3000`. In development, `/api` requests are proxied to `http://localhost:8000` (see `vite.config.js`).

## Scripts
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
  }
```
