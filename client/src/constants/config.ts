export const CONFIG = {
  USE_MOCK_API: true, // Set to false when real API is ready
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  MOCK_DELAY: 800, // Simulate network delay in ms
} as const;
