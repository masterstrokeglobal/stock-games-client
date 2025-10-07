"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { useTransactionPolling } from '@/hooks/use-transaction-polling';
import { TransactionStatus } from '@/models/transaction';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface PaymentStatusProps {
  transactionId: number;
  paymentLink?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PaymentStatus = ({ 
  transactionId, 
  paymentLink, 
  onSuccess, 
  onCancel 
}: PaymentStatusProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [hasOpenedLink, setHasOpenedLink] = useState(false);

  const { transaction, isPolling, error, manualRefresh } = useTransactionPolling({
    transactionId,
    enabled: true,
    pollingInterval: 5000, // Poll every 5 seconds
    onCompleted: (txn) => {
      toast.success('Payment completed successfully!');
      // Invalidate wallet and transactions to refresh balance
      queryClient.invalidateQueries({ queryKey: ['user', 'wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      onSuccess?.();
    },
    onFailed: (txn) => {
      toast.error('Payment failed. Please try again.');
    },
  });

  const status = transaction?.status || TransactionStatus.PENDING;
  const amount = transaction?.amount || 0;

  const openPaymentLink = () => {
    if (paymentLink) {
      window.open(paymentLink, '_blank');
      setHasOpenedLink(true);
    }
  };

  const handleDone = () => {
    if (status === TransactionStatus.COMPLETED) {
      onSuccess?.();
    } else {
      onCancel?.();
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return <CheckCircle2 className="h-16 w-16 text-green-500" />;
      case TransactionStatus.FAILED:
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return 'Payment Successful';
      case TransactionStatus.FAILED:
        return 'Payment Failed';
      default:
        return 'Payment Pending';
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return `Your deposit of ₹${amount.toLocaleString()} has been processed successfully.`;
      case TransactionStatus.FAILED:
        return 'Your payment could not be processed. Please try again.';
      default:
        return `Waiting for confirmation of your ₹${amount.toLocaleString()} deposit. This usually takes 5-15 minutes.`;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-2xl">{getStatusTitle()}</CardTitle>
          <CardDescription className="text-base mt-2">
            {getStatusDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === TransactionStatus.PENDING && (
            <>
              {paymentLink && !hasOpenedLink && (
                <Button 
                  onClick={openPaymentLink} 
                  className="w-full"
                  size="lg"
                >
                  Open Payment Gateway
                </Button>
              )}
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Instructions:</strong>
                </p>
                <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside space-y-1">
                  <li>Complete the payment in the payment gateway</li>
                  <li>Keep this page open</li>
                  <li>Your balance will update automatically once confirmed</li>
                </ul>
              </div>

              <Button 
                onClick={manualRefresh} 
                variant="outline" 
                className="w-full"
                disabled={isPolling}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isPolling ? 'animate-spin' : ''}`} />
                Check Payment Status
              </Button>
            </>
          )}

          {status === TransactionStatus.COMPLETED && (
            <Button onClick={handleDone} className="w-full" size="lg">
              View Wallet
            </Button>
          )}

          {status === TransactionStatus.FAILED && (
            <div className="space-y-2">
              <Button onClick={() => router.push('/game/wallet/deposit')} className="w-full" size="lg">
                Try Again
              </Button>
              <Button onClick={handleDone} variant="outline" className="w-full">
                Go Back
              </Button>
            </div>
          )}

          {status === TransactionStatus.PENDING && (
            <Button onClick={onCancel} variant="ghost" className="w-full">
              Close
            </Button>
          )}

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>Transaction ID: #{transactionId}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

