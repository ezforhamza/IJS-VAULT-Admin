# IJS Vault Admin Panel - API Integration Guide

## 📋 Overview

This guide documents the integration of real IJS Vault APIs with the admin panel. All APIs have been tested and the admin panel has been updated to work with the real backend.

## 🔑 API Base URL

**Production:** `https://ijsvault.codecoytechnologies.live/v1`

The base URL is configured in `.env` file:

```env
VITE_APP_API_BASE_URL = https://ijsvault.codecoytechnologies.live/v1
```

## 🔐 Authentication

### Admin Credentials

- **Email:** `admin@ijsvault.com`
- **Password:** `Admin@123456`

### Login API

```bash
POST /auth/login
```

**Request:**

```json
{
  "email": "admin@ijsvault.com",
  "password": "Admin@123456",
  "deviceType": "WEB",
  "deviceName": "Admin Panel",
  "deviceModel": "Chrome Browser"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": {
      "access": { "token": "...", "expires": "..." },
      "refresh": { "token": "...", "expires": "..." }
    }
  }
}
```

## 📊 Key Changes from Mock to Real API

### 1. **Categories/Subcategories → Files/Folders**

**Old Mock Structure:**

```typescript
{
  categoriesCount: 5,
  subcategoriesCount: 18,
  storageUsed: 245.5  // in MB
}
```

**New Real API Structure:**

```typescript
{
  files: 42,
  folders: 15,
  storageUsed: 257474560,  // in bytes
  storageLimit: 16106127360,  // in bytes
  storageUsedFormatted: "245.5 MB",
  storageLimitFormatted: "15 GB"
}
```

### 2. **User Fields**

**Added Fields:**

- `fullName` - User's full name (replaces username in display)
- `image` - Profile image URL (alternative to avatar)
- `isEmailVerified` - Email verification status
- `lastLoginAt` - Last login timestamp (alternative to lastLogin)
- `storageLimit` - Storage limit in bytes
- `storageUsedFormatted` - Human-readable storage used
- `storageLimitFormatted` - Human-readable storage limit

### 3. **User Detail Response**

**New Structure:**

```typescript
{
  user: { ... },
  sessions: [ ... ],
  vaultStats: {
    files: 3,
    folders: 2,
    storageUsed: 828033,
    storageLimit: 16106127360,
    storageUsedFormatted: "808.63 KB",
    storageLimitFormatted: "15 GB"
  },
  activeSessionCount: 0
}
```

## 🎯 API Endpoints

### Dashboard APIs

#### 1. Dashboard Statistics

```bash
GET /admin/dashboard
```

Returns: Total users, active sessions, user status distribution, sessions by device

#### 2. Platform Statistics

```bash
GET /admin/stats
```

Returns: Users, sessions, **items (files/folders)**, storage, plans

#### 3. Storage Statistics

```bash
GET /admin/storage/stats
```

Returns: Top users by storage, storage breakdown by plan

### User Management APIs

#### 1. Get Users List

```bash
GET /admin/users?page=1&limit=10&status=active&search=john&sortBy=createdAt:desc
```

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `status` - Filter by status: active, inactive, suspended
- `search` - Search by name or email
- `sortBy` - Sort field and order (e.g., createdAt:desc)

**Response Format:**

```json
{
  "success": true,
  "data": {
    "results": [...],
    "page": 1,
    "limit": 10,
    "totalPages": 6,
    "totalResults": 53
  }
}
```

#### 2. Get User Details

```bash
GET /admin/users/:userId
```

Returns user info, sessions, and vault statistics (files, folders, storage)

#### 3. Update User Status

```bash
PUT /admin/users/:userId/status
```

**Request:**

```json
{
  "status": "active|inactive|suspended",
  "reason": "Optional reason for status change"
}
```

#### 4. Suspend User

```bash
POST /admin/users/:userId/suspend
```

**Request:**

```json
{
  "reason": "Violation of terms of service"
}
```

#### 5. Activate User

```bash
POST /admin/users/:userId/activate
```

#### 6. Logout All User Sessions

```bash
POST /admin/users/:userId/logout-all
```

#### 7. Export Users

```bash
GET /admin/users/export?status=active
```

#### 8. Delete User

```bash
DELETE /admin/users/:userId
```

### Session Management APIs

#### 1. Get All Sessions

```bash
GET /admin/sessions?page=1&limit=10&deviceType=WEB&userId=
```

#### 2. Get Session Statistics

```bash
GET /admin/sessions/stats
```

#### 3. Terminate Session

```bash
DELETE /admin/sessions/:sessionId
```

### Legal Pages APIs

#### 1. Get All Legal Pages

```bash
GET /admin/legal
```

#### 2. Get Legal Page by Type

```bash
GET /admin/legal/:type
```

Types: `terms_of_service`, `privacy_policy`, `cookie_policy`, `disclaimer`, `refund_policy`

#### 3. Create Legal Page

```bash
POST /admin/legal
```

#### 4. Update Legal Page

```bash
PUT /admin/legal/:type
```

### Notifications APIs

#### 1. Get All Notifications

```bash
GET /admin/notifications?page=1&limit=20&type=all
```

#### 2. Send Notification to All Users

```bash
POST /admin/notifications/send-all
```

**Request:**

```json
{
  "title": "System Maintenance",
  "message": "Scheduled maintenance on Jan 10th",
  "type": "maintenance",
  "sendPush": false
}
```

#### 3. Send Notification to Specific Users

```bash
POST /admin/notifications/send
```

**Request:**

```json
{
  "title": "Account Verified",
  "message": "Your account has been verified",
  "type": "success",
  "userIds": ["user-id-1", "user-id-2"],
  "sendPush": true
}
```

### Admin Activity APIs

#### 1. Get Admin Profile

```bash
GET /admin/profile
```

#### 2. Get Activity Timeline

```bash
GET /admin/activity/timeline?page=1&limit=20
```

⚠️ **Note:** This endpoint currently returns a 500 error - may need backend fix

#### 3. Get All Activities

```bash
GET /admin/activity?page=1&limit=20&action=user_suspended
```

### Settings APIs

#### 1. Get Global Settings

```bash
GET /admin/settings
```

#### 2. Get Billing Revenue

```bash
GET /admin/billing/revenue?period=month
```

#### 3. Get Active Subscriptions

```bash
GET /admin/billing/subscriptions
```

## 🔧 Updated Files

### Type Definitions

- ✅ `src/types/user-management.ts` - Updated to include files/folders, storage fields

### Mock Data

- ✅ `src/_mock/assets/ijs-users.ts` - Updated all mock users with new structure

### UI Components

- ✅ `src/pages/user-management/users/columns.tsx` - Changed "Categories" to "Files"
- ✅ `src/pages/user-management/users/detail.tsx` - Updated to show Files, Folders, Storage Used/Limit

### API Configuration

- ✅ `src/config/api-endpoints.ts` - Updated all endpoints to match real API
- ✅ `src/api/apiClient.ts` - Updated to use real authentication tokens
- ✅ `src/api/services/ijsUserService.ts` - Updated service methods

### Environment

- ✅ `.env` - Created with production API URL

## 🚀 How to Use

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Login with Admin Credentials

- Email: `admin@ijsvault.com`
- Password: `Admin@123456`

### 3. The app will now use real APIs

All API calls will go to: `https://ijsvault.codecoytechnologies.live/v1`

## 📝 Important Notes

### Storage Values

- All storage values from the API are in **bytes**
- The API provides formatted versions: `storageUsedFormatted`, `storageLimitFormatted`
- Use these formatted values for display instead of converting manually

### User Display Names

- Use `fullName` if available, fallback to `username`
- Use `image` if available, fallback to `avatar`
- Use `lastLoginAt` if available, fallback to `lastLogin`

### Bulk Operations

- Real API doesn't have bulk endpoints for delete/suspend/activate
- Service layer implements these by calling individual endpoints in parallel
- This maintains compatibility with existing UI code

### Device Types

Real API uses uppercase: `WEB`, `ANDROID`, `IOS`, `HUAWEI`, `DESKTOP`, `UNKNOWN`

### Response Structure

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

## 🐛 Known Issues

1. **Activity Timeline API** - Returns 500 error, may need backend investigation
2. **Bulk Operations** - Implemented as parallel individual calls, may be slower for large datasets

## 🔄 Migration Checklist

- [x] Update type definitions
- [x] Update mock data structure
- [x] Update UI components
- [x] Update API endpoints
- [x] Update API client authentication
- [x] Update user service
- [x] Create .env file
- [x] Test all major APIs
- [ ] Update authentication flow (if needed)
- [ ] Update error handling (if needed)
- [ ] Add loading states (if needed)

## 📞 Support

For API issues or questions, contact the backend team or refer to the Postman collection:
`IJS-Vault-Admin-APIs.postman_collection.json`
