"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, CheckCircle, Camera, XCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFaceMatch } from "@/react-query/ocr-queries";
import { LivenessCapture } from "@/components/features/ocr/liveness-capture";
import imageCompression from 'browser-image-compression';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  data?: any;
}

export interface DocumentFlowProps {
  type: "aadhaar" | "passport" | "driving_license" | "pan_card";
  startAtStep?: number;
  onComplete?: (verificationData: any) => void;
}

const DocumentFlow: React.FC<DocumentFlowProps> = ({
  type,
  startAtStep = 0,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(startAtStep);
  // All document types have same 2-step flow
  const [steps, setSteps] = useState<VerificationStep[]>([
    {
      id: "document",
      title: getDocumentTitle(),
      description: "Upload a clear photo of your ID document",
      completed: false,
    },
    {
      id: "selfie",
      title: "Live Selfie Capture",
      description: "Capture a live photo using your camera",
      completed: false,
    },
  ]);

  function getDocumentTitle() {
    switch (type) {
      case "aadhaar":
        return "Aadhaar Card";
      case "passport":
        return "Passport";
      case "pan_card":
        return "PAN Card";
      case "driving_license":
        return "Driving License";
      default:
        return "ID Document";
    }
  }

  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    matched: boolean;
    score: number;
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const faceMatchMut = useFaceMatch();
  const isLoading = faceMatchMut.isPending;

  // Compress image to ensure it's under 1MB for AccuraScan
  const compressImage = async (file: File): Promise<string> => {
    try {
      const options = {
        maxSizeMB: 0.9, // Compress to max 900KB (under 1MB limit)
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg'
      };
      
      console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      
      const compressedFile = await imageCompression(file, options);
      
      console.log('Compressed file size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
      
      // Convert to base64
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(compressedFile);
      });
    } catch (error) {
      console.error('Compression error:', error);
      throw error;
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const loadingToast = toast.loading("Compressing image...");
    
    try {
      const compressedBase64 = await compressImage(file);
      
      // Check final size
      const sizeInMB = (compressedBase64.length * 3 / 4) / 1024 / 1024;
      console.log('Final base64 size:', sizeInMB.toFixed(2), 'MB');
      
      if (sizeInMB > 1) {
        toast.dismiss(loadingToast);
        toast.error("Image still too large after compression. Please use a smaller image.");
        return;
      }
      
      setDocumentImage(compressedBase64);
      toast.dismiss(loadingToast);
      toast.success("Image uploaded and compressed successfully");
    } catch (error) {
      console.error('Image upload error:', error);
      toast.dismiss(loadingToast);
      toast.error("Failed to process image. Please try again.");
    }
  };

  const processDocument = () => {
    // Step 1: Just store document image and move to selfie step
    if (!documentImage) return;
    
    setSteps((prev) =>
      prev.map((s, index) =>
        index === 0 ? { ...s, completed: true } : s
      )
    );
    
    setCurrentStep(1);
    toast.success("Document uploaded. Now capture your live selfie.");
  };

  const processFaceMatch = async (selfieBase64: string) => {
    // Step 2: Send BOTH images to Face Match API
    if (!documentImage) {
      toast.error("Please upload your document first");
      return;
    }

    try {
      console.log('📸 Calling Face Match API...');
      console.log('Source (selfie):', selfieBase64.substring(0, 50) + '...');
      console.log('Target (document):', documentImage.substring(0, 50) + '...');

      const response = await faceMatchMut.mutateAsync({
        liveness_image: selfieBase64,      // Live selfie with EXIF
        document_image: documentImage       // ID document photo
      });

      console.log('📥 Face Match Response:', response);

      // Extract score and matched status from response
      // Response structure: { success, matched, message, data: { score, threshold } }
      const score = response.data?.score ?? 0;
      const matched = response.matched ?? false;
      const message = response.message || 'Face match completed';

      console.log('📊 Extracted values:', { score, matched, message });

      setVerificationResult({
        matched,
        score,
        message
      });

      setSteps((prev) =>
        prev.map((s, index) =>
          index === 1 ? { ...s, completed: true, data: response.data } : s
        )
      );

      // Call onComplete if verification passed
      if (matched) {
        onComplete?.({
          documentImage,
          selfieImage: selfieBase64,
          faceMatchResult: response.data,
          verified: true
        });
      }
    } catch (error: any) {
      console.error("Face match error:", error);
      
      // Extract error details from response
      const errorData = error?.response?.data;
      const errorMsg = errorData?.message || error?.message || "Face match verification failed";
      const errorScore = errorData?.data?.score ?? 0;
      
      console.log('❌ Face Match Failed:', { errorMsg, errorScore, errorData });
      
      setVerificationResult({
        matched: false,
        score: errorScore,
        message: errorMsg
      });
    }
  };

  const handleReset = () => {
    setVerificationResult(null);
    setDocumentImage(null);
    setSelfieImage(null);
    setCurrentStep(0);
    setSteps((prev) => prev.map(s => ({ ...s, completed: false })));
  };

  // const getCurrentStepData = () => {
  //   if (currentStep === 0) return documentImage;
  //   if (currentStep === 1) return selfieImage;
  //   return null;
  // };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {type === "aadhaar"
              ? "Aadhaar Card Verification"
              : type === "passport"
              ? "Passport Verification"
              : type === "pan_card"
              ? "PAN Card Verification"
              : "Driving License Verification"}
          </CardTitle>
          <CardDescription className="text-center">
            Follow the steps to complete your document verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Verification Result Display */}
          {verificationResult && (
            <Card
              className={cn(
                'border-2',
                verificationResult.matched
                  ? 'border-green-500 bg-green-50 dark:bg-green-950'
                  : 'border-red-500 bg-red-50 dark:bg-red-950'
              )}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  {verificationResult.matched ? (
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  )}
                  <div>
                    <CardTitle
                      className={cn(
                        verificationResult.matched
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                      )}
                    >
                      {verificationResult.matched ? 'Face Match Verified ✓' : 'Face Match Failed ✗'}
                    </CardTitle>
                    <CardDescription
                      className={cn(
                        verificationResult.matched
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      )}
                    >
                      {verificationResult.message}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Match Score:</span>
                    <span
                      className={cn(
                        'text-2xl font-bold',
                        verificationResult.matched
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                      )}
                    >
                      {verificationResult.score.toFixed(2)}%
                    </span>
                  </div>

                  {/* Score bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-500',
                        verificationResult.matched
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      )}
                      style={{ width: `${Math.min(verificationResult.score, 100)}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Threshold: 55% (Scores above 55% indicate same person)
                  </p>

                  {/* Try again button */}
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full mt-4"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Start New Verification
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Only show steps if no result yet */}
          {!verificationResult && (
            <>
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex flex-col items-center space-y-2"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed
                      ? "bg-green-500 text-white"
                      : index === currentStep
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Step {currentStep + 1}: {steps[currentStep]?.title}
            </h3>
            <p className="text-muted-foreground mb-4">
              {steps[currentStep]?.description}
            </p>

            <div className="space-y-4">
              {/* Step 0: Document Upload */}
              {currentStep === 0 && (
                !documentImage ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Upload your {getDocumentTitle()}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click to select an image or drag and drop
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Choose Image
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={documentImage}
                        alt="Document preview"
                        className="w-full max-w-md mx-auto rounded-lg border"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Uploaded
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={processDocument}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        Continue to Selfie Capture
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setDocumentImage(null)}
                      >
                        Change Image
                      </Button>
                    </div>
                  </div>
                )
              )}

              {/* Step 1: Selfie Capture with LivenessCapture */}
              {currentStep === 1 && (
                !selfieImage ? (
                  <LivenessCapture
                    onCapture={(base64Image) => {
                      console.log('Selfie captured with EXIF metadata');
                      setSelfieImage(base64Image);
                    }}
                    disabled={isLoading}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={selfieImage}
                        alt="Captured selfie"
                        className="w-full max-w-md mx-auto rounded-lg border"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Captured
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => processFaceMatch(selfieImage)}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify Face Match"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelfieImage(null)}
                        disabled={isLoading}
                      >
                        Retake
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentFlow;
