# Firebase Custom Action URL Setup

## المشكلة: الرابط ما زال يوجه إلى صفحة Firebase الافتراضية

### السبب:

Firebase يتجاهل `handleCodeInApp: true` في بعض الحالات ويستخدم صفحته الافتراضية.

### الحل: إعداد Custom Action URL في Firebase Console

## الخطوة 1: إعداد Firebase Console

1. **اذهب إلى Firebase Console**
   - https://console.firebase.google.com/
   - اختر مشروعك

2. **Authentication > Settings**
   - اذهب إلى **Authentication** في القائمة الجانبية
   - اختر **Settings** tab

3. **Authorized Domains**
   - أضف `localhost` (للاختبار المحلي)
   - أضف domain الإنتاج (مثل `yourdomain.com`)

4. **Action URL Configuration**
   - في نفس الصفحة، ابحث عن **Action URL** أو **Custom Action URL**
   - أضف: `http://localhost:3000/reset-password` (للاختبار المحلي)
   - أضف: `https://yourdomain.com/reset-password` (للإنتاج)

## الخطوة 2: تحديث الكود

في `src/components/ForgotPassword.jsx`:

```javascript
await sendPasswordResetEmail(auth, data.email, {
  // لا نحتاج url هنا إذا تم إعداده في Firebase Console
  // url: redirectUrl,
  // handleCodeInApp: true,
});
```

## الخطوة 3: إعدادات إضافية

### في Firebase Console > Authentication > Templates:

1. **Password Reset Template**
   - اذهب إلى **Templates** tab
   - اختر **Password reset**
   - في **Action URL**، أضف:
     ```
     {{link}}
     ```
   - أو اتركه فارغاً ليستخدم الإعدادات العامة

### في Firebase Console > Authentication > Settings:

1. **Authorized Domains**

   ```
   localhost
   yourdomain.com
   ```

2. **Action URL (إذا كان متاحاً)**
   ```
   http://localhost:3000/reset-password
   https://yourdomain.com/reset-password
   ```

## الخطوة 4: اختبار

1. أعد تشغيل الخادم
2. جرب إعادة تعيين كلمة المرور
3. تحقق من الرابط الجديد في Console
4. يجب أن يوجه مباشرة إلى صفحتنا

## ملاحظات مهمة:

- **Development**: استخدم `localhost`
- **Production**: استخدم domain الإنتاج
- **Firebase Console**: الإعدادات في Console لها أولوية على الكود
- **Testing**: تأكد من إضافة جميع domains المطلوبة

## استكشاف الأخطاء:

### إذا لم يعمل:

1. تحقق من Authorized Domains
2. تأكد من إعداد Action URL في Console
3. تحقق من Firebase Console logs
4. تأكد من أن الموقع يعمل على localhost:3000

### بديل سريع:

إذا لم تعمل Custom Action URL، يمكن استخدام Firebase Default Page مع تحسين التصميم عبر CSS customization.
