# Mentorships Dashboard - Firebase Integration

## Overview

The Mentorships Dashboard has been completely rewritten to integrate with Firebase and follow the same pattern as other dashboard pages. It now provides real-time data management for mentorship sessions, requests, and reviews.

## Recent Fixes (Latest Update)

### ✅ **Fixed Issues**

1. **Request Status Distribution Chart**: Now properly displays data and shows "No request data available" when empty
2. **Session Status Distribution Chart**: Improved data validation and error handling
3. **User Names Display**: Mentor ID and Booked By now show actual user names instead of IDs
4. **Profile Links**: Clicking on user names now navigates to their profiles
5. **Pagination**: Added proper page numbers (1, 2, 3...) with smart navigation
6. **Data Validation**: Charts only show non-zero values and handle empty data gracefully

### 🔧 **Technical Improvements**

- **User Context Integration**: Uses `UsersContext` to resolve user IDs to names
- **Smart Pagination**: Shows up to 5 page numbers with intelligent positioning
- **Chart Data Filtering**: Filters out zero values to prevent empty charts
- **Fallback Messages**: Shows appropriate messages when no data is available

## Features

### 🔥 Real-time Firebase Integration

- **Live Data**: Real-time updates using Firebase Firestore snapshots
- **Collections**: Integrates with `sessions`, `requests`, and user data collections
- **Authentication**: Secure access control through Firebase Auth

### 📊 Comprehensive Dashboard

- **Statistics Cards**: Total sessions, requests, success rates, and approval rates
- **Interactive Charts**: Pie charts showing session and request status distributions
- **Real-time Updates**: Live data refresh without page reload

### 📋 Data Management

- **Sessions Tab**: Monitor all mentorship sessions (Scheduled, Completed, Cancelled)
- **Requests Tab**: Approve/reject mentorship requests from mentees
- **Search & Filter**: Advanced filtering by status, date, and search terms
- **Pagination**: Efficient data display with pagination controls

### 🎯 Actions & Operations

- **Session Management**: Complete, cancel, and update session statuses
- **Request Processing**: Approve or reject mentorship requests
- **Review System**: Handle session reviews and ratings
- **Meeting Links**: Direct access to Google Meet and Zoom links

## Firebase Collections Structure

### Sessions Collection (`sessions`)

```javascript
{
  id: "Db0y0TbVnCAWZp2WuWtG",
  title: "front & back",
  mentorId: "mH93IXWqJOQ1vstK5clWbexiVm83",
  bookedBy: "iL2WTygz0wg13P7jwtUiEz1Ig6E2",
  date: "2025-09-03",
  time: "03:39",
  duration: "1h",
  status: "Completed",
  isBooked: true,
  createdAt: "2025-08-13T00:36:59.731Z",
  updatedAt: "2025-08-13T00:37:31.731Z",
  completedAt: "2025-08-13T00:40:30.731Z",
  completedBy: "mH93IXWqJOQ1vstK5clWbexiVm83",
  reviewed: true,
  reviewId: "1755045991714",
  reviews: [
    {
      id: "1755045769392",
      title: "Cupidatat itaque ten",
      review: "Inventore pariatur",
      rating: 3,
      reviewerId: "iL2WTygz0wg13P7jwtUiEz1Ig6E2",
      reviewerName: "Islam",
      freelancerId: "iL2WTygz0wg13P7jwtUiEz1Ig6E2",
      mentorId: "mH93IXWqJOQ1vstK5clWbexiVm83",
      sessionId: "Db0y0TbVnCAWZp2WuWtG",
      createdAt: "2025-08-13T00:42:49.731Z"
    }
  ],
  googleMeetLink: "https://meet.google.com/your-meet-id",
  zoomLink: "https://zoom.us/j/your-zoom-id"
}
```

### Requests Collection (`requests`)

```javascript
{
  id: "request_id",
  menteeId: "iL2WTygz0wg13P7jwtUiEz1Ig6E2",
  menteeName: "Islam",
  menteeTitle: "Freelancer",
  mentorId: "mH93IXWqJOQ1vstK5clWbexiVm83",
  sessionId: "a0W237pcXsDlFNxcvZv5",
  status: "pending", // pending, approved, rejected
  createdAt: "2025-08-13T00:25:33.731Z",
  updatedAt: "2025-08-13T00:25:33.731Z"
}
```

## User Name Resolution

The dashboard now automatically resolves user IDs to display names:

```javascript
// Helper function to get user name by ID
const getUserName = (userId) => {
  if (!userId || !users) return "Unknown User";
  const user = users.find((u) => u.id === userId);
  return user ? user.name || user.email || "Unknown User" : "Unknown User";
};

// Helper function to get user profile link
const getUserProfileLink = (userId) => {
  if (!userId) return "#";
  return `/u/${userId}`;
};
```

### Features:

- **Clickable Names**: User names are clickable and link to their profiles
- **Fallback Handling**: Shows "Unknown User" if user data is not available
- **Real-time Updates**: Names update automatically when user data changes

## Pagination System

The pagination now includes page numbers and smart navigation:

```javascript
{
  /* Page Numbers */
}
<div className="flex items-center space-x-1">
  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    let pageNum;
    if (totalPages <= 5) {
      pageNum = i + 1;
    } else if (currentPage <= 3) {
      pageNum = i + 1;
    } else if (currentPage >= totalPages - 2) {
      pageNum = totalPages - 4 + i;
    } else {
      pageNum = currentPage - 2 + i;
    }

    return (
      <Button
        key={pageNum}
        variant={currentPage === pageNum ? "default" : "outline"}
        size="sm"
        onClick={() => setCurrentPage(pageNum)}
        className="w-8 h-8 p-0"
      >
        {pageNum}
      </Button>
    );
  })}
</div>;
```

### Features:

- **Page Numbers**: Shows actual page numbers (1, 2, 3, 4, 5)
- **Smart Positioning**: Always shows relevant page numbers around current page
- **Navigation Controls**: First, Previous, Next, Last buttons
- **Responsive**: Adapts to different numbers of pages

## Chart Data Handling

Charts now properly handle empty data and zero values:

```javascript
// Chart data with proper data validation
const sessionStatusData = [
  {
    name: "Completed",
    value: Math.max(0, stats.completedSessions),
    color: "#10B981",
  },
  {
    name: "Scheduled",
    value: Math.max(0, stats.pendingSessions),
    color: "#3B82F6",
  },
  {
    name: "Cancelled",
    value: Math.max(0, stats.cancelledSessions),
    color: "#EF4444",
  },
].filter((item) => item.value > 0); // Only show non-zero values

// Conditional chart rendering
{
  sessionStatusData.length > 0 ? (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>{/* Chart content */}</PieChart>
    </ResponsiveContainer>
  ) : (
    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
      No session data available
    </div>
  );
}
```

### Features:

- **Data Validation**: Prevents negative values and handles undefined data
- **Empty State Handling**: Shows appropriate messages when no data is available
- **Filtered Display**: Only shows categories with actual data
- **Fallback Messages**: User-friendly messages for empty states

## API Functions

### Session Management

```javascript
import {
  getAllMentorshipSessions,
  getMentorshipSessionsSnapshot,
  updateSessionStatus,
  completeSession,
  cancelSession,
} from "@/services/mentorshipService";

// Get all sessions
const sessions = await getAllMentorshipSessions();

// Set up real-time listener
const unsubscribe = getMentorshipSessionsSnapshot((sessions) => {
  console.log("Sessions updated:", sessions);
});

// Complete a session
await completeSession(sessionId, "admin");

// Cancel a session
await cancelSession(sessionId, "Cancelled by admin");
```

### Request Management

```javascript
import {
  getAllMentorshipRequests,
  approveRequest,
  rejectRequest,
} from "@/services/mentorshipService";

// Approve a request
await approveRequest(requestId, "admin");

// Reject a request
await rejectRequest(requestId, "admin", "Reason for rejection");
```

### Reviews Management

```javascript
import {
  getSessionReviews,
  addSessionReview,
  updateSessionReview,
  deleteSessionReview,
} from "@/services/mentorshipService";

// Get reviews for a session
const reviews = await getSessionReviews(sessionId);

// Add a new review
await addSessionReview(sessionId, {
  title: "Great Session",
  review: "Very helpful mentorship session",
  rating: 5,
  reviewerId: "user_id",
  reviewerName: "User Name",
});
```

### Statistics & Analytics

```javascript
import { getMentorshipStatistics } from "@/services/mentorshipService";

// Get comprehensive statistics
const stats = await getMentorshipStatistics();
// Returns: {
//   totalSessions: 10,
//   totalRequests: 5,
//   completedSessions: 8,
//   pendingSessions: 2,
//   cancelledSessions: 0,
//   pendingRequests: 3,
//   approvedRequests: 1,
//   rejectedRequests: 1,
//   totalReviews: 15,
//   averageRating: 4.2
// }
```

## Usage Examples

### Setting up Real-time Listeners

```javascript
useEffect(() => {
  // Set up real-time listeners for sessions and requests
  const unsubscribeSessions = getMentorshipSessionsSnapshot((sessions) => {
    setSessions(sessions);
  });

  const unsubscribeRequests = getMentorshipRequestsSnapshot((requests) => {
    setRequests(requests);
  });

  // Cleanup listeners on unmount
  return () => {
    unsubscribeSessions();
    unsubscribeRequests();
  };
}, []);
```

### Filtering and Searching

```javascript
// Filter sessions by status and date
const filteredSessions = sessions.filter((session) => {
  const matchesStatus =
    statusFilter === "all" || session.status === statusFilter;
  const matchesDate =
    dateFilter === "all" || isWithinDateRange(session.date, dateFilter);
  const matchesSearch = session.title
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase());

  return matchesStatus && matchesDate && matchesSearch;
});
```

### Handling Actions

```javascript
const handleCompleteSession = async (sessionId) => {
  try {
    await completeSession(sessionId, "admin");
    toast.success("Session marked as completed");
  } catch (error) {
    console.error("Error completing session:", error);
    toast.error("Failed to complete session");
  }
};
```

## Data Flow

1. **Initial Load**: Fetch data from Firebase collections on component mount
2. **Real-time Updates**: Set up Firestore snapshots for live data updates
3. **User Actions**: Perform CRUD operations through service functions
4. **State Management**: Update local state and trigger re-renders
5. **Error Handling**: Comprehensive error handling with user feedback

## Security Considerations

- **Authentication**: All operations require valid Firebase authentication
- **Authorization**: Role-based access control for admin operations
- **Data Validation**: Input validation and sanitization
- **Audit Trail**: All changes are timestamped and tracked

## Performance Optimizations

- **Pagination**: Large datasets are paginated for better performance
- **Efficient Queries**: Firestore queries are optimized with proper indexing
- **Real-time Updates**: Only necessary data is fetched and updated
- **Debounced Search**: Search operations are debounced to reduce API calls

## Error Handling

The system includes comprehensive error handling:

- **Network Errors**: Graceful fallbacks for connection issues
- **Validation Errors**: User-friendly error messages
- **Firebase Errors**: Specific error handling for Firestore operations
- **User Feedback**: Toast notifications for success/error states

## Future Enhancements

- **Advanced Analytics**: More detailed charts and metrics
- **Export Functionality**: CSV/PDF export of mentorship data
- **Bulk Operations**: Batch approve/reject multiple requests
- **Notification System**: Real-time notifications for status changes
- **Advanced Search**: Full-text search with Algolia integration

## Troubleshooting

### Common Issues

1. **Firebase Connection**: Ensure Firebase config is properly set up
2. **Authentication**: Verify user is authenticated before accessing data
3. **Permissions**: Check Firestore security rules for proper access
4. **Data Format**: Ensure data matches expected schema
5. **User Context**: Verify UsersContext is properly provided in the app

### Debug Mode

Enable debug logging by setting:

```javascript
localStorage.setItem("debug", "mentorship:*");
```

### Chart Issues

- **Empty Charts**: Check if data exists in Firebase collections
- **Missing User Names**: Verify UsersContext is working and contains user data
- **Pagination Not Working**: Check if filtered data length is greater than itemsPerPage

## Support

For technical support or questions about the mentorship system:

- Check Firebase console for connection issues
- Review browser console for JavaScript errors
- Verify Firestore security rules configuration
- Ensure all required dependencies are installed
- Verify UsersContext is properly set up in the app layout
