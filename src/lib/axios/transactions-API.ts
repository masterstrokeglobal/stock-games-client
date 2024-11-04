import api from "./instance"; // Import your Axios instance
import { Transaction } from "@/models/transaction"; // Import the Transaction model

export const transactionAPI = {
    // Create a new transaction
    createTransaction: async (transactionData: Transaction) => {
        return api.post("/transaction", transactionData);
    },

    // Get all transactions with optional filtering
    getAllTransactions: async (filter?: Record<string, any>) => {
        return api.get("/transaction", {
            params: filter,
        });
    },

    // Get a transaction by ID
    getTransactionById: async (transactionId: number) => {
        return api.get(`/transaction/${transactionId}`);
    },

    // Update a transaction by ID
    updateTransactionById: async (transactionId: number, transactionData: Partial<Transaction>) => {
        return api.put(`/transaction/${transactionId}`, transactionData);
    },

    // Delete a transaction by ID
    deleteTransactionById: async (transactionId: number) => {
        return api.delete(`/transaction/${transactionId}`);
    },
};
