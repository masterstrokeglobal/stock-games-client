import api from "./instance";

export const ocrAPI = {
  aadhaarFront: async (imageData: string) => {
    const res = await api.post(`/ocr/aadhaar/front`, { imageData });
    return res.data;
  },
  aadhaarBack: async (imageData: string) => {
    const res = await api.post(`/ocr/aadhaar/back`, { imageData });
    return res.data;
  },
  passport: async (passportImage: string) => {
    const res = await api.post(`/ocr/passport`, { passport_image: passportImage });
    return res.data;
  },
  panCard: async (panImage: string) => {
    const res = await api.post(`/ocr/pan-card`, { pan_image: panImage });
    return res.data;
  },
  drivingLicense: async (licenseImage: string) => {
    const res = await api.post(`/ocr/driving-license`, { license_image: licenseImage });
    return res.data;
  },
  faceMatch: async (payload: { liveness_image: string }) => {
    const res = await api.post(`/ocr/face-match`, payload);
    return res.data;
  },
  status: async () => {
    const res = await api.get(`/ocr/status`);
    return res.data;
  },
  startOver: async () => {
    const res = await api.post(`/ocr/start-over`);
    return res.data;
  },
  cont: async () => {
    const res = await api.post(`/ocr/continue`);
    return res.data;
  },
  verifyLiveness: async (payload: { liveness_image: string | Blob }) => {
    // Convert blob to base64 if needed, backend expects JSON with base64 string
    if (typeof payload.liveness_image === 'string') {
      // Already base64 or URL
      const requestPayload = { 
        liveness_image: payload.liveness_image,
        // bypass_for_web: true // Disabled - Testing real AccuraScan API
      };
      console.log('Sending liveness (string):', payload.liveness_image.substring(0, 50) + '...');
      console.log('Full request payload:', { 
        has_liveness_image: !!requestPayload.liveness_image,
        image_type: typeof requestPayload.liveness_image
      });
      const res = await api.post(`/ocr/verify-liveness`, requestPayload);
      console.log('🔍 Response from backend:', res.data);
      return res.data;
    } else {
      // Convert blob to base64
      const blobImage = payload.liveness_image as Blob;
      console.log('Converting blob to base64...', { size: blobImage.size, type: blobImage.type });
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blobImage);
      });
      
      const requestPayload = { 
        liveness_image: base64,
        // bypass_for_web: true // Disabled - Testing real AccuraScan API
      };
      console.log('Sending liveness (base64 from blob):', base64.substring(0, 50) + '...');
      console.log('Full request payload:', { 
        has_liveness_image: !!requestPayload.liveness_image,
        image_length: base64.length,
        starts_with: base64.substring(0, 30)
      });
      const res = await api.post(`/ocr/verify-liveness`, requestPayload);
      console.log('🔍 Full Response from backend:', JSON.stringify(res.data, null, 2));
      return res.data;
    }
  },
};

export type FaceMatchPayload = { 
  liveness_image: string;
  document_image?: string; // Optional - for standalone mode
};

export type LivenessVerificationPayload = { liveness_image: string | Blob };

export type LivenessVerificationResponse = {
  success: boolean;
  live: boolean;
  score: number;
  message: string;
  bypassed?: boolean; // True when using web browser bypass in development
};

