# School Management System

A comprehensive web-based school management system built with React, Firebase, and modern web technologies. This application provides tools for managing teachers, students, attendance, allowances, and canteen operations.

## 🚀 Features

### Core Functionality
- **Dashboard**: Overview with statistics and quick actions
- **Teacher Management**: Add, edit, delete, and search teachers
- **Student Management**: Manage student records and information
- **Attendance Tracking**: Daily attendance recording and reporting
- **Allowance Management**: Weekly allowance calculations and reports
- **Canteen Management**: Payment tracking and sales analytics

### Technical Features
- **Real-time Database**: Firebase Firestore for data persistence
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with consistent styling
- **Search & Filter**: Advanced search capabilities across all modules
- **Data Export**: Generate reports and export data
- **Authentication**: Secure user authentication (coming soon)

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: CSS-in-JS with custom theme system
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Icons**: React Icons (Feather Icons)
- **Date Handling**: date-fns
- **Charts**: Recharts (for analytics)
- **Notifications**: React Hot Toast
- **Deployment**: GitHub Pages

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Git
- Firebase account

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/school-management-system.git
cd school-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Go to Project Settings > General
5. Scroll down to "Your apps" and click the web icon
6. Register your app and copy the configuration

### 4. Configure Firebase

1. Open `src/firebase/config.js`
2. Replace the placeholder configuration with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 5. Set Up Firestore Rules

In your Firebase Console, go to Firestore Database > Rules and set the following rules for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development only
    }
  }
}
```

**⚠️ Important**: For production, implement proper authentication and security rules.

### 6. Start Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout/         # Layout components (Sidebar, MainLayout)
├── constants/          # Theme and configuration constants
├── firebase/           # Firebase configuration and setup
├── hooks/              # Custom React hooks
├── pages/              # Main page components
├── services/           # Firebase service functions
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles
```

## 🎨 Customization

### Theme Configuration

The application uses a centralized theme system. Modify `src/constants/theme.js` to customize:

- Colors
- Typography
- Spacing
- Shadows
- Breakpoints

### Adding New Features

1. **Create a new page**: Add a new component in `src/pages/`
2. **Add routing**: Update `src/App.js` with new routes
3. **Create services**: Add Firebase functions in `src/services/`
4. **Add hooks**: Create custom hooks in `src/hooks/`

## 🚀 Deployment

### Deploy to GitHub Pages

1. **Update package.json**: Change the homepage URL to your repository:

```json
{
  "homepage": "https://yourusername.github.io/school-management-system"
}
```

2. **Install gh-pages** (if not already installed):

```bash
npm install --save-dev gh-pages
```

3. **Deploy**:

```bash
npm run deploy
```

### Deploy to Firebase Hosting

1. **Install Firebase CLI**:

```bash
npm install -g firebase-tools
```

2. **Login to Firebase**:

```bash
firebase login
```

3. **Initialize Firebase**:

```bash
firebase init hosting
```

4. **Build and deploy**:

```bash
npm run build
firebase deploy
```

## 🔧 Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## 📊 Database Schema

### Teachers Collection
```javascript
{
  id: "auto-generated",
  fullname: "string",
  department: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Students Collection
```javascript
{
  id: "auto-generated",
  fullname: "string",
  department: "string",
  gender: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Attendance Collection
```javascript
{
  id: "auto-generated",
  teacherId: "string",
  date: "string (YYYY-MM-DD)",
  checkInTime: "string",
  checkOutTime: "string",
  status: "present|absent|late",
  remarks: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/school-management-system/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🔮 Roadmap

- [ ] User authentication and authorization
- [ ] Advanced reporting and analytics
- [ ] Email notifications
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Data import/export functionality
- [ ] Real-time notifications
- [ ] Advanced attendance features
- [ ] Financial management module

## 🙏 Acknowledgments

- React team for the amazing framework
- Firebase for the backend services
- React Icons for the beautiful icons
- The open-source community for inspiration and tools

---

**Made with ❤️ for educational institutions**
