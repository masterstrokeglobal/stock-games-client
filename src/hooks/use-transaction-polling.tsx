import { useEffect, useRef, useState } from 'react';
import { paymentAPI } from '@/lib/axios/payment-API';
import { TransactionStatus } from '@/models/transaction';

interface UseTransactionPollingOptions {
  transactionId: number | null;
  onCompleted?: (transaction: any) => void;
  onFailed?: (transaction: any) => void;
  pollingInterval?: number; // in milliseconds
  enabled?: boolean;
}

export const useTransactionPolling = ({
  transactionId,
  onCompleted,
  onFailed,
  pollingInterval = 5000, // Default 5 seconds
  enabled = true,
}: UseTransactionPollingOptions) => {
  const [transaction, setTransaction] = useState<any>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!transactionId || !enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        setIsPolling(false);
      }
      return;
    }

    const pollTransaction = async () => {
      try {
        setIsPolling(true);
        const response = await paymentAPI.getTransactionById(transactionId.toString());
        const txn = response.data.transaction;
        
        if (!isMountedRef.current) return;

        setTransaction(txn);

        // Stop polling if transaction is completed or failed
        if (txn.status === TransactionStatus.COMPLETED) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            setIsPolling(false);
          }
          onCompleted?.(txn);
        } else if (txn.status === TransactionStatus.FAILED) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            setIsPolling(false);
          }
          onFailed?.(txn);
        }
      } catch (err: any) {
        console.error('Error polling transaction:', err);
        if (isMountedRef.current) {
          setError(err.message || 'Failed to fetch transaction status');
        }
      }
    };

    // Initial poll
    pollTransaction();

    // Set up polling interval
    intervalRef.current = setInterval(pollTransaction, pollingInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [transactionId, enabled, pollingInterval, onCompleted, onFailed]);

  const manualRefresh = async () => {
    if (!transactionId) return;
    
    try {
      setIsPolling(true);
      const response = await paymentAPI.getTransactionById(transactionId.toString());
      const txn = response.data.transaction;
      
      setTransaction(txn);

      if (txn.status === TransactionStatus.COMPLETED) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        onCompleted?.(txn);
      } else if (txn.status === TransactionStatus.FAILED) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        onFailed?.(txn);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transaction status');
    } finally {
      setIsPolling(false);
    }
  };

  return {
    transaction,
    isPolling,
    error,
    manualRefresh,
  };
};

