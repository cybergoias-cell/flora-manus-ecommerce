import axios from 'axios';
import { VisualConfig, fallbackVisualConfig } from '../../types/visualConfig';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const VISUAL_CONFIG_ENDPOINT = '/api/configuracoes-visuais';

/**
 * Fetches the visual configuration from the API.
 * Uses the fallback config if the API call fails.
 * @returns {Promise<VisualConfig>} The visual configuration.
 */
export async function getVisualConfig(): Promise<VisualConfig> {
  const url = `${API_BASE_URL}${VISUAL_CONFIG_ENDPOINT}`;
  console.log(`Attempting to fetch visual config from: ${url}`);

  try {
    const response = await axios.get<VisualConfig>(url, {
      // Optional: Add a timeout to prevent hanging
      timeout: 5000,
    });

    // Basic validation to ensure the response has the expected structure
    if (response.data && response.data.logo && response.data.banners) {
      console.log('Visual config fetched successfully from API.');
      return response.data;
    } else {
      console.warn('API response structure is invalid. Falling back to local config.');
      return fallbackVisualConfig;
    }
  } catch (error) {
    console.error('Error fetching visual config from API. Falling back to local config.', error);
    // Hard Constraint: If API fails, fall back to local config
    return fallbackVisualConfig;
  }
}
