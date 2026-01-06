# Notifications and Legal Pages API Integration

## ✅ Completed Integration

### 1. **Notifications API - Fully Integrated**

#### API Endpoints Tested in curl:

```bash
# Get all notifications
GET /admin/notifications?page=1&limit=5

# Send to specific users
POST /admin/notifications/send
Body: {
  "title": "Test from Admin",
  "message": "This is a test notification",
  "type": "info",
  "userIds": ["695d45ccb30c84001db9e57e"],
  "sendPush": false
}

# Send to all users
POST /admin/notifications/send-all
Body: {
  "title": "System Announcement",
  "message": "Test broadcast message",
  "type": "announcement",
  "sendPush": false
}

# Get notification stats
GET /admin/notifications/stats
```

#### Response Format:

```json
{
  "success": true,
  "data": {
    "results": [...],
    "page": 1,
    "limit": 5,
    "totalPages": 1,
    "totalResults": 3
  }
}
```

#### Files Created/Updated:

- ✅ `src/hooks/use-notifications.ts` - React Query hooks

  - `useNotifications(params)` - List notifications with pagination
  - `useNotificationStats()` - Get statistics
  - `useSendNotification()` - Send to specific users
  - `useSendNotificationToAll()` - Broadcast to all users

- ✅ `src/api/services/notificationService.ts` - Complete rewrite

  - `getNotifications(params)` - Fetch list
  - `sendNotification(data)` - Send to specific users
  - `sendNotificationToAll(data)` - Broadcast
  - `getNotificationStats()` - Get stats

- ✅ `src/pages/notifications/index.tsx` - Updated to use real API
  - Fetches real users from API (not mock data)
  - Sends notifications via real API
  - Shows notification type selector (info, announcement, success, warning, maintenance)
  - Push notification toggle
  - Displays recipient count from real API
  - Loading states during send

#### Features:

- **Target Selection**: All users or specific users
- **User Search**: Search by name or email
- **User Selection**: Click to select/deselect users
- **Pagination**: Navigate through user pages
- **Notification Types**: info, announcement, success, warning, maintenance
- **Push Notifications**: Toggle to send push to mobile devices
- **Real-time Feedback**: Shows recipient count and success messages

---

### 2. **Legal Pages API - Fully Integrated**

#### API Endpoints Tested in curl:

```bash
# Get all legal pages
GET /admin/legal

# Get specific page by type
GET /admin/legal/terms_of_service

# Get public page (no auth)
GET /legal/terms_of_service

# Create legal page
POST /admin/legal
Body: {
  "type": "privacy_policy",
  "title": "Privacy Policy",
  "content": "<h1>Privacy Policy</h1><p>Content...</p>"
}

# Update legal page
PUT /admin/legal/terms_of_service
Body: {
  "title": "Terms of Service - Updated",
  "content": "<h1>Updated Terms</h1><p>New content...</p>",
  "version": "1.1",
  "isPublished": true
}
```

#### Response Format:

```json
{
  "success": true,
  "data": {
    "page": {
      "id": "...",
      "type": "terms_of_service",
      "title": "Terms of Service - Updated",
      "content": "&lt;h1>Updated Terms&lt;/h1>&lt;p>New content...&lt;/p>",
      "version": "1.1",
      "isPublished": true,
      "lastUpdatedBy": {
        "id": "...",
        "fullName": "IJS Vault Admin",
        "email": "admin@ijsvault.com"
      },
      "publishedAt": "2026-01-06T17:47:07.538Z"
    }
  }
}
```

#### Files Created/Updated:

- ✅ `src/hooks/use-legal.ts` - React Query hooks

  - `useLegalPages()` - Get all legal pages
  - `useLegalPage(type)` - Get specific page
  - `useCreateLegalPage()` - Create new page
  - `useUpdateLegalPage()` - Update existing page

- ✅ `src/api/services/legalService.ts` - Complete rewrite

  - `getAllLegalPages()` - Fetch all pages
  - `getLegalPageByType(type)` - Get specific page
  - `createLegalPage(data)` - Create new
  - `updateLegalPage(type, data)` - Update existing
  - `getPublicLegalPage(type)` - Get public version

- ✅ `src/pages/legal/components/legal-page.tsx` - Updated to use real API
  - Fetches legal page from real API
  - Displays version, published date, and author
  - Decodes HTML entities from API response
  - Shows loading skeleton
  - Error handling

#### Features:

- **Type Mapping**: Converts slug (terms, privacy) to API type (terms_of_service, privacy_policy)
- **HTML Rendering**: Safely renders HTML content from API
- **Version Display**: Shows version number
- **Metadata**: Displays published date and last updated by
- **Edit Button**: Navigate to edit page
- **Loading States**: Skeleton loaders while fetching
- **Error Handling**: Displays error messages

---

## 📊 API Understanding Summary

### Notifications API:

- **Pagination**: Uses `page` and `limit` parameters
- **Response**: `results` array with `totalResults` and `totalPages`
- **Types**: info, announcement, success, warning, maintenance
- **Target Types**: `all` or `specific` (with userIds array)
- **Push**: Optional `sendPush` boolean for mobile notifications
- **Stats**: Provides counts by type and target type

### Legal Pages API:

- **Types**: terms_of_service, privacy_policy, cookie_policy, disclaimer, refund_policy
- **Content**: HTML content stored as escaped entities (`&lt;` instead of `<`)
- **Versioning**: Version string (e.g., "1.1")
- **Publishing**: `isPublished` boolean flag
- **Metadata**: Tracks last updated by admin and published date
- **Public Access**: Separate endpoint for public viewing (no auth required)

---

## 🎯 Testing Checklist

### Notifications:

1. ✅ Navigate to Notifications page
2. ✅ Select "All Active Users" - should show total user count
3. ✅ Select "Specific Users" - should show user list with search
4. ✅ Search for users by name/email
5. ✅ Select multiple users
6. ✅ Choose notification type from dropdown
7. ✅ Toggle push notification checkbox
8. ✅ Fill title and message
9. ✅ Click Send - should show success toast with recipient count
10. ✅ Form should reset after successful send

### Legal Pages:

1. ✅ Navigate to Legal > Terms of Service
2. ✅ Should fetch and display real content from API
3. ✅ Should show version number
4. ✅ Should show published date
5. ✅ Should show last updated by admin name
6. ✅ HTML content should render properly
7. ✅ Edit button should be visible
8. ✅ Navigate to Legal > Privacy Policy (if exists)
9. ✅ Should handle loading states with skeleton
10. ✅ Should handle errors gracefully

---

## 🔧 Technical Details

### Notification Types Interface:

```typescript
interface SendNotificationRequest {
  title: string;
  message: string;
  type: string; // info, announcement, success, warning, maintenance
  userIds?: string[]; // For specific users
  sendPush?: boolean;
}
```

### Legal Page Interface:

```typescript
interface LegalPage {
  id: string;
  type: string;
  title: string;
  content: string; // HTML with escaped entities
  version: string;
  isPublished: boolean;
  lastUpdatedBy: {
    id: string;
    fullName: string;
    email: string;
  };
  publishedAt: string;
}
```

---

## 🚀 All Features Working

### Notifications Page:

- ✅ Real user list from API
- ✅ Search and pagination
- ✅ Send to all users
- ✅ Send to specific users
- ✅ Notification type selection
- ✅ Push notification toggle
- ✅ Success feedback with recipient count
- ✅ Form validation
- ✅ Loading states

### Legal Pages:

- ✅ Fetch from real API
- ✅ Display HTML content
- ✅ Show metadata (version, date, author)
- ✅ Loading skeletons
- ✅ Error handling
- ✅ Edit navigation

---

## 📝 Notes

1. **HTML Entities**: Legal page content comes from API with escaped HTML entities (`&lt;`, `&gt;`). We decode these before rendering.

2. **Notification Recipient Count**: When sending to "all users", the API returns the actual recipient count in the response.

3. **Type Mapping**: Legal page slugs (terms, privacy) are mapped to API types (terms_of_service, privacy_policy).

4. **Push Notifications**: The `sendPush` flag tells the backend to send push notifications to mobile devices.

5. **Pagination**: Both notifications and user lists support pagination with `page` and `limit` parameters.

All APIs tested thoroughly with curl and integrated successfully! 🎉
