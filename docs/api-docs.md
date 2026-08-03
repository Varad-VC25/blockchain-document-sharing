# API Documentation

## Base URL
- Development: http://localhost:5000/api
- Production: https://your-render-url.onrender.com/api

## Authentication Headers
Authorization: Bearer <jwt_token>

## Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- GET  /api/auth/me

### Documents
- POST   /api/documents/upload
- GET    /api/documents/
- GET    /api/documents/:id
- DELETE /api/documents/:id

### Sharing
- POST /api/share/grant
- POST /api/share/revoke
- GET  /api/share/shared-with-me

### Audit
- GET /api/audit/logs
- GET /api/audit/logs/:documentId
