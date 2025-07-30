// حقن متغيرات Firebase
self.FIREBASE_API_KEY = "AIzaSyBlMzVoTIAzb-ql2QYeid1NpYiu9dwGjPI";
self.FIREBASE_AUTH_DOMAIN = "iti-platform.firebaseapp.com";
self.FIREBASE_PROJECT_ID = "iti-platform";
self.FIREBASE_STORAGE_BUCKET = "iti-platform.firebasestorage.app";
self.FIREBASE_MESSAGING_SENDER_ID = "808324936416";
self.FIREBASE_APP_ID = "1:808324936416:web:1540dd08baec41a22f5685";
self.FIREBASE_MEASUREMENT_ID = "G-C421XZRKG6";

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