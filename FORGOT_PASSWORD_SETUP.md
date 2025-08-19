# Forgot Password Feature Setup Guide

This document explains how to set up and test the Forgot Password feature for the ITIANS Next.js application.

## Features Implemented

1. **Forgot Password Modal** - Integrated into the login page
2. **Reset Password Page** - Dedicated page for password reset
3. **Rate Limiting** - API route to prevent abuse (3 requests/hour per IP)
4. **Firebase Integration** - Uses Firebase Auth for password reset
5. **Development Support** - Console logging for testing
6. **Production Ready** - Real email sending in production

## Environment Variables

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
# For production, use your actual domain:
# NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Firebase Configuration

### 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** > **Templates**
4. Configure the **Password reset** email template:
   - Customize the email subject and content
   - Ensure the action URL points to your reset password page
   - Test the template

### 2. Email Templates Configuration

In Firebase Console > Authentication > Templates > Password reset:

- **Subject**: "Reset your ITIANS password"
- **Action URL**: `{{link}}` (Firebase will automatically replace this)
- **Customize the email content** as needed

## Testing Workflow

### Local Development Testing

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Test the forgot password flow**:
   - Go to `/login`
   - Click "Forgot password?"
   - Enter a valid email address
   - Submit the form
   - Check the browser console for the reset link (development only)
   - Copy the reset link from console
   - Open the link in a new tab
   - Enter a new password
   - Verify redirect to login page

3. **Test rate limiting**:
   - Try submitting the forgot password form multiple times
   - After 3 attempts, you should see a rate limit error
   - Wait for the rate limit window to expire (1 hour)

### Production Testing

1. **Deploy to production**
2. **Test with real email**:
   - Use a real email address
   - Check your inbox for the reset email
   - Click the reset link
   - Complete the password reset process

## File Structure

```
src/
├── app/
│   ├── login/
│   │   └── page.js (updated with ForgotPassword component)
│   ├── reset-password/
│   │   └── page.js (new - handles password reset)
│   └── api/
│       └── forgot-password/
│           └── route.js (new - rate limiting)
├── components/
│   ├── form/
│   │   └── loginForm.jsx (updated with ForgotPassword import)
│   └── ForgotPassword.jsx (new - modal component)
```

## Components Overview

### ForgotPassword.jsx

- Modal component with email input
- Firebase password reset integration
- Rate limiting check
- Form validation
- Success/error handling

### reset-password/page.js

- Handles password reset confirmation
- Extracts oobCode from URL
- Password validation (min 6 characters)
- Firebase confirmPasswordReset integration
- Redirects to login on success

### api/forgot-password/route.js

- Rate limiting implementation
- 3 requests per hour per IP
- In-memory storage (use Redis in production)

## Error Handling

The implementation handles various error scenarios:

- **Invalid email**: Shows appropriate error message
- **User not found**: Informs user no account exists
- **Rate limiting**: Prevents abuse with clear messaging
- **Expired/invalid reset links**: Guides user to request new link
- **Weak passwords**: Validates password strength

## Security Considerations

1. **Rate Limiting**: Prevents brute force attacks
2. **Secure Reset Links**: Firebase handles secure token generation
3. **Password Validation**: Minimum 6 characters required
4. **HTTPS Required**: Production should use HTTPS
5. **Environment Variables**: Sensitive data stored in environment variables

## Customization

### Styling

- Uses existing Tailwind CSS classes
- Follows the project's design system
- Primary color: `#901b20` (matches existing theme)

### Messages

- All messages are in English
- Can be easily customized in the component files
- Toast notifications for user feedback

### Rate Limiting

- Currently set to 3 requests per hour
- Can be adjusted in `api/forgot-password/route.js`
- Consider using Redis for production scalability

## Troubleshooting

### Common Issues

1. **Reset link not working**:
   - Check Firebase Console email templates
   - Verify NEXT_PUBLIC_APP_URL is set correctly
   - Ensure the reset-password page is accessible

2. **Rate limiting too strict**:
   - Adjust MAX_REQUESTS in the API route
   - Consider different limits for development vs production

3. **Emails not sending**:
   - Check Firebase project configuration
   - Verify email templates are set up
   - Check Firebase quotas and limits

### Development Tips

- Use Firebase Emulator for local testing
- Monitor browser console for development logs
- Test with different email providers
- Verify rate limiting behavior

## Production Deployment

1. **Set environment variables**:

   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

2. **Configure Firebase**:
   - Set up proper email templates
   - Configure authorized domains
   - Test email delivery

3. **Monitor usage**:
   - Check Firebase Analytics
   - Monitor rate limiting logs
   - Track password reset success rates

## Support

For issues or questions:

1. Check Firebase Console logs
2. Review browser console for errors
3. Verify environment variable configuration
4. Test with Firebase Emulator if needed
