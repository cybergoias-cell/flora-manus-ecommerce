import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API = axios.create({
  baseURL: `${API_BASE}/api`,
});

export interface Banner {
  id: number;
  url: string;
  alt: string;
  title: string;
  subtitle: string;
  link: string;
  active: boolean;
}

export interface VisualConfig {
  logo: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  banners: {
    enabled: boolean;
    autoplay: boolean;
    interval: number;
    items: Banner[];
  };
}

// Mock data structure for initial development
const MOCK_CONFIG: VisualConfig = {
  logo: {
    url: 'https://via.placeholder.com/150x50.png?text=Logo',
    alt: 'Logo da Loja',
    width: 150,
    height: 50,
  },
  banners: {
    enabled: true,
    autoplay: true,
    interval: 5000,
    items: [
      {
        id: 1,
        url: 'https://via.placeholder.com/1920x600.png?text=Banner+1',
        alt: 'Banner de Promoção',
        title: 'Super Promoção',
        subtitle: 'Até 50% de desconto',
        link: '/promocao',
        active: true,
      },
      {
        id: 2,
        url: 'https://via.placeholder.com/1920x600.png?text=Banner+2',
        alt: 'Nova Coleção',
        title: 'Chegou a Nova Coleção',
        subtitle: 'Confira as novidades',
        link: '/colecao',
        active: false,
      },
    ],
  },
};

export async function getVisualConfig(): Promise<VisualConfig> {
  try {
    const response = await API.get<VisualConfig>('/configuracoes-visuais');
    return response.data;
  } catch (error) {
    // Fallback to mock data if API fails during development/testing
    console.error('Failed to fetch visual config, using mock data:', error);
    return MOCK_CONFIG;
  }
}

export async function updateVisualConfig(config: VisualConfig): Promise<void> {
  // Simple validation before sending
  if (config.logo.width <= 0 || config.logo.height <= 0) {
    throw new Error('Width and Height must be greater than 0.');
  }
  if (config.banners.interval <= 0) {
    throw new Error('Interval must be greater than 0.');
  }

  // Remove mock IDs from new banners before sending
  const payload = {
    ...config,
    banners: {
      ...config.banners,
      items: config.banners.items.map(item => ({
        ...item,
        id: item.id < 10000 ? undefined : item.id, // Assume IDs < 10000 are mock/new
      })),
    }
  };

  await API.put('/configuracoes-visuais', payload);
}

