import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthService, AuthResponse } from "@/services/authService";

interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Verify token with AuthService
      const decoded = await AuthService.verifyToken(token);
      if (decoded) {
        const userData = localStorage.getItem('user_data');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAdmin(parsedUser.isAdmin);
        }
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('authToken');
        localStorage.removeItem('user_data');
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user_data');
      setUser(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext.signIn called');
      const result: AuthResponse = await AuthService.login(email, password);

      console.log('Login result:', result);

      // Store auth data (backend token is already stored by AuthService)
      localStorage.setItem('authToken', result.token); // Keep for compatibility
      localStorage.setItem('user_data', JSON.stringify(result.user));

      setUser(result.user);
      setIsAdmin(result.user.isAdmin);

      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error: new Error(error.message || 'Login failed') };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      if (!fullName) {
        return { error: new Error('Full name is required') };
      }

      const result: AuthResponse = await AuthService.register(email, password, fullName);

      return { error: null };
    } catch (error: any) {
      return { error: new Error(error.message || 'Registration failed') };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAdmin(false);
  };

  const updateProfile = async (updates: Partial<User>) => {
    // For now, just return success - profile updates can be implemented later
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
