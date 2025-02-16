// API base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Types for authentication
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
}

const isBrowser = typeof window !== 'undefined';

// Mock data for login mock. Will use demo = true for demo mode.
const MOCK_AUTH_RESPONSE: AuthResponse = {
  accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTczOTY3ODg1NiwiZXhwIjoxNzM5NzY1MjU2fQ.yVhX8HBZVVvRCL8pQjZ3rcxWX5xeEO5N_fqj-11zzc7TOGXo_TsTmn6kENlPw81u2SIAuRDhw2cm9HdO9pSFBw",
  tokenType: "Bearer"
};

// Authentication API utilities
export const authApi = {
  // Login function
  login: async (credentials: LoginRequest, demo: boolean = true): Promise<AuthResponse> => {
    if (demo) {
      // Return mock data for demo mode
      return Promise.resolve(MOCK_AUTH_RESPONSE);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register function
  register: async (userData: RegisterRequest): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Utility function to store token
  setToken: (token: string) => {
    if (isBrowser) {
      localStorage.setItem('accessToken', token);
    }
  },

  // Utility function to get token
  getToken: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem('accessToken');
  },

  // Utility function to remove token
  removeToken: () => {
    if (isBrowser) {
      localStorage.removeItem('accessToken');
    }
  },

  // Utility function to check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch (e) {
      return true;
    }
  },

  // Utility function to check if user is authenticated
  isAuthenticated: (): boolean => {
    if (!isBrowser) return false;
    
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    // Check if token is expired
    if (authApi.isTokenExpired(token)) {
      authApi.removeToken();
      return false;
    }
    
    return true;
  }
}; 