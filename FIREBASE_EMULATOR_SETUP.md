# Firebase Emulator Setup Guide

## المشكلة: رسائل إعادة تعيين كلمة المرور لا تصل في Development

### السبب:

في Development mode، Firebase لا يرسل رسائل حقيقية. الرسائل تُرسل فقط في Production.

### الحل: استخدام Firebase Emulator

## الخطوة 1: تثبيت Firebase CLI

```bash
npm install -g firebase-tools
```

## الخطوة 2: تسجيل الدخول إلى Firebase

```bash
firebase login
```

## الخطوة 3: تهيئة Firebase Emulator

```bash
firebase init emulators
```

اختر:

- Authentication Emulator
- Firestore Emulator

## الخطوة 4: تشغيل Emulators

```bash
firebase emulators:start
```

## الخطوة 5: تحديث Firebase Config

في `src/config/firebase.js`:

```javascript
import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  // your config
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to emulators in development
if (process.env.NODE_ENV === "development") {
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    console.log("Connected to Firebase Emulators");
  } catch (error) {
    console.log("Emulators already connected or not available");
  }
}
```

## الخطوة 6: اختبار في Emulator

1. شغل Emulators: `firebase emulators:start`
2. افتح Emulator UI: `http://localhost:4000`
3. جرب إعادة تعيين كلمة المرور
4. تحقق من Authentication Emulator للرسائل

## ملاحظات مهمة:

- **Emulator UI**: `http://localhost:4000`
- **Auth Emulator**: `http://localhost:9099`
- **Firestore Emulator**: `http://localhost:8080`

## بديل سريع: اختبار في Production

إذا كنت تريد اختبار سريع:

1. انشر على Vercel:

   ```bash
   npm run build
   vercel --prod
   ```

2. أضف متغير البيئة في Vercel:

   ```
   NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
   ```

3. اختبر في Production URL

## استكشاف الأخطاء:

### إذا لم تعمل Emulators:

1. تأكد من تثبيت Firebase CLI
2. تأكد من تسجيل الدخول: `firebase login`
3. تأكد من تهيئة المشروع: `firebase init`

### إذا لم تصل الرسائل في Production:

1. تحقق من Firebase Console > Authentication > Templates
2. تحقق من Authorized Domains
3. تحقق من Spam folder
