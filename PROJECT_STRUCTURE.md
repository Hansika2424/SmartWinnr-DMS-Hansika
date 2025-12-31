# Complete Project Directory Structure

```
e:\DMS\
│
├── README.md                                    (Main documentation)
├── QUICKSTART.md                               (5-minute setup guide)
├── TESTING_CHECKLIST.md                        (Complete testing guide)
├── API_DOCUMENTATION.md                        (API reference)
├── IMPLEMENTATION_COMPLETE.md                  (Features summary)
│
├── backend\                                    (Node.js/Express API)
│   ├── config\
│   │   └── db.js                              (MongoDB connection)
│   │
│   ├── middleware\
│   │   ├── auth.js                            (JWT authentication)
│   │   └── upload.js                          (Multer file upload)
│   │
│   ├── models\
│   │   ├── User.js                            (User schema)
│   │   └── Document.js                        (Document schema)
│   │
│   ├── routes\
│   │   ├── auth.js                            (Auth endpoints)
│   │   └── documents.js                       (Document endpoints)
│   │
│   ├── uploads\                               (Uploaded files storage)
│   │
│   ├── server.js                              (Express server setup)
│   ├── package.json                           (Dependencies & scripts)
│   ├── .env                                   (Environment variables)
│   ├── .env.example                           (Env template)
│   └── .gitignore                             (Git ignore)
│
└── frontend\
    └── dms-frontend\                          (Angular application)
        │
        ├── src\
        │   ├── app\
        │   │   ├── components\
        │   │   │   ├── login\
        │   │   │   │   ├── login.component.ts
        │   │   │   │   ├── login.component.html
        │   │   │   │   └── login.component.css
        │   │   │   │
        │   │   │   ├── register\
        │   │   │   │   ├── register.component.ts
        │   │   │   │   ├── register.component.html
        │   │   │   │   └── register.component.css
        │   │   │   │
        │   │   │   ├── dashboard\
        │   │   │   │   ├── dashboard.component.ts
        │   │   │   │   ├── dashboard.component.html
        │   │   │   │   └── dashboard.component.css
        │   │   │   │
        │   │   │   └── upload\
        │   │   │       ├── upload.component.ts
        │   │   │       ├── upload.component.html
        │   │   │       └── upload.component.css
        │   │   │
        │   │   ├── services\
        │   │   │   ├── auth.service.ts
        │   │   │   └── document.service.ts
        │   │   │
        │   │   ├── guards\
        │   │   │   └── auth.guard.ts
        │   │   │
        │   │   ├── interceptors\
        │   │   │   └── auth.interceptor.ts
        │   │   │
        │   │   ├── models\
        │   │   │   ├── user.model.ts
        │   │   │   └── document.model.ts
        │   │   │
        │   │   ├── app-routing.module.ts
        │   │   ├── app.module.ts
        │   │   ├── app.component.ts
        │   │   ├── app.component.html
        │   │   └── app.component.css
        │   │
        │   ├── environments\
        │   │   ├── environment.ts
        │   │   └── environment.prod.ts
        │   │
        │   ├── assets\
        │   ├── styles.css
        │   ├── main.ts
        │   ├── polyfills.ts
        │   ├── index.html
        │   └── favicon.ico
        │
        ├── angular.json
        ├── tsconfig.json
        ├── tsconfig.app.json
        ├── tsconfig.spec.json
        ├── package.json
        ├── .gitignore
        ├── .browserslistrc
        ├── angular.cli.json
        └── README.md
```

## File Count Summary

```
Backend Files:
├── Config files:        1
├── Middleware files:    2
├── Model files:         2
├── Route files:         2
├── Configuration:       5 (server.js, package.json, .env, .env.example, .gitignore)
└── Total Backend:      12 files

Frontend Files:
├── Components:         12 (4 components × 3 files each)
├── Services:            2
├── Guards:              1
├── Interceptors:        1
├── Models:              2
├── Configuration:      11 (angular.json, tsconfig files, package.json, etc.)
├── Styling:             5 (global + component styles)
├── Core files:          3 (main.ts, polyfills.ts, index.html)
└── Total Frontend:     37 files

Documentation:
├── Main README:         1
├── Quick Start:         1
├── Testing Guide:       1
├── API Docs:            1
├── Implementation:      1
└── Total Docs:          5 files

Total Project Files: 50+ files
Total Lines of Code: 5,000+
```

## Technology Stack

```
Backend (Server-side):
├── Runtime:      Node.js 14+
├── Framework:    Express.js 4.x
├── Database:     MongoDB + Mongoose 7.x
├── Auth:         JWT (jsonwebtoken 9.x)
├── File Upload:  Multer 1.x
├── Security:     bcryptjs 2.x
├── Validation:   express-validator 7.x
├── CORS:         cors 2.x
└── Environment:  dotenv 16.x

Frontend (Client-side):
├── Framework:    Angular 15+
├── HTTP:         HttpClientModule
├── Routing:      Angular Router
├── Forms:        Reactive Forms + Template Forms
├── Styling:      CSS3 + CSS Grid/Flexbox
├── Package Mgr:  npm
└── Build Tool:   Angular CLI
```

## Port Configuration

```
MongoDB:    27017  (local)
Backend:    5000   (http://localhost:5000)
Frontend:   4200   (http://localhost:4200)
```

## Database Collections

```
MongoDB (dms database):
├── users
│   ├── username (unique, indexed)
│   ├── email (unique, indexed)
│   ├── password (hashed)
│   ├── role
│   └── createdAt, updatedAt
│
└── documents
    ├── title (indexed)
    ├── uploadedBy (foreign key to users)
    ├── tags (array, indexed)
    ├── category (indexed)
    ├── fileName
    ├── filePath
    ├── fileSize
    ├── mimeType
    ├── permissions (array with userId references)
    ├── versions (array with upload history)
    ├── currentVersion
    ├── isPublic (indexed)
    └── createdAt, updatedAt (indexed)
```

## API Endpoints Summary

```
Authentication:
├── POST   /api/auth/register          (Create account)
├── POST   /api/auth/login             (Get JWT token)
└── GET    /api/auth/me                (Get profile - protected)

Documents:
├── POST   /api/documents/upload       (Upload - protected)
├── GET    /api/documents              (List with filters - protected)
├── GET    /api/documents/:id          (Get one - protected)
├── GET    /api/documents/:id/download (Download file - protected)
├── PUT    /api/documents/:id          (Update & version - protected)
├── POST   /api/documents/:id/perms    (Set permissions - protected)
└── DELETE /api/documents/:id          (Delete - protected)

Health:
└── GET    /api/health                 (Server status)
```

## Component Hierarchy

```
AppComponent
├── LoginComponent
├── RegisterComponent
├── DashboardComponent
│   ├── Navbar
│   ├── Search Section
│   ├── Filter Section
│   └── Document Grid
│       └── Document Cards
└── UploadComponent
    ├── Drop Zone
    ├── Form Fields
    ├── Tag Manager
    └── Action Buttons
```

## Routing Structure

```
/
├── /login (public)
├── /register (public)
├── /dashboard (protected by AuthGuard)
├── /upload (protected by AuthGuard)
└── /** (redirect to /dashboard)
```

## Security Layers

```
Frontend:
├── AuthGuard (route protection)
├── AuthInterceptor (token attachment)
├── Form validation (reactive & template)
└── Input sanitization (Angular)

Backend:
├── CORS (cross-origin control)
├── JWT verification (auth middleware)
├── Input validation (express-validator)
├── File validation (multer)
├── Permission checks (route handlers)
└── Password hashing (bcrypt)
```

## Environment Configuration

```
Development:
├── apiUrl: http://localhost:5000/api
├── production: false
└── PORT: 4200

Production:
├── apiUrl: https://your-domain/api
├── production: true
└── PORT: depends on hosting
```

---

This structure provides a scalable, maintainable, and professional Document Management System ready for production deployment.
