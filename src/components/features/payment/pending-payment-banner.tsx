"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { useTransactionPolling } from '@/hooks/use-transaction-polling';
import { TransactionStatus } from '@/models/transaction';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const PendingPaymentBanner = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check sessionStorage for pending transaction
    const txnId = sessionStorage.getItem('pending_deposit_transaction_id');
    const link = sessionStorage.getItem('pending_deposit_payment_link');
    
    if (txnId) {
      setTransactionId(parseInt(txnId));
      setPaymentLink(link);
      setIsVisible(true);
    }
  }, []);

  const { transaction } = useTransactionPolling({
    transactionId,
    enabled: isVisible && !!transactionId,
    pollingInterval: 5000,
    onCompleted: (txn) => {
      toast.success('Payment completed successfully!');
      // Clear sessionStorage
      sessionStorage.removeItem('pending_deposit_transaction_id');
      sessionStorage.removeItem('pending_deposit_payment_link');
      // Invalidate wallet and transactions
      queryClient.invalidateQueries({ queryKey: ['user', 'wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setIsVisible(false);
    },
    onFailed: (txn) => {
      toast.error('Payment failed. Please try again.');
      // Clear sessionStorage
      sessionStorage.removeItem('pending_deposit_transaction_id');
      sessionStorage.removeItem('pending_deposit_payment_link');
      setIsVisible(false);
    },
  });

  const handleViewStatus = () => {
    const params = new URLSearchParams({
      transactionId: transactionId?.toString() || '',
    });
    if (paymentLink) {
      params.append('paymentLink', paymentLink);
    }
    router.push(`/game/wallet/payment-status?${params.toString()}`);
  };

  const handleDismiss = () => {
    // Clear sessionStorage
    sessionStorage.removeItem('pending_deposit_transaction_id');
    sessionStorage.removeItem('pending_deposit_payment_link');
    setIsVisible(false);
  };

  if (!isVisible || !transactionId || transaction?.status === TransactionStatus.COMPLETED || transaction?.status === TransactionStatus.FAILED) {
    return null;
  }

  return (
    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Payment Pending
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Your deposit of ₹{transaction?.amount?.toLocaleString() || '...'} is being processed. 
              This usually takes 5-15 minutes.
            </p>
            <Button 
              onClick={handleViewStatus} 
              variant="link" 
              className="h-auto p-0 text-blue-600 dark:text-blue-400 mt-2"
            >
              View Payment Status
            </Button>
          </div>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

