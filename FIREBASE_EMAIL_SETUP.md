# Firebase Email Setup Guide

## المشكلة: رسائل إعادة تعيين كلمة المرور لا تصل

### الخطوة 1: إعداد Firebase Authentication

1. **اذهب إلى Firebase Console**
   - https://console.firebase.google.com/
   - اختر مشروعك

2. **Authentication > Templates**
   - اذهب إلى **Authentication** في القائمة الجانبية
   - اختر **Templates** tab
   - اختر **Password reset** template

3. **تخصيص Email Template**

   ```
   Subject: Reset your ITIANS password

   Content:
   Hello,

   You requested to reset your password for your ITIANS account.

   Click the button below to reset your password:

   [Reset Password Button]

   If you didn't request this, you can safely ignore this email.

   Best regards,
   ITIANS Team
   ```

### الخطوة 2: إعداد Authorized Domains

1. **Authentication > Settings**
   - اذهب إلى **Authentication** > **Settings**
   - في **Authorized domains** أضف:
     - `localhost` (للاختبار المحلي)
     - `yourdomain.com` (للموقع الإنتاجي)

### الخطوة 3: اختبار الإعدادات

1. **في Development:**
   - افتح Console في المتصفح
   - ستجد رسالة مثل:

   ```
   Password reset email sent to: your-email@gmail.com
   Reset URL: http://localhost:3000/reset-password?oobCode=...
   ```

2. **في Production:**
   - تحقق من Spam folder
   - تحقق من Firebase Console > Authentication > Users

### الخطوة 4: حلول إضافية

#### إذا لم تصل الرسالة:

1. **تحقق من Spam/Junk folder**
2. **أضف Firebase إلى whitelist**
3. **تحقق من Firebase Console logs**

#### إعدادات Gmail:

1. اذهب إلى Gmail Settings
2. Filters and Blocked Addresses
3. أضف `noreply@your-project.firebaseapp.com` إلى whitelist

### الخطوة 5: اختبار شامل

```javascript
// في development، ستجد في console:
console.log("Password reset email sent to:", data.email);
console.log("Reset URL:", redirectUrl);
console.log("Note: In production, check the email for the reset link");
```

### الخطوة 6: إعدادات إضافية

#### في Firebase Console:

1. **Authentication > Settings > Authorized domains**
   - أضف: `localhost`
   - أضف: `yourdomain.com`

2. **Authentication > Templates > Password reset**
   - تأكد من أن Action URL صحيح
   - اختبر Template

#### Environment Variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
# في production:
# NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### استكشاف الأخطاء:

1. **تحقق من Firebase Console > Authentication > Users**
   - هل المستخدم موجود؟
   - هل البريد الإلكتروني صحيح؟

2. **تحقق من Firebase Console > Authentication > Templates**
   - هل Password reset template مُعد؟

3. **تحقق من Network tab في المتصفح**
   - هل API calls تعمل؟

4. **تحقق من Console**
   - هل هناك أخطاء؟

### ملاحظات مهمة:

- **Development**: الرسائل لا تُرسل فعلياً، فقط console logs
- **Production**: الرسائل تُرسل فعلياً عبر Firebase
- **Gmail**: قد تضع رسائل Firebase في Spam
- **Rate Limiting**: 3 محاولات في الساعة

### إذا استمرت المشكلة:

1. تحقق من Firebase project settings
2. تأكد من أن Email/Password authentication مفعل
3. تحقق من Firebase quotas و limits
4. راجع Firebase Console logs
