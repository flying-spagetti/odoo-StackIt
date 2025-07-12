import { CONFIG } from '@/constants/config';
import { mockApi } from '@/mock/api/mockApi';
import { LoginCredentials, SignupData } from '@/types';

class ApiService {
  private baseUrl = CONFIG.API_BASE_URL;

  async login(credentials: LoginCredentials) {
    if (CONFIG.USE_MOCK_API) {
      return mockApi.login(credentials);
    }
    
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  }

  async signup(userData: SignupData) {
    if (CONFIG.USE_MOCK_API) {
      return mockApi.signup(userData);
    }
    
    const response = await fetch(`${this.baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    return response.json();
  }

  async getQuestions(status?: string, page = 1, limit = 10) {
    if (CONFIG.USE_MOCK_API) {
      return mockApi.getQuestions(status, page, limit);
    }
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status })
    });
    
    const response = await fetch(`${this.baseUrl}/questions?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    
    return response.json();
  }

  async getQuestion(id: string) {
    if (CONFIG.USE_MOCK_API) {
      return mockApi.getQuestion(id);
    }
    
    const response = await fetch(`${this.baseUrl}/questions/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch question');
    }
    
    return response.json();
  }

  async createQuestion(questionData: any, token: string) {
    if (CONFIG.USE_MOCK_API) {
      // Extract user ID from mock token
      const userId = token.split('_')[2];
      return mockApi.createQuestion(questionData, userId);
    }
    
    const response = await fetch(`${this.baseUrl}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(questionData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create question');
    }
    
    return response.json();
  }

  async approveQuestion(questionId: string, token: string) {
    if (CONFIG.USE_MOCK_API) {
      const adminId = token.split('_')[2];
      return mockApi.approveQuestion(questionId, adminId);
    }
    
    const response = await fetch(`${this.baseUrl}/admin/questions/${questionId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to approve question');
    }
    
    return response.json();
  }

  async rejectQuestion(questionId: string, reason: string, token: string) {
    if (CONFIG.USE_MOCK_API) {
      const adminId = token.split('_')[2];
      return mockApi.rejectQuestion(questionId, adminId, reason);
    }
    
    const response = await fetch(`${this.baseUrl}/admin/questions/${questionId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reason }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to reject question');
    }
    
    return response.json();
  }

  async getUsers(page = 1, limit = 10, token: string) {
    if (CONFIG.USE_MOCK_API) {
      return mockApi.getUsers(page, limit);
    }
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    const response = await fetch(`${this.baseUrl}/admin/users?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return response.json();
  }

  async getTags() {
    if (CONFIG.USE_MOCK_API) {
      return mockApi.getTags();
    }
    
    const response = await fetch(`${this.baseUrl}/tags`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }
    
    return response.json();
  }

  async searchQuestions(query: string, tags?: string[]) {
    if (CONFIG.USE_MOCK_API) {
      return mockApi.searchQuestions(query, tags);
    }
    
    const params = new URLSearchParams({
      q: query,
      ...(tags && tags.length > 0 && { tags: tags.join(',') })
    });
    
    const response = await fetch(`${this.baseUrl}/search?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to search questions');
    }
    
    return response.json();
  }
}

export const apiService = new ApiService();
