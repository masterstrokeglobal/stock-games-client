import { useMutation, useQuery } from "@tanstack/react-query";
import { ocrAPI, FaceMatchPayload } from "@/lib/axios/ocr-API";
import { toast } from "sonner";

export const useAadhaarFrontOCR = () => {
  return useMutation({
    mutationFn: (imageData: string) => ocrAPI.aadhaarFront(imageData),
    onSuccess: () => {
      toast.success("Aadhaar front processed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Failed to process Aadhaar front");
    },
  });
};

export const useAadhaarBackOCR = () => {
  return useMutation({
    mutationFn: (imageData: string) => ocrAPI.aadhaarBack(imageData),
    onSuccess: () => {
      toast.success("Aadhaar back processed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Failed to process Aadhaar back");
    },
  });
};

export const usePassportOCR = () => {
  return useMutation({
    mutationFn: (imageData: string) => ocrAPI.passport(imageData),
    onSuccess: () => {
      toast.success("Passport processed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Failed to process Passport");
    },
  });
};

export const useDrivingLicenseOCR = () => {
  return useMutation({
    mutationFn: (imageData: string) => ocrAPI.drivingLicense(imageData),
    onSuccess: () => {
      toast.success("Driving License processed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Failed to process Driving License");
    },
  });
};

export const usePanCardOCR = () => {
  return useMutation({
    mutationFn: (imageData: string) => ocrAPI.panCard(imageData),
    onSuccess: () => {
      toast.success("PAN Card processed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Failed to process PAN Card");
    },
  });
};

export const useFaceMatch = () => {
  return useMutation({
    mutationFn: (payload: FaceMatchPayload) => ocrAPI.faceMatch(payload),
    onSuccess: () => {
      toast.success("Face matched successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Face match failed");
    },
  });
};

export const useVerificationStatus = () => {
  return useQuery({
    queryKey: ["verification-status"],
    queryFn: () => ocrAPI.status(),
    staleTime: 30_000,
  });
};

export const useStartOverVerification = () => {
  return useMutation({
    mutationFn: () => ocrAPI.startOver(),
    onSuccess: () => toast.success("Verification reset"),
    onError: (error: any) => toast.error(error?.response?.data?.message || error?.message || "Failed to reset verification"),
  });
};

export const useContinueVerification = () => {
  return useMutation({
    mutationFn: () => ocrAPI.cont(),
  });
};


