// Project Structure for React PWA Allowance System
/allowance-pwa/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── sw.js (service worker)
│   └── icons/
│       ├── icon-192x192.png
│       └── icon-512x512.png
├── src/
│   ├── components/
│   │   ├── AllowanceForm.jsx
│   │   ├── AllowanceList.jsx
│   │   ├── Layout.jsx
│   │   └── LoadingSpinner.jsx
│   ├── hooks/
│   │   └── useAllowance.js
│   ├── services/
│   │   ├── allowanceService.js
│   │   └── firebase.js
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Calculator.jsx
│   │   ├── Reports.jsx
│   │   └── History.jsx
│   ├── styles/
│   │   ├── globals.css
│   │   └── components.css
│   ├── utils/
│   │   └── constants.js
│   ├── App.js
│   └── index.js
├── package.json
└── README.md

// Package.json dependencies for the PWA
{
  "name": "allowance-system-pwa",
  "version": "1.0.0",
  "homepage": "https://yourusername.github.io/allowance-pwa",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "firebase": "^10.7.1",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.0",
    "vite-plugin-pwa": "^0.16.4"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}

// Vite configuration (vite.config.js)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'School Allowance System',
        short_name: 'Allowance PWA',
        description: 'School allowance calculation and management system',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: '/allowance-pwa/'
})

// Firebase configuration (src/services/firebase.js)
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config here
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// For development with local emulator (optional)
// if (process.env.NODE_ENV === 'development') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export default app;