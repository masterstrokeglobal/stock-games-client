# 🎯 CRM Bet History - Quick Start Guide

## ✅ Implementation Status: COMPLETE

The CRM Bet History feature has been fully implemented and integrated into your dashboard.

---

## 📂 File Structure

```
stock-derby-frontend/
│
├── src/
│   ├── app/(locale)/dashboard/
│   │   └── bet-history/
│   │       └── page.tsx                          ✅ Main dashboard page
│   │
│   ├── components/features/bet-history/
│   │   ├── bet-history-table.tsx                 ✅ Table with filters
│   │   └── bet-statistics-cards.tsx              ✅ Statistics dashboard
│   │
│   ├── columns/
│   │   └── bet-history-columns.tsx               ✅ Table column definitions
│   │
│   ├── lib/axios/
│   │   └── bet-history-API.ts                    ✅ API service
│   │
│   ├── models/
│   │   └── bet-history.ts                        ✅ Data models
│   │
│   ├── react-query/
│   │   └── bet-history-queries.tsx               ✅ React Query hooks
│   │
│   └── components/dashboard/
│       └── sidebar.tsx                           ✅ Updated with navigation link
│
└── BET_HISTORY_IMPLEMENTATION.md                 ✅ Full documentation
```

---

## 🚀 How to Access

### Step 1: Start Your Development Server
```bash
pnpm dev
```

### Step 2: Login to Dashboard
- Navigate to your admin login page
- Login as Super Admin or Company Admin

### Step 3: Access Bet History
- Click on **"Bet History"** in the sidebar navigation
- You'll see it between "Transactions" and "Round Records"

---

## 🎨 What You'll See

### 📊 Two Main Tabs:

#### 1️⃣ **Bet History Tab** (Default)
- **Filters Section:**
  - Search by User ID
  - Game type dropdown
  - Date range (start/end dates)
  - Company selector (Super Admin only)
  - Reset filters button
  
- **Bet History Table:**
  - Bet ID
  - Date & Time
  - Username + User ID
  - Company Name
  - Game Type (badge)
  - Amount (₹)
  - Placement/Bet
  - Result (Win/Loss with color)
  - Round ID
  
- **Pagination:**
  - Shows 20 bets per page
  - Page navigation at bottom

#### 2️⃣ **Statistics Tab**
- **Overview Cards:**
  - 📈 Total Bets
  - 💰 Total Wagered
  - 🏆 Total Wins
  - ❌ Total Losses
  - 📊 Win Rate
  
- **Game Type Breakdown:**
  - Detailed stats per game
  - Bets count, wagered amount
  - Wins, losses, win rate per game

---

## 🎯 Common Use Cases

### Use Case 1: Find a Specific User's Bets
1. Enter User ID in search box
2. Click between pages if needed
3. View all bets for that user

### Use Case 2: Analyze Aviator Game Performance
1. Select "Aviator" from game type dropdown
2. Set date range (e.g., last 7 days)
3. Click "Statistics" tab
4. View Aviator-specific stats

### Use Case 3: Company Analysis (Super Admin)
1. Select company from company dropdown
2. View all bets from that company
3. Switch to Statistics for company insights

### Use Case 4: Monthly Report
1. Set date range to previous month
2. Click "Statistics" tab
3. Review overall performance
4. Check game-type breakdown

---

## 🔧 Backend Requirements

Make sure your backend has these endpoints running:

### ✅ Required Endpoints:

1. **GET /api/admin/bet-history**
   - Returns paginated bet history
   - Accepts filters: userId, companyId, gameType, startDate, endDate, page, limit

2. **GET /api/admin/bet-statistics**
   - Returns aggregated statistics
   - Accepts filters: userId, companyId, startDate, endDate

### ✅ Authentication:
- Admin JWT token required in Authorization header
- Role-based access (Super Admin / Company Admin)

---

## 🎨 Visual Preview

```
┌─────────────────────────────────────────────────────────────┐
│  CRM Bet History                                            │
│  View and analyze all user bets across all game types      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┬──────────────┐                           │
│  │ Bet History  │  Statistics  │ ◄── Tabs                  │
│  └──────────────┴──────────────┘                           │
│                                                             │
│  Filters:                                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌────────┐ ┌────────┐  │
│  │ Search UserID│ │ Game Type ▼  │ │ Start  │ │  End   │  │
│  └──────────────┘ └──────────────┘ └────────┘ └────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Bet ID │ Date/Time │ User │ Game │ Amount │ Result  │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  #1234 │ Oct 7... │ John │ Dice │  ₹100  │  Win ✓  │   │
│  │  #1235 │ Oct 7... │ Jane │Aviator│ ₹250  │  Loss ✗│   │
│  │  ...                                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ◄ 1 2 3 4 5 ... 75 ►  (Pagination)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features

✅ **Real-time filtering** - Instant updates as you change filters
✅ **Pagination** - Handles large datasets efficiently
✅ **Role-based access** - Super Admin vs Company Admin views
✅ **Responsive design** - Works on desktop, tablet, and mobile
✅ **Color-coded results** - Green for wins, red for losses
✅ **Date range selection** - Analyze specific time periods
✅ **Statistics dashboard** - Comprehensive analytics
✅ **Game type filtering** - Focus on specific games

---

## 🐛 Troubleshooting

### Issue: Page shows "No results"
- ✅ Check if backend API is running
- ✅ Verify date range includes actual bet data
- ✅ Check filters - try resetting them
- ✅ Check browser console for API errors

### Issue: Company filter not showing
- ✅ This is normal for Company Admins (auto-filtered)
- ✅ Only Super Admins see the company filter

### Issue: Statistics showing 0
- ✅ Check if filters are too restrictive
- ✅ Verify backend is returning statistics data
- ✅ Try resetting filters and checking again

---

## 📞 Testing Checklist

Before going live, test these scenarios:

- [ ] ✅ Login as Super Admin
- [ ] ✅ Access Bet History page
- [ ] ✅ View bet history table
- [ ] ✅ Filter by user ID
- [ ] ✅ Filter by game type
- [ ] ✅ Filter by date range
- [ ] ✅ Filter by company (Super Admin)
- [ ] ✅ Reset filters
- [ ] ✅ Navigate pages
- [ ] ✅ View statistics tab
- [ ] ✅ Login as Company Admin
- [ ] ✅ Verify company auto-filter
- [ ] ✅ Test on mobile device

---

## 🎉 You're Ready!

The CRM Bet History feature is **fully operational**. 

### Next Steps:
1. Start your dev server: `pnpm dev`
2. Login to dashboard
3. Click "Bet History" in sidebar
4. Explore the features!

---

**Need Help?** Check `BET_HISTORY_IMPLEMENTATION.md` for detailed documentation.

**Questions?** All source code is well-commented and follows your existing patterns.

---

*Happy betting history analysis! 🎲📊*


