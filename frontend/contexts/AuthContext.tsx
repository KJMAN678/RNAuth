import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthStorage } from '../utils/storage';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const TOKEN_EXPIRY_MINUTES = 5;

  const generateMockToken = (): string => {
    return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateMockUser = (email: string, name?: string): User => {
    return {
      id: `user_${Date.now()}`,
      email,
      name: name || email.split('@')[0],
    };
  };

  const saveAuthData = async (userData: User, authToken: string): Promise<void> => {
    try {
      const expiryTime = Date.now() + (TOKEN_EXPIRY_MINUTES * 60 * 1000);
      await AuthStorage.setAuthData(userData, authToken, expiryTime);
    } catch (error) {
      console.error('認証データの保存に失敗:', error);
      throw error;
    }
  };

  const clearAuthData = async (): Promise<void> => {
    try {
      await AuthStorage.clearAuthData();
    } catch (error) {
      console.error('認証データの削除に失敗:', error);
    }
  };

  const initializeAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const isValid = await AuthStorage.isTokenValid();
      
      if (isValid) {
        const { token: storedToken, user: userData } = await AuthStorage.getAuthData();
        
        if (storedToken && userData) {
          setToken(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
          
          setTimeout(() => {
            logout();
          }, TOKEN_EXPIRY_MINUTES * 60 * 1000);
        } else {
          setIsAuthenticated(false);
          await clearAuthData();
        }
      } else {
        setIsAuthenticated(false);
        await clearAuthData();
      }
    } catch (error) {
      setIsAuthenticated(false);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!email || !password) {
        return false;
      }

      if (!email.includes('@')) {
        return false;
      }

      const mockUser = generateMockUser(email);
      const mockToken = generateMockToken();

      await saveAuthData(mockUser, mockToken);

      setUser(mockUser);
      setToken(mockToken);
      setIsAuthenticated(true);

      setTimeout(() => {
        logout();
      }, TOKEN_EXPIRY_MINUTES * 60 * 1000);

      return true;
    } catch (error) {
      return false;
    }
  };

  const signup = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      if (!email || !password) {
        return false;
      }

      if (!email.includes('@')) {
        return false;
      }

      if (password.length < 6) {
        return false;
      }

      const mockUser = generateMockUser(email, name);
      const mockToken = generateMockToken();

      await saveAuthData(mockUser, mockToken);

      setUser(mockUser);
      setToken(mockToken);
      setIsAuthenticated(true);

      setTimeout(() => {
        logout();
      }, TOKEN_EXPIRY_MINUTES * 60 * 1000);

      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await clearAuthData();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      if (!email || !email.includes('@')) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    signup,
    logout,
    resetPassword,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
