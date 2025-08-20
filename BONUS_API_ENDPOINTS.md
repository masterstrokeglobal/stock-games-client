# Bonus System API Endpoints Reference

## Base URL: `/api`

---

## 🔐 ADMIN ENDPOINTS

### Bonus Campaign Management

#### Create Bonus Campaign
```http
POST /admin/bonus-campaigns
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "bonusName": "Welcome Bonus",
  "description": "50% match on first deposit",
  "bonusType": "DEPOSIT_MATCH",
  "triggerEvent": "FIRST_DEPOSIT",
  "bonusValue": 50,
  "wagerRequirementType": "TURNOVER_MULTIPLIER",
  "wagerRequirementValue": 5,
  "spendingRequirement": 1000,
  "applicableProviders": [1, 2],
  "minDepositAmount": 100,
  "maxBonusAmount": 500,
  "validityDays": 30,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bonus campaign created successfully",
  "data": {
    "id": 123,
    "bonusName": "Welcome Bonus",
    "applicableProviders": [1, 2],
    "spendingRequirement": 1000,
    "isActive": true,
    "createdAt": "2025-08-14T10:00:00Z"
  }
}
```

#### Get All Campaigns
```http
GET /admin/bonus-campaigns
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "bonusName": "Welcome Bonus",
      "bonusType": "DEPOSIT_MATCH",
      "bonusValue": 50,
      "spendingRequirement": 1000,
      "applicableProviders": [1, 2],
      "isActive": true,
      "stats": {
        "totalAssigned": 145,
        "totalCompleted": 23,
        "totalPending": 122
      }
    }
  ]
}
```

#### Update Campaign
```http
PATCH /admin/bonus-campaigns/{id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "spendingRequirement": 1500,
  "applicableProviders": [1],
  "isActive": false
}
```

#### Get Available Providers
```http
GET /admin/providers
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "providers": [
      { "id": 1, "name": "Stock" },
      { "id": 2, "name": "QTech" },
      { "id": 3, "name": "PGSoft" }
    ]
  }
}
```

#### Update Provider Restrictions
```http
PATCH /admin/bonus-campaigns/{id}/providers
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "applicableProviders": [1, 2]
}
```

#### Get Campaign Analytics
```http
GET /admin/bonus-campaigns/{id}/analytics
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "campaignId": 123,
    "totalAssignments": 500,
    "completedAssignments": 87,
    "providerBreakdown": {
      "1": { "name": "Stock", "assignments": 300, "completed": 45 },
      "2": { "name": "QTech", "assignments": 200, "completed": 42 }
    },
    "averageCompletionTime": "5.2 days",
    "totalBonusPayout": 125000
  }
}
```

---

## 👤 USER ENDPOINTS

### Bonus Information

#### Get User Bonus History
```http
GET /bonus/user/{userId}
Authorization: Bearer <user_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Bonus history retrieved successfully",
  "data": [
    {
      "id": 456,
      "bonusCampaign": {
        "id": 123,
        "bonusName": "Welcome Bonus",
        "applicableProviders": [1, 2]
      },
      "status": "ACTIVE",
      "potBalance": 250.0,
      "initialBonusAmount": 250.0,
      "requiredWager": 1250.0,
      "completedWager": 300.0,
      "remainingWager": 950.0,
      "providerWagerProgress": {
        "1": 200.0,
        "2": 100.0
      },
      "assignedAt": "2025-08-10T14:30:00Z",
      "expiresAt": "2025-09-09T14:30:00Z"
    }
  ]
}
```

#### Get User Wager Progress
```http
GET /bonus/user/{userId}/wager-progress
Authorization: Bearer <user_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 789,
    "totalActiveBonuses": 2,
    "totalBonusValue": 450.0,
    "assignments": [
      {
        "id": 456,
        "bonusName": "Welcome Bonus",
        "status": "ACTIVE",
        "potBalance": 250.0,
        "totalRequired": 1250.0,
        "remainingWager": 950.0,
        "progressPercentage": 24.0,
        "providerProgress": {
          "1": 200.0,
          "2": 100.0
        },
        "applicableProviders": [1, 2]
      }
    ]
  }
}
```

#### Get Bonus Wager Breakdown
```http
GET /bonus/assignment/{assignmentId}/wager-breakdown
Authorization: Bearer <user_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "assignmentId": 456,
    "bonusName": "Welcome Bonus",
    "totalRequired": 1250.0,
    "totalCompleted": 300.0,
    "remainingWager": 950.0,
    "providerBreakdown": [
      {
        "providerId": 1,
        "providerName": "Stock",
        "totalWagered": 200.0,
        "isEligible": true,
        "contributionPercentage": 100
      },
      {
        "providerId": 2,
        "providerName": "QTech", 
        "totalWagered": 100.0,
        "isEligible": true,
        "contributionPercentage": 100
      }
    ]
  }
}
```

---

## 🎮 PROVIDER WAGER TRACKING

### Provider-Specific Wager Updates

#### Update Provider Wager Progress
```http
POST /bonus/wager/provider-update
Content-Type: application/json

{
  "userId": 789,
  "providerId": 1,
  "wagerAmount": 50.0,
  "gameId": "stock-slot-round-456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Wager progress updated successfully",
  "data": {
    "userId": 789,
    "providerId": 1,
    "wagerAmount": 50.0,
    "updatedBonuses": [
      {
        "assignmentId": 456,
        "bonusName": "Welcome Bonus",
        "providerWagerAmount": 50.0,
        "totalProviderWager": 250.0,
        "totalWagerProgress": 350.0,
        "remainingWager": 900.0,
        "isCompleted": false
      }
    ],
    "gameId": "stock-slot-round-456"
  }
}
```

---

## 🏦 STOCK BETTING INTEGRATION

### Stock Slot Placement
```http
POST /stock-slot-placement
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "roundId": 789,
  "marketItem": "AAPL",
  "placement": "UP",
  "amount": 100.0
}
```

**Response:**
```json
{
  "success": true,
  "stockSlotPlacement": {
    "id": 12345,
    "userId": 789,
    "roundId": 789,
    "marketItem": "AAPL",
    "placement": "UP",
    "amount": 100.0,
    "status": "ACTIVE",
    "placedAt": "2025-08-14T15:30:00Z"
  }
}
```

*Note: This automatically triggers provider wager tracking for Provider ID 1 (Stock)*

---

## 🎰 QTECH INTEGRATION

### QTech Bet Callback
```http
POST /qtech/bet-callback
Content-Type: application/json

{
  "player_id": "789",
  "bet_amount": "25.50",
  "game_id": "slots_game_123",
  "transaction_id": "txn_abc123",
  "bet_time": "2025-08-14T15:45:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "transaction_id": "txn_abc123",
  "player_id": "789",
  "bonuses_updated": 2,
  "timestamp": "2025-08-14T15:45:00Z"
}
```

### QTech Balance Check
```http
POST /qtech/balance-check
Content-Type: application/json

{
  "player_id": "789"
}
```

**Response:**
```json
{
  "success": true,
  "player_id": "789",
  "balance": 1250.75,
  "currency": "INR",
  "timestamp": "2025-08-14T15:45:00Z"
}
```

---

## 📊 ADMIN ANALYTICS

### User Provider Analytics
```http
GET /admin/bonus/user/{userId}/provider-analytics
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 789,
    "totalWagered": 2500.0,
    "providerBreakdown": {
      "1": { "name": "Stock", "totalWagered": 1800.0, "bonusesCompleted": 3 },
      "2": { "name": "QTech", "totalWagered": 700.0, "bonusesCompleted": 1 }
    },
    "activeBonuses": 2,
    "completedBonuses": 4
  }
}
```

### System-Wide Analytics
```http
GET /admin/bonus/system-analytics
Authorization: Bearer <admin_token>
Query Parameters:
- startDate: 2025-08-01
- endDate: 2025-08-14
- providerId: 1 (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "2025-08-01 to 2025-08-14",
    "totalBonusesIssued": 1250,
    "totalBonusesCompleted": 287,
    "totalWagerVolume": 125000.0,
    "providerBreakdown": {
      "1": { 
        "name": "Stock", 
        "wagerVolume": 80000.0, 
        "bonusCompletions": 180,
        "averageCompletionTime": "4.2 days"
      },
      "2": { 
        "name": "QTech", 
        "wagerVolume": 45000.0, 
        "bonusCompletions": 107,
        "averageCompletionTime": "6.1 days"
      }
    }
  }
}
```

---

## ⚠️ ERROR RESPONSES

### Common Error Codes

#### 400 - Bad Request
```json
{
  "success": false,
  "error": "Wager requirement value must be greater than 0",
  "code": "INVALID_WAGER_REQUIREMENT"
}
```

#### 401 - Unauthorized
```json
{
  "success": false,
  "error": "Invalid or expired token",
  "code": "UNAUTHORIZED"
}
```

#### 404 - Not Found
```json
{
  "success": false,
  "error": "Bonus assignment not found",
  "code": "BONUS_NOT_FOUND"
}
```

#### 409 - Conflict
```json
{
  "success": false,
  "error": "Provider 2 contribution percentage must be between 0-100",
  "code": "INVALID_PROVIDER_PERCENTAGE"
}
```

---

## 🔧 UTILITY ENDPOINTS

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-14T16:00:00Z",
  "services": {
    "database": "connected",
    "bonusSystem": "operational",
    "providerTracking": "operational"
  }
}
```

---

## 🚀 CLIENT INTEGRATION EXAMPLES

### JavaScript/React Example
```javascript
// Initialize bonus tracking
const bonusAPI = {
  baseURL: '/api',
  
  async getUserBonuses(userId, token) {
    const response = await fetch(`${this.baseURL}/bonus/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  
  async updateProviderWager(userId, providerId, amount, gameId) {
    const response = await fetch(`${this.baseURL}/bonus/wager/provider-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, providerId, wagerAmount: amount, gameId })
    });
    return response.json();
  }
};

// Track stock bet
await bonusAPI.updateProviderWager(userId, 1, betAmount, `stock-${roundId}`);

// Track QTech bet (called from QTech callback)
await bonusAPI.updateProviderWager(userId, 2, betAmount, `qtech-${gameId}`);
```

### cURL Examples
```bash
# Create bonus campaign
curl -X POST "http://your-api/api/admin/bonus-campaigns" \
  -H "Authorization: Bearer admin_token" \
  -H "Content-Type: application/json" \
  -d '{
    "bonusName": "Stock Bonus",
    "spendingRequirement": 1000,
    "applicableProviders": [1]
  }'

# Update wager progress
curl -X POST "http://your-api/api/bonus/wager/provider-update" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "providerId": 1,
    "wagerAmount": 50.0,
    "gameId": "stock-round-456"
  }'
```

---

## 📱 WebSocket Events (Optional)

If implementing real-time updates:

### Subscribe to Bonus Updates
```javascript
const ws = new WebSocket('ws://your-api/bonus-updates/123');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'BONUS_PROGRESS':
      updateProgressBar(data.assignmentId, data.progress);
      break;
    case 'BONUS_COMPLETED':
      showCompletionNotification(data.bonusName, data.amount);
      break;
    case 'BONUS_EXPIRED':
      removeExpiredBonus(data.assignmentId);
      break;
  }
};
```

This comprehensive API reference provides all the endpoints needed to integrate the bonus system with provider-specific wager tracking in your client application.
