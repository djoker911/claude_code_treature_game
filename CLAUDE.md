# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start both Vite (port 3000) and Express API (port 3001) concurrently
npm run dev:client # Vite only
npm run dev:server # Express API only
npm run build      # Build for production (output: build/)
```

No test or lint scripts are configured.

## Architecture

This is a full-stack app: a React + TypeScript frontend (Vite) paired with an Express + SQLite backend.

**Frontend entry point:** `src/main.tsx` renders `<Root>`, which manages auth state (localStorage token/username) and gates rendering between `<AuthScreen>` and `<App>`.

**Game loop (src/App.tsx):**
1. `initializeGame()` randomly assigns treasure to one of 3 boxes
2. Player clicks boxes → `openBox(boxId)` updates score (+$100 treasure, -$50 skeleton) and triggers animation + audio
3. Game ends when treasure is found or all boxes opened
4. On game end, if user is logged in, score is saved via `api.saveScore()`

**App.tsx receives props:** `currentUser: { username, token } | null` and `onSignOut`. Guest users get `currentUser = null` and scores are not saved.

**State in App.tsx:**
- `boxes: Box[]` — array of 3 boxes (`{ id, isOpen, hasTreasure }`)
- `score: number`
- `gameEnded: boolean`

**Backend (server/):**
- `server/index.js` — Express app on port 3001
- `server/db.js` — better-sqlite3 database, creates `users` and `scores` tables on startup; stores `game.db` in `server/`
- `server/routes/auth.js` — POST `/api/auth/signup` and `/api/auth/signin` (bcrypt passwords, JWT tokens)
- `server/routes/scores.js` — POST/GET `/api/scores` (JWT-authenticated)

Vite proxies `/api` to `http://localhost:3001` in dev. The client API wrapper lives in `src/lib/api.ts`.

**Key dependencies:**
- `motion` (Framer Motion) — 3D chest flip and hover animations
- Radix UI — large set of pre-built UI primitives in `src/components/ui/` (mostly unused by the game itself, available for extensions)
- Tailwind CSS via `src/styles/globals.css` with CSS variables in oklch color space
- `@` path alias resolves to `src/`
- `better-sqlite3` + `express` + `jsonwebtoken` + `bcrypt` — backend stack

**Assets:**
- Images: `src/assets/` (treasure_closed.png, treasure_opened.png, treasure_opened_skeleton.png, key.png)
- Audio: `src/audios/` (chest_open.mp3, chest_open_with_evil_laugh.mp3)
- `src/components/figma/ImageWithFallback.tsx` — image component with base64 SVG fallback
