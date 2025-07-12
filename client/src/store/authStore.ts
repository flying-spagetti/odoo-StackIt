import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, LoginCredentials, SignupData, User } from '@/types';
import { apiService } from '@/utils/apiService';

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (credentials: LoginCredentials) => {
        try {
          const response = await apiService.login(credentials);
          set({ 
            user: response.user, 
            isAuthenticated: true,
            token: response.token 
          });
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },

      signup: async (userData: SignupData) => {
        try {
          const response = await apiService.signup(userData);
          return response;
        } catch (error) {
          console.error('Signup error:', error);
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, token: null });
      },

      getToken: () => {
        return get().token;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        token: state.token
      }),
    }
  )
);

export default useAuthStore;
