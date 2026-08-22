# SIT UNIVERSITY WEBSITE — FULL IMPLEMENTATION SPECIFICATION

## 1. PROJECT CONTEXT

You are working inside the following project:

```text
SIT_Development/
├── Design_svgs/
├── university_frontend/
└── university_backend/
```

This is an existing project.

You MUST inspect the existing projects before making architectural decisions.

Do NOT replace the existing architecture unnecessarily.

Do NOT create a new frontend project.

Do NOT create a new backend project.

Do NOT migrate the projects to another framework.

---

# 2. TECHNOLOGY

## Frontend

The existing `university_frontend` project is the frontend application.

It contains:

* Public-facing university website
* Admin Dashboard

Both must remain inside the same Next.js application.

Use the existing Next.js version and configuration already present in `university_frontend`.

Use the existing:

* TypeScript configuration
* Tailwind CSS configuration
* ESLint configuration
* package manager
* component system
* routing approach
* styling conventions
* existing dependencies

Do NOT arbitrarily replace existing libraries.

Before implementing anything, inspect:

```text
university_frontend/
├── package.json
├── next.config.*
├── tsconfig.json
├── eslint.config.*
├── tailwind.config.*
├── src/
├── app/
├── pages/
├── components/
└── other existing directories
```

The exact existing structure determines where new code should be placed.

Follow official Next.js project architecture and the architecture already established by the project.

---

# 3. BACKEND

`university_backend` is the existing NestJS backend.

Use:

* NestJS
* TypeScript
* PostgreSQL
* Prisma ORM

The PostgreSQL connection already exists in:

```text
university_backend/.env
```

with:

```env
DATABASE_URL=...
```

DO NOT replace the existing `DATABASE_URL`.

DO NOT create another database configuration unless the existing implementation genuinely requires it.

Inspect the existing backend before implementation.

---

# 4. BACKEND ARCHITECTURE

The backend MUST use a feature-based modular architecture.

Do NOT create one giant:

```text
controllers/
services/
repositories/
```

structure containing every feature.

Instead, organize by business feature/module.

For example:

```text
university_backend/
└── src/
    ├── auth/
    ├── admins/
    ├── hero/
    ├── core-values/
    ├── majors/
    ├── students/
    ├── faculty/
    ├── programs/
    ├── program-directors/
    ├── spotlights/
    ├── partners/
    ├── admissions/
    ├── campus/
    ├── news/
    ├── events/
    ├── student-life/
    ├── founder/
    ├── members/
    ├── history/
    ├── vision-mission/
    ├── contact/
    ├── application-timeline/
    ├── admission-requirements/
    └── ...
```

However:

**Do not blindly copy this example.**

First inspect the existing `university_backend` architecture.

If the existing project already has an appropriate feature-based structure, extend it.

Each feature should contain its own:

* Controller
* Service
* DTO
* Prisma access/model logic
* Validation
* Business logic

Use NestJS modules properly.

---

# 5. FIGMA DESIGN SOURCE

The following directory contains SVG files exported directly from the Figma design:

```text
Design_svgs/
```

Current structure:

```text
Design_svgs/
├── About/
├── Academics/
├── Admissions/
├── ApplyNow/
├── Collaborations/
├── Department/
├── Home/
├── HowToApply/
├── Life_at_SIT/
└── RequestInfo/
```

Each directory currently contains:

```text
MobileView.svg
DesktopView.svg
```

However:

## IMPORTANT

Do NOT assume that every folder follows this structure perfectly.

Do NOT assume that `MobileView.svg` is actually the mobile version without inspecting it.

Do NOT assume that `DesktopView.svg` is actually the desktop version without inspecting it.

You MUST inspect EVERY folder.

You MUST inspect EVERY SVG.

You MUST compare the desktop and mobile designs.

If additional SVG files, assets, nested directories, or variations exist, inspect those as well.

---

# 6. DESIGN_SVGS IS ONLY A VISUAL SPECIFICATION

The `Design_svgs` directory is a design reference.

It is NOT the production website.

The SVG files are NOT the final implementation.

The application must NOT depend on:

```text
Design_svgs/
```

at runtime.

Do NOT:

* embed the SVG website
* use an SVG as an entire webpage
* create an iframe
* load a Figma URL
* use Figma runtime APIs
* use Figma rendering
* create a Figma-powered webpage
* convert an entire SVG frame into one giant image
* use the exported SVG as a substitute for React components

Instead:

**Understand the visual design and reproduce it using actual source code.**

Use:

* React components
* Next.js
* TypeScript
* Tailwind CSS
* HTML
* CSS
* SVG icons where appropriate
* actual images/assets where available

---

# 7. FIGMA ANALYSIS REQUIREMENT

Before implementing the frontend, inspect all design references.

For each folder:

```text
Design_svgs/About/
Design_svgs/Academics/
Design_svgs/Admissions/
Design_svgs/ApplyNow/
Design_svgs/Collaborations/
Design_svgs/Department/
Design_svgs/Home/
Design_svgs/HowToApply/
Design_svgs/Life_at_SIT/
Design_svgs/RequestInfo/
```

inspect:

```text
MobileView.svg
DesktopView.svg
```

and determine:

* page identity
* sections
* section ordering
* desktop layout
* mobile layout
* typography
* colors
* spacing
* card structures
* buttons
* navigation
* footer
* images
* icons
* decorative elements
* responsive transformations
* hidden/visible elements
* mobile-specific behavior
* desktop-specific behavior
* repeated components
* reusable patterns

Create an internal implementation map before coding.

---

# 8. DO NOT CREATE ONE SINGLE PAGE

This is extremely important.

Do NOT implement a complete page as:

```tsx
export default function HomePage() {
  return (
    <>
      // thousands of lines
    </>
  );
}
```

Do NOT create giant components.

Each page must be composed of detailed reusable components.

For example:

```text
HomePage
├── Header
├── HeroSection
├── CoreValuesSection
├── MajorsSection
├── StudentsSection
├── FacultySection
├── ProgramsSection
├── ProgramDirectorsSection
├── SpotlightSection
├── UniversityPartnersSection
├── IndustryPartnersSection
├── NewsSection
├── StudentLifeSection
└── Footer
```

Each section should be a real React component.

If a section is complex, split it further.

For example:

```text
ProgramsSection/
├── ProgramsSection.tsx
├── ProgramCard.tsx
├── ProgramGrid.tsx
└── ProgramFilters.tsx
```

Use the same principle throughout the application.

---

# 9. REUSABILITY

Identify repeated visual patterns from the Figma designs.

Create reusable components for:

* Header
* Desktop navigation
* Mobile navigation
* Footer
* Buttons
* Section headers
* Cards
* Program cards
* Faculty cards
* Partner logos
* News cards
* Event cards
* Image galleries
* Modals
* Breadcrumbs
* Pagination
* Forms
* Timeline
* CTA sections
* Statistics
* Testimonials
* Content blocks

Do not duplicate identical UI implementations across pages.

---

# 10. RESPONSIVE DESIGN

Responsive implementation is mandatory.

Do NOT simply shrink the desktop page.

The mobile SVG must be analyzed separately.

Determine what changes between:

```text
DesktopView.svg
MobileView.svg
```

including:

* navigation
* layout direction
* spacing
* typography
* card layout
* image sizes
* section ordering
* visibility
* buttons
* menus
* grids
* carousels
* content density

Use responsive Tailwind classes.

Example:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

but do NOT blindly use generic responsive classes.

Match the actual Figma design.

Test at:

```text
320px
360px
375px
390px
414px
768px
820px
1024px
1280px
1440px
1920px
```

Fix:

* horizontal overflow
* text clipping
* broken grids
* incorrect spacing
* oversized images
* inaccessible menus
* broken buttons
* incorrect navigation

---

# 11. REQUIRED DYNAMIC CONTENT MANAGEMENT

The following content MUST be dynamic and manageable through the Admin Dashboard.

Nothing in this list should be permanently hardcoded into the public website.

## 11.1 Hero Section

Manage:

* Background image
* Title
* Subtitle
* Description
* Button text
* Button destination

---

## 11.2 Our Core Values

Manage:

* Title
* Description
* Icon/image
* Ordering

---

## 11.3 Our Majors

Manage:

* Title
* Description
* Image
* Ordering

---

## 11.4 Students Section

Manage:

* Title
* Subtitle
* Description
* Image
* Statistics/content displayed by the design

---

## 11.5 Teachers & Professors

Manage:

* Name
* Position
* Biography
* Profile image
* Ordering

---

# 12. ACADEMIC PROGRAMS

Academic Programs must use a unified structure.

Do NOT create separate incompatible schemas for every department.

Use a common program model.

Example conceptual structure:

```text
Academic Program
├── Department
├── Program information
├── Core Focus Areas
├── Program Director
└── Other program-specific content
```

Manage:

* Program name
* Slug
* Description
* Degree
* Duration
* Image
* Core Focus Areas
* Program Director

---

# 13. PROGRAM DIRECTORS

Manage:

* Name
* Position
* Biography
* Image
* Associated program/department

---

# 14. FACULTY & STUDENT SPOTLIGHT

Manage:

* Type
* Title
* Description
* Image
* Ordering

Types may include:

```text
Faculty
Student
```

---

# 15. UNIVERSITY PARTNERS

Manage:

* Name
* Logo
* Website
* Ordering

---

# 16. INDUSTRY PARTNERS

Manage:

* Name
* Logo
* Website
* Ordering

---

# 17. ADMISSION HERO

Manage:

* Background/image
* Title
* Subtitle
* Description
* CTA

---

# 18. CAMPUS & FACILITIES

Manage:

* Name
* Description
* Image
* Ordering

Each item must support configurable action behavior.

Possible actions:

```text
REDIRECT
MODAL
```

For REDIRECT:

* destination URL/path

For MODAL:

* modal title
* modal content
* optional image/gallery

---

# 19. NEWS AND EVENTS

News and Events must be dynamically managed.

Support:

* listing
* detail page
* slug
* image
* title
* summary
* content
* publication date
* category
* ordering/status where necessary

News cards on the public site must link to actual article detail pages.

Do NOT hardcode article pages.

---

# 20. STUDENT LIFE & ACTIVITIES

Manage:

* Title
* Description
* Images
* Gallery
* Ordering

---

# 21. FOUNDER

Manage:

* Founder image
* Founder name
* Designation
* Remark/content

---

# 22. MEET OUR MEMBERS

Manage:

* Name
* Position
* Biography
* Image
* Ordering

---

# 23. OUR HISTORY

Manage:

* Title
* Rich content
* Timeline/history entries if required by the design

---

# 24. VISION & MISSION

Manage:

* Vision
* Mission

The public website must retrieve these from the backend.

---

# 25. CONTACT INFORMATION

Manage:

* Address
* Phone
* Email
* Map
* Office/contact information

The map must be configurable.

---

# 26. APPLICATION TIMELINE

Manage:

* Intake name
* Intake year
* Opening date
* Closing date
* Status if necessary

The frontend must display the current data from the backend.

---

# 27. ADMISSION REQUIREMENTS

Manage admission requirements through the Admin Dashboard.

Support structured content and/or rich text depending on the Figma design.

---

# 28. ADMIN DASHBOARD

The existing `university_frontend` must contain both:

```text
Public Website
+
Admin Dashboard
```

Do NOT create a separate frontend project for the admin dashboard.

Use a dedicated admin route structure.

For example, adapt to the existing Next.js architecture with something conceptually similar to:

```text
/admin
/admin/login
/admin/dashboard
/admin/content
/admin/programs
/admin/faculty
/admin/admissions
/admin/news
/admin/events
/admin/partners
/admin/media
/admin/settings
```

Use the existing routing architecture if it differs.

---

# 29. ADMIN DASHBOARD FEATURES

Implement:

## Authentication

* Login
* Logout
* Protected admin routes
* Authentication state
* Unauthorized handling

---

## Dashboard

Display useful overview statistics such as:

* Programs
* Faculty
* Students/spotlights
* News
* Events
* Partners
* Applications
* Request Info submissions

---

# 30. CRUD

The Admin Dashboard must provide full CRUD for every dynamic content type.

For each resource support:

```text
Create
Read
Update
Delete
```

Where applicable also support:

```text
Publish
Unpublish
Sort/Reorder
Search
Filter
Pagination
```

---

# 31. ADMIN CONTENT UI

Use appropriate interfaces.

Examples:

* Tables for lists
* Forms for editing
* Image upload controls
* Rich text editor where needed
* Reorder controls
* Confirmation dialogs
* Validation messages
* Loading states
* Empty states
* Error states
* Success notifications

Do not build the admin dashboard as a collection of raw HTML forms.

It should be a usable administration system.

---

# 32. APPLY NOW

Implement:

```text
Apply Now Form
```

The form must submit to the NestJS backend.

Store submissions in PostgreSQL.

At minimum collect the fields required by the design.

Inspect the Figma design to determine:

* fields
* labels
* required fields
* optional fields
* validation
* confirmation UI

Admin users must be able to view submissions.

---

# 33. REQUEST INFO

Implement:

```text
Request Info Form
```

The form must submit to the NestJS backend.

Store submissions in PostgreSQL.

Inspect the design for exact fields.

Admin Dashboard must allow administrators to view submissions.

---

# 34. DATABASE

Use PostgreSQL with Prisma.

The backend already contains:

```env
DATABASE_URL
```

Use it.

Create proper Prisma models for:

* Admin users
* Authentication/session data where necessary
* Hero
* Core values
* Majors
* Students section
* Faculty
* Programs
* Departments if required
* Core focus areas
* Program directors
* Spotlights
* University partners
* Industry partners
* Admission hero
* Campus/facilities
* News
* Events
* Student life
* Founder
* Members
* History
* Vision
* Mission
* Contact
* Application timeline
* Admission requirements
* Applications
* Request info submissions
* Media

Do not create unnecessary duplicated models.

Use relationships properly.

Add appropriate indexes.

Use UUIDs or follow the existing project's established ID strategy.

---

# 35. PRISMA

Use Prisma ORM properly.

Create:

```text
schema.prisma
```

and migrations.

Do not manually write raw SQL for normal CRUD when Prisma can handle it.

Use Prisma relations.

Use transactions where multiple related records must be changed atomically.

---

# 36. API DESIGN

Create clean REST APIs following the existing backend architecture.

Conceptually:

```text
POST   /auth/login
POST   /auth/logout

GET    /hero
PUT    /hero

GET    /core-values
POST   /core-values
PUT    /core-values/:id
DELETE /core-values/:id

GET    /programs
POST   /programs
GET    /programs/:slug
PUT    /programs/:id
DELETE /programs/:id
```

Apply the same principle to all dynamic resources.

Admin endpoints must be protected.

Public read endpoints must only expose appropriate published content.

Do not expose private/admin data through public endpoints.

---

# 37. FRONTEND API INTEGRATION

The public website must consume backend data.

Do NOT create:

```tsx
const programs = [...]
```

as the production data source.

Instead use backend APIs.

Use the existing frontend API architecture if one already exists.

Otherwise create an organized service/query structure.

Example conceptual structure:

```text
features/
├── programs/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   └── types/
```

Use React Query or the project's existing data-fetching strategy.

---

# 38. CONTENT FALLBACK

If the design contains content that is expected to exist but the database is empty during development, use a controlled empty state or seed data.

Do NOT permanently hardcode production content into page components.

Create seed data where useful.

---

# 39. DESIGN FIDELITY

The goal is not merely to create a website with similar sections.

The goal is to reproduce the actual SIT University design.

Pay attention to:

* Exact visual hierarchy
* Font sizing
* Font weights
* Letter spacing
* Line height
* Border radius
* Shadows
* Backgrounds
* Section spacing
* Image cropping
* Card dimensions
* Button dimensions
* Alignment
* Navigation behavior
* Mobile layout
* Desktop layout

Use the SVGs to understand the design.

Do not approximate sections unnecessarily.

---

# 40. ASSETS

If the Figma SVGs reference images/assets, inspect how they are represented.

Where actual assets are available, place them into the appropriate application asset/public structure.

Do NOT treat the entire exported `DesktopView.svg` or `MobileView.svg` as the page image.

Extract/recreate individual assets where appropriate.

For icons:

* Prefer existing project icon libraries if already installed
* Otherwise create appropriate SVG React components
* Do not rasterize simple icons unnecessarily

---

# 41. SEO

Implement appropriate SEO for public pages.

At minimum:

* title
* description
* canonical URL where appropriate
* Open Graph metadata
* social preview image where available

News and program detail pages must have dynamic metadata.

---

# 42. ACCESSIBILITY

Implement:

* semantic HTML
* keyboard accessibility
* visible focus states
* proper labels
* alt text
* accessible buttons
* accessible dialogs
* accessible navigation
* proper heading hierarchy

Do not use clickable `<div>` elements when a semantic `<button>` or `<a>` is appropriate.

---

# 43. SECURITY

Admin functionality must be protected.

Do not:

* expose passwords
* expose JWT secrets
* expose DATABASE_URL
* expose admin-only APIs publicly
* trust client-side authorization alone

Validate all backend input.

Use DTO validation.

Sanitize/handle rich text appropriately.

Validate uploaded files.

---

# 44. ERROR HANDLING

Frontend:

* loading state
* error state
* empty state
* retry where appropriate

Backend:

* proper HTTP status codes
* validation errors
* authentication errors
* authorization errors
* not-found errors
* database errors

Do not silently swallow errors.

---

# 45. IMPLEMENTATION PROCESS

Follow this order.

## Step 1 — Inspect

Inspect:

```text
Design_svgs/
university_frontend/
university_backend/
```

Understand the current project before editing.

---

## Step 2 — Analyze Design

Inspect every:

```text
MobileView.svg
DesktopView.svg
```

under every `Design_svgs` directory.

Create a mapping between:

```text
Design folder
→
Page/section
→
Frontend route
→
React components
→
Backend dynamic data
```

---

## Step 3 — Analyze Existing Architecture

Determine:

* Next.js routing architecture
* frontend folder conventions
* existing components
* existing Tailwind setup
* existing API client
* existing authentication
* NestJS modules
* Prisma configuration
* existing database schema

Reuse existing infrastructure wherever appropriate.

---

## Step 4 — Database

Implement/update Prisma schema.

Create migrations.

Create seed data if useful.

---

## Step 5 — Backend

Implement:

* Authentication
* CMS APIs
* Application API
* Request Info API
* Media API
* Admin APIs

Follow feature-based NestJS modules.

---

## Step 6 — Admin Dashboard

Implement admin authentication.

Then implement CMS CRUD.

Verify that administrators can actually create/update/delete the content.

---

## Step 7 — Public Website

Implement the public pages based on the Figma designs.

Use real React components and Tailwind CSS.

---

## Step 8 — API Integration

Connect all dynamic public content to backend APIs.

Verify that modifying content through Admin Dashboard changes the public website.

---

## Step 9 — Responsive Testing

Check every page against:

```text
MobileView.svg
DesktopView.svg
```

and test multiple viewport sizes.

---

## Step 10 — Final Audit

Verify:

### Design

* All Figma screens implemented
* All sections implemented
* Mobile implemented
* Desktop implemented

### CMS

* All dynamic sections manageable
* CRUD works
* Ordering works where needed

### Authentication

* Admin login works
* Admin logout works
* Protected routes work

### Forms

* Apply Now works
* Request Info works
* Submissions stored in PostgreSQL
* Admin can view submissions

### Backend

* NestJS architecture correct
* Feature-based modules
* Prisma working
* PostgreSQL working

### Frontend

* Next.js architecture respected
* Components reusable
* No giant page components
* Tailwind used properly

### Figma Independence

Search the entire codebase and ensure there is NO runtime dependency on:

* Figma URL
* Figma iframe
* Figma API
* Figma rendering
* Figma plugin
* Design_svgs as a runtime page renderer

The final application must be completely independent of Figma.

---

# 46. IMPORTANT IMPLEMENTATION RULE

Do not stop after creating the folder structure.

Do not merely analyze the Figma design.

Do not create placeholders such as:

```tsx
<div>TODO</div>
```

Do not create fake APIs.

Do not create static mock-only CMS screens.

Actually implement the working system.

---

# 47. IMPORTANT CODE QUALITY RULE

Do not optimize for minimizing the number of files.

The objective is maintainable production code.

It is completely acceptable and expected to create many focused components.

For example:

```text
HomePage
├── Hero
│   ├── HeroContent
│   ├── HeroActions
│   └── HeroBackground
│
├── CoreValues
│   ├── CoreValuesHeader
│   ├── CoreValuesGrid
│   └── CoreValueCard
│
├── Programs
│   ├── ProgramsHeader
│   ├── ProgramsGrid
│   └── ProgramCard
│
└── Footer
```

This is preferred over one 2,000-line page.

---

# 48. IMPORTANT FINAL RULE

The Figma design is the source of truth for visual design.

The CMS requirements are the source of truth for dynamic functionality.

The existing `university_frontend` architecture is the source of truth for frontend project conventions.

The existing `university_backend` architecture is the source of truth for backend project conventions.

The application should combine all four correctly:

```text
Figma
  ↓
Visual specification

CMS Requirements
  ↓
Dynamic functionality

university_frontend
  ↓
Next.js implementation

university_backend
  ↓
NestJS + Prisma + PostgreSQL implementation
```

Final result:

```text
                SIT UNIVERSITY
                     │
          ┌──────────┴──────────┐
          │                     │
     Public Website        Admin Dashboard
          │                     │
          └──────────┬──────────┘
                     │
                NestJS API
                     │
                  Prisma
                     │
                PostgreSQL
```

The final system must be a real, working university website with a real CMS and real database-backed administration system.

Do not build a Figma prototype.

Build the actual application.
