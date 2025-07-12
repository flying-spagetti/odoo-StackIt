export const USER_ROLES = {
  GUEST: 'guest',
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const QUESTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
  },
  QUESTIONS: {
    LIST: '/api/questions',
    CREATE: '/api/questions',
    GET: (id: string) => `/api/questions/${id}`,
    UPDATE: (id: string) => `/api/questions/${id}`,
    DELETE: (id: string) => `/api/questions/${id}`,
  },
  ADMIN: {
    USERS: '/api/admin/users',
    QUESTIONS: '/api/admin/questions',
    APPROVE: (id: string) => `/api/admin/questions/${id}/approve`,
    REJECT: (id: string) => `/api/admin/questions/${id}/reject`,
  },
} as const;
