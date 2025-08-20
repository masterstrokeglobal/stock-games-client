# Real-time Wallet & Bonus Update System

## Overview

This implementation provides real-time wallet balance and bonus updates using a simplified API polling approach. The system ensures wallet balances are always accurate since the backend auto-sync runs after every wallet update.

## Architecture

```
Frontend Components
├── Services/
│   └── realTimeUpdateService.ts     # Core polling service
├── Hooks/
│   └── useRealTimeWallet.ts        # React integration hook
├── Components/
│   └── wallet/RealTimeWallet.tsx   # Wallet display component
└── Examples/
    └── realTimeWalletIntegration.tsx # Integration patterns
```

## Key Features

### 🔄 **Smart Polling**
- Polls wallet balance every 10 seconds (configurable)
- Pauses when browser tab is inactive (saves resources)
- Resumes automatically when tab becomes active

### ⚡ **Transaction-Triggered Updates**
- Immediate balance check after deposits
- Immediate balance check after bets/wagers
- Immediate balance check after bonus claims
- Configurable delay (1-2 seconds) for backend processing

### 🎯 **API-First Approach**
```javascript
// After any bet/transaction, just check the wallet balance
const response = await fetch(`/api/user/${userId}/wallet`);
const walletData = await response.json();

// The balance will ALWAYS be accurate because auto-sync runs after every wallet update
updateUI({
  mainBalance: walletData.mainBalance,
  bonusBalance: walletData.bonusBalance
});
```

## API Endpoints Used

| Endpoint | Purpose | Frequency |
|----------|---------|-----------|
| `GET /api/user/{userId}/wallet` | Get current wallet balance | Every 10s + after transactions |

## Quick Start

### 1. Basic Wallet Display

```tsx
import { useWalletDisplay } from '@/hooks/useRealTimeWallet';

const WalletComponent = ({ userId }) => {
    const { mainBalance, bonusBalance, totalBalance } = useWalletDisplay(userId);
    
    return (
        <div>
            <div>Main: ₹{mainBalance.toLocaleString()}</div>
            <div>Bonus: ₹{bonusBalance.toLocaleString()}</div>
            <div>Total: ₹{totalBalance.toLocaleString()}</div>
        </div>
    );
};
```

### 2. Active Wallet with Polling

```tsx
import { useActiveWallet } from '@/hooks/useRealTimeWallet';

const ActiveWallet = ({ userId }) => {
    const {
        mainBalance,
        bonusBalance,
        onDeposit,
        onBet,
        refreshWallet
    } = useActiveWallet(userId, 5000); // Poll every 5 seconds
    
    const handleDeposit = async (amount) => {
        // Your deposit API call
        await depositAPI(userId, amount);
        
        // Trigger immediate wallet update
        await onDeposit(amount);
    };
    
    return (
        <div>
            <div>Balance: ₹{mainBalance}</div>
            <button onClick={() => handleDeposit(1000)}>
                Deposit ₹1000
            </button>
        </div>
    );
};
```

### 3. Complete Wallet Component

```tsx
import RealTimeWallet from '@/components/wallet/RealTimeWallet';

const Dashboard = ({ userId }) => {
    return (
        <div>
            <RealTimeWallet 
                userId={userId} 
                enablePolling={true}
                showActions={false}
            />
        </div>
    );
};
```

## Integration Patterns

### 🏦 **Deposit Integration**
```tsx
const handleDeposit = async (amount) => {
    try {
        const response = await fetch('/api/user/deposit', {
            method: 'POST',
            body: JSON.stringify({ userId, amount })
        });
        
        if (response.ok) {
            await onDeposit(amount); // Triggers wallet update
            toast.success('Deposit successful!');
        }
    } catch (error) {
        toast.error('Deposit failed');
    }
};
```

### 🎰 **Game Betting Integration**
```tsx
const placeBet = async (betAmount, providerId) => {
    try {
        const response = await fetch('/api/game/bet', {
            method: 'POST',
            body: JSON.stringify({ userId, betAmount, providerId })
        });
        
        if (response.ok) {
            await onBet(betAmount, providerId); // Triggers wallet update
            toast.success('Bet placed!');
        }
    } catch (error) {
        toast.error('Bet failed');
    }
};
```

### 🎁 **Bonus Claiming Integration**
```tsx
const claimBonus = async (bonusId) => {
    try {
        const response = await fetch(`/api/bonus/claim/${bonusId}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            await onTransaction('BONUS_CLAIM'); // Triggers wallet update
            toast.success('Bonus claimed!');
        }
    } catch (error) {
        toast.error('Claim failed');
    }
};
```

## Service Configuration

### Polling Intervals
- **Regular polling**: 10 seconds (default)
- **Active gaming**: 5 seconds (faster updates during gameplay)
- **Background**: Paused (when tab is inactive)

### Transaction Delays
- **Deposits**: 1.5 seconds delay before wallet check
- **Bets**: 1 second delay before wallet check
- **Bonus claims**: 1 second delay before wallet check

## Performance Optimizations

### 🚀 **Resource Management**
- Automatic pause when browser tab is inactive
- Single service instance (singleton pattern)
- Efficient subscription management
- Error handling with graceful fallbacks

### 📊 **Smart Updates**
- Only update UI when balance actually changes
- Debounced API calls to prevent spam
- Parallel API calls for better performance
- Cached authentication tokens

## Browser Support

- ✅ Modern browsers with `fetch` API
- ✅ Document visibility API for smart polling
- ✅ Local storage for authentication tokens
- ✅ React 16.8+ (hooks support)

## Environment Setup

Add to your environment variables:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=your-api-base-url
NEXT_PUBLIC_WALLET_POLL_INTERVAL=10000
NEXT_PUBLIC_TRANSACTION_DELAY=1000
```

## Demo

Visit `/dashboard/wallet/real-time-demo` to see the complete implementation in action with:
- Live wallet balance display
- Transaction simulation
- Bonus progress tracking
- Service status monitoring

## Troubleshooting

### Common Issues

1. **Balance not updating**: Check if user is logged in and polling is active
2. **Too frequent API calls**: Adjust polling interval or check for multiple service instances
3. **Updates after transactions**: Ensure `onDeposit`/`onBet` is called after successful API responses
4. **Memory leaks**: Service automatically cleans up subscriptions on component unmount

### Debug Information

The service provides status information:
```tsx
const { serviceStatus } = useRealTimeWallet({ userId });

console.log(serviceStatus);
// {
//   isPolling: true,
//   currentUserId: "123",
//   pollInterval: 10000,
//   isDocumentVisible: true,
//   subscriberCount: 3
// }
```

## Future Enhancements

- [ ] WebSocket integration for real-time updates
- [ ] Offline support with local state management
- [ ] Enhanced error recovery mechanisms
- [ ] Transaction history tracking
- [ ] Performance analytics and monitoring

## Support

For issues or questions:
1. Check the demo page for working examples
2. Review the integration patterns in `examples/`
3. Monitor service status for debugging
4. Ensure proper authentication token handling
