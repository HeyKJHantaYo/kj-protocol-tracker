# KJ Protocol Tracker — Deployment Guide

## 3-Step Deploy: Supabase + Vercel + iPhone

Total time: ~15 minutes

---

## STEP 1: Create Supabase Project (5 min)

1. Go to **https://supabase.com** → Sign in (or create free account)
2. Click **"New Project"**
   - Name: `kj-protocol`
   - Database password: generate a strong one (you won't need it directly)
   - Region: pick closest to Miami → **US East**
   - Click "Create new project" — wait ~60 seconds
3. Once ready, click **SQL Editor** in the left sidebar
4. Paste the **entire contents** of `supabase-schema.sql` (included in this repo)
5. Click **Run** — you should see "Success. No rows returned"
6. Go to **Settings → API** (left sidebar → gear icon → API)
7. Copy these two values (you'll need them in Step 2):
   - **Project URL** → looks like `https://abcdefgh.supabase.co`
   - **anon public** key → long string starting with `eyJ...`

---

## STEP 2: Deploy to Vercel (5 min)

### Option A: GitHub (recommended)

1. Push this entire folder to a **private** GitHub repo
2. Go to **https://vercel.com** → Sign in → "Add New Project"
3. Import the GitHub repo
4. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Project URL from Step 1
   - `VITE_SUPABASE_ANON_KEY` = your anon key from Step 1
5. Click **Deploy** — takes ~60 seconds

### Option B: Vercel CLI (if you prefer terminal)

```bash
# Install Vercel CLI if needed
npm i -g vercel

# In this project folder:
vercel

# Follow prompts, then set env vars:
vercel env add VITE_SUPABASE_URL
# paste your URL

vercel env add VITE_SUPABASE_ANON_KEY
# paste your key

# Redeploy with env vars:
vercel --prod
```

---

## STEP 3: Add to iPhone Home Screen (2 min)

1. Open Safari on your iPhone
2. Navigate to your Vercel URL (e.g., `https://kj-protocol.vercel.app`)
3. Tap the **Share** button (square with arrow)
4. Scroll down → tap **"Add to Home Screen"**
5. Name it "Protocol" → tap **Add**

The app will now launch full-screen like a native app — no Safari toolbar, no URL bar. The "KJ" icon appears on your home screen.

---

## How It Works

- **Supabase** stores all your data in a `kv_store` table (key-value pairs)
- **localStorage** acts as an instant cache — the app writes there first, then syncs to Supabase
- **If offline**, the app works from cache and syncs when connection returns
- **PWA service worker** caches the app shell so it loads instantly even offline

---

## Project Structure

```
kj-deploy/
├── index.html              # Entry HTML with iOS meta tags
├── package.json            # Dependencies
├── vite.config.js          # Build config + PWA plugin
├── vercel.json             # SPA routing
├── supabase-schema.sql     # Run this in Supabase SQL Editor
├── .env.example            # Template for env vars
├── public/
│   ├── icon.svg            # Source icon
│   ├── icon-192.png        # PWA icon
│   └── icon-512.png        # PWA icon large
└── src/
    ├── main.jsx            # React entry
    ├── App.jsx             # Full app (your protocol tracker)
    ├── supabase.js         # Supabase client init
    └── storage.js          # Storage layer (Supabase + localStorage cache)
```

---

## Security Notes

- The Supabase **anon key** is a public key — it's safe in client-side code
- Row Level Security (RLS) is enabled on the table
- The RLS policy allows all operations via anon key — this is fine for a single-user app
- Your Vercel URL is effectively your access control
- **Optional**: Add a custom domain in Vercel for a cleaner URL
- **Optional**: If you want auth later, Supabase has built-in magic link / PIN login

---

## Updating the App

To push changes:

### If using GitHub:
1. Edit files, commit, push
2. Vercel auto-deploys on push

### If using Vercel CLI:
```bash
vercel --prod
```

---

## Troubleshooting

**App loads but no data**: Check Supabase env vars in Vercel. Redeploy after adding them.

**"Add to Home Screen" not available**: Must use Safari (not Chrome) on iOS.

**Data not persisting**: Open browser console → check for Supabase errors. Verify the SQL schema was run successfully.

**Want to reset all data**: In Supabase SQL Editor run: `DELETE FROM kv_store;`
