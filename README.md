# Document Management System (DMS)

A complete full-stack Document Management System built with the MEAN stack (MongoDB, Express.js, Angular, Node.js).

## Project Overview

This application allows users to:

- Register and authenticate with JWT tokens
- Upload documents with metadata (title, description, tags, category)
- Search and filter documents
- Download documents
- Manage document versions
- Set document permissions
- Delete documents (owners only)

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: Angular 15
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer middleware

## Project Structure

```
document-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── upload.js            # Multer file upload configuration
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Document.js          # Document schema
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   └── documents.js         # Document endpoints
│   ├── uploads/                 # Uploaded files directory
│   ├── .env                     # Environment variables
│   ├── server.js                # Express server setup
│   ├── package.json
│   └── .gitignore
└── frontend/
    └── dms-frontend/
        ├── src/
        │   ├── app/
        │   │   ├── components/
        │   │   │   ├── login/
        │   │   │   ├── register/
        │   │   │   ├── dashboard/
        │   │   │   └── upload/
        │   │   ├── services/
        │   │   │   ├── auth.service.ts
        │   │   │   └── document.service.ts
        │   │   ├── guards/
        │   │   │   └── auth.guard.ts
        │   │   ├── interceptors/
        │   │   │   └── auth.interceptor.ts
        │   │   ├── models/
        │   │   │   ├── user.model.ts
        │   │   │   └── document.model.ts
        │   │   ├── app-routing.module.ts
        │   │   ├── app.module.ts
        │   │   └── app.component.ts
        │   ├── environments/
        │   │   ├── environment.ts
        │   │   └── environment.prod.ts
        │   ├── styles.css           # Global styles
        │   └── index.html
        ├── package.json
        ├── angular.json
        ├── tsconfig.json
        └── .gitignore
```

## Prerequisites

- **Node.js** (v14 or higher) and npm
- **MongoDB** running locally or on a remote server
- **Angular CLI** (installed globally): `npm install -g @angular/cli`

## Installation & Setup

### 1. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MongoDB URI and other settings

# Start the server
npm run dev
# Server will run on http://localhost:5000
```

**Backend Environment Variables (.env):**

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dms
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
CLIENT_URL=http://localhost:4200
```

### 2. Frontend Setup

```bash
# Navigate to frontend folder
cd frontend/dms-frontend

# Install dependencies
npm install

# Start the development server
npm start
# or
ng serve

# Navigate to http://localhost:4200/
```

## Features

### Authentication

- User registration with validation
- User login with JWT token
- Protected routes with auth guard
- Automatic token attachment to API requests

### Document Management

- Upload documents with metadata
- Create and manage document versions
- Search documents by title and description
- Filter by category and tags
- Download documents
- Delete documents (owner only)
- Set user permissions for sharing

### User Interface

- Responsive design (mobile, tablet, desktop)
- Modern gradient backgrounds
- Smooth animations and transitions
- Real-time validation feedback
- Loading states and error handling
- Drag-and-drop file upload
- Tag management system

<img width="1918" height="946" alt="image" src="https://github.com/user-attachments/assets/ebff7959-8867-48e4-a9c9-5e680a1468bd" />
<img width="1915" height="943" alt="image" src="https://github.com/user-attachments/assets/e27e8c6a-55a9-4ae1-8926-a7fe2d3b6bf3" />



## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login user and get JWT token
- `GET /me` - Get current user profile (protected)

### Document Routes (`/api/documents`)

- `POST /upload` - Upload new document (protected)
- `GET /` - Get documents with filtering (protected)
- `GET /:id` - Get single document (protected)
- `GET /:id/download` - Download document (protected)
- `PUT /:id` - Update document and create version (protected)
- `POST /:id/permissions` - Set document permissions (protected)
- `DELETE /:id` - Delete document (protected)

## Usage Guide

### 1. Register a New Account

1. Navigate to http://localhost:4200/register
2. Enter username, email, password, and confirm password
3. Click "Register"
4. You'll be logged in and redirected to the dashboard

### 2. Upload a Document

1. Click the "Upload" button in the navbar
2. Drag and drop a file or click to select
3. Fill in the document details:
   - Title (auto-filled from filename)
   - Description (optional)
   - Category
   - Tags (add multiple tags)
   - Make Public (optional)
4. Click "Upload Document"

### 3. Search & Filter Documents

1. Use the search bar to search by title or description
2. Click category pills to filter by category
3. Click tag pills to filter by tags
4. Click "Clear Filters" to reset

### 4. Download Documents

1. Find the document in the grid
2. Click the "Download" button

### 5. Delete Documents

1. Find your document (you must be the owner)
2. Click the trash icon (🗑️)
3. Confirm deletion

### 6. Update Documents

1. Click the "Update" button on your document
2. Modify details or upload a new version
3. Click "Update Document"

## File Upload Restrictions

Allowed file types:

- Images: JPEG, JPG, PNG, GIF
- Documents: PDF, DOC, DOCX, XLS, XLSX, TXT
- Archives: ZIP

Max file size: 10 MB

## Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token expiration (7 days)
- ✅ Input validation on frontend and backend
- ✅ File type validation
- ✅ File size limits
- ✅ XSS protection via Angular sanitization
- ✅ CORS properly configured
- ✅ Secure token storage (localStorage for JWT only)
- ✅ Protected API routes

## Error Handling

The application includes comprehensive error handling:

- Try-catch blocks in all async operations
- User-friendly error messages
- Validation feedback for form inputs
- HTTP error interceptor for 401 responses
- Automatic logout on token expiration

## Testing

### Test User Registration

1. Go to /register
2. Enter credentials:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Verify success message and redirect

### Test Login

1. Go to /login
2. Enter registered credentials
3. Verify token is stored in localStorage
4. Verify redirect to dashboard

### Test File Upload

1. Click Upload button
2. Select a valid file
3. Fill in details
4. Click Upload
5. Verify file appears in dashboard

### Test Search & Filtering

1. Upload multiple documents with different categories and tags
2. Use search bar to find documents
3. Click category filters
4. Click tag filters
5. Verify results update correctly

### Test Download

1. Click download on any document
2. Verify file downloads

### Test Delete

1. Click trash icon on your document
2. Confirm deletion
3. Verify document disappears from list

### Test Protected Routes

1. Logout or clear localStorage
2. Try accessing /dashboard or /upload directly
3. Verify redirect to /login

## MongoDB Setup

### Local MongoDB

```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

Example:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dms
```

## Troubleshooting

### Backend won't start

- Check if MongoDB is running
- Check if port 5000 is not in use
- Check .env file is properly configured
- Check Node.js version (v14+)

### Frontend won't load

- Check if backend is running on http://localhost:5000
- Check if Angular CLI is installed
- Check port 4200 is not in use
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

### CORS errors

- Make sure `CLIENT_URL` in .env matches your frontend URL
- Verify backend is allowing requests from frontend URL

### Upload fails

- Check file size (max 10MB)
- Check file type is allowed
- Check uploads folder exists and has write permissions
- Check disk space

### Login issues

- Verify MongoDB is running and has users collection
- Check JWT_SECRET is set in .env
- Clear browser localStorage and try again

## Production Deployment

### Build Frontend

```bash
cd frontend/dms-frontend
ng build --configuration production
# Dist files in dist/dms-frontend/
```

### Environment Configuration

Update `environment.prod.ts` with production API URL:

```typescript
export const environment = {
  production: true,
  apiUrl: "https://your-api-domain.com/api",
};
```
## Support & Contributing

For issues or questions:

1. Check the troubleshooting section
2. Review the API endpoints documentation
3. Check console for error messages
4. Review network tab in browser DevTools

## License

MIT License - Feel free to use this project for personal and commercial use.

## Author

Hansika Srivastava 

---

