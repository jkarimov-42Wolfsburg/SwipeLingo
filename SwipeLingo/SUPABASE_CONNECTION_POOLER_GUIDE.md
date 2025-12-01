# How to Find Your Supabase Connection Pooler String - Step by Step

## Your Project Details
- **Project ID**: kmvxgkbejniggepqvftw
- **URL**: https://kmvxgkbejniggepqvftw.supabase.co

---

## EXACT STEPS (Follow These Carefully)

### Step 1: Go to Supabase Dashboard
1. Open: https://app.supabase.com
2. Sign in with your account
3. Click on your project name: **"kmvxgkbejniggepqvftw"**

### Step 2: Find the Connect Button
1. Look at the **TOP RIGHT** of your dashboard
2. You should see a blue button that says **"Connect"**
3. Click on it

![Location: Top right corner of dashboard]

### Step 3: Choose Your Connection Type
After clicking "Connect", a dropdown menu will appear with these options:

```
Choose connection method:
├─ Direct connection
├─ Session pooler (port 5432)  ← Click this for best compatibility
└─ Transaction pooler (port 6543)  ← Alternative option
```

**For Vercel, choose: "Session pooler (port 5432)"**

### Step 4: Copy Your Connection String
You'll see a text box with your connection string. It will look like:

```
postgres://postgres.[PROJECT_ID]:[YOUR_PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
```

**Example for your project:**
```
postgres://postgres.kmvxgkbejniggepqvftw:[PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
```

**Copy the entire string** - this is your `DATABASE_URL`

---

## What Each Part Means

| Part | Example | What to Do |
|------|---------|-----------|
| Username | `postgres.kmvxgkbejniggepqvftw` | Keep as-is (includes project ID) |
| Password | `[PASSWORD]` | Replace with your database password |
| Host | `aws-0-[region].pooler.supabase.com` | Keep as-is (auto-selected by region) |
| Port | `5432` | Keep as-is (this is pooler port) |
| Database | `postgres` | Keep as-is |

---

## Finding Your Database Password

If you need your password:

1. In Supabase dashboard, click **Settings** (bottom left)
2. Go to **Database** tab
3. Scroll down to find **"Database password"** section
4. Click **"Reveal"** to see it
5. Copy and paste it into your connection string where it says `[PASSWORD]`

---

## What NOT to Use

❌ **DON'T use Direct connection** (this won't work with Vercel serverless)
- It looks like: `postgresql://postgres:[PASSWORD]@db.xxxxxxxx.supabase.co:5432/postgres`

❌ **DON'T use the OLD "Connection pooler" tab** (if you see it)
- Different UI, might confuse you

---

## Your Final Connection String

Once you have it, it should look like:
```
postgres://postgres.kmvxgkbejniggepqvftw:[YOUR_ACTUAL_PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

**Save this safely** - you'll paste it into Vercel next!

---

## Troubleshooting

**Q: I clicked Connect but see no dropdown menu?**
- A: Try refreshing the page (Ctrl+R or Cmd+R)
- Try clicking the "Connect" button again

**Q: I see "Connecting..." and it stays there?**
- A: Wait 10 seconds, or refresh the page

**Q: I can only see "Direct connection" option?**
- A: Look carefully at the menu - sometimes Session/Transaction options are below
- Scroll down if needed, or try different browser

**Q: The connection string shows `[PASSWORD]`**
- A: That's normal! The actual password is hidden for security
- You need to manually replace `[PASSWORD]` with your real password
- Go to Settings → Database to find your actual password

---

## Next Step: Add to Vercel

Once you have your connection string, go to:
- https://vercel.com → Your Project → Settings → Environment Variables
- Add it as `DATABASE_URL`
- Then add the other variables from `VERCEL_SETUP_GUIDE.md`

