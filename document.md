# SIT University Website & Management Platform
## Comprehensive Technical Documentation & Client Handover Guide

---

## 1. Executive Summary & Project Overview

### 1.1 Project Description
The **SIT University Website & Management Platform** is a full-stack digital solution engineered for the **Sengsavanh Institute of Technology (SIT)**. The platform combines a public-facing university portal with an administrative Content Management System (CMS), student admissions workflow, inquiry tracking, dynamic bilingual localized content (English and Lao), high-performance media storage, and system telemetry.

### 1.2 Key Objectives Delivered
- **Public University Portal**: Comprehensive presentation of SIT academic programs, departments, faculty profiles, campus facilities, student life, news, events, and institutional history.
- **Bilingual Experience**: Native support for **English (`en`)** and **Lao (`la`)** across all public pages, dynamic database models, and static UI dictionaries.
- **Administrative CMS**: Secure, role-based admin dashboard enabling authorized staff to update content, manage admissions, track inquiries, and upload media without code modifications.
- **Online Admissions & Inquiries**: End-to-end processing for student enrollment applications and info requests, complete with automated email notifications via Resend.
- **High-Performance Distributed Media Storage**: SeaweedFS cluster providing S3-compatible object storage with instant fallback to local disk storage.
- **Observability**: Built-in Prometheus metrics export on both frontend and backend for system performance monitoring.

---

## 2. System Architecture

```mermaid
flowchart TB
    subgraph Clients["Clients / Users"]
        PublicUsers["Prospective Students & Public Visitors"]
        AdminUsers["University Administrators & Staff"]
    end

    subgraph Frontend["Frontend Layer (Next.js 16 / React 19)"]
        PublicApp["Public Portal (/about, /academics, /admissions, etc.)"]
        AdminApp["Admin Dashboard (/admin/*)"]
        I18nEngine["i18n Localization Engine (EN / LA)"]
        ApiClient["Typed API Client (lib/api)"]
    end

    subgraph Backend["Backend Layer (NestJS 11)"]
        AuthGuard["JWT Authentication & Guards"]
        ApiModules["Feature Modules (Admissions, Programs, News, Events, etc.)"]
        EmailService["Resend Email Integration"]
        UploadService["S3 / Local Storage Adapter"]
        PrismaORM["Prisma ORM Client 6.x"]
    end

    subgraph Persistence["Storage & Infrastructure"]
        PostgresDB[("PostgreSQL Database")]
        SeaweedCluster["SeaweedFS Cluster (Master, Volume, Filer, S3)"]
        DiskUploads["Local Uploads Folder (Fallback)"]
        Prometheus["Prometheus Metrics Collector"]
    end

    PublicUsers -->|HTTPS / Port 3000| PublicApp
    AdminUsers -->|HTTPS / Port 3000| AdminApp
    PublicApp --> I18nEngine
    PublicApp --> ApiClient
    AdminApp --> ApiClient
    ApiClient -->|REST API / Port 5000| AuthGuard
    AuthGuard --> ApiModules
    ApiModules --> PrismaORM
    ApiModules --> EmailService
    ApiModules --> UploadService
    PrismaORM --> PostgresDB
    UploadService --> SeaweedCluster
    UploadService --> DiskUploads
    Backend -.->|/api/metrics| Prometheus
    Frontend -.->|/api/metrics| Prometheus
```

---

## 3. Technology Stack

### 3.1 Frontend Stack
| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.3.1` | Server-Side Rendering (SSR), Static Generation (SSG), and routing |
| **Core UI** | React | `19.2.8` | Declarative component model |
| **Styling** | Tailwind CSS / PostCSS | `^4.0.0` | Modern, responsive, utility-first styling |
| **Icons** | Lucide React | `^1.31.0` | Accessible, consistent vector iconography |
| **Language** | TypeScript | `^5.0.0` | Static typing and compile-time safety |
| **Telemetry** | prom-client | `^15.1.3` | Next.js endpoint metrics collection |

### 3.2 Backend Stack
| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | NestJS | `11.0.1` | Enterprise modular backend framework |
| **Language** | TypeScript / Node.js | `Node 20+` / `TS 5.7` | Type-safe backend application logic |
| **ORM** | Prisma ORM | `6.19.3` | Schema definition, migrations, and database querying |
| **Database** | PostgreSQL | `14+` / Cloud (Aiven) | Relational database storage |
| **Auth & Security** | Passport + JWT + BcryptJS | `^0.7` / `^11.0` | Bearer token authentication & hashed passwords |
| **Validation** | class-validator + class-transformer | `^0.15` / `^0.5` | Input DTO schema validation and transformation |
| **Email Service** | Resend SDK | `^6.21.0` | Transactional email delivery for admissions & inquiries |
| **Object Storage** | @aws-sdk/client-s3 + Multer | `^3.1113.0` | File uploads to S3-compatible storage or disk |
| **Telemetry** | prom-client | `^15.1.3` | Custom Prometheus metrics endpoint |

### 3.3 Infrastructure & Storage
| Component | Tool | Purpose |
| :--- | :--- | :--- |
| **Distributed Object Store** | SeaweedFS | High-throughput distributed storage for images, documents, and media |
| **Containerization** | Docker & Docker Compose | Container orchestration for SeaweedFS and Prometheus |
| **Monitoring** | Prometheus | Real-time time-series telemetry aggregator |
| **Process Management** | PM2 / Systemd / Shell Nohup | Production and staging background process supervision |

---

## 4. Repository Directory Structure

```text
SIT_Development/
├── document.md                       # Comprehensive Project Documentation & Handover Guide
├── AGENT.md                          # Technical specification & architecture rules
├── seaweedfs-compose.yml             # Local Docker Compose for SeaweedFS + Prometheus
├── seaweedfs-staging.yml             # Staging lightweight SeaweedFS configuration
├── deploy-staging.sh                 # Zero-downtime Alpine VPS staging deployment script
├── stop-staging.sh                   # Staging service stop script
├── start-dev.ps1                     # Windows PowerShell one-click development stack launcher
├── start-dev.sh                      # Linux/macOS one-click development stack launcher
├── stop-dev.ps1                      # Windows PowerShell development stack termination script
├── stop-dev.sh                       # Linux/macOS development stack termination script
├── prometheus/
│   └── prometheus.yml                # Prometheus metrics scrape configuration
├── university_backend/               # NestJS Backend Application
│   ├── .env.example                  # Environment template for backend
│   ├── package.json                  # Backend dependencies and scripts
│   ├── nest-cli.json                 # NestJS CLI configuration
│   ├── tsconfig.json                 # TypeScript compiler configuration
│   ├── prisma/
│   │   ├── schema.prisma             # Primary Prisma schema & entity definitions
│   │   └── seed.ts                   # Comprehensive initial database seeding script
│   ├── uploads/                      # Local fallback directory for media uploads
│   └── src/
│       ├── main.ts                   # Entry point (CORS, Pipes, Static assets, Port)
│       ├── app.module.ts             # Root module aggregating all feature modules
│       ├── auth/                     # JWT authentication, guards, and login controller
│       ├── admins/                   # Admin user CRUD and profile management
│       ├── admissions/               # Admission requirements, materials, FAQs, timelines
│       ├── applications/             # Student application submissions & status management
│       ├── request-info/             # Public inquiry submissions & tracking
│       ├── departments/              # Academic departments & statistics
│       ├── programs/                 # Degree programs (Bachelor, Master, PhD)
│       ├── faculty/                  # Faculty and lecturer profiles
│       ├── program-directors/        # Program leadership profiles
│       ├── campus-facilities/        # Campus buildings, labs, and interactive facility modals
│       ├── student-life/             # Student activities, galleries, and categories
│       ├── news/                     # University news articles and view counts
│       ├── events/                   # Campus events, schedules, and registration
│       ├── spotlights/               # Student, faculty, and alumni testimonials
│       ├── partners/                 # Academic and industry partner logos
│       ├── core-values/              # Institutional pillars and values
│       ├── hero/                     # Dynamic hero banners for all pages
│       ├── about/                    # Founder, leadership members, history timeline, vision/mission
│       ├── contact/                  # Campus contact details, maps, phones, office hours
│       ├── dashboard/                # Admin metrics aggregation & quick stats
│       ├── email/                    # Resend integration for automated notifications
│       ├── uploads/                  # Dual-storage upload service (S3/SeaweedFS & Local disk)
│       ├── metrics/                  # Prometheus metrics controller & collectors
│       └── prisma/                   # Prisma client wrapper service
└── university_frontend/              # Next.js 16 Application (Public Portal & Admin)
    ├── .env.example                  # Environment template for frontend
    ├── package.json                  # Frontend dependencies and scripts
    ├── next.config.ts                # Next.js config (standalone build, remote image domains)
    ├── postcss.config.mjs            # PostCSS configuration for Tailwind v4
    ├── tsconfig.json                 # TypeScript compiler configuration
    ├── public/                       # Static public assets, favicons, logos, sample images
    ├── context/
    │   ├── AuthContext.tsx           # Admin authentication state & token management
    │   └── LanguageContext.tsx       # Global language toggle context ('en' | 'la')
    ├── lib/
    │   ├── api/                      # Strongly-typed API client modules
    │   │   ├── client.ts             # Base fetcher with JWT headers & error handling
    │   │   ├── types.ts              # Universal TypeScript data interfaces
    │   │   ├── auth.ts               # Auth login & user verification calls
    │   │   ├── content.ts            # Dynamic CMS content endpoints
    │   │   ├── academics.ts          # Department & program endpoints
    │   │   ├── admissions.ts         # Admissions & application submission endpoints
    │   │   ├── news.ts & events.ts   # News and events endpoints
    │   │   └── upload.ts             # Media upload integration
    │   └── i18n/
    │       ├── index.ts              # Dictionary resolver
    │       └── dictionaries/
    │           ├── en.ts             # English language dictionary
    │           └── la.ts             # Lao language dictionary
    ├── components/
    │   ├── layout/                   # Header, Navbar, Footer, MobileNav, LanguageSwitcher
    │   ├── home/                     # Hero, Stats, Programs, Spotlights, Partners, News widgets
    │   ├── academics/                # Program grids, curriculum views, director cards
    │   ├── admissions/               # Requirements checklist, timeline, tuition calculator
    │   ├── about/                    # Founder quote, leadership grid, interactive history timeline
    │   └── ui/                       # Reusable buttons, modals, dropdowns, inputs
    └── app/
        ├── layout.tsx                # Root HTML layout with font loaders and providers
        ├── globals.css               # Global styling, theme tokens, and typography
        ├── page.tsx                  # Home page
        ├── about/                    # About SIT page
        ├── academics/                # Academics overview & program catalogue
        ├── departments/              # Department detail pages (`[slug]`)
        ├── admissions/               # Admissions overview page
        ├── apply-now/                # Multi-step online admission application form
        ├── request-info/             # Information request form
        ├── how-to-apply/             # Step-by-step application guidance & downloads
        ├── life-at-sit/              # Student life, campus facilities & clubs
        ├── collaborations/           # Partner universities & industry alliances
        ├── news/                     # News listing and article viewer (`[slug]`)
        ├── events/                   # Event listing and registration viewer (`[slug]`)
        ├── contact/                  # Interactive contact details & feedback form
        ├── api/metrics/              # Frontend Prometheus metrics endpoint
        └── admin/                    # Secured Admin Dashboard
            ├── layout.tsx            # Admin sidebar navigation, header, auth guard
            ├── page.tsx              # Admin home / redirect to dashboard
            ├── login/                # Admin authentication login portal
            ├── dashboard/            # High-level metrics, inquiries, recent applications
            ├── applications/         # Student application review & status management
            ├── request-info/         # Information inquiry management
            ├── hero/                 # Hero banners manager
            ├── departments/          # Academic department manager
            ├── programs/             # Program manager
            ├── faculty/              # Faculty member manager
            ├── news/                 # News articles publisher
            ├── events/               # Events scheduler
            ├── campus/               # Campus facilities manager
            ├── student-life/         # Student life activities manager
            ├── spotlights/           # Testimonials & spotlights manager
            ├── partners/             # Partner organizations manager
            ├── admissions/           # Requirements, timelines & FAQs manager
            ├── how-to-apply/         # Application downloadable materials manager
            ├── about/                # Founder, leadership, history, vision & mission manager
            ├── contact/              # Contact info & office hours manager
            ├── social-links/         # Social media links manager
            └── media/                # File and media asset browser
```

---

## 5. Environment Variables & Configuration

### 5.1 Backend Environment Configuration (`university_backend/.env`)

| Variable | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | `postgres://user:pass@host:5432/db?sslmode=require` | PostgreSQL database connection string |
| `PORT` | No | `5000` | HTTP port where NestJS listens |
| `JWT_SECRET` | **Yes** | `super_secret_jwt_key_sit_2026` | Secret key used to sign and verify JWT tokens |
| `BACKEND_PUBLIC_URL`| No | `http://localhost:5000` | Public backend URL for asset prefixes |
| `ADMIN_EMAIL` | **Yes** | `admin@sit.edu.la` | Primary super admin seed email |
| `ADMIN_PASSWORD` | **Yes** | `AdminSecurePass2026!` | Primary super admin seed password |
| `ADMIN_NAME` | No | `SIT Super Admin` | Full name of primary administrator |
| `S3_ENDPOINT` | No | `http://localhost:8333` | S3 API endpoint (SeaweedFS or AWS) |
| `S3_REGION` | No | `us-east-1` | S3 region identifier |
| `S3_BUCKET` | No | `university-media` | Bucket name for uploaded assets |
| `S3_FORCE_PATH_STYLE`| No| `true` | Required for SeaweedFS / MinIO path-style URLs |
| `S3_ACCESS_KEY_ID` | No | `any` | S3 access key ID |
| `S3_SECRET_ACCESS_KEY`| No| `any` | S3 secret access key |
| `S3_PUBLIC_URL` | No | `http://localhost:5000/uploads` | Public backend URL that serves uploaded files from SeaweedFS or local disk |
| `RESEND_API_KEY` | No | `re_123456789...` | API key from Resend for transactional emails |
| `RESEND_FROM_EMAIL` | No | `SIT Admissions <onboarding@resend.dev>` | Verified sender address for outgoing emails |
| `ADMIN_NOTIFICATION_EMAIL`| No | `admissions@sit.edu.la` | Target mailbox receiving new application alerts |

### 5.2 Frontend Environment Configuration (`university_frontend/.env.local` or `.env.production`)

| Variable | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | **Yes** | `http://localhost:5000/api` | Base URL used by the frontend to communicate with backend |

---

## 6. Database Schema & Data Models

The application utilizes PostgreSQL managed via Prisma ORM. All bilingual fields follow the naming convention of `fieldName` (English) and `fieldNameLa` (Lao).

### 6.1 Entity Overview Table

| Model | Description | Key Relationships |
| :--- | :--- | :--- |
| **`Admin`** | Administrative users with hashed credentials and roles (`SUPER_ADMIN`, `ADMIN`, `EDITOR`) | Standalone |
| **`Hero`** | Page-specific hero banners (Title, Subtitle, CTA buttons, Background images/video) | Keyed by `page` enum |
| **`CoreValue`** | Institutional values, icons, and descriptions | Standalone |
| **`Major`** | Academic majors with slugs and descriptions | Standalone |
| **`Department`** | Academic departments with statistics, career outcomes, and labs | Has many `Program`, `Faculty` |
| **`Program`** | Degree programs (Bachelor, Master, PhD) with curriculum and duration | Belongs to `Department`, has many `ProgramDirector` |
| **`Faculty`** | Faculty and lecturer profiles with biography and department | Belongs to `Department` |
| **`ProgramDirector`**| Leadership profiles for specific degree programs | Belongs to `Program` |
| **`Spotlight`** | Student, Faculty, and Alumni quotes and success stories | Standalone |
| **`Partner`** | Academic university and industry partner affiliations | Standalone |
| **`CampusFacility`** | Campus amenities, laboratories, libraries with interactive modal content | Standalone |
| **`News`** | University news articles with categories, slugs, authors, and view counters | Standalone |
| **`Event`** | Upcoming events, schedules, locations, and registration links | Standalone |
| **`StudentLife`** | Extracurricular activities, student clubs, and photo galleries | Standalone |
| **`Founder`** | Institutional founder biography, portrait, and inspirational quote | Standalone |
| **`Member`** | Board of Trustees, University Council, and Advisory Board members | Categorized |
| **`History`** | Milestone timeline items ordered by year | Standalone |
| **`VisionMission`** | Institutional vision, mission statements, and core strategic pillars | Standalone |
| **`ContactInfo`** | Campus locations, phone directory, email contacts, and office hours | Standalone |
| **`ApplicationTimeline`**| Admission intake cycles (Fall, Spring, Open) with deadlines and status | Standalone |
| **`ApplicationReminder`**| Important admission deadline reminders and alerts | Standalone |
| **`AdmissionRequirement`**| Degree-level requirements (Undergraduate, Graduate, International) | Standalone |
| **`AdmissionFaq`** | Frequently asked questions regarding admissions | Standalone |
| **`ApplicationMaterial`**| Downloadable application forms, brochures, and PDF guides | Standalone |
| **`Application`** | Full student online enrollment application with personal info and documents | Standalone |
| **`RequestInfo`** | Prospective student information inquiry submissions | Standalone |
| **`Media`** | Uploaded asset registry (URL, MIME type, size) | Standalone |

---

## 7. REST API Endpoints Reference

All API routes are served under the `/api` prefix. Protected routes require the `Authorization: Bearer <token>` header.

### 7.1 Authentication & Admins (`/api/auth`, `/api/admins`)
- `POST /api/auth/login`: Authenticate admin with email and password; returns JWT token and admin profile.
- `GET /api/auth/profile`: Get current logged-in admin identity (Protected).
- `GET /api/admins`: List all registered administrators (Protected).
- `POST /api/admins`: Create new administrator user (Super Admin).
- `PUT /api/admins/:id`: Update administrator role or details (Protected).
- `DELETE /api/admins/:id`: Delete administrator account (Super Admin).

### 7.2 Academic Content (`/api/departments`, `/api/programs`, `/api/faculty`, `/api/program-directors`)
- `GET /api/departments`: Retrieve all active academic departments with associated programs and faculty.
- `GET /api/departments/:slug`: Retrieve single department by slug.
- `POST /api/departments`: Create new department (Protected).
- `PUT /api/departments/:id`: Update department details and statistics (Protected).
- `DELETE /api/departments/:id`: Remove department (Protected).
- `GET /api/programs`: Retrieve all published academic programs.
- `GET /api/programs/:slug`: Retrieve program details, focus areas, and directors.
- `POST /api/programs`: Create new program (Protected).
- `PUT /api/programs/:id`: Update program (Protected).
- `DELETE /api/programs/:id`: Remove program (Protected).
- `GET /api/faculty`: List faculty members (supports `?departmentId=` and `?featured=true`).
- `POST /api/faculty` | `PUT /api/faculty/:id` | `DELETE /api/faculty/:id`: Faculty CRUD (Protected).
- `GET /api/program-directors`: List program directors.
- `POST /api/program-directors` | `PUT /api/program-directors/:id` | `DELETE /api/program-directors/:id`: Director CRUD (Protected).

### 7.3 Admissions & Applications (`/api/admissions`, `/api/applications`, `/api/request-info`)
- `GET /api/admissions/timelines`: Retrieve application intake cycles and deadlines.
- `POST /api/admissions/timelines` | `PUT /api/admissions/timelines/:id` | `DELETE /api/admissions/timelines/:id`: Timeline management (Protected).
- `GET /api/admissions/requirements`: Retrieve admission requirements by degree level.
- `POST /api/admissions/requirements` | `PUT /api/admissions/requirements/:id` | `DELETE /api/admissions/requirements/:id`: Requirements management (Protected).
- `GET /api/admissions/faqs`: Retrieve admission FAQs.
- `POST /api/admissions/faqs` | `PUT /api/admissions/faqs/:id` | `DELETE /api/admissions/faqs/:id`: FAQ management (Protected).
- `GET /api/admissions/materials`: Retrieve downloadable admission brochures and forms.
- `POST /api/admissions/materials` | `PUT /api/admissions/materials/:id` | `DELETE /api/admissions/materials/:id`: Materials management (Protected).
- `POST /api/applications`: Submit new student application (Public). Triggers confirmation email to student and alert email to admin.
- `GET /api/applications`: List all submitted student applications with filter options (Protected).
- `GET /api/applications/:id`: View detailed application dossier (Protected).
- `PATCH /api/applications/:id/status`: Update status (`PENDING`, `REVIEWED`, `ACCEPTED`, `REJECTED`) and internal review notes (Protected).
- `POST /api/request-info`: Submit prospective student inquiry (Public). Triggers confirmation email to user and notification to staff.
- `GET /api/request-info`: List all inquiries (Protected).
- `PATCH /api/request-info/:id/status`: Update inquiry status (`PENDING`, `CONTACTED`, `RESOLVED`) (Protected).

### 7.4 Public Institutional Information (`/api/about`, `/api/contact`, `/api/news`, `/api/events`, `/api/student-life`)
- `GET /api/about/founder`: Founder profile, quote, and biography.
- `PUT /api/about/founder`: Update founder info (Protected).
- `GET /api/about/members`: Board of Trustees and Council members list.
- `POST /api/about/members` | `PUT /api/about/members/:id` | `DELETE /api/about/members/:id`: Member management (Protected).
- `GET /api/about/history`: Historical milestones ordered chronologically.
- `POST /api/about/history` | `PUT /api/about/history/:id` | `DELETE /api/about/history/:id`: History management (Protected).
- `GET /api/about/vision-mission`: Vision, mission, and core strategic pillars.
- `PUT /api/about/vision-mission`: Update vision & mission (Protected).
- `GET /api/contact`: Get university contact info, multi-location map embeds, phone list, office hours.
- `PUT /api/contact`: Update contact details and social links (Protected).
- `GET /api/news`: List news articles (supports pagination and category filter).
- `GET /api/news/:slug`: Get single news article (increments view counter automatically).
- `POST /api/news` | `PUT /api/news/:id` | `DELETE /api/news/:id`: News CRUD (Protected).
- `GET /api/events`: List upcoming and past events.
- `GET /api/events/:slug`: Get event details.
- `POST /api/events` | `PUT /api/events/:id` | `DELETE /api/events/:id`: Events CRUD (Protected).
- `GET /api/student-life`: Extracurricular activities, facilities, and photo galleries.
- `POST /api/student-life` | `PUT /api/student-life/:id` | `DELETE /api/student-life/:id`: Student life CRUD (Protected).
- `GET /api/campus-facilities`: Campus amenities and laboratory cards.
- `POST /api/campus-facilities` | `PUT /api/campus-facilities/:id` | `DELETE /api/campus-facilities/:id`: Facilities CRUD (Protected).
- `GET /api/spotlights`: Testimonials and spotlights.
- `GET /api/partners`: University and industry partner logos.
- `GET /api/core-values`: Institutional values list.
- `GET /api/hero/:page`: Get banner content for specified page (`HOME`, `ABOUT`, `ACADEMICS`, `ADMISSIONS`, `LIFE_AT_SIT`, `COLLABORATIONS`).

### 7.5 Uploads, Metrics & Dashboard (`/api/uploads`, `/api/metrics`, `/api/dashboard`)
- `POST /api/uploads`: Multipart file upload (Images, PDFs). Saves to SeaweedFS S3 storage or local fallback; returns public URL.
- `GET /api/uploads/media`: List all uploaded media files in the repository (Protected).
- `GET /api/metrics`: Prometheus metrics export endpoint for telemetry scrapers.
- `GET /api/dashboard/stats`: Aggregated summary statistics for admin dashboard (Total applications, inquiries, news count, programs count).

---

## 8. Internationalization & Bilingual Architecture

The platform provides comprehensive bilingual support for **English (`en`)** and **Lao (`la`)**.

### 8.1 How i18n Operates
1. **Frontend UI Localization**:
   - Stored in `university_frontend/lib/i18n/dictionaries/en.ts` and `la.ts`.
   - Managed via `LanguageContext` (`university_frontend/context/LanguageContext.tsx`).
   - Persisted across sessions in browser `localStorage`.
   - Accessible via standard React hook: `const { language, setLanguage, t } = useLanguage();`.
2. **Dynamic Database Content Localization**:
   - Every CMS-managed table in the database provides parallel Lao fields (e.g., `title` vs `titleLa`, `description` vs `descriptionLa`).
   - The frontend automatically selects the localized field based on the current active language, seamlessly falling back to English if the Lao field is empty:
     ```typescript
     const displayTitle = language === 'la' && item.titleLa ? item.titleLa : item.title;
     ```
3. **Admin Bilingual Authoring**:
   - All admin editing forms feature side-by-side or dedicated input tabs for English and Lao content, giving content managers complete control over translation quality.

---

## 9. Storage Architecture (SeaweedFS & Local Fallback)

The platform is designed with a resilient dual-mode asset storage engine:

```text
Upload Request
     │
     ▼
[Upload Service]
     │
     ├─► Check S3 / SeaweedFS availability
     │        │
     │        ├─► [Available] ──► Upload to SeaweedFS S3 Bucket ('university-media')
     │        │                   └── Return Backend Media URL (/uploads/filename)
     │        │
     │        └─► [Unavailable] ─► Save to Local 'university_backend/uploads/'
     │                            └── Return Local Static Asset URL (/uploads/filename)
```

- **SeaweedFS In Local/Staging**: Run via `docker compose -f seaweedfs-compose.yml up -d`. Exposes S3 API on port `8333` and Web Filer on port `8888`.
- **Public Media Route**: `/uploads/:filename` serves local files directly and proxies SeaweedFS S3 or Filer objects through the backend, so clients do not need direct storage access.
- **Zero-Failure Fallback**: If Docker is not running or S3 is unavailable, the backend gracefully stores files to `university_backend/uploads/` and serves them statically via NestJS static asset middleware. No upload request will ever crash due to missing storage containers.

---

## 10. Email Notification System (Resend)

The backend integrates the **Resend** transactional email API (`university_backend/src/email/email.service.ts`).

### 10.1 Automated Email Triggers
1. **Student Application Submitted**:
   - **Student Email**: Sends an instant, beautifully branded confirmation letter containing applicant name, reference number, intended program, and next steps in the evaluation process.
   - **Admin Notification**: Sends an urgent alert to `ADMIN_NOTIFICATION_EMAIL` with applicant qualifications, contact details, and a direct link to the Admin Review Portal.
2. **Information Request Submitted**:
   - **User Email**: Sends a thank-you note with links to download the academic prospectus.
   - **Admin Notification**: Alerts the admissions office about the prospective student inquiry and their selected programs of interest.

---

## 11. Local Development Quick Start Guide

### 11.1 Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or higher
- **PostgreSQL**: PostgreSQL database instance (local or cloud like Aiven / Supabase)
- **Docker Desktop** *(Optional for local SeaweedFS & Prometheus)*

### 11.2 Initial Setup Step-by-Step

#### Step 1: Clone and Navigate
```bash
cd SIT_Development
```

#### Step 2: Configure Backend Environment
```bash
cd university_backend
cp .env.example .env
```
Edit `.env` and set your `DATABASE_URL`, `JWT_SECRET`, and `ADMIN_PASSWORD`.

#### Step 3: Install Backend Dependencies & Seed Database
```bash
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed   # or: npx ts-node prisma/seed.ts
```
*(The seed script populates all initial academic programs, faculty, news, history, and the default super admin account).*

#### Step 4: Configure Frontend Environment
```bash
cd ../university_frontend
cp .env.example .env.local
npm install
```

### 11.3 Launching All Services

#### On Windows (PowerShell One-Click Launcher):
```powershell
.\start-dev.ps1
```
*(Starts SeaweedFS in Docker if available, launches Backend on port 5000 in a new window, and Frontend on port 3000 in a new window).*

#### On macOS / Linux (Bash Launcher):
```bash
chmod +x start-dev.sh stop-dev.sh
./start-dev.sh
```

#### Stopping Development Services:
```powershell
# Windows
.\stop-dev.ps1

# Linux / macOS
./stop-dev.sh
```

### 11.4 Accessing Local Services
- **Public Portal**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3000/admin`
- **Backend API**: `http://localhost:5000/api`
- **SeaweedFS S3 Endpoint**: `http://localhost:8333`
- **SeaweedFS Filer Explorer**: `http://localhost:8888`
- **Prometheus Dashboard**: `http://localhost:9000`

---

## 12. Staging & Production Deployment Guide

### 12.1 Alpine Linux / VPS Deployment (Scripted)
The repository includes an optimized, production-ready staging script (`deploy-staging.sh`) designed for standalone Linux VPS or Alpine NAT hosts.

```bash
# Execute deployment script with IP and custom port parameters:
chmod +x deploy-staging.sh stop-staging.sh
./deploy-staging.sh <SERVER_IP> <FRONTEND_PORT> <BACKEND_PORT>

# Example:
./deploy-staging.sh 149.56.240.225 3965 4118
```

#### What `deploy-staging.sh` Automates:
1. Validates and installs required system packages (`nodejs`, `npm`, `git`, `curl`, `docker`).
2. Boots SeaweedFS container cluster.
3. Generates Prisma client and builds NestJS backend into optimized `dist/`.
4. Compiles Next.js frontend into ultra-lightweight `.next/standalone` production bundle.
5. Injects production environment variables.
6. Launches backend and frontend as persistent background services with process IDs saved to `.staging_pids`.

### 12.2 Production Process Management with PM2 (Recommended for Ubuntu/Debian/RHEL)

If deploying to a dedicated cloud VM (e.g., AWS EC2, DigitalOcean, Hetzner), PM2 provides automated process restart and clustering:

#### 1. Install PM2 Globally
```bash
npm install -g pm2
```

#### 2. Start Backend
```bash
cd /var/www/SIT_Development/university_backend
npm install --production=false
npx prisma generate
npx prisma db push
npm run build
pm2 start dist/main.js --name "sit-backend"
```

#### 3. Start Frontend
```bash
cd /var/www/SIT_Development/university_frontend
npm install
npm run build
pm2 start npm --name "sit-frontend" -- start -- -p 3000
```

#### 4. Configure PM2 Startup
```bash
pm2 save
pm2 startup
```

### 12.3 Recommended Nginx Reverse Proxy Configuration

```nginx
# Public University Portal (Frontend)
server {
    listen 80;
    server_name sit.edu.la www.sit.edu.la;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# API & Media Uploads (Backend)
server {
    listen 80;
    server_name api.sit.edu.la;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 13. Admin Dashboard & Operations Guide

### 13.1 Accessing the Admin CMS
1. Navigate to: `https://sit.edu.la/admin/login` (or `http://localhost:3000/admin/login`).
2. Default Credentials *(from initial seeding)*:
   - **Email**: `admin@sit.edu.la`
   - **Password**: *(Configured in `ADMIN_PASSWORD` in `.env`)*
3. Once logged in, the JWT token is stored securely in browser storage, granting access to all administrative modules in the sidebar.

### 13.2 Key Administrative Workflows

#### 1. Managing Student Applications
- Navigate to **Applications** in the sidebar.
- Filter by status (`PENDING`, `REVIEWED`, `ACCEPTED`, `REJECTED`) or search by applicant name/program.
- Click **View Dossier** to inspect previous qualifications, GPA, submitted PDF documents, and personal statement.
- Update application status and leave internal committee review notes.

#### 2. Publishing News & Campus Events
- Navigate to **News** or **Events**.
- Click **Create New Article / Event**.
- Fill in bilingual titles, summaries, and full rich content.
- Upload feature images directly via the media picker.
- Click **Publish**. Updates appear immediately on the public website.

#### 3. Updating Academic Programs & Departments
- Navigate to **Departments** or **Programs**.
- Manage curriculum requirements, program directors, career placement statistics, and core focus area tags.
- Re-order items using the `order` priority field.

#### 4. Updating Admissions Timelines & Downloadable Forms
- Navigate to **Admissions** -> **Timelines** or **How to Apply Materials**.
- Create intake cycles (e.g., "Fall 2026", "Spring 2027") with opening and deadline dates.
- Upload application forms and brochures (PDF) with custom download badges.

---

## 14. Maintenance, Backups & Disaster Recovery

### 14.1 Database Backups (PostgreSQL)
To back up the complete relational database to a timestamped SQL dump:
```bash
# Create Backup
pg_dump "postgres://username:password@hostname:port/database" -F c -b -v -f "sit_backup_$(date +%Y%m%d_%H%M%S).dump"

# Restore Backup
pg_restore -d "postgres://username:password@hostname:port/database" -v "sit_backup_YYYYMMDD_HHMMSS.dump"
```

### 14.2 Media Storage Backup (SeaweedFS / Uploads)
- If using SeaweedFS, back up the volume data directory (`seaweedfs_volume_data` Docker volume).
- If using local disk storage, create daily archives of the `university_backend/uploads/` directory:
```bash
tar -czvf "uploads_backup_$(date +%Y%m%d).tar.gz" university_backend/uploads/
```

### 14.3 Common Troubleshooting & Solutions

| Symptom / Error | Cause | Resolution |
| :--- | :--- | :--- |
| **`PrismaClientInitializationError`** | Invalid `DATABASE_URL` or network timeout to PostgreSQL | Verify database host is reachable; ensure SSL mode (`?sslmode=require`) is specified if using cloud Postgres. |
| **Images show broken / 404** | Backend media URL mismatch or storage unavailable | Check `S3_PUBLIC_URL`, `BACKEND_PUBLIC_URL`, backend logs, and the `/uploads/:filename` response. |
| **CORS error on API requests** | Frontend origin not accepted by backend | Check `app.enableCors()` in `main.ts`. By default it allows all origins (`origin: true`). |
| **`UnauthorizedException` on Admin** | JWT token expired or missing `Authorization` header | Log out and log back in at `/admin/login` to obtain a fresh token. |
| **Email notifications not arriving** | Missing or invalid `RESEND_API_KEY` | Provide a valid Resend API key in `university_backend/.env` and verify sending domain at resend.com. |

---

## 15. Client Handover Checklist

Please verify that the following items are completed during the official project handover:

- [x] **Source Code Transferred**: Complete repository including frontend, backend, Docker configurations, and scripts.
- [x] **Database Seeded & Migrated**: Prisma schema synchronized with all models and initial content seeded.
- [x] **Super Admin Account Provisioned**: Primary credentials supplied for university administrative staff.
- [x] **Bilingual Content Verified**: All key public pages tested in both English and Lao.
- [x] **Online Applications Tested**: Test student application submitted, verified in admin panel, and confirmation email delivery confirmed.
- [x] **Media Uploads Verified**: Test images uploaded and displayed across dynamic components.
- [x] **Staging & Dev Scripts Tested**: `start-dev` and `deploy-staging` scripts validated for execution.
- [x] **Documentation Delivered**: `document.md` provided covering architecture, APIs, schema, operations, and deployment.

---

*Documentation prepared for Sengsavanh Institute of Technology (SIT) — All Rights Reserved.*
