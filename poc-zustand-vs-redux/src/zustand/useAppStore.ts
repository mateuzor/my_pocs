import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Zustand supports splitting stores into slices for large apps
// Each slice owns its own state and actions

interface ThemeSlice {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

interface NotificationSlice {
  notifications: string[];
  addNotification: (msg: string) => void;
  removeNotification: (index: number) => void;
}

type AppStore = ThemeSlice & NotificationSlice;

// devtools middleware connects the store to Redux DevTools browser extension
// You can inspect state changes, time-travel debug, and replay actions
export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      // --- Theme slice ---
      theme: 'light',
      toggleTheme: () =>
        set(
          (state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }),
          false,          // false = merge (default); true = replace entire state
          'toggleTheme'   // action name shown in Redux DevTools
        ),

      // --- Notification slice ---
      notifications: [],
      addNotification: (msg) =>
        set(
          (state) => ({ notifications: [...state.notifications, msg] }),
          false,
          'addNotification'
        ),
      removeNotification: (index) =>
        set(
          (state) => ({ notifications: state.notifications.filter((_, i) => i !== index) }),
          false,
          'removeNotification'
        ),
    }),
    { name: 'AppStore' } // name shown in Redux DevTools
  )
);
