export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getWebSocketUrl = (path: string) => {
  const url = new URL(API_BASE_URL);
  const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${url.host}${path}`;
};
