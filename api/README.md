# API

Express 5 + Prisma 7 + Postgres API for the Odin Blog.

## Setup

### 1) Initialize
```bash
mkdir api
cd api
npm init -y
```

Set `"type": "module"` in `package.json`.

### 2) Install dependencies
```bash
# Core
npm install express cors cookie-parser dotenv nodemon

# Auth
npm install jsonwebtoken bcryptjs passport passport-jwt express-validator

# Database (Postgres + Prisma 7)
npm install pg prisma @prisma/client @prisma/adapter-pg @prisma/client-runtime-utils
```

### 3) Prisma
```bash
npx prisma init
```

- Write your schema in `prisma/schema.prisma`
- Set `generator client { provider = "prisma-client-js", output = "../generated/prisma" }` in the schema
- Run migrations and generate client:
```bash
npx prisma migrate dev
npx prisma generate
```

### 4) Environment variables
Create `.env` in `api/` with the following:
```env
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/odin_blog?schema=public"
PORT=8000
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1m
REFRESH_TOKEN_EXPIRY=10d

AUTHOR_SECRET=your_author_secret
AUTHOR_PARAM=your_author_param
```

### 5) Run
```bash
npm run dev
```

Server runs on `http://localhost:8000`. Routes are mounted under `/api`.

## Scripts
```json
"scripts": {
  "dev": "nodemon --env-file=.env server.js"
}
```

## Notes
- `api/generated/prisma/` is gitignored. Run `npx prisma generate` after installing dependencies.
- Refresh tokens are stored as hashed values in the database. Access tokens are sent in the Authorization header, refresh tokens are sent via httpOnly cookies.
