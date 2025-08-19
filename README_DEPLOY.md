### Deployment quick guide (Vercel)

1. Create the project on Vercel and link the repo.

2. Add environment variables (Project → Settings → Environment Variables):

Copy from `env.production.example` and paste keys and values. Minimum set:

- NEXTAUTH_SECRET
- NEXTAUTH_URL (e.g. https://yourdomain.vercel.app)
- NEXT_PUBLIC_APP_URL (same as domain)
- Firebase client keys: NEXT*PUBLIC_FIREBASE*\*
- Firebase admin: FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY (use \n for newlines)
- Cloudinary: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- Admin login: NEXT_PUBLIC_ADMIN_PIN, NEXT_PUBLIC_ADMIN_EMAIL, NEXT_PUBLIC_ADMIN_PASSWORD

3. Build settings:

- Install Command: already set by `vercel.json` → `npm install --legacy-peer-deps --no-audit --no-fund`
- Build Command: `npm run build`

4. Redeploy.

5. Optional checks locally:

```bash
cp env.example .env.local
# fill values
node scripts/verify-env.mjs
npm run build && npm start
```

Notes:

- `serviceAccount.json` should not be uploaded. Prefer env vars for Admin SDK.
- For the Firebase SW, make sure all NEXT*PUBLIC_FIREBASE*\* vars exist; the file is generated during build by `next.config.mjs`.


