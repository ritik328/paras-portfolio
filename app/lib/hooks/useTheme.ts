'use client';

import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';

/**
 * Shared theme hook — single source of truth for dark/light mode.
 *
 * Reads initial value from localStorage (falling back to 'dark'),
 * syncs the `data-theme` attribute on <html>, and persists changes.
 *
 * Multiple components can call `useTheme()` independently;
 * they each get their own local state but all listen to the same
 * `storage` + custom `themechange` events so they stay in sync.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('dark');

  // Sync on mount + listen for cross-component theme changes
  useEffect(() => {
    // Read persisted value
    const saved = (localStorage.getItem('theme') as Theme) || 'dark';
    setThemeState(saved);
    document.documentElement.setAttribute('data-theme', saved);

    // Listen for custom event dispatched by setTheme below
    const handleThemeChange = (e: Event) => {
      const detail = (e as CustomEvent<Theme>).detail;
      setThemeState(detail);
    };
    window.addEventListener('themechange', handleThemeChange);

    // Also handle cross-tab sync via storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        const newTheme = e.newValue as Theme;
        setThemeState(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('themechange', handleThemeChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    // Notify other useTheme() instances in the same tab
    window.dispatchEvent(new CustomEvent('themechange', { detail: newTheme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      document.documentElement.setAttribute('data-theme', next);
      window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
      return next;
    });
  }, []);

  return { theme, setTheme, toggleTheme } as const;
}
