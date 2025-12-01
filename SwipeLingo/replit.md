# SwipeLingo - Telegram Mini App for Language Learning

**Motto:** SWIPE-MATCH-SPEAK

## Overview
A Next.js 14 Telegram Mini App for connecting language learners with teachers. Features swipe-based matching, profile browsing, real-time messaging, and a complete database backend. Users can discover teachers through an engaging swipe interface, match with compatible educators, and chat in real-time to practice languages.

## Current State
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with Telegram theme integration
- **Authentication**: Telegram WebApp SDK for user authentication
- **Database**: PostgreSQL with direct pg client
- **Status**: Fully functional with seeded data (400 users, 10 teachers)

## Project Architecture

### Folder Structure
```
src/
├── app/
│   ├── api/                # API routes
│   │   ├── users/          # User CRUD operations
│   │   ├── swipe/          # Swipe actions and candidates
│   │   ├── matches/        # Match listings
│   │   ├── messages/       # Chat messages
│   │   └── teachers/       # Teacher listings
│   ├── chat/[matchId]/     # Chat page for matches
│   ├── home/               # Home/landing page
│   ├── swipe/              # Swipe interface for matching
│   ├── matches/            # View matches and messages
│   ├── profile/            # User profile settings
│   ├── teachers/           # Browse all teachers
│   ├── fonts/              # Custom fonts
│   ├── globals.css         # Global styles with Telegram theme
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Root redirect to /home
├── components/
│   └── ui/                 # Reusable UI components
│       ├── BottomNav.tsx   # Bottom navigation bar
│       ├── SwipeCard.tsx   # Swipeable card component
│       ├── ProfileCard.tsx # Profile display card
│       ├── TeacherCard.tsx # Teacher listing card
│       ├── MatchCard.tsx   # Match/conversation card
│       └── index.ts        # Component exports
├── lib/
│   ├── db/                 # Database utilities
│   │   ├── index.ts        # PostgreSQL connection pool
│   │   └── types.ts        # TypeScript type definitions
│   ├── supabase/           # Supabase client (alternative)
│   │   ├── client.ts       # Browser client
│   │   └── server.ts       # Server-side client
│   └── telegram/           # Telegram integration
│       └── TelegramProvider.tsx # Context provider with DB sync
scripts/
└── seed.ts                 # Database seeding script (400 users)
```

### Database Schema
```sql
-- users: Main user table with Telegram integration
-- swipes: Tracks like/dislike actions between users
-- matches: Created when two users mutually like each other
-- teachers: Extended profile for users with teacher role
-- messages: Chat messages between matched users
```

### Key Features
- **Telegram Detection**: Automatically syncs Telegram user to database
- **Swipe Matching**: Tinder-style card swiping with auto-match detection
- **Real-time Chat**: Polling-based messaging between matches
- **Teacher Profiles**: Browse and filter teachers by language/rate

## Environment Variables

### Available (Auto-configured)
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

### Optional Secrets
- `NEXT_PUBLIC_SUPABASE_URL` - If using Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - If using Supabase
- `TELEGRAM_BOT_TOKEN` - For bot token validation

## Commands
```bash
npm run dev      # Start development server on port 5000
npm run seed     # Seed database with 400 fake users
npm run build    # Build for production
npm run start    # Start production server
```

## Recent Changes (December 2024)
- Created PostgreSQL database with full schema
- Implemented Telegram user detection and DB sync
- Built swipe deck with animations and auto-matching
- Added real-time chat with polling
- Created seed script with 400 users (10 teachers, 390 learners)
- Added language filtering and teacher search
- Fixed TelegramProvider loading bug (stale closure & dev fallback)
- Configured for Vercel deployment with vercel.json

## Deployment Configuration

### Vercel + Supabase Setup
The app is configured for Vercel deployment via `vercel.json`:
- **Node Version**: 20.x
- **Framework**: Next.js 14 (auto-detected)
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Supabase Project**: kmvxgkbejniggepqvftw
- **Supabase URL**: https://kmvxgkbejniggepqvftw.supabase.co

### Quick Vercel Deployment Steps
1. Get Supabase PostgreSQL connection string (Connection Pooler):
   - Go to Supabase Dashboard → Settings → Database
   - Copy Connection Pooler string (port 6543)
2. Push code to GitHub
3. Go to Vercel → Import your GitHub repo
4. Add these environment variables:
   - `DATABASE_URL` - Your Supabase connection pooler string
   - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - From Supabase
   - `SESSION_SECRET` - Run: `openssl rand -base64 32`
5. Deploy!
6. (Optional) Seed database: `npm run seed` with your DATABASE_URL

See `VERCEL_SETUP_GUIDE.md` for complete detailed instructions.

## User Preferences
- Clean, minimal UI design
- Telegram-native styling and themes
- Mobile-first responsive layout
- Smooth animations for swipe interactions

## API Endpoints
- `POST/GET /api/users` - Create/fetch user by telegram_id
- `PUT/GET /api/users/[id]` - Update/fetch user by ID
- `POST/GET /api/swipe` - Record swipe, get candidates
- `GET /api/matches` - Get user's matches
- `POST/GET /api/messages` - Send/fetch messages
- `POST/GET /api/teachers` - Create teacher profile, list teachers
