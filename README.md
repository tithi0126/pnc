# Vitality Hub - Nutrition Consultant Website

A modern React application for Dr. Bidita Shah's nutrition consulting practice, featuring a complete admin panel for managing services, testimonials, gallery, and contact inquiries.

## 🚀 Features

### Public Website
- **Responsive Design**: Optimized for desktop and mobile
- **Service Showcase**: Display nutrition services with detailed descriptions
- **Testimonials**: Customer reviews and ratings
- **Gallery**: Professional images and content
- **Contact Form**: Lead capture and inquiry management

### Admin Panel
- **Complete CRUD Operations**: Create, read, update, delete for all content
- **User Authentication**: JWT-based authentication with role management
- **Content Management**: Services, testimonials, gallery, contact inquiries
- **Settings Management**: Site-wide configuration
- **User Management**: Admin role assignment and user oversight

## 🛠️ Technologies Used

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for data fetching

### Data Storage & Authentication
- **Browser localStorage** for data persistence (no server required)
- **Custom authentication** with secure token generation
- **Service layer architecture** for data operations
- **Offline-capable** - works without internet connection

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (running on localhost:27017)
- **Modern web browser** with localStorage support

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <YOUR_GIT_URL>
cd vitality-hub
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Start MongoDB
Make sure MongoDB is running on `localhost:27017`. If not installed:
```bash
# Windows (using Chocolatey)
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community

# Start MongoDB service
mongod
```

### 4. Start the Backend Server
```bash
# Open a new terminal
cd backend
npm install
npm start
```
Backend will run on `http://localhost:5000`

### 5. Start the Frontend Server
```bash
# Back in the main project directory
npm run dev
```

The application will be available at `http://localhost:8080`

### 6. Initial Setup (First Time Only)
The application will automatically detect MongoDB connection and use it for all data operations. The backend connects to the `vitality-hub` database automatically.

## 👤 Admin Setup

### Create Your First Admin Account

1. **Navigate to Admin Auth**: `http://localhost:8080/admin/auth`
2. **Register**: Create an account with your email and password
3. **Check Database Status**: The admin panel overview will show MongoDB connection status
4. **Login**: Use your credentials at `http://localhost:8080/admin/auth`

**Note**: The first registered user automatically gets admin privileges. You can manage additional admin roles through the Users tab in the admin panel.
5. **Access Admin Panel**: Navigate to `http://localhost:8080/admin`

## 📊 Admin Panel Features

### Dashboard Overview
- Statistics overview (services, testimonials, inquiries)
- Recent activity and pending items

### Services Management
- Add, edit, delete nutrition services
- Configure pricing, duration, benefits
- Activate/deactivate services
- Reorder services for display

### Testimonials Management
- Approve/reject customer testimonials
- Mark testimonials as featured
- Add ratings and customer information
- Bulk management operations

### Gallery Management
- Upload and manage images
- Categorize images (Healthy Food, Consultation, Events, etc.)
- Show/hide images on website
- SEO-friendly alt text management

### Contact Inquiries
- View all customer inquiries
- Update inquiry status (new → read → responded → archived)
- Add internal notes
- Direct email and WhatsApp links

### User Management
- View all registered users
- Assign/remove admin privileges
- Search and filter users
- Role-based access control

### Settings
- Update site name and contact information
- Configure WhatsApp number
- Manage global site settings

## 🔍 Database Connection Monitoring

The admin panel includes comprehensive database connection monitoring:

### Real-time Status Display
- **Admin Dashboard**: Visual indicators showing MongoDB connection status
- **Console Logging**: Detailed connection logs on application startup
- **API Testing**: Automatic testing of backend API endpoints

### Browser Console Commands
```javascript
// Check all database connections
checkDB()

// Test MongoDB connection specifically
testMongoDB()

// Log detailed connection status
dbStatus.logAllConnections()
```

### Connection Status Indicators
- **🟢 Connected**: MongoDB is accessible and responding
- **🟡 API Running**: Backend is running but MongoDB may have issues
- **🔴 Disconnected**: Backend server or MongoDB is not available

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin panel components
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
├── lib/                # Utility functions and API layer
├── models/             # MongoDB schemas
├── pages/              # Page components
├── services/           # Business logic services
└── utils/              # Helper utilities
```

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- **Registration**: Users can create accounts
- **Login**: JWT tokens stored in localStorage
- **Authorization**: Role-based access (admin, user)
- **Security**: Passwords hashed with bcrypt

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- **Vercel**: Connect your GitHub repo
- **Netlify**: Drag & drop the dist folder
- **Traditional Hosting**: Upload build files to any static host

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 📞 Support

For technical support or questions about the admin panel, please contact the development team.
