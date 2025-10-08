# Pagination Debugging Guide

## Issue: Pagination Not Showing

### Quick Fix Applied ✅

The code has been updated to handle multiple API response formats. The pagination should now work with any of these backend response structures:

```json
// Option 1: Full pagination object
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 1500,
    "totalPages": 75,
    "currentPage": 1,
    "limit": 20
  }
}

// Option 2: Direct count field
{
  "success": true,
  "data": [...],
  "count": 1500
}

// Option 3: Only total in pagination
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 1500
  }
}
```

---

## Still Not Working? Debug Steps:

### Step 1: Check Browser Console

Open your browser console (F12) and look for the API response:

1. Go to **Network** tab
2. Filter by **XHR** or **Fetch**
3. Find the request to `/api/admin/bet-history`
4. Click on it and check the **Response** tab

### Step 2: Add Console Logging

Temporarily add this to `bet-history-table.tsx` to see what's being returned:

```tsx
// Add after line 92 (after useGetBetHistory)
console.log('Bet History API Response:', data);
console.log('Total Pages Calculated:', totalPages);
console.log('Total Count:', totalCount);
```

### Step 3: Check Backend Response

Make sure your backend is returning:
- ✅ At least 21+ records (to show page 2)
- ✅ A `pagination` object OR `count` field
- ✅ Proper total count

### Step 4: Test with cURL

Test your backend directly:

```bash
curl -X GET "http://localhost:3000/api/admin/bet-history?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Common Issues & Solutions:

### Issue 1: Only 1 page showing but have lots of data
**Cause:** Backend not returning pagination info
**Solution:** Check backend response structure

### Issue 2: Pagination shows but can't navigate
**Cause:** `changePage` function not triggering API call
**Solution:** Already fixed - the `page` is in the `filters` dependency array

### Issue 3: No data showing at all
**Cause:** API endpoint not configured or authorization issue
**Solution:** Check:
- Backend API is running
- Correct endpoint `/api/admin/bet-history`
- Valid admin JWT token
- CORS settings if on different domain

---

## Quick Test Component

Add this to your page temporarily to see raw API data:

```tsx
// In bet-history-table.tsx, add before the return statement:

if (!isSuccess) {
    return <div>Loading or Error...</div>;
}

// Add this temporarily to see the raw response
console.log('Raw API Data:', {
    data: data,
    betHistory: betHistory,
    totalPages: totalPages,
    totalCount: totalCount,
    filters: filters
});
```

---

## Expected Behavior:

✅ **With 100 records:**
- Page 1 shows records 1-20
- Page 2 shows records 21-40
- Total pages = 5
- Pagination controls visible at bottom

✅ **With < 20 records:**
- Only page 1 visible
- No pagination controls (only 1 page)

---

## What Was Changed:

### Before (Fixed):
```tsx
const pagination = useMemo(() => {
    if (isSuccess && data?.data?.pagination) {
        return data.data.pagination;
    }
    return { total: 0, totalPages: 1, currentPage: 1, limit: 20 };
}, [data, isSuccess]);
```
**Problem:** If backend doesn't return exact `pagination` object, defaults to 1 page

### After (Current):
```tsx
const totalPages = useMemo(() => {
    // Handles multiple response formats
    if (isSuccess && data?.data?.pagination?.totalPages) {
        return data.data.pagination.totalPages;
    }
    if (isSuccess && data?.data?.pagination?.total) {
        return Math.ceil(data.data.pagination.total / (data.data.pagination.limit || 20));
    }
    if (isSuccess && data?.data?.count) {
        return Math.ceil(data.data.count / 20);
    }
    return 1;
}, [data, isSuccess]);
```
**Solution:** Tries multiple paths to find total count and calculates pages

---

## Still Stuck?

1. Share your backend API response structure
2. Check browser console for errors
3. Verify you have more than 20 records in database
4. Make sure backend API is actually implementing pagination

---

## Backend Checklist:

Your backend should:
- [ ] Accept `page` and `limit` query parameters
- [ ] Return total count of records
- [ ] Return only the records for requested page
- [ ] Include pagination metadata in response

Example backend implementation needed:
```typescript
// Backend should do something like:
const page = req.query.page || 1;
const limit = req.query.limit || 20;
const offset = (page - 1) * limit;

const bets = await getBets({ ...filters, limit, offset });
const total = await getTotalBetsCount(filters);

res.json({
  success: true,
  data: bets,
  pagination: {
    total: total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    limit: limit
  }
});
```

---

*If pagination still doesn't work after these steps, the issue is likely in the backend API implementation.*


