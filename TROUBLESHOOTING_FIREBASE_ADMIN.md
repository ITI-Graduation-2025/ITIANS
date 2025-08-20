# 🔧 Firebase Admin Troubleshooting Guide

## Current Issue: UNAUTHENTICATED Error

The error you're seeing:

```
16 UNAUTHENTICATED: Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential.
```

This indicates that Firebase Admin is initializing but failing to authenticate with Firestore.

## 🔍 Root Causes & Solutions

### 1. **Project ID Mismatch** ⚠️ MOST LIKELY CAUSE

**Problem**: The `NEXT_PUBLIC_FIREBASE_PROJECT_ID` environment variable doesn't match the service account project.

**Check**:

- Service account has `project_id: "iti-platform"`
- Environment variable should be `NEXT_PUBLIC_FIREBASE_PROJECT_ID=iti-platform`

**Fix**: Update your Vercel environment variables to match exactly.

### 2. **Missing Required Configuration**

**Problem**: Firebase Admin needs additional configuration beyond just credentials.

**Required Fields**:

```javascript
{
  credential: admin.credential.cert({...}),
  projectId: "iti-platform",           // Must match service account
  storageBucket: "iti-platform.appspot.com",
  databaseURL: "https://iti-platform.firebaseio.com"
}
```

### 3. **Service Account Permissions**

**Problem**: The service account might not have the right permissions.

**Check**: Ensure the service account has these roles:

- Firebase Admin SDK Administrator Service Agent
- Cloud Datastore User
- Firebase Authentication Admin

## 🧪 Testing Steps

### Step 1: Test Environment Variables

Visit `/api/test-firebase` to see detailed environment information.

### Step 2: Check Vercel Logs

Look for these messages in Vercel function logs:

```
✅ Initializing Firebase Admin with environment variables
✅ Firebase Admin initialized successfully with env vars
```

### Step 3: Verify Project ID Consistency

The service account email `firebase-adminsdk-fbsvc@iti-platform.iam.gserviceaccount.com`
should match your `NEXT_PUBLIC_FIREBASE_PROJECT_ID=iti-platform`.

## 🔧 Quick Fixes

### Fix 1: Update Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Set `NEXT_PUBLIC_FIREBASE_PROJECT_ID=iti-platform` (exact match)
3. Ensure `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` are set
4. Redeploy

### Fix 2: Use Service Account File (Temporary)

If environment variables continue to fail, the system will fall back to `serviceAccount.json`.

### Fix 3: Check Firebase Console

1. Go to Firebase Console → Project Settings → Service Accounts
2. Verify the service account exists and has proper permissions
3. Download a fresh service account key if needed

## 📋 Required Vercel Environment Variables

```bash
# Firebase Client (Frontend)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=iti-platform
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=iti-platform.appspot.com
# ... other NEXT_PUBLIC_* variables

# Firebase Admin (Backend) - CRITICAL
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@iti-platform.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# NextAuth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 🚨 Common Mistakes

1. **Project ID Mismatch**: Using different project IDs in different places
2. **Missing Quotes**: Private key not wrapped in quotes in Vercel
3. **Wrong Environment**: Variables set for Preview instead of Production
4. **Service Account Permissions**: Insufficient IAM roles

## 🔍 Debug Commands

### Local Environment Check

```bash
node scripts/verify-env.mjs
```

### Test Firebase Admin

```bash
curl https://your-domain.vercel.app/api/test-firebase
```

## 📞 Getting Help

If the issue persists:

1. Check Vercel function logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure project ID consistency across all configurations
4. Test with a fresh service account key if needed

## ✅ Success Indicators

When working correctly, you should see:

- ✅ Firebase Admin initializing with environment variables
- ✅ No UNAUTHENTICATED errors
- ✅ `/api/test-firebase` returning success
- ✅ `/api/graduates/check` working without 500 errors
