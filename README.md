# Unity Drop Web - Frontend Application Portal Manual

Unity Drop Web is the client-side portal for the Unity Drop Blood Donation Management System. Built using high-performance web frameworks, it provides role-specific dashboards (Admin, Donor, Patient) that connect users through clean, highly interactive interfaces.

---

## ⚙️ Core Technology Stack

* **Framework**: **Next.js 15** with **React 19** utilizing React Server Components (RSC) and fast dev execution via **Turbopack**.
* **Styling**: **Tailwind CSS v4** combined with HSL CSS variables, clean typography, and smooth transitions powered by **Framer Motion**.
* **State Management**: **Zustand** for lightweight, persistent global reactive state.
* **Form Controls**: **React Hook Form** paired with **Yup** schemas for strong schema validation.
* **API Communication**: **Axios** client configured with global interceptors to handle secure httpOnly cookie session context.
* **Visualizations**: Interactive system statistics charts powered by **Recharts**.
* **Transitions**: **NextTopLoader** providing deterministic visual page-load feedback.
* **Security Checks**: **Google ReCAPTCHA v2** integration on registration and login.
* **Toasts**: **Sonner** toast notices for clean and interactive system alerts.

---

## 📂 Frontend Directory Structure

```
unity-drop-web/
├── public/                 # Static assets, lottie files, logos
├── src/
│   ├── app/                # Next.js App Router (symmetrical routes & layouts)
│   │   ├── admin/          # Admin registration, login, verification, and dashboard
│   │   ├── donor/          # Donor registration, login, verification, and dashboard
│   │   ├── patient/        # Patient registration, login, verification, and dashboard
│   │   ├── public-feedback/# Public feedback submission route
│   │   ├── globals.css     # CSS style overrides and Tailwind v4 definitions
│   │   ├── layout.js       # Main app layout, font loading, progress bar
│   │   └── page.js         # Public landing page mapping
│   ├── components/         # Reusable UI systems
│   │   ├── common/         # CaptchaField, SystemHealthCard, PasswordField, InfoDetailBox
│   │   ├── ui/             # Dialogs, Dropdowns, Cards, Skeletons
│   │   └── providers/      # Context providers (e.g. Sonner Toast provider)
│   ├── features/           # Symmetrical visual modules
│   │   ├── dashboard/      # Sidebar layout, charts, requests dashboard notice
│   │   └── landing/        # Landing page sections (BloodInfoSection, FAQSection)
│   ├── hooks/              # Custom hooks (e.g. useNetworkHealth, useDebounce)
│   ├── lib/                # Axios interceptors and helper utils
│   ├── store/              # Zustand global store files (e.g. useAuthStore)
│   └── middleware.js       # Route protection middleware intercepting sessions
├── package.json            # Package dependencies and Turbopack scripts
└── next.config.mjs         # Next.js configurations
```

---

## 💡 Frontend Architecture & Custom Hooks

### 1. Symmetrical Role-Based Dashboards
The portal features unique dashboards for each user type, mounted symmetrically under the App Router:
* **Admin Dashboard (`/admin/dashboard`)**: Displays interactive metrics of users (Admins, Patients, Donors) and active requests, dynamic search/filter panels, and quick controls to approve administrative registrations.
* **Donor Dashboard (`/donor/dashboard`)**: Allows browsing active blood requests, updating donor health status, tracking coordination requests, and accepting/declining invites with one click.
* **Patient Dashboard (`/patient/dashboard`)**: Streamlines creating blood request alerts, listing location-compatible donors, and sending coordination requests.

### 2. Symmetrical Form Validation
Forms are fully managed with **React Hook Form** to prevent unwanted re-renders, while **Yup** schemas enforce strict validation rules on:
* **Login Form**: Email format and secure password requirements.
* **Registration Form**: Valid phone numbers, location strings, and compatible blood groups.
* **Verification Form**: 6-digit numeric OTP code.
* **Captcha Check**: Validation of Google ReCAPTCHA v2 token before submission.

### 3. Lightweight Online Monitoring
* **`useNetworkHealth` Hook**: Monitors the browser's online/offline connection state. It triggers a single warning toast if the user goes offline and a success toast when the connection is restored, without heavy database polling.
* **`SystemHealthCard` Component**: Placed in dashboard headers to provide real-time connection status feedback.

---

## 🛠️ Installation & Setup

1. **Install Client Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variable Configuration**:
   Create a `.env` or `.env.local` file at the root of `unity-drop-web`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_APP_NAME="Unity Drop"
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-google-recaptcha-site-key
   ```
3. **Execute Development Environment**:
   ```bash
   npm run dev
   ```
   *(This starts the local Next.js client at `http://localhost:3000` with fast Turbopack support)*
4. **Compile Production Bundle**:
   ```bash
   npm run build
   ```
   *(Validates types, compiles scripts, and generates the optimized production build)*

---
*Maintained under secure, professional development standards.* 🩸
