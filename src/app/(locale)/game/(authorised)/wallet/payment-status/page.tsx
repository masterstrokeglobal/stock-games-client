"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@/components/common/container';
import TopBar from '@/components/common/top-bar';
import { PaymentStatus } from '@/components/features/payment/payment-status';

const PaymentStatusPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | undefined>();

  useEffect(() => {
    const txnId = searchParams.get('transactionId');
    const link = searchParams.get('paymentLink');
    
    if (txnId) {
      setTransactionId(parseInt(txnId));
    }
    if (link) {
      setPaymentLink(link);
    }
  }, [searchParams]);

  const handleSuccess = () => {
    router.push('/game/platform/user-menu');
  };

  const handleCancel = () => {
    router.push('/game/platform/user-menu');
  };

  if (!transactionId) {
    return (
      <Container className="flex flex-col space-y-8 items-center bg-primary-game pt-24">
        <TopBar>Payment Status</TopBar>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No transaction ID found.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col space-y-8 items-center bg-primary-game pt-24">
      <TopBar>Payment Status</TopBar>
      <PaymentStatus
        transactionId={transactionId}
        paymentLink={paymentLink}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </Container>
  );
};

export default PaymentStatusPage;

