# Services Not Storing - Fix Instructions

## Problem

Services added through the admin panel are not being stored properly in MongoDB.

## Root Cause

The backend server at `http://localhost:5003` is not running, causing the application to fall back to localStorage instead of saving to MongoDB.

## Solution

### Step 1: Ensure MongoDB is Running

Check if MongoDB is running:

```cmd
tasklist | findstr mongod
```

If MongoDB is not running, start it:

```cmd
net start MongoDB
```

Or if you installed MongoDB manually, navigate to your MongoDB bin directory and run:

```cmd
mongod --dbpath="C:\data\db"
```

### Step 2: Start the Backend Server

Open a new terminal in the project root and run:

```cmd
cd backend
npm start
```

The server should start on port 5003. You should see:

```
Server running on port 5003
MongoDB connected successfully
```

### Step 3: Verify Backend is Running

In another terminal, test the health endpoint:

```cmd
curl http://localhost:5003/api/health
```

You should get a response like:

```json
{ "status": "OK", "message": "PNC API is running", "timestamp": "..." }
```

### Step 4: Test Service Creation

1. Open your browser and go to the admin panel
2. Log in with your admin credentials
3. Navigate to the Services tab
4. Click "Add Service"
5. Fill in the service details:
   - Title (required)
   - Short Description (required)
   - Full Description (optional)
   - Duration (e.g., "45-60 minutes")
   - Ideal For (e.g., "Weight management")
   - Benefits (one per line)
   - Active checkbox (checked to make it visible)
6. Click "Save Service"

The service should now be saved to MongoDB and persist across page refreshes.

## Technical Details

### Changes Made

1. **Fixed API Endpoint** (`src/lib/api.ts`):
   - Changed `getAllAdmin()` to use `/services/admin` instead of `/services`
   - This matches the backend route definition in `backend/routes/services.js`

### Backend Routes

The backend has the following service routes:

- `GET /api/services` - Get active services (public)
- `GET /api/services/admin` - Get all services including inactive (admin only, requires auth)
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create new service (admin only, requires auth)
- `PUT /api/services/:id` - Update service (admin only, requires auth)
- `DELETE /api/services/:id` - Delete service (admin only, requires auth)

### Authentication

The admin routes require:

1. Valid JWT token in the Authorization header
2. User must have 'admin' role

The frontend automatically includes the auth token from localStorage when making API calls.

## Troubleshooting

### Services still not saving?

1. **Check browser console** for error messages
2. **Check backend terminal** for error logs
3. **Verify MongoDB connection**:
   - Check `.env` file has `MONGODB_URI=mongodb://localhost:27017/vitality-hub`
   - Ensure MongoDB is accessible at that URI

### Backend won't start?

1. **Port 5003 already in use**:

   ```cmd
   netstat -ano | findstr :5003
   taskkill /PID <pid> /F
   ```

2. **Missing dependencies**:

   ```cmd
   cd backend
   npm install
   ```

3. **MongoDB connection error**:
   - Verify MongoDB is running
   - Check the MONGODB_URI in `.env`

### Authentication errors?

1. **Clear localStorage** and log in again
2. **Verify admin role** in the database:
   ```javascript
   // In MongoDB shell or Compass
   db.users.find({ email: "your-email@example.com" });
   // Should show roles: ["admin"]
   ```

## Database Schema

The Service model in MongoDB has the following fields:

```javascript
{
  title: String (required),
  shortDescription: String (required),
  fullDescription: String,
  icon: String (default: 'Apple'),
  duration: String,
  idealFor: String,
  benefits: [String],
  isActive: Boolean (default: true),
  sortOrder: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## Next Steps

Once the backend is running:

1. Services will be saved to MongoDB
2. They will persist across page refreshes
3. The admin panel will show all services (active and inactive)
4. The public website will only show active services
