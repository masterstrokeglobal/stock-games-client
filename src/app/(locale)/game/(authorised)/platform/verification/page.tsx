"use client";

import React, { useState } from 'react'
import VerificationGate from '@/components/features/platform/verification/verification-gate'
import DocumentFlow from '@/components/features/platform/verification/document-flow'
import { LivenessVerification } from '@/components/features/ocr'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const page = () => {
  const handleVerificationComplete = (verificationData: any) => {
    console.log('Verification completed:', verificationData);
  };

  return (
    <div className="min-h-screen py-8">
      <PageContent onComplete={handleVerificationComplete} />
    </div>
  )
}

export default page

const PageContent: React.FC<{ onComplete?: (data: any) => void }> = ({ onComplete }) => {
  const [flowType, setFlowType] = useState<null | 'aadhaar' | 'passport' | 'driving_license' | 'pan_card' | 'liveness'>(null);
  const [startStep, setStartStep] = useState<number>(0);

  if (!flowType) {
    return (
      <VerificationGate
        onStartNew={(t) => { setFlowType(t); setStartStep(0); }}
        onContinue={(t, nextStep) => { setFlowType(t); setStartStep(nextStep); }}
      />
    );
  }

  // Handle liveness-only verification separately
  if (flowType === 'liveness') {
    return (
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setFlowType(null)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Verification Options
        </Button>
        <LivenessVerification
          onSuccess={(score) => {
            console.log('Liveness verification passed with score:', score);
            onComplete?.({ liveness: true, score });
          }}
          onFailure={(score) => {
            console.log('Liveness verification failed with score:', score);
          }}
        />
      </div>
    );
  }

  return (
    <DocumentFlow type={flowType} startAtStep={startStep} onComplete={onComplete} />
  );
};