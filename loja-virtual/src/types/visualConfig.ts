export interface LogoConfig {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface Banner {
  id: number;
  url: string;
  link: string;
  active: boolean;
  alt: string;
}

export interface VisualConfig {
  logo: LogoConfig;
  banners: Banner[];
}

export const fallbackVisualConfig: VisualConfig = {
  logo: {
    url: '/fallback-logo.png',
    alt: 'Default Logo',
    width: 150,
    height: 50,
  },
  banners: [
    { id: 1, url: '/fallback-banner-1.jpg', link: '#', active: true, alt: 'Fallback Banner 1' },
    { id: 2, url: '/fallback-banner-2.jpg', link: '#', active: false, alt: 'Fallback Banner 2' },
    { id: 3, url: '/fallback-banner-3.jpg', link: '#', active: true, alt: 'Fallback Banner 3' },
  ],
};
