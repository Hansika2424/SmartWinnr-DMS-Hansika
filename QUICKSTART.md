# Quick Start Guide

## 5-Minute Setup

### Step 1: Start MongoDB

```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 2: Start Backend

```bash
cd backend
npm install
npm run dev
```

✅ Backend running on http://localhost:5000

### Step 3: Start Frontend

```bash
cd frontend/dms-frontend
npm install
npm start
```

✅ Frontend running on http://localhost:4200

### Step 4: Test the Application

**Register:**

1. Go to http://localhost:4200/register
2. Create an account
3. Auto-login and redirect to dashboard

**Upload Document:**

1. Click "Upload" button
2. Select a file (PDF, image, etc.)
3. Fill in title, description, category, tags
4. Click "Upload Document"

**Search & Download:**

1. Use search bar to find documents
2. Click category or tag filters
3. Click "Download" to get your file

**Logout:**

1. Click "Logout" button
2. Redirected to login page

## Common Commands

### Backend

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### Frontend

```bash
# Start dev server
npm start
# or
ng serve

# Build for production
ng build --configuration production

# Run tests
ng test
```

## Default Ports

- Backend API: http://localhost:5000
- Frontend: http://localhost:4200
- MongoDB: mongodb://localhost:27017

## First Account

Create your first user account by registering at `/register`

## Need Help?

See the main README.md for:

- Complete feature documentation
- API endpoint reference
- Troubleshooting guide
- Deployment instructions
- Architecture details
