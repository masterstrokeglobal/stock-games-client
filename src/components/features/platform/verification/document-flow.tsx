"use client";

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, CheckCircle, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { useAadhaarBackOCR, useAadhaarFrontOCR, usePassportOCR, useFaceMatch } from '@/react-query/ocr-queries';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  data?: any;
}

export interface DocumentFlowProps {
  type: 'aadhaar' | 'passport';
  startAtStep?: number;
  onComplete?: (verificationData: any) => void;
}

const DocumentFlow: React.FC<DocumentFlowProps> = ({ type, startAtStep = 0, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(startAtStep);
  const [steps, setSteps] = useState<VerificationStep[]>(() => {
    return type === 'aadhaar'
      ? [
          { id: 'front', title: 'Aadhaar Front Side', description: 'Upload the front side of your Aadhaar card', completed: false },
          { id: 'back', title: 'Aadhaar Back Side', description: 'Upload the back side of your Aadhaar card', completed: false },
          { id: 'selfie', title: 'Selfie (Face Liveness)', description: 'Upload a live selfie for liveness & face match', completed: false },
          { id: 'complete', title: 'Verification Complete', description: 'Your Aadhaar card has been verified', completed: false },
        ]
      : [
          { id: 'front', title: 'Passport Document', description: 'Upload your passport document', completed: false },
          { id: 'selfie', title: 'Selfie (Face Liveness)', description: 'Upload a live selfie for liveness & face match', completed: false },
          { id: 'complete', title: 'Verification Complete', description: 'Your passport has been verified', completed: false },
        ];
  });

  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [frontData, setFrontData] = useState<any>(null);
  const [backData, setBackData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aadhaarFrontMut = useAadhaarFrontOCR();
  const aadhaarBackMut = useAadhaarBackOCR();
  const passportMut = usePassportOCR();
  const faceMatchMut = useFaceMatch();
  const isLoading = aadhaarFrontMut.isPending || aadhaarBackMut.isPending || passportMut.isPending || faceMatchMut.isPending;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast.error("File too large. Please upload an image smaller than 1MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (currentStep === 0) setFrontImage(result);
      else if (currentStep === 1 && type === 'aadhaar') setBackImage(result);
      else setSelfieImage(result);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageData: string, step: 'front' | 'back' | 'selfie') => {
    try {
      let response: any;
      if (step === 'selfie') {
        response = await faceMatchMut.mutateAsync({ source: imageData });
      } else if (type === 'aadhaar') {
        response = step === 'front' ? await aadhaarFrontMut.mutateAsync(imageData) : await aadhaarBackMut.mutateAsync(imageData);
      } else {
        response = await passportMut.mutateAsync(imageData);
      }

      if (response.success) {
        if (step === 'front') setFrontData(response.data);
        else if (step === 'back') setBackData(response.data);

        setSteps((prev) => prev.map((s, index) => (index === currentStep ? { ...s, completed: true, data: response.data } : s)));

        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
        if (step === 'selfie') setTimeout(() => onComplete?.({ frontData, backData, faceMatched: true }), 0);
      } else {
        throw new Error(response.error || 'Processing failed');
      }
    } catch (error) {
      // toasts handled by hooks
    }
  };

  const getCurrentStepData = () => {
    if (currentStep === 0) return frontImage;
    if (currentStep === 1 && type === 'aadhaar') return backImage;
    const selfieIndex = type === 'aadhaar' ? 2 : 1;
    if (currentStep === selfieIndex) return selfieImage;
    return null;
  };

  const canProceedToNext = () => {
    if (currentStep === 0) return frontImage && frontData;
    if (currentStep === 1 && type === 'aadhaar') return backImage && backData;
    const selfieIndex = type === 'aadhaar' ? 2 : 1;
    if (currentStep === selfieIndex) return !!selfieImage;
    return false;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{type === 'aadhaar' ? 'Aadhaar Card Verification' : 'Passport Verification'}</CardTitle>
          <CardDescription className="text-center">Follow the steps to complete your document verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500 text-white' : index === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {step.completed ? <CheckCircle className="h-4 w-4" /> : <span className="text-sm font-semibold">{index + 1}</span>}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Step {currentStep + 1}: {steps[currentStep]?.title}</h3>
            <p className="text-muted-foreground mb-4">{steps[currentStep]?.description}</p>

            <div className="space-y-4">
              {!getCurrentStepData() ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">Upload your document</p>
                  <p className="text-sm text-muted-foreground mb-4">Click to select an image or drag and drop</p>
                  <Button onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                    {isLoading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing...</>) : (<><Camera className="h-4 w-4 mr-2" />Choose Image</>)}
                  </Button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img src={getCurrentStepData() || ''} alt={`${steps[currentStep]?.title} preview`} className="w-full max-w-md mx-auto rounded-lg border" />
                    <Badge className="absolute top-2 right-2 bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Uploaded</Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        const selfieIndex = type === 'aadhaar' ? 2 : 1;
                        const stepKey = currentStep === 0 ? 'front' : (currentStep === selfieIndex ? 'selfie' : 'back');
                        processImage(getCurrentStepData()!, stepKey as any);
                      }}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing...</>) : ('Process Document')}
                    </Button>
                    <Button variant="outline" onClick={() => { if (currentStep === 0) setFrontImage(null); else setBackImage(null); fileInputRef.current?.click(); }}>Change Image</Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              {canProceedToNext() && currentStep < steps.length - 1 && (
                <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={isLoading}>Next Step</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentFlow;


