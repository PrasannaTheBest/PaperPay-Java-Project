import { create } from 'zustand';

interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
}

interface AuthStore {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  login: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pp_token', token);
      localStorage.setItem('pp_user', JSON.stringify(user));
      // Also set cookie for Next.js middleware
      document.cookie = `pp_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    }
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pp_token');
      localStorage.removeItem('pp_user');
      document.cookie = 'pp_token=; path=/; max-age=0';
    }
    set({ token: null, user: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('pp_token');
      const userStr = localStorage.getItem('pp_user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ token, user, isAuthenticated: true });
        } catch {
          localStorage.removeItem('pp_token');
          localStorage.removeItem('pp_user');
        }
      }
    }
  },
}));
