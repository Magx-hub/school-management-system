# Deployment Guide

This guide will walk you through deploying your School Management System to GitHub Pages and Firebase Hosting.

## 🚀 Deploy to GitHub Pages

### Prerequisites
- A GitHub account
- Git installed on your computer
- Node.js and npm installed

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., `school-management-system`)
4. Make it public or private (your choice)
5. Don't initialize with README (we'll push our existing code)
6. Click "Create repository"

### Step 2: Push Your Code to GitHub

```bash
# Initialize git in your project folder (if not already done)
git init

# Add all files
git add .

# Commit the changes
git commit -m "Initial commit: School Management System"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/school-management-system.git

# Push to GitHub
git push -u origin main
```

### Step 3: Configure GitHub Pages

1. **Update package.json**: Change the homepage URL to match your repository:

```json
{
  "homepage": "https://yourusername.github.io/school-management-system"
}
```

2. **Install gh-pages** (if not already installed):

```bash
npm install --save-dev gh-pages
```

3. **Deploy to GitHub Pages**:

```bash
npm run deploy
```

4. **Configure GitHub Pages**:
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Select "gh-pages" branch
   - Click "Save"

Your app will be available at: `https://yourusername.github.io/school-management-system`

## 🔥 Deploy to Firebase Hosting

### Prerequisites
- A Firebase account
- Firebase CLI installed

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open your browser to authenticate with Firebase.

### Step 3: Initialize Firebase in Your Project

```bash
firebase init
```

Follow the prompts:

1. **Select features**: Choose "Hosting"
2. **Select project**: Choose your Firebase project or create a new one
3. **Public directory**: Enter `build` (this is where React builds the production files)
4. **Configure as single-page app**: Answer `y` (yes)
5. **Set up automatic builds**: Answer `n` (no, we'll do it manually)
6. **Overwrite index.html**: Answer `n` (no, don't overwrite)

### Step 4: Build and Deploy

```bash
# Build the React app
npm run build

# Deploy to Firebase
firebase deploy
```

Your app will be available at: `https://your-project-id.web.app`

## 🌐 Environment Variables for Production

### For GitHub Pages

Since GitHub Pages serves static files, you'll need to handle environment variables differently:

1. **Create a config file** (`src/config.js`):

```javascript
const config = {
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your-api-key",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "your-project-id",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "your-app-id"
  }
};

export default config;
```

2. **Update firebase config** (`src/firebase/config.js`):

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import config from '../config';

const app = initializeApp(config.firebase);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
```

### For Firebase Hosting

Firebase Hosting supports environment variables through Firebase Functions, but for a simple React app, you can use the same approach as above.

## 🔒 Security Considerations

### Firebase Security Rules

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users only
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Or implement more specific rules
    match /teachers/{teacherId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### Environment Variables

Never commit sensitive information like API keys to your repository:

1. **Add .env to .gitignore**:

```
# .gitignore
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

2. **Use environment variables**:

```bash
# .env
REACT_APP_FIREBASE_API_KEY=your-actual-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## 🔄 Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      env:
        REACT_APP_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
        REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
        REACT_APP_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
        REACT_APP_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
        REACT_APP_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
```

### Firebase CI/CD

For Firebase Hosting, you can use GitHub Actions:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      env:
        REACT_APP_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
        REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
        REACT_APP_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
        REACT_APP_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
        REACT_APP_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
        
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
        projectId: your-project-id
```

## 🐛 Troubleshooting

### Common Issues

1. **Build fails**: Check for missing dependencies or syntax errors
2. **Firebase connection fails**: Verify your Firebase configuration
3. **Routing issues**: Ensure you're using the correct base path for your deployment
4. **Environment variables not working**: Make sure they're prefixed with `REACT_APP_`

### Debugging

1. **Check build output**: Look at the console for error messages
2. **Verify Firebase config**: Test your Firebase connection locally
3. **Check network tab**: Look for failed requests in browser dev tools
4. **Review deployment logs**: Check GitHub Actions or Firebase deployment logs

## 📊 Performance Optimization

### Build Optimization

1. **Enable gzip compression** in your hosting provider
2. **Use CDN** for static assets
3. **Implement lazy loading** for components
4. **Optimize images** and use WebP format
5. **Minimize bundle size** by analyzing with `npm run build --analyze`

### Firebase Optimization

1. **Use Firestore offline persistence** for better performance
2. **Implement proper indexing** for your queries
3. **Use pagination** for large datasets
4. **Cache frequently accessed data**

## 🔄 Updating Your Deployment

### For GitHub Pages

```bash
# Make your changes
git add .
git commit -m "Update description"
git push origin main

# Deploy
npm run deploy
```

### For Firebase Hosting

```bash
# Make your changes
git add .
git commit -m "Update description"
git push origin main

# Build and deploy
npm run build
firebase deploy
```

## 📱 Mobile Optimization

Ensure your app works well on mobile devices:

1. **Test responsive design** on various screen sizes
2. **Optimize touch targets** (minimum 44px)
3. **Implement mobile-specific navigation**
4. **Test offline functionality**
5. **Optimize loading times** for slower connections

---

**Happy Deploying! 🚀**
