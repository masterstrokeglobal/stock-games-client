import api from "./instance"; // Import your Axios instance
import { Transaction } from "@/models/transaction"; // Import the Transaction model

export const transactionAPI = {
    // Create a new transaction
    createTransaction: async (transactionData: Transaction) => {
        return api.post("/transaction", transactionData);
    },

    // Get all transactions with optional filtering
    getAllTransactions: async (filter?: Record<string, any>) => {
        return api.get("/payment/transaction", {
            params: filter,
        });
    },

    // Get a transaction by ID
    getTransactionById: async (transactionId: string) => {
        return api.get(`/payment/transaction/${transactionId}`);
    },

    // Update a transaction by ID
    updateTransactionById: async (transaction: Partial<Transaction>) => {
        return api.patch(`/payment/transaction/${transaction.id}`, transaction);
    },

    // confirm a withdrawal by ID
    confirmWithdrawal: async (transaction:Partial<Transaction>) => {
        return api.patch(`/payment/confirm-withdrawal/${transaction.id}`, transaction);
    },
    // Delete a transaction by ID
    deleteTransactionById: async (transactionId: number) => {
        return api.delete(`/transaction/${transactionId}`);
    },
};
