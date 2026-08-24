'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('vldd-theme');
      if (stored === 'dark' || stored === 'light') {
        setTheme(stored);
        document.documentElement.setAttribute('data-theme', stored);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initial = prefersDark ? 'dark' : 'light';
        setTheme(initial);
      }
    } catch {
      // Ignore localStorage access errors
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      localStorage.setItem('vldd-theme', next);
      document.documentElement.setAttribute('data-theme', next);
    } catch {
      // Ignore localStorage access errors
    }
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Theme badlo"
        className="w-[40px] h-[40px] rounded-[10px]"
      >
        <span className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Dark theme chuno' : 'Light theme chuno'}
      className="w-[40px] h-[40px] rounded-[10px]"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-ink-2" />
      ) : (
        <Sun className="h-5 w-5 text-accent" />
      )}
    </Button>
  );
}
