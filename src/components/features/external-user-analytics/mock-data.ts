// Mock data for testing external user transactions
// This can be removed once the backend APIs are implemented

export const mockExternalUserTransactions = [
  {
    id: 1,
    amount: 1000.00,
    type: "BET",
    status: "COMPLETED",
    createdAt: "2024-01-15T10:30:00.000Z",
    externalUser: {
      id: 1,
      name: "John Doe",
      externalId: "ext_123",
      company: "Company A"
    }
  },
  {
    id: 2,
    amount: 2500.00,
    type: "WIN",
    status: "COMPLETED",
    createdAt: "2024-01-15T09:15:00.000Z",
    externalUser: {
      id: 2,
      name: "Jane Smith",
      externalId: "ext_456",
      company: "Company B"
    }
  },
  {
    id: 3,
    amount: 500.00,
    type: "BET",
    status: "PENDING",
    createdAt: "2024-01-15T08:45:00.000Z",
    externalUser: {
      id: 3,
      name: "Mike Johnson",
      externalId: "ext_789",
      company: "Company A"
    }
  },
  {
    id: 4,
    amount: 2000.00,
    type: "DEPOSIT",
    status: "COMPLETED",
    createdAt: "2024-01-14T16:20:00.000Z",
    externalUser: {
      id: 1,
      name: "John Doe",
      externalId: "ext_123",
      company: "Company A"
    }
  },
  {
    id: 5,
    amount: 1500.00,
    type: "WITHDRAWAL",
    status: "COMPLETED",
    createdAt: "2024-01-14T14:30:00.000Z",
    externalUser: {
      id: 2,
      name: "Jane Smith",
      externalId: "ext_456",
      company: "Company B"
    }
  },
  {
    id: 6,
    amount: 750.00,
    type: "BET",
    status: "FAILED",
    createdAt: "2024-01-14T12:15:00.000Z",
    externalUser: {
      id: 4,
      name: "Sarah Wilson",
      externalId: "ext_101",
      company: "Company C"
    }
  },
  {
    id: 7,
    amount: 3000.00,
    type: "WIN",
    status: "COMPLETED",
    createdAt: "2024-01-14T11:00:00.000Z",
    externalUser: {
      id: 3,
      name: "Mike Johnson",
      externalId: "ext_789",
      company: "Company A"
    }
  },
  {
    id: 8,
    amount: 1200.00,
    type: "BET",
    status: "CANCELLED",
    createdAt: "2024-01-13T15:45:00.000Z",
    externalUser: {
      id: 5,
      name: "David Brown",
      externalId: "ext_202",
      company: "Company B"
    }
  },
  {
    id: 9,
    amount: 800.00,
    type: "BET",
    status: "COMPLETED",
    createdAt: "2024-01-13T13:20:00.000Z",
    externalUser: {
      id: 1,
      name: "John Doe",
      externalId: "ext_123",
      company: "Company A"
    }
  },
  {
    id: 10,
    amount: 1800.00,
    type: "WIN",
    status: "COMPLETED",
    createdAt: "2024-01-13T10:30:00.000Z",
    externalUser: {
      id: 2,
      name: "Jane Smith",
      externalId: "ext_456",
      company: "Company B"
    }
  }
];

// Generate more mock transactions for better pagination testing
const generateMockTransactions = () => {
  const baseTransactions = [...mockExternalUserTransactions];
  const additionalTransactions = [];
  
  for (let i = 11; i <= 50; i++) {
    const types = ['BET', 'WIN', 'DEPOSIT', 'WITHDRAWAL'];
    const statuses = ['COMPLETED', 'PENDING', 'FAILED', 'CANCELLED'];
    const companies = ['Company A', 'Company B', 'Company C'];
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Lisa Davis', 'Tom Wilson', 'Emma Taylor'];
    
    additionalTransactions.push({
      id: i,
      amount: Math.floor(Math.random() * 5000) + 100,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      externalUser: {
        id: Math.floor(Math.random() * 8) + 1,
        name: names[Math.floor(Math.random() * names.length)],
        externalId: `ext_${Math.floor(Math.random() * 1000)}`,
        company: companies[Math.floor(Math.random() * companies.length)]
      }
    });
  }
  
  return [...baseTransactions, ...additionalTransactions];
};

export const mockTransactionsResponse = {
  transactions: generateMockTransactions(),
  pagination: {
    page: 1,
    limit: 10,
    total: 50,
    pages: 5
  }
};
