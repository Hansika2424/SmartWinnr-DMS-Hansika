# DMS API Documentation

## Base URL

`http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User

- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response** (201):

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login User

- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response** (200):

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Get Current User

- **URL**: `/auth/me`
- **Method**: `GET`
- **Auth**: Required ✅
- **Response** (200):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Document Endpoints

### Upload Document

- **URL**: `/documents/upload`
- **Method**: `POST`
- **Auth**: Required ✅
- **Content-Type**: `multipart/form-data`
- **Form Fields**:

  - `file` (File, required) - The document file
  - `title` (String, required) - Document title
  - `description` (String, optional) - Document description
  - `category` (String, optional) - Category name
  - `tags` (JSON Array, optional) - Array of tags: `["tag1", "tag2"]`
  - `isPublic` (Boolean, optional) - Make document public

- **Response** (201):

```json
{
  "message": "Document uploaded successfully",
  "document": {
    "_id": "507f191e810c19729de860ea",
    "title": "My Document",
    "description": "A sample document",
    "fileName": "1234567890-filename.pdf",
    "filePath": "uploads/1234567890-filename.pdf",
    "fileSize": 524288,
    "mimeType": "application/pdf",
    "tags": ["important", "work"],
    "category": "Work",
    "uploadedBy": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "currentVersion": 1,
    "isPublic": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get All Documents

- **URL**: `/documents?page=1&limit=10&search=&tags=&category=`
- **Method**: `GET`
- **Auth**: Required ✅
- **Query Parameters**:

  - `page` (Number, optional, default: 1) - Page number
  - `limit` (Number, optional, default: 10) - Items per page
  - `search` (String, optional) - Search in title/description
  - `tags` (String, optional) - Filter by tags (comma-separated)
  - `category` (String, optional) - Filter by category

- **Response** (200):

```json
{
  "documents": [
    {
      "_id": "507f191e810c19729de860ea",
      "title": "My Document",
      "description": "A sample document",
      "fileName": "1234567890-filename.pdf",
      "filePath": "uploads/1234567890-filename.pdf",
      "fileSize": 524288,
      "mimeType": "application/pdf",
      "tags": ["important", "work"],
      "category": "Work",
      "uploadedBy": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "email": "john@example.com"
      },
      "currentVersion": 1,
      "isPublic": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

### Get Single Document

- **URL**: `/documents/:id`
- **Method**: `GET`
- **Auth**: Required ✅
- **Permissions**: Owner, public documents, or shared users
- **Response** (200): Same as upload response

### Download Document

- **URL**: `/documents/:id/download`
- **Method**: `GET`
- **Auth**: Required ✅
- **Permissions**: Owner, public documents, or shared users
- **Response** (200): File blob with Content-Disposition header

### Update Document

- **URL**: `/documents/:id`
- **Method**: `PUT`
- **Auth**: Required ✅
- **Authorization**: Owner only
- **Content-Type**: `multipart/form-data` (if updating file)
- **Form Fields** (all optional):

  - `file` (File, optional) - New version of file
  - `title` (String, optional) - New title
  - `description` (String, optional) - New description
  - `category` (String, optional) - New category
  - `tags` (JSON Array, optional) - New tags
  - `isPublic` (Boolean, optional) - Update visibility

- **Response** (200): Updated document with new version

### Set Document Permissions

- **URL**: `/documents/:id/permissions`
- **Method**: `POST`
- **Auth**: Required ✅
- **Authorization**: Owner only
- **Body**:

```json
{
  "userId": "507f1f77bcf86cd799439012",
  "accessType": "view"
}
```

- **Response** (200): Updated document with new permissions

### Delete Document

- **URL**: `/documents/:id`
- **Method**: `DELETE`
- **Auth**: Required ✅
- **Authorization**: Owner only
- **Response** (200):

```json
{
  "message": "Document deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "message": "Error message describing what went wrong"
}
```

### 401 Unauthorized

```json
{
  "message": "Token is not valid"
}
```

### 403 Forbidden

```json
{
  "message": "Access denied"
}
```

### 404 Not Found

```json
{
  "message": "Document not found"
}
```

### 500 Server Error

```json
{
  "message": "Server error message"
}
```

---

## Status Codes Summary

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK - Request successful                 |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input             |
| 401  | Unauthorized - Token invalid or missing |
| 403  | Forbidden - Insufficient permissions    |
| 404  | Not Found - Resource not found          |
| 500  | Server Error                            |

---

## Testing with cURL

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Documents

```bash
curl -X GET http://localhost:5000/api/documents \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Upload Document

```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@path/to/file.pdf" \
  -F "title=My Document" \
  -F "description=Test document" \
  -F "category=Work" \
  -F "tags=[\"test\"]"
```

---

## Health Check

### Server Status

- **URL**: `/api/health`
- **Method**: `GET`
- **Auth**: Not required
- **Response** (200):

```json
{
  "message": "Server is running"
}
```
