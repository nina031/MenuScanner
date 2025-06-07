// app/services/api.ts
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.30:8000/api'  // Développement local
  : 'https://your-production-api.com/api';  // Production (plus tard)

export interface UploadImageResponse {
  success: boolean;
  message: string;
  data?: {
    scan_id: string;
    file_key: string;
    file_size_bytes: number;
    content_type: string;
    original_filename: string;
  };
  processing_time_seconds: number;
  timestamp: string;
}

export interface ScanMenuResponse {
  success: boolean;
  message: string;
  data?: {
    menu: {
      name?: string;
      sections: Array<{
        name: string;
        items: Array<{
          name: string;
          price: {
            value: number;
            currency: string;
          };
          description: string;
          ingredients: string[];
          dietary: string[];
        }>;
      }>;
    };
  };
  processing_time_seconds: number;
  scan_id: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  error_code?: string;
  scan_id?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Scan complet d'un menu : upload + OCR + LLM en une seule requête
   */
  async scanMenuComplete(
    imageUri: string, 
    languageHint: string = 'fr',
    cleanupTempFile: boolean = true
  ): Promise<ScanMenuResponse> {
    try {
      console.log('🔄 Scan menu complet vers backend:', this.baseUrl);
      
      // Créer le FormData avec l'image et les paramètres
      const formData = new FormData();
      
      // Ajouter l'image au FormData
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `menu_image_${Date.now()}.jpg`,
      } as any);

      // Ajouter les paramètres optionnels
      formData.append('language_hint', languageHint);
      formData.append('cleanup_temp_file', cleanupTempFile.toString());

      // Requête vers le nouvel endpoint
      const response = await fetch(`${this.baseUrl}/scan-menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }

      console.log('✅ Scan menu réussi:', data);
      return data;

    } catch (error) {
      console.error('❌ Erreur scan menu:', error);
      throw error;
    }
  }

  /**
   * Upload une image vers le backend (méthode legacy)
   */
  async uploadImage(imageUri: string): Promise<UploadImageResponse> {
    try {
      console.log('📤 Upload image vers backend:', this.baseUrl);
      
      // Créer le FormData avec l'image
      const formData = new FormData();
      
      // Ajouter l'image au FormData
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `menu_image_${Date.now()}.jpg`,
      } as any);

      // Requête vers le backend
      const response = await fetch(`${this.baseUrl}/upload-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }

      console.log('✅ Upload réussi:', data);
      return data;

    } catch (error) {
      console.error('❌ Erreur upload:', error);
      throw error;
    }
  }

  /**
   * Récupère le statut d'un scan
   */
  async getScanStatus(scanId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/status/${scanId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Erreur récupération statut:', error);
      throw error;
    }
  }

  /**
   * Vérifier la santé du backend
   */
  async healthCheck(): Promise<{ status: string; version: string; services: any }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();