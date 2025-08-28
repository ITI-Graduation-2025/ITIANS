## ITIANS – Graduate Networking, Mentorship, and Jobs Platform

ITIANS is a full‑stack Next.js platform that connects graduates, mentors, and companies. It provides role‑based dashboards, real‑time chat, job postings and applications, profile management with file uploads, analytics, and push notifications.

### Key Features

- **Authentication & Roles**: Email/password auth, protected routes, role‑based dashboards (students, mentors, companies, admins).
- **Real‑time Chat**: One‑to‑one chat under `src/app/chat/[chatId]` with message history and typing indicators.
- **Jobs Module**: Post jobs, browse/apply, and manage applications (`src/app/(jihan)/*`).
- **Profiles**: Complete and edit profiles, upload avatars/documents (Cloudinary), vanity usernames under `src/app/u/[username]`.
- **Mentorship**: Mentor profiles, sessions, bookings, and review flow under `src/app/(islam)/*`.
- **Notifications**: In‑app + Firebase Cloud Messaging (FCM) push.
- **Analytics**: Dashboard charts and engagement metrics.
- **File Uploads**: Secure uploads to Cloudinary with previews and validation.

### Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: firebase , Next.js API Routes (`src/app/api/*`)
- **Data/Services**: Firebase Auth, Firestore, Firebase Admin SDK, FCM
- **Media**: Cloudinary
- **State/Utilities**: Context API, custom hooks, service layer
- **Tooling**: ESLint, PostCSS, Vercel

---

## Project Structure

High‑level directories (see `src/` for full details):

- `src/app/` – App Router pages, layouts, and API routes
  - `(islam)/` – mentorship, bookings, mentor data, session flows
  - `(jihan)/` – company dashboards, jobs, profiles, settings
  - `chat/` – chat UI, message screens, and send box
  - `api/` – API routes: auth, users, uploads, notifications, jobs, etc.
- `src/components/` – UI components, forms, tables, providers, charts
- `src/services/` – service layer (auth, chat, notifications, mentorship, posts)
- `src/lib/` – Firebase admin, Cloudinary client, utils, mock data
- `src/config/` – Firebase client/admin configuration
- `src/context/` – Auth and user context providers
- `src/hooks/` – Reusable hooks (chat logic, current user, network errors)
- `public/` – static assets (images, icons, service worker)

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project (Web App + Service Account) with Auth, Firestore, and FCM
- A Cloudinary account (for media uploads)

### 1) Clone and Install

```bash
git clone <your-repo-url>
cd ITIANS
npm install
```

### 2) Configure Environment Variables

Use `env-template.txt` or `vercel-env.txt` as a reference. Create a `.env.local` file in the project root:

```bash
copy env-template.txt .env.local
```

Fill in the variables below. Common keys used in the codebase include:

```ini
# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase (admin)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# App
NEXTAUTH_SECRET=some-strong-secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- Service account JSON: place it at `src/config/serviceAccount.json` (a template exists) or set the admin variables above.
- For FCM, ensure `public/firebase-messaging-sw.js` is present and configured if you plan to use push notifications locally.

### 3) Verify Environment

```bash
npm run verify:env
```

### 4) Seed Sample Data (optional)

If you plan to showcase graduates data and charts:

```bash
npm run seed:graduates
```

This uses `scripts/seedGraduates.mjs` and `data/graduates.xlsx`.

### 5) Run the App

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Available Scripts

```bash
npm run dev           # start development server
npm run build         # create production build
npm run start         # run production server
npm run lint          # run ESLint
npm run verify:env    # check required environment variables
npm run seed:graduates# seed Firestore with graduates data
```

---

## Core Modules

### Authentication & Middleware

- Client auth via Firebase Auth; server validation via Firebase Admin.
- Sensitive routes are protected using `src/middleware.js` and role checks in server handlers.

### Chat

- Pages under `src/app/chat` with core logic in `src/hooks/useChatLogic.js` and helpers in `src/lib/chatFunctions.js`.
- Supports real‑time updates and notifications.

### Jobs & Company Flows

- Company dashboards, job posting, and applications under `src/app/(jihan)/*` with supporting services in `src/services/postServices.js` and `src/services/index.js`.

### Mentorship

- Mentor data, editing, booking, pending review flows under `src/app/(islam)/*` and components in `src/components/mentorComp/*`.

### Uploads & Media

- Cloudinary integration in `src/lib/cloudinary.js` and `src/utils/upload.js`.
- File previews/icons in `public/` and `src/components/`.

### Notifications

- FCM setup in `public/firebase-messaging-sw.js` and server routes under `src/app/api/sendNotification` and `src/services/notificationService.js`.

---

## API Routes (selection)

- `src/app/api/auth/*` – authentication helpers
- `src/app/api/users/*` – user profiles and listing
- `src/app/api/upload/*` – file upload endpoints
- `src/app/api/graduates/*` – graduates data ingestion/download
- `src/app/api/notify/*` and `src/app/api/sendNotification/*` – push notifications
- `src/app/api/check-email/*` and `src/app/api/username/*` – validation utilities

---

## Coding Standards

- Follow the existing code style and naming in the repository.
- Run `npm run lint` before committing.
- Prefer multi‑line, readable code; avoid deep nesting.

---

## Deployment (Vercel)

1. Push the repository to GitHub/GitLab.
2. Create a new Vercel project and import the repo.
3. Add all environment variables from `.env.local` to the Vercel project settings.
4. Set the build command to `npm run build` and output as default (`.next`).
5. Deploy. Ensure FCM web push origins match the deployed domain.

For local previews, you can also use `vercel dev` if you prefer the Vercel CLI.

---

## Troubleshooting

- Firebase Admin private key must keep newlines escaped as `\n` in `.env`.
- If uploads fail, verify Cloudinary credentials and unsigned/unsigned presets as needed.
- Service worker for FCM must be at `/firebase-messaging-sw.js` and served from the root.
- If role‑based routes 403, confirm middleware and token claims are set correctly.

---

## License

This project is for educational and portfolio purposes. Add a license if you plan to open‑source it.

---

## Acknowledgements

- ITI community and contributors
- Next.js, Firebase, Cloudinary, and the open‑source ecosystem
