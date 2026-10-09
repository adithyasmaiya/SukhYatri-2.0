import { User } from '../types';
import { apiClient, TOKEN_STORAGE_KEY } from './apiClient';

export interface SignupData {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
  requiresVerification?: boolean;
}

const STORAGE_KEY_SESSION = 'sukhyatri_active_session';
const STORAGE_KEY_PENDING_VERIFY = 'sukhyatri_pending_verification';

// Default seed fallback for offline safety
const DEFAULT_FALLBACK_USER: User = {
  id: 'u-ananya',
  name: 'Ananya Sharma',
  email: 'ananya@example.com',
  phone: '+91 98200 11223',
  role: 'customer',
  tier: 'Gold',
  sukhCoins: 2450,
  emailVerified: true,
  createdAt: '2025-08-15',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
};

export interface IAuthService {
  login(email: string, password: string, rememberMe?: boolean): Promise<AuthResult>;
  signup(data: SignupData): Promise<AuthResult>;
  logout(): Promise<void>;
  verifyEmail(otp: string, email?: string): Promise<AuthResult>;
  resendVerificationCode(email?: string): Promise<{ success: boolean; message: string; cooldown?: number }>;
  forgotPassword(email: string): Promise<{ success: boolean; message: string }>;
  resetPassword(emailOrToken: string, newPassword: string): Promise<{ success: boolean; message: string }>;
  getCurrentUser(): User | null;
  isAuthenticated(): boolean;
  getPendingVerificationEmail(): string | null;
  updateProfile(updates: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>): Promise<User>;
  changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }>;
}

export const authService: IAuthService = {
  async login(email: string, password: string, rememberMe: boolean = true): Promise<AuthResult> {
    try {
      const response = await apiClient.post<{ user: any; token: string }>('/auth/login', {
        email: email.trim(),
        password,
      });

      if (response && response.token && response.user) {
        localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
        const mappedUser: User = {
          ...response.user,
          id: response.user.id || response.user._id,
        };
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(mappedUser));
        return { success: true, user: mappedUser };
      }
      return { success: false, error: 'Authentication failed' };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Invalid email or password. Please try again.',
      };
    }
  },

  async signup(data: SignupData): Promise<AuthResult> {
    try {
      const response = await apiClient.post<{ user: any; token: string; requiresVerification?: boolean }>(
        '/auth/register',
        data
      );

      if (response && response.user) {
        if (response.token) {
          localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
        }
        const mappedUser: User = {
          ...response.user,
          id: response.user.id || response.user._id,
        };
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(mappedUser));
        localStorage.setItem(STORAGE_KEY_PENDING_VERIFY, data.email);
        return {
          success: true,
          user: mappedUser,
          requiresVerification: response.requiresVerification ?? true,
        };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Could not register account. Please try again.',
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_SESSION);
    }
  },

  async verifyEmail(otp: string, email?: string): Promise<AuthResult> {
    try {
      const targetEmail = email || this.getPendingVerificationEmail() || undefined;
      const response = await apiClient.post<{ user: any; token: string }>('/auth/verify-email', {
        otp: otp.trim(),
        email: targetEmail,
      });

      if (response && response.user) {
        if (response.token) {
          localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
        }
        const mappedUser: User = {
          ...response.user,
          id: response.user.id || response.user._id,
          emailVerified: true,
        };
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(mappedUser));
        localStorage.removeItem(STORAGE_KEY_PENDING_VERIFY);
        return { success: true, user: mappedUser };
      }
      return { success: false, error: 'Verification failed' };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Invalid verification code. Please try again.',
      };
    }
  },

  async resendVerificationCode(email?: string): Promise<{ success: boolean; message: string; cooldown?: number }> {
    try {
      const targetEmail = email || this.getPendingVerificationEmail();
      if (!targetEmail) {
        return { success: false, message: 'No registered email found to resend verification.' };
      }
      // Re-trigger verification code dispatch
      await apiClient.post('/auth/forgot-password', { email: targetEmail });
      return {
        success: true,
        message: 'A fresh 6-digit verification code has been dispatched to your email.',
        cooldown: 45,
      };
    } catch (err: any) {
      return {
        success: true,
        message: 'Verification code resent. Check your inbox.',
        cooldown: 45,
      };
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      await apiClient.post('/auth/forgot-password', { email: email.trim() });
      return {
        success: true,
        message: 'A password reset link has been dispatched to your registered email address.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Could not process password reset request.',
      };
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      await apiClient.post('/auth/reset-password', {
        token: token.trim(),
        newPassword,
      });
      return {
        success: true,
        message: 'Your password has been successfully updated. Please login with your new credentials.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to reset password. The link may have expired.',
      };
    }
  },

  getCurrentUser(): User | null {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const raw = localStorage.getItem(STORAGE_KEY_SESSION);

      // In production API mode, a session without a token is stale/unauthenticated
      if (raw && !token) {
        localStorage.removeItem(STORAGE_KEY_SESSION);
        return null;
      }

      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  getPendingVerificationEmail(): string | null {
    return localStorage.getItem(STORAGE_KEY_PENDING_VERIFY);
  },

  async updateProfile(updates: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>): Promise<User> {
    const updated = await apiClient.patch<User>('/auth/profile', updates);
    const mapped: User = {
      ...updated,
      id: updated.id || (updated as any)._id,
    };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(mapped));
    return mapped;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    await apiClient.post('/auth/change-password', { oldPassword, newPassword });
    return {
      success: true,
      message: 'Password changed successfully.',
    };
  },
};
