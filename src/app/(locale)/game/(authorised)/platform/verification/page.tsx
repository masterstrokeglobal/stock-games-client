"use client";

import React, { useState } from 'react'
import VerificationGate from '@/components/features/platform/verification/verification-gate'
import DocumentFlow from '@/components/features/platform/verification/document-flow'

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
  const [flowType, setFlowType] = useState<null | 'aadhaar' | 'passport'>(null);
  const [startStep, setStartStep] = useState<number>(0);

  if (!flowType) {
    return (
      <VerificationGate
        onStartNew={(t) => { setFlowType(t); setStartStep(0); }}
        onContinue={(t, nextStep) => { setFlowType(t); setStartStep(nextStep); }}
      />
    );
  }

  return (
    <DocumentFlow type={flowType} startAtStep={startStep} onComplete={onComplete} />
  );
};