# GymTrack — Membership Manager

A simple, mobile-first gym membership tracking app built with React + Supabase.

---

## Features

- Add members with name, phone, location, slot, plan, and amount
- Dashboard showing **Overdue**, **Due Today**, and **Upcoming (5 days)** members
- One-tap **Renew** membership from current date
- **Search** by name or phone number
- Auto-calculated expiry date on add and renew

---

## Setup Guide

### Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**, give it a name (e.g. `gymtrack`)
3. Choose a region close to you and set a database password
4. Wait ~1 minute for the project to be ready

### Step 2 — Create the database table

1. In your Supabase dashboard, go to **SQL Editor**
2. Paste the contents of `supabase/schema.sql` and click **Run**
3. You should see: `Success. No rows returned`

### Step 3 — (Optional) Load sample data

1. In the SQL Editor, paste the contents of `supabase/seed.sql` and click **Run**
2. This loads 12 test members with various statuses

### Step 4 — Get your Supabase credentials

1. Go to **Project Settings → API**
2. Copy:
   - **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
   - **anon / public** key (the long string under "Project API keys")

### Step 5 — Configure environment variables

```bash
# In the project root, copy the example file
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 6 — Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) on your phone (connect to same WiFi) or browser.

---

## Deploy to Vercel

### Option A — Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts, then add environment variables:

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel --prod
```

### Option B — Deploy via Vercel Dashboard (easier)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **Deploy**

Vercel will auto-detect Vite and set the build command to `vite build` with output dir `dist`.

---

## Project Structure

```
gym-membership/
├── src/
│   ├── App.jsx                  # Root layout + tab navigation
│   ├── main.jsx
│   ├── index.css
│   ├── lib/
│   │   ├── supabase.js          # Supabase client
│   │   └── dates.js             # Date helpers (no external libs)
│   └── components/
│       ├── Dashboard.jsx        # 3-section dues overview
│       ├── AddMember.jsx        # Add member form
│       ├── Search.jsx           # Search by name/phone
│       ├── RenewModal.jsx       # Bottom sheet renewal UI
│       └── MemberCard.jsx       # Reusable member row
├── supabase/
│   ├── schema.sql               # Table definition + RLS policy
│   └── seed.sql                 # 12 sample members for testing
├── .env.example                 # Environment variable template
└── README.md
```

---

## Status Logic

| Condition | Status |
|---|---|
| `expiry_date < today` | Overdue |
| `expiry_date == today` | Due Today |
| `expiry_date > today` | Active |

Renewal always sets `join_date = today` and `expiry_date = today + plan_duration`.
