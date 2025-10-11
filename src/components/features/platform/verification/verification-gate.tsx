"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useVerificationStatus, useContinueVerification, useStartOverVerification } from '@/react-query/ocr-queries';

export interface VerificationGateProps {
  onStartNew: (type: 'aadhaar' | 'passport') => void;
  onContinue: (type: 'aadhaar' | 'passport', nextStep: number) => void;
}

export const VerificationGate: React.FC<VerificationGateProps> = ({ onStartNew, onContinue }) => {
  const { data: statusData, isLoading: statusLoading, refetch } = useVerificationStatus();
  const startOverMut = useStartOverVerification();
  const continueMut = useContinueVerification();

  if (statusLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Document Verification</CardTitle>
            <CardDescription className="text-center">Loading status...</CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      </div>
    );
  }

  const status = statusData?.data?.status as 'pending' | 'processing' | 'completed' | undefined;
  const type = statusData?.data?.type as 'aadhaar' | 'passport' | null | undefined;
  const currentStep = statusData?.data?.currentStep as number | undefined;

  if (status === 'completed') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">KYC Completed</CardTitle>
            <CardDescription className="text-center">Your documents are verified.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === 'processing' && type) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Resume your KYC</CardTitle>
            <CardDescription className="text-center">You have an in-progress verification.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Button
                onClick={async () => {
                  const res = await continueMut.mutateAsync();
                  // Use the nextStep from the API response, or fallback to currentStep + 1
                  const nextStep = res?.data?.nextStep ?? (currentStep ?? 0) + 1;
                  onContinue(type, nextStep);
                }}
                disabled={continueMut.isPending}
              >
                {continueMut.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Continue...
                  </>
                ) : (
                  'Continue where you left off'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await startOverMut.mutateAsync();
                  await refetch();
                }}
                disabled={startOverMut.isPending}
              >
                {startOverMut.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Start Over'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Document Verification</CardTitle>
          <CardDescription className="text-center">Please complete your KYC</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => onStartNew('aadhaar')}
              variant="outline"
              className="h-32 flex flex-col items-center justify-center space-y-2"
            >
              <span className="font-semibold">Aadhaar Card</span>
              <span className="text-sm text-muted-foreground">Front & Back sides required</span>
            </Button>
            <Button
              onClick={() => onStartNew('passport')}
              variant="outline"
              className="h-32 flex flex-col items-center justify-center space-y-2"
            >
              <span className="font-semibold">Passport</span>
              <span className="text-sm text-muted-foreground">Single document required</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationGate;


