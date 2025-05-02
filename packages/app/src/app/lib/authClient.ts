'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

/**
 * User session interface
 */
export interface User {
  id: number;
  email: string;
  role: string;
}

/**
 * Auth status interface
 */
export interface AuthStatus {
  authenticated: boolean;
  user: User | null;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Login response interface
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  error?: string;
}

/**
 * A utility for client-side authentication operations
 */
export const authClient = {
  /**
   * Check the current authentication status
   * @returns Promise resolving to auth status
   */
  checkAuthStatus: async (): Promise<AuthStatus> => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return { authenticated: false, user: null };
      }

      const data = await response.json();
      return {
        authenticated: data.authenticated || false,
        user: data.user || null,
      };
    } catch (error) {
      console.error('Auth status check error:', error);
      return { authenticated: false, user: null };
    }
  },

  /**
   * Log in a user with email and password
   * @param credentials Login credentials
   * @returns Promise resolving to login response
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Login failed',
          error: data.message,
        };
      }

      return {
        success: true,
        message: data.message || 'Login successful',
        user: data.user,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Log out the current user
   * @returns Promise resolving to logout success
   */
  logout: async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },
};

/**
 * React hook to check and manage authentication status
 */
export function useAuth() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ 
    authenticated: false, 
    user: null 
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const status = await authClient.checkAuthStatus();
      setAuthStatus(status);
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthStatus({ authenticated: false, user: null });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const response = await authClient.login(credentials);
      
      if (response.success) {
        // Update auth status after successful login
        await checkAuth();
      }
      
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await authClient.logout();
      
      if (success) {
        // Reset auth status after logout
        setAuthStatus({ authenticated: false, user: null });
      }
      
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const requireAuth = useCallback((requiredRole?: string) => {
    if (isLoading) return;

    if (!authStatus.authenticated) {
      router.replace('/login');
      return;
    }

    if (requiredRole && authStatus.user?.role !== requiredRole) {
      router.replace('/dashboard');
    }
  }, [authStatus, isLoading, router]);

  return {
    isAuthenticated: authStatus.authenticated,
    user: authStatus.user,
    isLoading,
    login,
    logout,
    checkAuth,
    requireAuth
  };
}