const isLocalHost = (hostname: string) =>
  hostname === 'localhost' || hostname === '127.0.0.1';

const getApiOrigin = () => {
  const configuredApiUrl = import.meta.env.VITE_API_URL;

  if (configuredApiUrl) {
    try {
      const configuredUrl = new URL(configuredApiUrl, window.location.origin);
      if (!isLocalHost(configuredUrl.hostname)) return configuredUrl.origin;
    } catch {
      // Fall back to the environment-specific API host for relative API URLs.
    }
  }

  return import.meta.env.DEV
    ? 'http://localhost:5001'
    : 'https://slapit-website.onrender.com';
};

const API_ORIGIN = getApiOrigin();

export const getImageUrl = (url: string) => {
  if (!url || url.startsWith('data:')) return url;

  try {
    const imageUrl = new URL(url, API_ORIGIN);
    if (isLocalHost(imageUrl.hostname)) {
      return `${API_ORIGIN}${imageUrl.pathname}${imageUrl.search}${imageUrl.hash}`;
    }
    return imageUrl.href;
  } catch {
    return `${API_ORIGIN}/${url.replace(/^\/+/, '')}`;
  }
};
