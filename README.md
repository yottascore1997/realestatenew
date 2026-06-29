# EstatePro - Premium Real Estate CRM

Full-stack real estate platform with a **public website** (Projects, Properties, Launches) and a **premium CRM dashboard** — built with Next.js, Prisma, and MySQL.

## Features

### Public Website (`/`)
- Home page with hero, featured projects, launches & properties
- **Projects** — premium developments listing
- **Properties** — homes for sale/rent
- **Launches** — pre-launch & live launch opportunities
- **Contact** — enquiry form

### CRM Dashboard (`/crm`)
- **Dashboard** — KPIs, sales charts, lead sources, pipeline
- **Properties, Leads, Contacts, Deals** management
- **Tasks, Appointments, Calendar**
- **Messages, Reports, Marketing**
- **Team, Settings, Integrations**

## Tech Stack

- **Next.js 16** (App Router — frontend + API in one project)
- **Prisma 5** + **MySQL**
- **Tailwind CSS 4**
- **Recharts** for analytics
- **Lucide React** icons

## Setup

### 1. Prerequisites
- Node.js 20+ recommended (works on Node 19 with Prisma 5)
- MySQL 8+ running locally or remote

### 2. Install dependencies
```bash
npm install
```

### 3. Configure database
Copy `.env.example` to `.env` and update your MySQL connection:
```bash
cp .env.example .env
```

```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/estatepro"
```

Create the database in MySQL:
```sql
CREATE DATABASE estatepro;
```

### 4. Push schema & seed data
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Run development server
```bash
npm run dev
```

Open:
- **Website:** http://localhost:3000
- **CRM Dashboard:** http://localhost:3000/crm

## Project Structure

```
src/
├── app/
│   ├── (website)/          # Public website
│   │   ├── page.tsx        # Home
│   │   ├── projects/
│   │   ├── properties/
│   │   ├── launches/
│   │   └── contact/
│   ├── crm/                # CRM dashboard
│   │   ├── page.tsx        # Dashboard
│   │   ├── properties/
│   │   ├── leads/
│   │   └── ...
│   └── api/                # Backend API routes
│       ├── dashboard/
│       ├── properties/
│       ├── leads/
│       ├── projects/
│       └── launches/
├── components/
│   ├── crm/                # CRM UI components
│   ├── website/            # Website UI components
│   └── ui/                 # Shared UI
└── lib/
    ├── prisma.ts
    ├── utils.ts
    └── mock-data.ts        # Fallback when DB not connected
prisma/
├── schema.prisma
└── seed.ts
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Dashboard stats |
| GET/POST | `/api/properties` | Properties CRUD |
| GET/POST | `/api/leads` | Leads CRUD |
| GET | `/api/projects` | Projects list |
| GET | `/api/launches` | Launches list |

## Default Admin (after seed)

- Email: `admin@estatepro.com`
- Password: `admin123`

## Notes

- Without MySQL connected, the app uses mock data and works out of the box for UI preview.
- Upgrade to Node.js 20+ for best compatibility with Next.js 16 and Prisma 7.
