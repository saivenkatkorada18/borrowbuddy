# BorrowBuddy 🇮🇳
> **"Borrow instead of buy."** — Peer-to-peer campus item sharing for Indian university students.

BorrowBuddy enables college and university students to share calculators, lab coats, textbooks, power banks, chargers, laptops, cameras, and hostel essentials within their campus communities safely and deposit-free or with minimal refundable security deposits in Indian Rupees (₹).

---

## 🚀 What's New in Update 2

1. **Indian Rupee (₹) Everywhere**:
   - Complete replacement of Euro symbols. All prices and deposits use `formatINR(amount)` with Indian digit grouping (e.g. `₹1,500`, `₹1,25,000`, and `Free` when deposit is 0).
   - Rescaled to realistic Indian student budgets (deposits between ₹0 and ₹8,000).
   - Interactive Community Savings Calculator with selectable items:
     - Scientific Calculator (₹1,000)
     - White Lab Coat (₹450)
     - Engineering / Medical Textbook (₹800)
     - Fast-charging Power Bank (₹1,200)

2. **Campus Localisation**:
   - **8 Indian Campus Hubs**: `Central Library`, `Science Block`, `Boys Hostel`, `Girls Hostel`, `Sports Complex`, `Engineering Block`, `Student Activity Centre`, `Canteen Court`.
   - **Diverse Indian Student Lenders**: Aarav Sharma, Ananya Iyer, Rohan Mehta, Priya Nair, Karthik Reddy, Sneha Kulkarni, Mohammed Faiz, Ishita Banerjee, Vikram Singh, Divya Menon.
   - **Academic Courses**: B.Tech CSE, B.Tech ECE, B.Sc Chemistry, MBBS 1st Year, B.Com, BBA, Architecture, Pharmacy, MBA.
   - **College Email Validation**: Accepts `.edu`, `.edu.in`, `.ac.in`, `.ac.*`, and domains containing `university`, `college`, or `institute`.
   - **Exam Season Context**: Realistic copy covering semester exams, lab record submissions, hostel life, and cultural fests.

3. **16 Categories & 50+ Items**:
   - Categories: `calculators`, `lab-coats`, `books`, `chargers`, `adapters`, `power-banks`, `laptops`, `headphones`, `electronics`, `umbrellas`, `sports`, `tools`, `kitchen`, `stationery`, `hostel-essentials`, `cameras`.
   - 50+ curated student listings with distinct condition, pickup locations, rules, and availability dates.
   - **High-Value Trust Guard**: Items requiring high trust scores (≥ 70 or 85, such as Dell laptops, MacBooks, and DSLR cameras) feature prominent trust badges and protective validation banners.

4. **Dynamic Layered SVG Artwork**:
   - `<ItemArtwork>` features handcrafted SVG illustrations with idle float and interactive hover animations for all 16 categories (laptops, power banks, chargers, headphones, multimeters, Arduino boards, cricket gear, badminton sets, lab coats, kettles, and more).

---

## 🗄️ Database Architecture & Setup (Supabase)

BorrowBuddy works seamlessly **out of the box with zero setup** via local mock storage and transparently synchronises with **Supabase PostgreSQL** when credentials are provided.

### Files Provided in `supabase/`:
- `supabase/schema.sql`: Full DDL with tables (`profiles`, `items`, `borrow_requests`, `activity_logs`), foreign keys, Row Level Security (RLS) policies, and updated check constraints for the 16 categories and 8 campuses.
- `supabase/seed.sql`: Comprehensive seed dataset containing 10 Indian student profiles, 45+ items, sample borrow requests, and real-time activity events.
- `supabase/migration_update2.sql`: Safe, idempotent migration script to update existing databases from Update 1 to Update 2.

### Demo Lenders Strategy
In Supabase, user profiles in production are linked to `auth.users(id)`. To make the seed data immediately usable in any environment without requiring manual pre-registration of 10 student authentication accounts:
- `supabase/schema.sql` defines `profiles.id` as a `UUID PRIMARY KEY` with an optional foreign key or decoupled reference that allows seeding demo profiles directly.
- Demo lender profiles (Aarav, Ananya, Priya, etc.) are inserted into `public.profiles` with fixed deterministic UUIDs.
- Newly authenticated users who sign up via the Auth modal automatically trigger profile creation in `public.profiles` and seamlessly borrow or list items alongside the seeded demo listings.

### Running Migrations:
If you already set up a database with Update 1:
```sql
-- In your Supabase SQL Editor, run:
supabase/migration_update2.sql
```

For fresh setups:
```sql
-- In your Supabase SQL Editor, run:
1. supabase/schema.sql
2. supabase/seed.sql
```

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
# Clone the repository and install dependencies
npm install

# Start the Vite development server
npm run dev
```

The app will start at `http://localhost:5173`.

### Production Build
```bash
# Type check and build with Vite
npm run build
```

---

## 🛡️ Trust & Verification Architecture
- **Verified Student Badge**: Verified when registering with an official college email (`.ac.in`, `.edu.in`, `.edu`, etc.).
- **Dynamic Trust Score**: Ranging from 50 to 100 based on return timeliness, lender reviews, and completed borrowings.
- **High-Value Security**: Restricts ultra-valuable equipment (laptops, DSLR cameras) to students with Trust Score ≥ 70–85.
