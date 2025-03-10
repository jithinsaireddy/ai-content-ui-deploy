// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
  },
  trends: {
    getAll: `${API_BASE_URL}/trends`,
    getByCategory: (category: string) => `${API_BASE_URL}/trends/category/${encodeURIComponent(category)}`,
  },
  localization: {
    localize: `${API_BASE_URL}/v1/localization/localize`,
  },
  content: {
    generate: `${API_BASE_URL}/content/generate`,
  },
};

// Types for authentication
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  industry: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
}

// Mock data for login mock. Will use demo = true for demo mode.
const MOCK_AUTH_RESPONSE: AuthResponse = {
  accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTczOTY3ODg1NiwiZXhwIjoxNzM5NzY1MjU2fQ.yVhX8HBZVVvRCL8pQjZ3rcxWX5xeEO5N_fqj-11zzc7TOGXo_TsTmn6kENlPw81u2SIAuRDhw2cm9HdO9pSFBw",
  tokenType: "Bearer"
};

const IS_DEMO = false;

// Utility function for fetch with CORS handling
export const fetchWithCors = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    console.log('Making fetch request to:', url);
    console.log('Request headers:', mergedOptions.headers);
    
    const response = await fetch(url, mergedOptions);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // For non-ok responses, try to get error details
    if (!response.ok) {
      const errorBody = await response.text();
      console.log('Error response body:', errorBody);
      
      try {
        // Try to parse as JSON
        const errorJson = JSON.parse(errorBody);
        console.log('Parsed error:', errorJson);
      } catch (e) {
        console.log('Error body is not JSON');
      }
    }
    
    return response;
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
};

// Authentication API utilities
export const authApi = {
  // Login function
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    if (IS_DEMO) {
      console.log("Using mock auth response");
      return Promise.resolve(MOCK_AUTH_RESPONSE);
    }

    try {
      console.log('Attempting login...');
      const response = await fetchWithCors(`${API_ENDPOINTS.auth.login}`, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Login failed with response:', errorText);
        throw new Error(errorText || 'Login failed');
      }

      const authResponse = await response.json();
      console.log('Login response:', {
        ...authResponse,
        accessToken: authResponse.accessToken ? `${authResponse.accessToken.substring(0, 20)}...` : 'missing'
      });

      // Validate response format
      if (!authResponse.accessToken) {
        throw new Error('Invalid login response: missing access token');
      }

      return authResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register function
  register: async (userData: RegisterRequest): Promise<void> => {
    try {
      const response = await fetchWithCors(`${API_ENDPOINTS.auth.register}`, {
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
    try {
      if (!token) {
        console.error('Attempted to store null/empty token');
        return;
      }

      // Remove any existing Bearer prefix
      const jwt = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

      // Validate JWT format
      if (!jwt.includes('.') || jwt.split('.').length !== 3) {
        console.error('Invalid JWT format');
        throw new Error('Invalid token format');
      }

      // Store with Bearer prefix
      const fullToken = `Bearer ${jwt}`;
      console.log('Storing token:', fullToken.substring(0, 20) + '...');
      localStorage.setItem('accessToken', fullToken);
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  },

  // Utility function to get token
  getToken: (): string | null => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('No token found in storage');
        return null;
      }

      // Validate token format
      const parts = token.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        console.error('Invalid token format in storage');
        authApi.removeToken(); // Clean up invalid token
        return null;
      }

      const jwt = parts[1];
      if (!jwt.includes('.') || jwt.split('.').length !== 3) {
        console.error('Invalid JWT format in storage');
        authApi.removeToken(); // Clean up invalid token
        return null;
      }

      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  // Utility function to remove token
  removeToken: () => {
    localStorage.removeItem('accessToken');
  },

  // Utility function to check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      console.log('Checking token expiration...');
      
      // Remove Bearer prefix if present
      const jwt = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
      console.log('Checking JWT:', jwt.substring(0, 20) + '...');
      
      const [header, payload, signature] = jwt.split('.');
      if (!header || !payload || !signature) {
        console.log('Invalid token format');
        return true;
      }

      const decodedPayload = JSON.parse(atob(payload));
      console.log('Token payload:', decodedPayload);
      
      if (!decodedPayload.exp) {
        console.log('No expiration in token');
        return false; // If no expiration, consider it valid
      }

      const expiry = decodedPayload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      console.log('Token expires:', new Date(expiry));
      console.log('Current time:', new Date(now));
      return now >= expiry;
    } catch (e) {
      console.error('Error checking token expiration:', e);
      return true;
    }
  },

  // Utility function to check if user is authenticated
  isAuthenticated: (): boolean => {
    try {
      const token = authApi.getToken(); // Use getToken to get validated token
      console.log('Checking authentication - Token exists:', !!token);
      
      if (!token) {
        console.log('No valid token found');
        return false;
      }
      
      // Extract JWT for expiration check
      const jwt = token.split(' ')[1];
      
      // Check if token is expired
      if (!IS_DEMO && authApi.isTokenExpired(jwt)) {
        console.log('Token expired, removing...');
        authApi.removeToken();
        return false;
      }
      
      console.log('Token is valid and not expired');
      return true;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }
}; 