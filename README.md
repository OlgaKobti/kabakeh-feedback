# Kabakeh Feedback System – README

This document explains **what was built**, **how everything is connected**, and **where to change things in the future**.

It is written so that even if you don’t touch this project for a long time, you can come back and understand it quickly.

---

## 🌍 Live URLs

### Public feedback page (QR destination)

```
https://feedback.kabakeh.com
```

* Customers scan the QR code and land here
* They leave a star rating and (optionally) feedback

### Admin dashboard (private)

```
https://feedback.kabakeh.com/admin
```

* Password protected
* Shows all feedback stored in the database

---

## 🧩 High-level architecture

```
Customer phone
   ↓ (QR code)
Next.js app (Vercel)
   ↓
Supabase database
   ↓
Admin page (same app)
```

### Main services used

* **Next.js** – frontend + backend (API routes)
* **Vercel** – hosting & deployments
* **Supabase** – PostgreSQL database
* **GoDaddy** – domain & DNS (CNAME)
* **Google Business Profile** – public reviews

---

## ⭐ Product logic (VERY IMPORTANT)

### Rating flow

#### 4–5 stars

* Rating is saved to Supabase
* User is **immediately redirected to Google Reviews**
* No submit button
* Redirect is triggered by clicking the star (allowed by browsers)

#### 1–3 stars

* User sees an apology message
* User can leave detailed private feedback
* **NO redirect to Google**
* Feedback stays private

This approach:

* Is ethical
* Is Google-policy safe
* Helps catch bad experiences early

---

## 🗄️ Supabase (Database)

### Project

* Platform: **Supabase**
* Contains a single table for feedback

### Table: `feedback`

Columns:

* `id` – unique ID
* `rating` – integer (1–5)
* `comment` – optional text
* `contact_phone` – optional
* `contact_email` – optional
* `created_at` – timestamp

### Security rules (RLS)

* Public users: **can INSERT only**
* No public SELECT access
* Admin reads data using server-side key

### Where to manage

* Supabase Dashboard → Table Editor → `feedback`

---

## 🚀 Vercel (Hosting & Deployments)

### Vercel project

* Connected to GitHub repo:

```
OlgaKobti/kabakeh-feedback
```

* Production branch: `main`

### Domain

* Custom domain attached:

```
feedback.kabakeh.com
```

### How domain works

* DNS CNAME set in GoDaddy:

  * Host: `feedback`
  * Value: `cname.vercel-dns.com`
* Domain attached inside **Vercel → Settings → Domains**

---

## 🔐 Environment Variables (Vercel)

Configured in:
**Vercel → Project → Settings → Environment Variables**

### Required variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

NEXT_PUBLIC_GOOGLE_REVIEW_URL

ADMIN_PASSWORD
ADMIN_SECRET
```

### What each one does

* `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL
* `NEXT_PUBLIC_SUPABASE_ANON_KEY` – public key (safe for browser)
* `SUPABASE_SERVICE_ROLE_KEY` – admin DB access (server only)
* `NEXT_PUBLIC_GOOGLE_REVIEW_URL` – Google “Write a review” link
* `ADMIN_PASSWORD` – password for `/admin`
* `ADMIN_SECRET` – cookie signing secret

⚠️ After changing env vars → **Redeploy** is required

---

## 🧑‍💼 Admin page

### URL

```
/ admin
```

(full URL: [https://feedback.kabakeh.com/admin](https://feedback.kabakeh.com/admin))

### How it works

* Password is sent to `/api/admin/login`
* Secure cookie is set
* Admin data fetched from `/api/admin/feedback`

### Files involved

* `app/admin/page.tsx`
* `app/api/admin/login/route.ts`
* `app/api/admin/feedback/route.ts`
* `lib/adminAuth.ts`

---

## 📁 Code structure (important files)

```
app/
 ├── page.tsx                 # Public feedback page
 ├── thanks/page.tsx          # Thank-you page
 ├── admin/page.tsx           # Admin UI
 ├── api/
 │   ├── feedback/route.ts    # Save feedback
 │   └── admin/
 │       ├── login/route.ts   # Admin login
 │       └── feedback/route.ts# Admin read feedback

lib/
 ├── supabase.ts              # Supabase clients
 └── adminAuth.ts             # Admin cookie auth

public/
 └── (future logo, images)

app/globals.css               # Styling
```

---

## 🖨️ QR Code

### QR target URL

```
https://feedback.kabakeh.com
```

### Suggested text under QR

> “Your feedback helps us improve ❤️”

Where to place:

* Menus
* Table tents
* Counter
* Receipts

---

## 🔄 How to update things in the future

### Change Google review link

1. Vercel → Settings → Environment Variables
2. Update `NEXT_PUBLIC_GOOGLE_REVIEW_URL`
3. Redeploy

### Change admin password

1. Update `ADMIN_PASSWORD` in Vercel
2. Redeploy

### Change UI text / behavior

* Edit `app/page.tsx`
* Commit & push
* Vercel auto-deploys

### View feedback

* Supabase Dashboard
* Or `/admin` page

---

## 🧠 Design principles used

* No review gating (policy-safe)
* Honest feedback collection
* Private resolution of bad experiences
* Encourage happy customers naturally

---

## ✅ Current status

* ✅ Live in production
* ✅ Custom domain
* ✅ Secure database
* ✅ Admin dashboard
* ✅ Google redirect logic

---

## 🚧 Planned next upgrades

* 📩 Email alert for 1–2★
* 💬 WhatsApp alert for 1–2★
* 🌍 Language switch (EN / עברית / العربية)
* 🎨 Branding (logo + colors)
* 📊 Weekly summary email

---

**Owner:** Kabakeh

This system was built to be simple, safe, and easy to maintain.
