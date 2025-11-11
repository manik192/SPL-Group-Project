# Indian Spice Hub — Beginner Run Guide

_Last updated: 2025-10-28_

This project has two parts:
- **backend/** — Go server (listens on **:8080** by default)
- **frontend/** — React app (proxies to backend at **http://localhost:8080**)

## 1) Install prerequisites
- **Node.js** (v18+ recommended) — https://nodejs.org/
- **Go** (v1.21+ recommended) — https://go.dev/dl/
- **Git** (optional, helpful) — https://git-scm.com/

## 2) MongoDB options

### Option A: Local MongoDB (easiest offline)
1. Install MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Ensure it runs on `mongodb://localhost:27017` (default).

### Option B: MongoDB Atlas (free online cluster)
1. Create a free cluster: https://www.mongodb.com/atlas
2. Create a DB user (username & password).
3. Network → allow your IP (or 0.0.0.0/0 for testing).
4. Get your SRV connection string. It looks like:
   ```
   mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority&appName=<AppName>
   ```
5. In **backend/.env**, set:
   ```
   URL=<your Atlas connection string>
   ```

> This project currently expects env var key `URL` (see `backend/.env`).

## 3) Start the backend (Go)
```bash
cd backend
# Install dependencies and build cache
go mod tidy
# Run the server (listens on :8080)
go run .
```
You should see logs indicating the server is running on port 8080.

## 4) Start the frontend (React)
Open a new terminal:
```bash
cd frontend
npm install   # or: npm ci (if package-lock.json is present)
npm start     # usually starts at http://localhost:3000
```
The frontend is configured with a proxy to `http://localhost:8080` so API calls should work without CORS issues.

## 5) Where to change branding or text later
- **Frontend UI** strings (titles, labels): `frontend/src/**` and `frontend/public/index.html`
- **Readme/docs**: `README.md`, `frontend/README.md`
- **Backend** response messages (if any): `backend/**.go`

## 6) Common issues
- **Go module errors**: run `go mod tidy` inside `backend`, ensure Go 1.21+
- **Port already in use**: change the port in backend code (search `Listen(":8080")`) and update `frontend/package.json` `"proxy"` accordingly
- **Mongo connection refused**: check that `URL` is set correctly in `backend/.env` and that your DB is reachable

Happy cooking with **Indian Spice Hub**! 🍛
