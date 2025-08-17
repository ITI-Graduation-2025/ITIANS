#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables for ITIANS...\n');

// Get the current port from command line or default to 3001
const port = process.argv[2] || 3001;

const envContent = `# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:${port}

# Firebase Configuration (if not already set)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file successfully!');
  console.log(`✅ Set NEXTAUTH_URL to http://localhost:${port}`);
  console.log('\n📝 Next steps:');
  console.log('1. Replace the Firebase configuration values with your actual values');
  console.log('2. Restart your development server');
  console.log('3. The chatbot should now work without errors!');
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  console.log('\n📝 Manual setup:');
  console.log('1. Create a .env.local file in your project root');
  console.log('2. Copy the content above into the file');
  console.log('3. Replace Firebase values with your actual configuration');
}
