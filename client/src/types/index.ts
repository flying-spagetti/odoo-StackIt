export interface User {
  userId: string;
  email: string;
  name: string;
  role: 'guest' | 'user' | 'admin';
}

export interface LoginResponse {
  user: User;
  token?: string;
}

export interface SignupResponse {
  statusCode: number;
  message: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  authorName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  answers?: Answer[];
  views?: number;
  votes?: number;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

export interface Answer {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  questionId: string;
  createdAt: string;
  updatedAt: string;
  votes?: number;
  isAccepted?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (userData: SignupData) => Promise<SignupResponse>;
  logout: () => void;
  getToken: () => string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface Tag {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  color?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
