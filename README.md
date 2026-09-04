# Unity Drop Web — Frontend Application Manual

**Unity Drop Web** is the client-side portal for the Unity Drop Blood Donation Management System. Built on **Next.js 15** with **React 19**, it delivers three role-specific dashboards (Admin, Donor, Patient) with a premium, animated, mobile-first interface.

---

## ⚙️ Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router + Turbopack) |
| UI Library | React 19 (with React Server Components) |
| Styling | Tailwind CSS v4 + HSL CSS variables |
| Animations | Framer Motion |
| State Management | Zustand (persistent global state) |
| Form Handling | React Hook Form + Yup validation schemas |
| API Communication | Axios (with global interceptors for HttpOnly cookie sessions) |
| Charts | Recharts (admin analytics dashboard) |
| Toast Notifications | Sonner |
| Security | Google ReCAPTCHA v2 (client-side integration) |
| Email Bridge | Nodemailer via internal Next.js API routes (for Vercel deployment) |
| Page Transitions | nextjs-toploader |

---

## 📂 Project Directory Structure

```
unity-drop-web/
├── public/                         # Static assets (images, lottie animations, icons)
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── admin/
│   │   │   ├── (auth)/             # Admin register, login, verify-email pages
│   │   │   └── dashboard/          # Admin dashboard (donors, patients, admins, feedbacks, stats)
│   │   ├── donor/
│   │   │   ├── (auth)/             # Donor register, login, verify-email pages
│   │   │   └── dashboard/          # Donor dashboard (patients, requests, profile, stats)
│   │   ├── patient/
│   │   │   ├── (auth)/             # Patient register, login, verify-email pages
│   │   │   └── dashboard/          # Patient dashboard (donors, requests, profile, stats)
│   │   ├── public-feedback/        # Public landing page feedback submission form
│   │   ├── api-internal-email/     # Internal Next.js API route (email bridge for Vercel)
│   │   ├── globals.css             # Global CSS, Tailwind v4 directives, custom tokens
│   │   ├── layout.js               # Root layout (font loading, providers, top loader)
│   │   └── page.js                 # Public landing page
│   ├── components/
│   │   ├── common/                 # CaptchaField, PasswordField, SystemHealthCard, InfoDetailBox
│   │   ├── ui/                     # Radix UI primitives (dialogs, dropdowns, cards, skeletons)
│   │   └── providers/              # Sonner toast provider wrapper
│   ├── features/
│   │   ├── dashboard/              # Sidebar, charts, request notice components
│   │   └── landing/                # Landing page sections (BloodInfoSection, FAQSection, Hero)
│   ├── hooks/
│   │   ├── useNetworkHealth.js     # Online/offline browser connection monitor
│   │   └── useDebounce.js          # Debounce hook for search input fields
│   ├── lib/
│   │   └── axios.js                # Axios instance with base URL and interceptors
│   ├── store/
│   │   └── auth/
│   │       ├── authAdminStore.js   # Zustand admin state + API action functions
│   │       ├── authDonorStore.js   # Zustand donor state + API action functions
│   │       └── authPatientStore.js # Zustand patient state + API action functions
│   └── middleware.js               # Next.js route protection (redirects unauthenticated users)
├── next.config.mjs                 # Next.js config (API proxy rewrites)
├── package.json
└── .env.example                    # Environment variable template
```

---

## 💡 Architecture & Key Features

### 1. Role-Based Protected Dashboards
Three completely separate authenticated dashboard areas, each with their own layouts and pages:

| Dashboard | URL | Features |
|---|---|---|
| **Admin** | `/admin/dashboard` | User management, analytics charts, admin approvals, feedback moderation |
| **Donor** | `/donor/dashboard` | Patient browsing, request management (Accept/Reject), profile, stats |
| **Patient** | `/patient/dashboard` | Donor search, blood request dispatch, request tracking, profile |

Route protection is enforced at the **Next.js middleware level** (`middleware.js`) — unauthenticated users are redirected to the login page before any page renders.

### 2. Global State with Zustand
Each role has its own Zustand store (`authAdminStore`, `authDonorStore`, `authPatientStore`) that:
- Holds the authenticated user object in memory
- Provides all API action functions (fetch, update, delete, etc.)
- Persists state across page navigations without re-fetching

### 3. Form Validation
All forms are managed by **React Hook Form** with **Yup** schemas:
- No unnecessary re-renders during typing
- Strict validation: email format, phone numbers, blood group values, OTP length
- ReCAPTCHA v2 token is validated before any form can submit

### 4. Network Health Monitoring
- **`useNetworkHealth` hook** — Listens to the browser's built-in `online`/`offline` events.
- Shows a toast warning when the user goes offline.
- Shows a success toast when the connection is restored.
- No background polling — zero extra server requests.

### 5. Email Bridge (Vercel Deployment)
On Vercel, outbound SMTP ports are blocked. The frontend includes an internal API route (`/api-internal-email`) that acts as a secure email relay for the backend, using Nodemailer directly from the Next.js server.

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** v18 or higher
- **Unity Drop API** running at `http://localhost:8000` (backend must be started first)
- **Google ReCAPTCHA v2** site key

### Step 1 — Install Dependencies
```bash
npm install
```

### Step 2 — Configure Environment Variables
Copy the template and fill in your values:
```bash
cp .env.example .env
```

```env
# Frontend public URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend API URL (all /api requests are proxied here)
NEXT_PUBLIC_Backend_URL=/api
API_URL=http://localhost:8000

# Google reCAPTCHA v2 (get from console.google.com)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here

# Email Bridge (used for Vercel deployments only)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
INTERNAL_EMAIL_SECRET=unity_drop_internal_email_secret_2026
```

> **Note:** The `API_URL` and `NEXT_PUBLIC_Backend_URL` are used together. The Next.js config rewrites all `/api/*` requests on the frontend to `http://localhost:8000/*` behind the scenes, so you never expose your backend URL in the browser.

### Step 3 — Start Development Server
```bash
npm run dev
```
> The portal will be accessible at **`http://localhost:3000`**
> Powered by **Turbopack** for near-instant hot reloads.

### Step 4 — Build for Production
```bash
npm run build
```

### Step 5 — Start Production Server
```bash
npm start
```

---

## 📄 License
This project is licensed under the **ISC License**.

---
*Maintained under secure, professional development standards.* 🩸
