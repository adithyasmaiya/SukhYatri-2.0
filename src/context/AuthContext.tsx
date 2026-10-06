import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { authService, SignupData, AuthResult } from '../services/authService';

export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmailVerified: boolean;
  userRole: UserRole | null;
  loading: boolean;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<AuthResult>;
  signup: (data: SignupData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  verifyEmail: (otp: string, email?: string) => Promise<AuthResult>;
  resendVerification: (email?: string) => Promise<{ success: boolean; message: string; cooldown?: number }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (emailOrToken: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>) => Promise<User>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  fillDemoUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return authService.getCurrentUser();
  });
  const [loading, setLoading] = useState(false);

  // Sync state if localStorage changes in other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const active = authService.getCurrentUser();
      setCurrentUser(active);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(
    async (email: string, pass: string, rememberMe: boolean = true): Promise<AuthResult> => {
      setLoading(true);
      try {
        const res = await authService.login(email, pass, rememberMe);
        if (res.success && res.user && !res.requiresVerification) {
          setCurrentUser(res.user);
        }
        return res;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signup = useCallback(async (data: SignupData): Promise<AuthResult> => {
    setLoading(true);
    try {
      const res = await authService.signup(data);
      if (res.success && res.user && !res.requiresVerification) {
        setCurrentUser(res.user);
      }
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(
    async (otp: string, email?: string): Promise<AuthResult> => {
      setLoading(true);
      try {
        const res = await authService.verifyEmail(otp, email);
        if (res.success && res.user) {
          setCurrentUser(res.user);
        }
        return res;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const resendVerification = useCallback(
    async (email?: string) => {
      return authService.resendVerificationCode(email);
    },
    []
  );

  const forgotPassword = useCallback(async (email: string) => {
    return authService.forgotPassword(email);
  }, []);

  const resetPassword = useCallback(async (emailOrToken: string, newPass: string) => {
    return authService.resetPassword(emailOrToken, newPass);
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>) => {
      const updated = await authService.updateProfile(updates);
      setCurrentUser(updated);
      return updated;
    },
    []
  );

  const changePassword = useCallback(
    async (oldPass: string, newPass: string) => {
      return authService.changePassword(oldPass, newPass);
    },
    []
  );

  const fillDemoUser = useCallback(async () => {
    const res = await authService.login('ananya@example.com', 'sukhyatri123', true);
    if (res.user) setCurrentUser(res.user);
  }, []);

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';
  const isEmailVerified = currentUser?.emailVerified ?? false;
  const userRole = currentUser?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        isEmailVerified,
        userRole,
        loading,
        login,
        signup,
        logout,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        updateProfile,
        changePassword,
        fillDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
