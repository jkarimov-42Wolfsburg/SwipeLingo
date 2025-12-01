# SwipeLingo - Vercel Deployment Guide with Supabase

## Your Supabase Project
- **URL**: https://kmvxgkbejniggepqvftw.supabase.co
- **Project ID**: kmvxgkbejniggepqvftw

## Step 1: Get Your Supabase PostgreSQL Connection String

### In Supabase Dashboard:
1. Go to your project: https://app.supabase.com
2. Click on your project name → Settings → Database
3. Look for "Connection string" section
4. Select **"Connection pooler"** tab (for serverless applications like Vercel)
5. Copy the connection string that looks like:
   ```
   postgresql://postgres.kmvxgkbejniggepqvftw:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

### Important Notes:
- Use **"Connection pooler"** (NOT "Direct connection") - essential for Vercel
- Replace `[PASSWORD]` with your database password (get it from Settings → Database → Password)
- Keep this string secure - it contains your password!

## Step 2: Deploy to Vercel

### If Not Already Connected to GitHub:
1. Push your code to GitHub
2. Go to https://vercel.com → New Project
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### Set Environment Variables in Vercel:
In your Vercel project settings, add these under "Environment Variables":

```
DATABASE_URL=postgresql://postgres.kmvxgkbejniggepqvftw:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
PGHOST=aws-0-[region].pooler.supabase.com
PGPORT=6543
PGUSER=postgres.kmvxgkbejniggepqvftw
PGPASSWORD=[YOUR_PASSWORD]
PGDATABASE=postgres
SESSION_SECRET=[GENERATE_RANDOM_SECRET]
```

### Generate SESSION_SECRET:
Run this in your terminal:
```bash
openssl rand -base64 32
```
Copy the output and paste it as `SESSION_SECRET`

## Step 3: Verify Database Schema

Before deploying, make sure your Supabase has the correct tables:

### Create Tables (Run in Supabase SQL Editor):
```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(255),
  languages TEXT[] DEFAULT '{}',
  learning_languages TEXT[] DEFAULT '{}',
  user_role VARCHAR(50) DEFAULT 'learner',
  bio TEXT,
  hourly_rate DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Swipes table
CREATE TABLE IF NOT EXISTS swipes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  target_id INTEGER NOT NULL REFERENCES users(id),
  liked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  user1_id INTEGER NOT NULL REFERENCES users(id),
  user2_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES matches(id),
  sender_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  bio TEXT,
  hourly_rate DECIMAL(10,2) NOT NULL,
  languages TEXT[] NOT NULL,
  rating DECIMAL(3,1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_swipes_user_id ON swipes(user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_target_id ON swipes(target_id);
CREATE INDEX IF NOT EXISTS idx_matches_user1_id ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2_id ON matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);
```

## Step 4: Deploy

1. In Vercel dashboard, click "Deploy"
2. Wait for the build to complete
3. Your app will be live at: `https://your-project-name.vercel.app`

## Step 5: Seed Your Database (Optional)

After deployment, seed your database with test users:

### Option A: Local Machine
```bash
DATABASE_URL="your-supabase-connection-string" npm run seed
```

### Option B: Vercel CLI
```bash
vercel env pull  # Get environment variables from Vercel
npm run seed
```

## Step 6: Connect Telegram Mini App

To make this a proper Telegram Mini App:
1. Create a Telegram Bot (ask @BotFather)
2. Set up a Telegram Mini App pointing to your Vercel URL
3. Users can then access: `https://your-telegram-bot.t.me/app`

## Troubleshooting

### Database Connection Issues?
- ✅ Use Connection Pooler (NOT Direct Connection)
- ✅ Port should be 6543 (pooler), NOT 5432 (direct)
- ✅ Include full hostname with region: `aws-0-[region].pooler.supabase.com`

### Vercel Build Fails?
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Make sure `npm run build` works locally

### App Crashes After Deploy?
- Check Vercel function logs
- Verify database connection string is correct
- Run seed script to create tables if missing

## Security Checklist
- [ ] DATABASE_URL uses connection pooler (NOT direct connection)
- [ ] SESSION_SECRET is set to a random value
- [ ] All environment variables are configured in Vercel
- [ ] Database password is NOT committed to Git
- [ ] `.env.local` is in `.gitignore`

## Support
For issues, check:
- Supabase Status: https://status.supabase.com
- Vercel Status: https://www.vercel-status.com
- Next.js Docs: https://nextjs.org/docs
