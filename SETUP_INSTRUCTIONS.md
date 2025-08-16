# Setup Instructions for NextAuth.js

## Environment Variables Setup

To fix the NextAuth.js error and port issues, you need to create a `.env.local` file in your project root with the following variables:

### Required Environment Variables

Create a file named `.env.local` in your project root directory and add:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3001

# Firebase Configuration (if not already set)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
```

### Steps to Fix the Error:

1. **Create the `.env.local` file** in your project root
2. **Add the environment variables** above (replace with your actual Firebase values)
3. **Update NEXTAUTH_URL to match your port** (currently running on 3001)
4. **Restart your development server** after adding the environment variables
5. **The chatbot should now work** without the NextAuth errors

### For Production:

- Change `NEXTAUTH_URL` to your production domain
- Use a strong, random `NEXTAUTH_SECRET` (you can generate one with: `openssl rand -base64 32`)

### Note:

The chatbot will work even without authentication, but user-specific features like chat history will only work for logged-in users.

### Quick Fix for Port Issues:

If you want to force the server to run on port 3000, you can:

1. **Stop the current server** (Ctrl+C)
2. **Kill any process using port 3000**: `npx kill-port 3000`
3. **Restart the server**: `npm run dev`

Or simply update the `NEXTAUTH_URL` in `.env.local` to match your current port (3001).
