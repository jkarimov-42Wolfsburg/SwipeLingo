# Telegram Mini App - Teacher Matching Platform

## Overview
A Next.js 14 Telegram Mini App for connecting students with teachers. Features swipe-based matching, profile browsing, and real-time messaging.

## Current State
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with Telegram theme integration
- **Authentication**: Telegram WebApp SDK for user authentication
- **Database**: Supabase (PostgreSQL) - requires configuration
- **Status**: MVP with mock data, ready for Supabase integration

## Project Architecture

### Folder Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── home/              # Home/landing page
│   ├── swipe/             # Swipe interface for matching
│   ├── matches/           # View matches and messages
│   ├── profile/           # User profile settings
│   ├── teachers/          # Browse all teachers
│   ├── fonts/             # Custom fonts
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Root redirect to /home
├── components/
│   └── ui/                # Reusable UI components
│       ├── BottomNav.tsx  # Bottom navigation bar
│       ├── SwipeCard.tsx  # Swipeable card component
│       ├── ProfileCard.tsx# Profile display card
│       ├── TeacherCard.tsx# Teacher listing card
│       ├── MatchCard.tsx  # Match/conversation card
│       └── index.ts       # Component exports
└── lib/
    ├── supabase/          # Supabase client configuration
    │   ├── client.ts      # Browser client
    │   └── server.ts      # Server-side client
    └── telegram/          # Telegram integration
        └── TelegramProvider.tsx # Telegram context provider
```

### Key Components
- **TelegramProvider**: Handles Telegram WebApp initialization and user data
- **BottomNav**: Persistent navigation with 5 main sections
- **SwipeCard**: Draggable card with swipe gestures for matching

## Environment Variables Required

### Secrets (Store in Replit Secrets)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `TELEGRAM_BOT_TOKEN` - (Optional) For bot token validation

## Running the App
```bash
npm run dev
```
The app runs on port 5000 and is configured for Telegram WebApp integration.

## Recent Changes
- Initial project setup with Next.js 14 and TailwindCSS
- Created all main pages: home, swipe, matches, profile, teachers
- Added Telegram WebApp SDK integration
- Set up Supabase client for future database integration
- Created reusable UI components library

## User Preferences
- Clean, minimal UI design
- Telegram-native styling and themes
- Mobile-first responsive layout

## Next Steps
1. Add Supabase credentials to environment
2. Create database schema for users, matches, and messages
3. Implement real authentication flow
4. Replace mock data with database queries
5. Add real-time messaging with Supabase Realtime
