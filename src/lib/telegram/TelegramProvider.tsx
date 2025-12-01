'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramContextType {
  user: TelegramUser | null;
  isReady: boolean;
  webApp: any;
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  isReady: false,
  webApp: null,
});

export const useTelegram = () => useContext(TelegramContext);

interface TelegramProviderProps {
  children: ReactNode;
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [webApp, setWebApp] = useState<any>(null);

  useEffect(() => {
    const initTelegram = () => {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        
        tg.ready();
        tg.expand();
        
        setWebApp(tg);
        
        if (tg.initDataUnsafe?.user) {
          setUser(tg.initDataUnsafe.user);
        }
        
        setIsReady(true);
      } else {
        // Development mode - simulate Telegram environment
        setIsReady(true);
        setUser({
          id: 123456789,
          first_name: 'Dev',
          last_name: 'User',
          username: 'devuser',
        });
      }
    };

    // Wait for Telegram WebApp script to load
    if (typeof window !== 'undefined') {
      if ((window as any).Telegram?.WebApp) {
        initTelegram();
      } else {
        // Check periodically for Telegram WebApp
        const interval = setInterval(() => {
          if ((window as any).Telegram?.WebApp) {
            clearInterval(interval);
            initTelegram();
          }
        }, 100);

        // Fallback to development mode after 2 seconds
        setTimeout(() => {
          clearInterval(interval);
          if (!isReady) {
            initTelegram();
          }
        }, 2000);
      }
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ user, isReady, webApp }}>
      {children}
    </TelegramContext.Provider>
  );
}
