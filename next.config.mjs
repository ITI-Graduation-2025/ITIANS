// next.config.mjs
import { writeFile } from "fs/promises";
import { join } from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // --- إعدادات الصور ---
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "png.pngtree.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "www.creativefabrica.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // أضف أي domains أخرى تحتاجها
    ],
  },

  // --- Headers للسماح للـ Service Worker بالتسجيل ---
  async headers() {
    return [
      {
        source: "/firebase-messaging-sw.js",
        headers: [
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
          {
            key: "Cache-Control",
            value: "no-cache",
          },
        ],
      },
    ];
  },
};

// --- توليد ملف الـ Service Worker ديناميكيًا ---
const generateFirebaseSW = async () => {
  const workerContent = `
// حقن متغيرات Firebase
self.FIREBASE_API_KEY = "${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}";
self.FIREBASE_AUTH_DOMAIN = "${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}";
self.FIREBASE_PROJECT_ID = "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}";
self.FIREBASE_STORAGE_BUCKET = "${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}";
self.FIREBASE_MESSAGING_SENDER_ID = "${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}";
self.FIREBASE_APP_ID = "${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}";
self.FIREBASE_MEASUREMENT_ID = "${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}";

// استيراد مكتبات Firebase (بدون أي مسافات!)
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// تهيئة Firebase
firebase.initializeApp({
  apiKey: self.FIREBASE_API_KEY,
  authDomain: self.FIREBASE_AUTH_DOMAIN,
  projectId: self.FIREBASE_PROJECT_ID,
  storageBucket: self.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID,
  appId: self.FIREBASE_APP_ID,
  measurementId: self.FIREBASE_MEASUREMENT_ID,
});

// استخراج الـ messaging
const messaging = firebase.messaging();

// استقبال الإشعارات في الخلفية (بدون استخدام ?.)
messaging.onBackgroundMessage((payload) => {
  console.log('📥 Background Message:', payload);

  // تجنب استخدام Optional Chaining (?.) في الـ Service Worker
  const notification = payload.notification;
  const title = notification ? notification.title || 'Notification' : 'Notification';
  const body = notification ? notification.body : '';
  const icon = notification && notification.icon ? notification.icon : '/icons/icon-192x192.png';
  const badge = '/icons/badge-72x72.png';

  const options = {
  body: body,
  icon: icon,
  badge: badge,
  data: payload.data || {} // آمن لو data مش موجود
};

  self.registration.showNotification(title, options);
});
  `.trim();

  const filePath = join(process.cwd(), "public", "firebase-messaging-sw.js");
  try {
    await writeFile(filePath, workerContent, "utf8");
    console.log("✅  public/firebase-messaging-sw.js");
  } catch (error) {
    console.error("❌ Service Worker:", error);
  }
};

// تنفيذ الدالة عند تشغيل السيرفر
generateFirebaseSW().catch(console.error);

export default nextConfig;
