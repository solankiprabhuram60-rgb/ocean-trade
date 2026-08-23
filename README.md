# Ocean Trade

A **CGTrader-style 3D marketplace** built with Next.js 15, featuring **glass UI**, **animations**, **admin product uploads**, and **live search**.

## Features

- **Glass morphism UI** with animated background (Framer Motion)
- **Admin dashboard** — upload product images + 3D model files
- **SQLite database** — products stored persistently
- **Working search** — search by title, description, category, tags, author
- **Public catalog** — users browse and download uploaded models

## Quick Start

```bash
cd ocean-trade
npm install
npm run db:migrate   # first time only
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Upload

1. Go to **http://localhost:3000/admin**
2. Login with password: `admin123` (change in `.env` → `ADMIN_PASSWORD`)
3. Fill in product details and upload:
   - **Product image** (preview thumbnail)
   - **3D model file** (.fbx, .obj, .stl, .blend, .zip, .glb)
4. Products appear instantly on homepage and `/models`

## Search

- Use the search bar in the **header** or **hero**
- Searches title, description, category, tags, and author
- Results at `/models?q=your+search`

## Environment Variables

Copy `.env.example` to `.env`:

```
ADMIN_PASSWORD=admin123
DATABASE_URL="file:./dev.db"
```

## Tech Stack

- Next.js 15 (App Router)
- Prisma 7 + SQLite
- Frisma Motion
- Tailwind CSS
- TypeScript

## Project Structure

```
src/
├── app/
│   ├── admin/page.tsx       # Admin upload dashboard
│   ├── models/              # Browse + product detail
│   └── api/
│       ├── products/        # Public product API + search
│       └── admin/           # Admin auth + upload API
├── components/
│   ├── SearchBar.tsx        # Working search component
│   ├── ProductGrid.tsx      # Fetches from API
│   └── AnimatedBackground.tsx
└── lib/
    ├── db.ts                # Prisma client
    └── upload.ts            # File upload handler
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |
