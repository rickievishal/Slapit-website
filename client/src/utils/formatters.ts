export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const truncate = (text: string, length = 80): string => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};
