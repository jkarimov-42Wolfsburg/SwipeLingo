'use client';

import { useEffect, useState } from 'react';
import { useTelegram } from '@/lib/telegram/TelegramProvider';
import Link from 'next/link';

interface Stats {
  matches: number;
  likes: number;
  views: number;
}

export default function HomePage() {
  const { telegramUser, dbUser, isReady, isLoading, isInTelegram, error } = useTelegram();
  const [stats, setStats] = useState<Stats>({ matches: 0, likes: 0, views: 0 });

  useEffect(() => {
    if (dbUser?.id) {
      fetchStats();
    }
  }, [dbUser?.id]);

  const fetchStats = async () => {
    try {
      const matchesRes = await fetch(`/api/matches?user_id=${dbUser?.id}`);
      if (matchesRes.ok) {
        const matches = await matchesRes.json();
        setStats(prev => ({ ...prev, matches: matches.length }));
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-hint">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isInTelegram && process.env.NODE_ENV !== 'development') {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Open in Telegram</h1>
          <p className="text-hint mb-6">
            This app is designed to work inside Telegram. Please open it through our Telegram bot.
          </p>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block"
          >
            Open Telegram
          </a>
        </div>
      </div>
    );
  }

  if (error && !dbUser) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
          <p className="text-hint">{error}</p>
        </div>
      </div>
    );
  }

  const displayName = dbUser?.name || telegramUser?.first_name || 'User';

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto">
        <div className="text-center py-6">
          <img src="/logo.png" alt="SwipeLingo" className="w-32 h-32 mx-auto mb-4" />
          <h2 className="text-sm tracking-widest text-accent font-semibold mb-6">SWIPE-MATCH-SPEAK</h2>
        </div>

        <div className="text-center py-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 overflow-hidden">
            {dbUser?.photo_url ? (
              <img src={dbUser.photo_url} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-primary">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Welcome, {displayName}!
          </h1>
          <p className="text-hint">Find your perfect teacher match</p>
          {dbUser?.user_role === 'teacher' && (
            <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
              Teacher
            </span>
          )}
        </div>

        <div className="grid gap-4 mt-8">
          <Link href="/swipe" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Start Swiping</h3>
                <p className="text-sm text-hint">Discover new teachers</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </Link>

          <Link href="/matches" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Your Matches</h3>
                <p className="text-sm text-hint">View your connections</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </Link>

          <Link href="/teachers" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Browse Teachers</h3>
                <p className="text-sm text-hint">Explore all teachers</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-primary/10 rounded-2xl">
          <h3 className="font-semibold text-primary mb-2">Quick Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{stats.matches}</p>
              <p className="text-xs text-hint">Matches</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.likes}</p>
              <p className="text-xs text-hint">Likes</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.views}</p>
              <p className="text-xs text-hint">Views</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
