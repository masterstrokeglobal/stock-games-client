import axios from 'axios';

export interface OCRResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface VerificationData {
  documentType: 'aadhaar' | 'passport';
  frontData?: any;
  backData?: any;
  verified: boolean;
  verifiedAt: string;
}

class OCRService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || '';

  async processAadhaarFront(imageData: string): Promise<OCRResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/ocr/aadhaar/front`, {
        imageData,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Front side processing failed',
      };
    }
  }

  async processAadhaarBack(imageData: string): Promise<OCRResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/ocr/aadhaar/back`, {
        imageData,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Back side processing failed',
      };
    }
  }

  async processPassport(imageData: string): Promise<OCRResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/ocr/passport`, {
        imageData,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Passport processing failed',
      };
    }
  }

  async completeVerification(data: {
    documentType: 'aadhaar' | 'passport';
    frontData?: any;
    backData?: any;
  }): Promise<OCRResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/ocr/complete`, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Verification completion failed',
      };
    }
  }
}

export const ocrService = new OCRService();
