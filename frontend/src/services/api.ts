import axios from 'axios';
import { ApiDefinition } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/postman';

interface GenerateScriptResponse {
  success: boolean;
  script: string;
}

interface GenerateCollectionResponse {
  success: boolean;
  collection: Record<string, unknown>;
}

interface AppendCollectionResponse {
  success: boolean;
  collection: Record<string, unknown>;
}

export const apiService = {
  async generateScript(apiDefinition: ApiDefinition): Promise<string> {
    try {
      const payload = {
        ...apiDefinition,
        requestBody: apiDefinition.requestBody ? JSON.parse(apiDefinition.requestBody) : undefined,
      };

      const response = await axios.post<GenerateScriptResponse>(`${API_BASE}/generate-script`, payload);
      return response.data.script;
    } catch (error) {
      throw new Error(`Failed to generate script: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async generateCollection(
    collectionName: string,
    baseUrl: string,
    apiDefinition: ApiDefinition
  ): Promise<Record<string, unknown>> {
    try {
      const payload = {
        collectionName,
        baseUrl,
        apiDefinition: {
          ...apiDefinition,
          requestBody: apiDefinition.requestBody ? JSON.parse(apiDefinition.requestBody) : undefined,
        },
      };

      const response = await axios.post<GenerateCollectionResponse>(`${API_BASE}/generate-collection`, payload);
      return response.data.collection;
    } catch (error) {
      throw new Error(
        `Failed to generate collection: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  async appendToCollection(
    collection: Record<string, unknown>,
    apiDefinition: ApiDefinition
  ): Promise<Record<string, unknown>> {
    try {
      const payload = {
        collection,
        apiDefinition: {
          ...apiDefinition,
          requestBody: apiDefinition.requestBody ? JSON.parse(apiDefinition.requestBody) : undefined,
        },
      };

      const response = await axios.post<AppendCollectionResponse>(`${API_BASE}/append-to-collection`, payload);
      return response.data.collection;
    } catch (error) {
      throw new Error(
        `Failed to append to collection: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  downloadCollection(collection: Record<string, unknown>, filename: string): void {
    const dataStr = JSON.stringify(collection, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
  },
};
