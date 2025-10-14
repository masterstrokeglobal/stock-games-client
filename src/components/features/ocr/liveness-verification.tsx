'use client';

import React, { useState } from 'react';
import { LivenessCapture } from './liveness-capture';
import { useVerifyLiveness } from '@/react-query/ocr-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LivenessVerificationProps {
  onSuccess?: (score: number) => void;
  onFailure?: (score: number) => void;
  className?: string;
}

export const LivenessVerification: React.FC<LivenessVerificationProps> = ({
  onSuccess,
  onFailure,
  className,
}) => {
  const [verificationResult, setVerificationResult] = useState<{
    live: boolean;
    score: number;
    message: string;
    bypassed?: boolean;
  } | null>(null);

  const { mutate: verifyLiveness, isPending } = useVerifyLiveness();

  const handleCapture = (base64Image: string, blob?: Blob) => {
    // IMPORTANT: Send the base64 image with EXIF metadata embedded
    // Do NOT send the blob as it will lose EXIF metadata when converted back to base64
    const imageToSend = base64Image;
    
    console.log('Sending liveness verification with EXIF metadata...', {
      hasBlob: !!blob,
      imageType: typeof imageToSend,
      base64Length: base64Image.length,
      blobSize: blob ? `${(blob.size / 1024).toFixed(2)} KB` : 'N/A',
      usingEXIFEmbeddedBase64: true
    });

    verifyLiveness(
      { liveness_image: imageToSend },
      {
        onSuccess: (response) => {
          setVerificationResult({
            live: response.live,
            score: response.score,
            message: response.message,
            bypassed: response.bypassed,
          });

          if (response.live) {
            const bypassMsg = response.bypassed ? ' (Development Mode - Bypassed)' : '';
            toast.success(`Liveness verified! Score: ${response.score}%${bypassMsg}`);
            onSuccess?.(response.score);
          } else {
            toast.error(`Verification failed. Score: ${response.score}%`);
            onFailure?.(response.score);
          }
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || error?.message || 'Verification failed';
          setVerificationResult({
            live: false,
            score: 0,
            message: errorMessage,
          });
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleReset = () => {
    setVerificationResult(null);
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto space-y-6', className)}>
      {/* Verification Status */}
      {verificationResult && (
        <Card
          className={cn(
            'border-2',
            verificationResult.live
              ? 'border-green-500 bg-green-50 dark:bg-green-950'
              : 'border-red-500 bg-red-50 dark:bg-red-950'
          )}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              {verificationResult.live ? (
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              )}
              <div>
                <CardTitle
                  className={cn(
                    verificationResult.live
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-red-700 dark:text-red-300'
                  )}
                >
                  {verificationResult.live ? 'Verification Passed' : 'Verification Failed'}
                </CardTitle>
                <CardDescription
                  className={cn(
                    verificationResult.live
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
                <span className="text-sm font-medium">Liveness Score:</span>
                <span
                  className={cn(
                    'text-2xl font-bold',
                    verificationResult.live
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-red-700 dark:text-red-300'
                  )}
                >
                  {verificationResult.score}%
                </span>
              </div>

              {/* Score bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-500',
                    verificationResult.live
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  )}
                  style={{ width: `${Math.min(verificationResult.score, 100)}%` }}
                />
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400">
                Threshold: 55% (Scores above 55% are considered live)
              </p>

              {/* Development mode indicator */}
              {verificationResult.bypassed && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    ⚠️ <strong>Development Mode:</strong> Liveness check bypassed for web browser testing.
                    Real AccuraScan verification will be used in production.
                  </p>
                </div>
              )}

              {/* Try again button */}
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full mt-4"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera capture component */}
      {!verificationResult && (
        <>
          {isPending && (
            <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Verifying liveness...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <LivenessCapture onCapture={handleCapture} disabled={isPending} />
        </>
      )}
    </div>
  );
};

