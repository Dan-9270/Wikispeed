const sanitizeBase = (value: string, fallback: string): string => {
  const base = (value || fallback).trim();
  return base.endsWith('/') ? base.slice(0, -1) : base;
};

const apiBase = sanitizeBase(import.meta.env.VITE_API_BASE_URL || '', '/api');
const solverBase = sanitizeBase(import.meta.env.VITE_SOLVER_BASE_URL || '', '/solver');

export const apiUrl = (path: string): string => `${apiBase}${path.startsWith('/') ? path : `/${path}`}`;
export const solverUrl = (path: string): string => `${solverBase}${path.startsWith('/') ? path : `/${path}`}`;

export const wsUrl = (): string => {
  const configuredWs = import.meta.env.VITE_WS_URL;
  if (configuredWs && configuredWs.length > 0) {
    return configuredWs;
  }

  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    return `${protocol}://${window.location.host}/ws`;
  }

  return 'ws://localhost:2025';
};
