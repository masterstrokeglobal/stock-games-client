'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
// @ts-expect-error - piexifjs doesn't have TypeScript definitions
import piexif from 'piexifjs';
import { UAParser } from 'ua-parser-js';

interface LivenessCaptureProps {
  onCapture: (base64Image: string, blob?: Blob) => void;
  disabled?: boolean;
  className?: string;
}

// Helper function to add EXIF metadata to base64 image
const addExifMetadata = (base64Image: string): string => {
  try {
    console.log('Adding EXIF metadata to image...');
    
    // Get device information using UAParser
    const parser = new UAParser();
    const result = parser.getResult();
    
    // Get device, browser, and OS info for better EXIF data
    const device = result.device || {};
    const browser = result.browser || {};
    const os = result.os || {};
    
    // Determine make and model with fallbacks
    let make = device.vendor || os.name || browser.name || 'Camera';
    let model = device.model || device.type || 'WebCamera';
    
    // If still unknown, use user agent info
    if (make === 'Unknown' || !make) {
      make = os.name || 'WebBrowser';
    }
    if (model === 'Unknown' || !model) {
      model = browser.name || 'WebCamera';
    }
    
    console.log('Device info for EXIF:', { 
      make, 
      model, 
      device, 
      os: os.name,
      browser: browser.name,
      fullUA: navigator.userAgent 
    });
    
    // Create comprehensive EXIF data
    const exifObj = {
      "0th": {
        [piexif.ImageIFD.Make]: make,
        [piexif.ImageIFD.Model]: model,
        [piexif.ImageIFD.Software]: `${browser.name || 'Browser'} ${browser.version || ''}`.trim(),
        [piexif.ImageIFD.Orientation]: 1,
      },
      "Exif": {
        [piexif.ExifIFD.DateTimeOriginal]: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        [piexif.ExifIFD.ColorSpace]: 1,
      }
    };
    
    console.log('EXIF object to be inserted:', exifObj);
    
    // Dump EXIF data to bytes
    const exifBytes = piexif.dump(exifObj);
    
    // Insert EXIF data into the base64 image
    const newBase64Image = piexif.insert(exifBytes, base64Image);
    
    // Verify EXIF was added
    try {
      const insertedExif = piexif.load(newBase64Image);
      console.log('EXIF metadata verification:', {
        hasExif: !!insertedExif,
        make: insertedExif?.['0th']?.[piexif.ImageIFD.Make],
        model: insertedExif?.['0th']?.[piexif.ImageIFD.Model],
      });
    } catch (verifyError) {
      console.warn('Could not verify EXIF metadata:', verifyError);
    }
    
    console.log('EXIF metadata added successfully');
    return newBase64Image;
  } catch (error) {
    console.error('Error adding EXIF metadata:', error);
    // Return original image if EXIF insertion fails
    return base64Image;
  }
};

export const LivenessCapture: React.FC<LivenessCaptureProps> = ({
  onCapture,
  disabled = false,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [streamReady, setStreamReady] = useState(false);

  // Start camera
  const startCamera = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    setStreamReady(false);

    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user', // Front camera
        },
        audio: false,
      });

      console.log('Camera stream received:', stream);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('Stream attached to video element');
        
        // Set camera active immediately
        setIsCameraActive(true);
        
        // Wait for video to be ready
        try {
          await videoRef.current.play();
          setStreamReady(true);
          console.log('Video playing successfully');
        } catch (playErr) {
          console.error('Play error:', playErr);
          // Try again after a short delay
          setTimeout(() => {
            videoRef.current?.play().then(() => {
              setStreamReady(true);
              console.log('Video playing after retry');
            }).catch(e => console.error('Retry play error:', e));
          }, 100);
        }
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setError(
        err.name === 'NotAllowedError'
          ? 'Camera access denied. Please allow camera permissions.'
          : 'Failed to access camera. Please check your camera settings.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
    setStreamReady(false);
  }, []);

  // Capture photo
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) return;

    setIsCapturing(true);
    
    try {
      // IMMEDIATE FRAME FREEZE: Capture the current frame to canvas immediately
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        setIsCapturing(false);
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas IMMEDIATELY (freeze the moment)
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get immediate preview for display (without EXIF)
      const immediatePreview = canvas.toDataURL('image/jpeg', 1.0);
      
      // Show the frozen frame immediately so user sees what was captured
      setCapturedImage(immediatePreview);
      
      // Stop camera immediately so video doesn't continue
      stopCamera();

      // Now process EXIF metadata in the background
      console.log('Processing EXIF metadata in background...');
      
      // Convert to blob for processing
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Photo captured:', { size: blob.size, type: blob.type });
            
            // Convert blob to base64
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64Image = reader.result as string;
              
              // Add EXIF metadata to the base64 image
              const base64WithExif = addExifMetadata(base64Image);
              
              console.log('✅ Photo with EXIF metadata ready for AccuraScan');
              
              // Update with the EXIF-embedded version (this is what will be sent to API)
              setCapturedImage(base64WithExif);
              setCapturedBlob(blob); // Keep original blob for reference
              setIsCapturing(false);
            };
            reader.readAsDataURL(blob);
          } else {
            setIsCapturing(false);
          }
        },
        'image/jpeg',
        1.0 // Maximum quality (AccuraScan is very strict)
      );
    } catch (err) {
      console.error('Error capturing photo:', err);
      setError('Failed to capture photo. Please try again.');
      setIsCapturing(false);
    }
  }, [stopCamera]);

  // Retake photo
  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setCapturedBlob(null);
    startCamera();
  }, [startCamera]);

  // Confirm and submit photo
  const confirmPhoto = useCallback(() => {
    if (capturedImage && capturedBlob) {
      onCapture(capturedImage, capturedBlob);
      setCapturedImage(null);
      setCapturedBlob(null);
    }
  }, [capturedImage, capturedBlob, onCapture]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardHeader>
        <CardTitle>Liveness Verification</CardTitle>
        <CardDescription>
          Capture a clear photo of your face for verification
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Camera view or captured image */}
        <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
          {capturedImage ? (
            // Show captured image
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              {/* Always render video element when camera is active */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={(e) => {
                  console.log('Video metadata loaded');
                  const video = e.currentTarget;
                  video.play().then(() => {
                    setStreamReady(true);
                    console.log('Video started playing from metadata event');
                  }).catch(err => console.error('Error playing video from metadata:', err));
                }}
                onCanPlay={() => {
                  console.log('Video can play');
                }}
                className={`w-full h-full object-cover scale-x-[-1] ${isCameraActive ? 'block' : 'hidden'}`}
              />
              {/* Show placeholder when camera is not active */}
              {!isCameraActive && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Camera not active
                    </p>
                  </div>
                </div>
              )}
              {/* Show loading indicator while stream is initializing */}
              {isCameraActive && !streamReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                  <div className="text-center text-white">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin mb-2" />
                    <p className="text-sm">Initializing camera...</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Hidden canvas for capturing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Overlay guide */}
          {isCameraActive && !capturedImage && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-80 border-4 border-white/50 rounded-full"></div>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!capturedImage && isCameraActive && (
          <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-600 dark:text-blue-400">
              <p className="font-medium mb-1">Instructions:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Position your face within the oval guide</li>
                <li>Ensure good lighting</li>
                <li>Look directly at the camera</li>
                <li>Remove glasses if possible</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-3">
        {!capturedImage && !isCameraActive && (
          <Button
            onClick={startCamera}
            disabled={disabled || isLoading}
            className="flex-1"
          >
            <Camera className="h-4 w-4 mr-2" />
            {isLoading ? 'Starting Camera...' : 'Start Camera'}
          </Button>
        )}

        {isCameraActive && !capturedImage && (
          <>
            <Button
              variant="destructive"
              onClick={stopCamera}
              disabled={disabled || isCapturing}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={capturePhoto} 
              disabled={disabled || isCapturing} 
              className="flex-1"
            >
              {isCapturing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Capturing...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Photo
                </>
              )}
            </Button>
          </>
        )}

        {capturedImage && (
          <>
            <Button variant="outline" onClick={retakePhoto} disabled={disabled}>
              Retake
            </Button>
            <Button onClick={confirmPhoto} disabled={disabled} className="flex-1">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm & Verify
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

