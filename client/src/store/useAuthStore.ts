import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  _id: string;
  name: string;
  email: string;
  onboardingNote?: string;
  fitnessScore?: number;
  hasCompletedOnboarding?: boolean;
  weight?: number;
  height?: number;
  pushups?: number;
  fitnessLevel?: string;
  activityLevel?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      fetchUser: async () => {
        try {
  
          const { default: api } = await import('@/api');
          const res = await api.get('/auth/me');
          if (res.data.success) {
             set({ user: res.data.data }); 
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
