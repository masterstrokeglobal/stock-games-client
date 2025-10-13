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
};

export type FaceMatchPayload = { liveness_image: string };

