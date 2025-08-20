# Client-Side Bonus System Integration API Documentation

## Overview
This documentation provides complete client-side integration examples for the bonus system with provider-specific wager tracking. The system supports both Stock (internal) and QTech (external) providers.

## Provider Configuration
```javascript
const PROVIDERS = {
  STOCK: 1,  // Internal stock betting system
  QTECH: 2   // QTech third-party provider
};
```

---

## 1. ADMIN BONUS MANAGEMENT

### 1.1 Create Bonus Campaign
**Endpoint:** `POST /admin/bonus/campaigns`  
**Headers:** `Authorization: Bearer <admin_token>`

```javascript
// Create bonus with provider restrictions
const createBonus = async (bonusData) => {
  try {
    const response = await fetch('/api/admin/bonus-campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        bonusName: "Welcome Stock Bonus",
        description: "50% bonus for new users - Stock games only",
        bonusType: "DEPOSIT_MATCH",
        triggerEvent: "FIRST_DEPOSIT",
        bonusValue: 50,
        wagerRequirementType: "TURNOVER_MULTIPLIER", 
        wagerRequirementValue: 5,
        spendingRequirement: 1000, // User must spend 1000 to complete
        applicableProviders: [1], // Only Stock bets count
        minDepositAmount: 100,
        maxBonusAmount: 500,
        validityDays: 30,
        isActive: true
      })
    });
    
    const result = await response.json();
    console.log('Bonus created:', result);
    return result;
  } catch (error) {
    console.error('Error creating bonus:', error);
  }
};

// Create bonus for both providers
const createMultiProviderBonus = async () => {
  return await createBonus({
    bonusName: "VIP Weekly Bonus",
    description: "10% cashback on all games",
    bonusType: "CASHBACK",
    triggerEvent: "LOGIN",
    bonusValue: 10,
    wagerRequirementType: "TURNOVER_MULTIPLIER",
    wagerRequirementValue: 3,
    spendingRequirement: 2000,
    applicableProviders: [1, 2], // Both Stock and QTech
    validityDays: 7,
    isActive: true
  });
};

// Create QTech-only bonus
const createQTechBonus = async () => {
  return await createBonus({
    bonusName: "QTech Slots Bonus",
    description: "Free spins equivalent bonus",
    bonusType: "FREE_BONUS",
    triggerEvent: "EVERY_DEPOSIT",
    bonusValue: 25,
    wagerRequirementType: "TURNOVER_MULTIPLIER", 
    wagerRequirementValue: 10,
    spendingRequirement: 500,
    applicableProviders: [2], // Only QTech bets count
    minDepositAmount: 50,
    validityDays: 3,
    isActive: true
  });
};
```

### 1.2 Get All Bonus Campaigns
```javascript
const getBonusCampaigns = async () => {
  try {
    const response = await fetch('/api/admin/bonus-campaigns', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    const campaigns = await response.json();
    console.log('Available campaigns:', campaigns.data);
    
    // Display campaigns in admin UI
    campaigns.data.forEach(campaign => {
      console.log(`${campaign.bonusName}: ${campaign.applicableProviders?.join(', ') || 'All providers'}`);
    });
    
    return campaigns;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
  }
};
```

### 1.3 Update Provider Restrictions
```javascript
const updateProviderRestrictions = async (bonusId, providers) => {
  try {
    const response = await fetch(`/api/admin/bonus-campaigns/${bonusId}/providers`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        applicableProviders: providers
      })
    });
    
    const result = await response.json();
    console.log('Provider restrictions updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating providers:', error);
  }
};

// Example usage
await updateProviderRestrictions(123, [1]); // Stock only
await updateProviderRestrictions(124, [1, 2]); // Both providers
```

---

## 2. USER BONUS OPERATIONS

### 2.1 Get User Bonus History
```javascript
const getUserBonuses = async (userId) => {
  try {
    const response = await fetch(`/api/bonus/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    const bonuses = await response.json();
    console.log('User bonuses:', bonuses.data);
    
    // Display active bonuses with provider info
    bonuses.data.forEach(bonus => {
      const providers = bonus.bonusCampaign.applicableProviders;
      const providerNames = providers?.map(id => 
        id === 1 ? 'Stock' : id === 2 ? 'QTech' : `Provider ${id}`
      ).join(', ') || 'All games';
      
      console.log(`
        Bonus: ${bonus.bonusCampaign.bonusName}
        Amount: $${bonus.potBalance}
        Wagering Required: $${bonus.remainingWager}
        Valid for: ${providerNames}
        Progress: ${((bonus.requiredWager - bonus.remainingWager) / bonus.requiredWager * 100).toFixed(1)}%
      `);
    });
    
    return bonuses;
  } catch (error) {
    console.error('Error fetching user bonuses:', error);
  }
};
```

### 2.2 Get Provider Wager Progress
```javascript
const getUserWagerProgress = async (userId) => {
  try {
    const response = await fetch(`/api/bonus/user/${userId}/wager-progress`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    const progress = await response.json();
    
    // Display progress by provider
    progress.data.assignments.forEach(assignment => {
      console.log(`
        Bonus: ${assignment.bonusName}
        Stock Progress: $${assignment.providerProgress?.['1'] || 0}
        QTech Progress: $${assignment.providerProgress?.['2'] || 0}
        Total Required: $${assignment.totalRequired}
        Remaining: $${assignment.remainingWager}
      `);
    });
    
    return progress;
  } catch (error) {
    console.error('Error fetching wager progress:', error);
  }
};
```

### 2.3 Get Detailed Bonus Breakdown
```javascript
const getBonusBreakdown = async (assignmentId) => {
  try {
    const response = await fetch(`/api/bonus/assignment/${assignmentId}/wager-breakdown`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    const breakdown = await response.json();
    
    // Display provider-wise breakdown
    console.log('Bonus Breakdown:', breakdown.data);
    breakdown.data.providerBreakdown.forEach(provider => {
      console.log(`
        ${provider.providerName}: 
        - Wagered: $${provider.totalWagered}
        - Eligible: ${provider.isEligible ? 'Yes' : 'No'}
        - Contribution: ${provider.contributionPercentage}%
      `);
    });
    
    return breakdown;
  } catch (error) {
    console.error('Error fetching bonus breakdown:', error);
  }
};
```

---

## 3. STOCK BETTING INTEGRATION

### 3.1 Place Stock Bet with Bonus Tracking
```javascript
const placeStockBet = async (betData) => {
  try {
    // First, place the stock bet
    const betResponse = await fetch('/api/stock-slot-placement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        roundId: betData.roundId,
        marketItem: betData.symbol,
        placement: betData.direction, // 'UP' or 'DOWN'
        amount: betData.amount
      })
    });
    
    const betResult = await betResponse.json();
    
    if (betResult.stockSlotPlacement) {
      console.log('Stock bet placed successfully');
      
      // Check updated bonus progress
      await checkBonusProgressAfterBet(betData.userId, 1, betData.amount);
    }
    
    return betResult;
  } catch (error) {
    console.error('Error placing stock bet:', error);
  }
};

// Example stock betting component
const StockBettingComponent = () => {
  const [bonusProgress, setBonusProgress] = useState([]);
  
  const handleStockBet = async (symbol, direction, amount) => {
    const betData = {
      userId: currentUser.id,
      roundId: currentRound.id,
      symbol,
      direction,
      amount
    };
    
    const result = await placeStockBet(betData);
    
    // Update bonus progress display
    if (result) {
      const progress = await getUserWagerProgress(currentUser.id);
      setBonusProgress(progress.data.assignments);
    }
  };
  
  return (
    <div>
      <StockChart />
      <BetControls onBet={handleStockBet} />
      <BonusProgressDisplay bonuses={bonusProgress} />
    </div>
  );
};
```

### 3.2 Check Bonus Progress After Bet
```javascript
const checkBonusProgressAfterBet = async (userId, providerId, betAmount) => {
  try {
    // Get updated bonus progress
    const progress = await getUserWagerProgress(userId);
    
    // Check for completed bonuses
    const completedBonuses = progress.data.assignments.filter(
      assignment => assignment.status === 'COMPLETED'
    );
    
    if (completedBonuses.length > 0) {
      // Show bonus completion notification
      completedBonuses.forEach(bonus => {
        showNotification({
          type: 'success',
          title: 'Bonus Completed!',
          message: `${bonus.bonusName} - $${bonus.potBalance} added to your balance`,
          duration: 5000
        });
      });
    }
    
    // Update progress bars for active bonuses
    const activeBonuses = progress.data.assignments.filter(
      assignment => assignment.status === 'ACTIVE'
    );
    
    activeBonuses.forEach(bonus => {
      const progressPercent = ((bonus.requiredWager - bonus.remainingWager) / bonus.requiredWager * 100);
      updateBonusProgressBar(bonus.id, progressPercent);
    });
    
  } catch (error) {
    console.error('Error checking bonus progress:', error);
  }
};
```

---

## 4. QTECH INTEGRATION

### 4.1 QTech Game Launch
```javascript
const launchQTechGame = async (gameId) => {
  try {
    // Launch QTech game (your existing implementation)
    const gameUrl = await getQTechGameUrl(gameId);
    
    // Open game in iframe or new window
    openQTechGame(gameUrl);
    
    // Set up bet tracking listener
    setupQTechBetTracking();
    
  } catch (error) {
    console.error('Error launching QTech game:', error);
  }
};

const setupQTechBetTracking = () => {
  // Listen for QTech bet callbacks (if using postMessage)
  window.addEventListener('message', (event) => {
    if (event.origin === 'https://qtech-games.com') {
      const { type, data } = event.data;
      
      if (type === 'BET_PLACED') {
        handleQTechBetPlaced(data);
      }
    }
  });
};

const handleQTechBetPlaced = async (betData) => {
  try {
    // Update local bonus progress tracking
    await checkBonusProgressAfterBet(
      betData.player_id, 
      2, // QTech Provider ID
      betData.bet_amount
    );
    
    // Show live bonus progress update
    showBonusProgressUpdate(betData.bet_amount, 'QTech');
    
  } catch (error) {
    console.error('Error handling QTech bet:', error);
  }
};
```

### 4.2 QTech Balance Integration
```javascript
// If you need to provide balance to QTech games
const getBalanceForQTech = async (userId) => {
  try {
    const response = await fetch(`/api/user/${userId}/balance`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    const balance = await response.json();
    return balance.data.totalBalance;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return 0;
  }
};
```

---

## 5. UI COMPONENTS FOR BONUS DISPLAY

### 5.1 Bonus Progress Component
```javascript
const BonusProgressComponent = ({ userId }) => {
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchBonusProgress();
  }, [userId]);
  
  const fetchBonusProgress = async () => {
    setLoading(true);
    try {
      const progress = await getUserWagerProgress(userId);
      setBonuses(progress.data.assignments);
    } catch (error) {
      console.error('Error fetching bonuses:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getProviderIcon = (providerId) => {
    switch(providerId) {
      case 1: return '📈'; // Stock
      case 2: return '🎰'; // QTech
      default: return '🎮';
    }
  };
  
  if (loading) return <div>Loading bonuses...</div>;
  
  return (
    <div className="bonus-progress-container">
      <h3>Active Bonuses</h3>
      {bonuses.map(bonus => (
        <div key={bonus.id} className="bonus-card">
          <div className="bonus-header">
            <h4>{bonus.bonusName}</h4>
            <span className="bonus-amount">${bonus.potBalance}</span>
          </div>
          
          <div className="bonus-providers">
            <span>Valid for: </span>
            {bonus.applicableProviders?.map(providerId => (
              <span key={providerId} className="provider-tag">
                {getProviderIcon(providerId)}
                {providerId === 1 ? 'Stock' : 'QTech'}
              </span>
            )) || <span>All games</span>}
          </div>
          
          <div className="progress-section">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${((bonus.requiredWager - bonus.remainingWager) / bonus.requiredWager * 100)}%` 
                }}
              />
            </div>
            <div className="progress-text">
              ${bonus.requiredWager - bonus.remainingWager} / ${bonus.requiredWager}
            </div>
          </div>
          
          {/* Provider-specific progress */}
          <div className="provider-progress">
            {Object.entries(bonus.providerProgress || {}).map(([providerId, amount]) => (
              <div key={providerId} className="provider-progress-item">
                <span>{getProviderIcon(parseInt(providerId))}</span>
                <span>${amount}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 5.2 Admin Bonus Management Component
```javascript
const AdminBonusManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [providers, setProviders] = useState([]);
  
  useEffect(() => {
    fetchCampaigns();
    fetchProviders();
  }, []);
  
  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/admin/providers', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await response.json();
      setProviders(data.data.providers);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };
  
  const createNewBonus = async (formData) => {
    try {
      const result = await createBonus(formData);
      if (result) {
        fetchCampaigns(); // Refresh list
        showSuccessMessage('Bonus created successfully');
      }
    } catch (error) {
      showErrorMessage('Failed to create bonus');
    }
  };
  
  return (
    <div className="admin-bonus-manager">
      <h2>Bonus Campaign Management</h2>
      
      {/* Bonus Creation Form */}
      <BonusCreationForm 
        providers={providers}
        onSubmit={createNewBonus}
      />
      
      {/* Existing Campaigns */}
      <div className="campaigns-list">
        {campaigns.map(campaign => (
          <CampaignCard 
            key={campaign.id}
            campaign={campaign}
            providers={providers}
            onUpdate={fetchCampaigns}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## 6. ERROR HANDLING

### 6.1 API Error Handling
```javascript
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API call failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    
    // Show user-friendly error messages
    if (error.message.includes('provider')) {
      showErrorMessage('This bonus is not available for the selected game');
    } else if (error.message.includes('spending')) {
      showErrorMessage('Insufficient wagering progress for this bonus');
    } else {
      showErrorMessage('Something went wrong. Please try again.');
    }
    
    throw error;
  }
};
```

### 6.2 Bonus Validation
```javascript
const validateBonusEligibility = async (userId, providerId, betAmount) => {
  try {
    const bonuses = await getUserBonuses(userId);
    const applicableBonuses = bonuses.data.filter(bonus => 
      bonus.status === 'ACTIVE' &&
      (!bonus.bonusCampaign.applicableProviders || 
       bonus.bonusCampaign.applicableProviders.includes(providerId))
    );
    
    return {
      eligible: applicableBonuses.length > 0,
      bonusCount: applicableBonuses.length,
      totalPotential: applicableBonuses.reduce((sum, b) => sum + b.potBalance, 0)
    };
  } catch (error) {
    console.error('Error validating bonus eligibility:', error);
    return { eligible: false, bonusCount: 0, totalPotential: 0 };
  }
};
```

---

## 7. COMPLETE INTEGRATION EXAMPLE

### 7.1 Full Client Application Structure
```javascript
// App.js - Main application with bonus integration
const App = () => {
  const [user, setUser] = useState(null);
  const [bonuses, setBonuses] = useState([]);
  
  // Initialize bonus tracking
  useEffect(() => {
    if (user) {
      initializeBonusTracking(user.id);
    }
  }, [user]);
  
  const initializeBonusTracking = async (userId) => {
    try {
      // Get initial bonus state
      const userBonuses = await getUserBonuses(userId);
      setBonuses(userBonuses.data);
      
      // Set up real-time bonus updates
      setupBonusWebSocket(userId);
    } catch (error) {
      console.error('Failed to initialize bonus tracking:', error);
    }
  };
  
  const setupBonusWebSocket = (userId) => {
    const ws = new WebSocket(`ws://your-api/bonus-updates/${userId}`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      
      if (update.type === 'BONUS_PROGRESS') {
        updateBonusProgress(update.data);
      } else if (update.type === 'BONUS_COMPLETED') {
        showBonusCompletionNotification(update.data);
        refreshBonusData();
      }
    };
  };
  
  return (
    <div className="app">
      <Header user={user} />
      <BonusProgressComponent userId={user?.id} bonuses={bonuses} />
      
      <Routes>
        <Route path="/stock" element={<StockTradingPage />} />
        <Route path="/qtech" element={<QTechGamesPage />} />
        <Route path="/admin/bonuses" element={<AdminBonusManager />} />
      </Routes>
    </div>
  );
};
```

This comprehensive API documentation provides everything needed to integrate the bonus system with provider-specific wager tracking on the client side. The system automatically tracks bets from both Stock and QTech providers and updates bonus progress accordingly.

Key features:
- ✅ Provider-specific bonus eligibility
- ✅ Real-time wager progress tracking  
- ✅ Automatic bonus completion detection
- ✅ Admin tools for bonus management
- ✅ Complete error handling
- ✅ UI components for bonus display
- ✅ Integration with both Stock and QTech betting systems
