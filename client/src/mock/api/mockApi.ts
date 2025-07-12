import { CONFIG } from '@/constants/config';
import { LoginCredentials, SignupData, User, Question, Answer } from '@/types';

// Import mock data
import usersData from '../data/users.json';
import questionsData from '../data/questions.json';
import answersData from '../data/answers.json';
import tagsData from '../data/tags.json';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiService {
  private users = usersData;
  private questions = questionsData;
  private answers = answersData;
  private tags = tagsData;

  async login(credentials: LoginCredentials) {
    await delay(CONFIG.MOCK_DELAY);
    
    const user = this.users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as User,
      token: `mock_token_${user.userId}_${Date.now()}`
    };
  }

  async signup(userData: SignupData) {
    await delay(CONFIG.MOCK_DELAY);
    
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      return {
        statusCode: 400,
        message: 'User with this email already exists'
      };
    }
    
    // Simulate successful signup
    return {
      statusCode: 201,
      message: 'Account created successfully! Please login to continue.'
    };
  }

  async getQuestions(status?: string, page = 1, limit = 10) {
    await delay(CONFIG.MOCK_DELAY);
    
    let filteredQuestions = this.questions;
    
    if (status) {
      filteredQuestions = this.questions.filter(q => q.status === status);
    } else {
      // For public view, only show approved questions
      filteredQuestions = this.questions.filter(q => q.status === 'approved');
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);
    
    return {
      questions: paginatedQuestions,
      total: filteredQuestions.length,
      page,
      limit,
      totalPages: Math.ceil(filteredQuestions.length / limit)
    };
  }

  async getQuestion(id: string) {
    await delay(CONFIG.MOCK_DELAY);
    
    const question = this.questions.find(q => q.id === id);
    if (!question) {
      throw new Error('Question not found');
    }
    
    const questionAnswers = this.answers.filter(a => a.questionId === id);
    
    return {
      ...question,
      answers: questionAnswers
    };
  }

  async createQuestion(questionData: any, userId: string) {
    await delay(CONFIG.MOCK_DELAY);
    
    const user = this.users.find(u => u.userId === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const newQuestion = {
      id: `q_${Date.now()}`,
      ...questionData,
      authorId: userId,
      authorName: user.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      votes: 0
    };
    
    return newQuestion;
  }

  async approveQuestion(questionId: string, adminId: string) {
    await delay(CONFIG.MOCK_DELAY);
    
    const questionIndex = this.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) {
      throw new Error('Question not found');
    }
    
    this.questions[questionIndex] = {
      ...this.questions[questionIndex],
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: adminId,
      updatedAt: new Date().toISOString()
    };
    
    return this.questions[questionIndex];
  }

  async rejectQuestion(questionId: string, adminId: string, reason: string) {
    await delay(CONFIG.MOCK_DELAY);
    
    const questionIndex = this.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) {
      throw new Error('Question not found');
    }
    
    this.questions[questionIndex] = {
      ...this.questions[questionIndex],
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: adminId,
      rejectionReason: reason,
      updatedAt: new Date().toISOString()
    };
    
    return this.questions[questionIndex];
  }

  async getUsers(page = 1, limit = 10) {
    await delay(CONFIG.MOCK_DELAY);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = this.users.slice(startIndex, endIndex);
    
    // Remove passwords from response
    const usersWithoutPasswords = paginatedUsers.map(({ password, ...user }) => user);
    
    return {
      users: usersWithoutPasswords,
      total: this.users.length,
      page,
      limit,
      totalPages: Math.ceil(this.users.length / limit)
    };
  }

  async getTags() {
    await delay(CONFIG.MOCK_DELAY);
    return this.tags;
  }

  async searchQuestions(query: string, tags?: string[]) {
    await delay(CONFIG.MOCK_DELAY);
    
    let filteredQuestions = this.questions.filter(q => q.status === 'approved');
    
    if (query) {
      filteredQuestions = filteredQuestions.filter(q => 
        q.title.toLowerCase().includes(query.toLowerCase()) ||
        q.content.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (tags && tags.length > 0) {
      filteredQuestions = filteredQuestions.filter(q =>
        tags.some(tag => q.tags.includes(tag))
      );
    }
    
    return filteredQuestions;
  }
}

export const mockApi = new MockApiService();
