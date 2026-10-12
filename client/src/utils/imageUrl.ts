const API_ORIGIN = 'https://slapit-website.onrender.com';

export const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_ORIGIN}/${url.replace(/^\/+/, '')}`;
};