'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User } from '@/lib/db/types';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramContextType {
  telegramUser: TelegramUser | null;
  dbUser: User | null;
  isReady: boolean;
  isLoading: boolean;
  isInTelegram: boolean;
  error: string | null;
  webApp: any;
  refreshUser: () => Promise<void>;
}

const TelegramContext = createContext<TelegramContextType>({
  telegramUser: null,
  dbUser: null,
  isReady: false,
  isLoading: true,
  isInTelegram: false,
  error: null,
  webApp: null,
  refreshUser: async () => {},
});

export const useTelegram = () => useContext(TelegramContext);

interface TelegramProviderProps {
  children: ReactNode;
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [webApp, setWebApp] = useState<any>(null);

  const syncUserToDatabase = useCallback(async (tgUser: TelegramUser) => {
    try {
      const fullName = tgUser.last_name 
        ? `${tgUser.first_name} ${tgUser.last_name}` 
        : tgUser.first_name;

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_id: tgUser.id,
          name: fullName,
          photo_url: tgUser.photo_url || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync user to database');
      }

      const user = await response.json();
      setDbUser(user);
      return user;
    } catch (err) {
      console.error('Error syncing user:', err);
      setError('Failed to sync user data');
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!telegramUser) return;
    
    try {
      const response = await fetch(`/api/users?telegram_id=${telegramUser.id}`);
      if (response.ok) {
        const user = await response.json();
        setDbUser(user);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  }, [telegramUser]);

  useEffect(() => {
    const initTelegram = async () => {
      setIsLoading(true);
      
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        
        tg.ready();
        tg.expand();
        
        if (tg.themeParams) {
          document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
          document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
          document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999');
          document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#3390ec');
          document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#3390ec');
          document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
          document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#f1f1f1');
        }
        
        setWebApp(tg);
        setIsInTelegram(true);
        
        if (tg.initDataUnsafe?.user) {
          const tgUser = tg.initDataUnsafe.user;
          setTelegramUser(tgUser);
          await syncUserToDatabase(tgUser);
        } else {
          setError('No Telegram user data available');
        }
        
        setIsReady(true);
        setIsLoading(false);
      } else {
        setIsInTelegram(false);
        setIsReady(true);
        setIsLoading(false);
        
        if (process.env.NODE_ENV === 'development') {
          const devUser: TelegramUser = {
            id: 123456789,
            first_name: 'Dev',
            last_name: 'User',
            username: 'devuser',
          };
          setTelegramUser(devUser);
          await syncUserToDatabase(devUser);
        }
      }
    };

    if (typeof window !== 'undefined') {
      if ((window as any).Telegram?.WebApp) {
        initTelegram();
      } else {
        const interval = setInterval(() => {
          if ((window as any).Telegram?.WebApp) {
            clearInterval(interval);
            initTelegram();
          }
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          if (!isReady) {
            initTelegram();
          }
        }, 2000);
      }
    }
  }, [syncUserToDatabase]);

  return (
    <TelegramContext.Provider value={{ 
      telegramUser, 
      dbUser, 
      isReady, 
      isLoading,
      isInTelegram,
      error, 
      webApp,
      refreshUser
    }}>
      {children}
    </TelegramContext.Provider>
  );
}
