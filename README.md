# Smart Railway Reservation System

Full-stack train booking app with React (Vite) frontend and Express + MongoDB backend.

## How to run (step by step)

### 1. Prerequisites

- **Node.js** 18 or newer ([nodejs.org](https://nodejs.org))
- **MongoDB** running on your PC (Windows service name is usually `MongoDB`)

Check MongoDB in PowerShell:

```powershell
Get-Service MongoDB
```

Status should be **Running**. If not:

```powershell
Start-Service MongoDB
```

### 2. Open the project folder

```powershell
cd "C:\Users\bauch\OneDrive\Desktop\Rersarvation_system"
```

### 3. First-time setup (install + database seed)

```powershell
npm install
npm install --prefix server
npm run seed
```

### 4. Start the app (API + website together)

```powershell
npm start
```

Wait until you see both lines in the terminal:

- `Local: http://localhost:5173/`
- `Express API Server Running on port 5000`
- `MongoDB Connected`

### 5. Open in the browser

Use **only** this URL (not `index.html`, not port 5000):

**http://localhost:5173**

- Port **5000** = API only (JSON), not the website
- Opening `index.html` directly = blank page (wrong)

### 6. Stop the app

Press `Ctrl + C` in the terminal.

---

## Quick start (one command after setup)

```powershell
npm start
```

- Frontend: http://localhost:5173
- API: http://localhost:5000

## Demo accounts (after seed)

| Role  | Email               | Password       |
|-------|---------------------|----------------|
| Admin | admin@smartrail.com | adminpassword  |
| User  | user@smartrail.com  | userpassword   |

**Admin portal:** http://localhost:5173/admin/login → then full control panel at `/admin`

## Maharashtra trains (includes Kolhapur)

Search examples: `Kolhapur (KOP)` → `Mumbai CSMT (CSMT)`, `Pune Junction (PUNE)` → `Kolhapur (KOP)`

17 trains seeded (5 national + 12 Maharashtra routes).

## Requirements

- Node.js 18+
- MongoDB running locally on `mongodb://127.0.0.1:27017`

## Scripts

| Command        | Description                          |
|----------------|--------------------------------------|
| `npm run setup`| Install deps + seed database         |
| `npm start`    | Run API + frontend together          |
| `npm run seed` | Re-seed database with demo data      |
| `npm run dev`  | Frontend only                        |
