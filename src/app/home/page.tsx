'use client';

import { useTelegram } from '@/lib/telegram/TelegramProvider';
import Link from 'next/link';

export default function HomePage() {
  const { user, isReady } = useTelegram();

  if (!isReady) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="animate-pulse text-hint">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto">
        <div className="text-center py-8">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-primary">
              {user?.first_name?.charAt(0) || 'U'}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Welcome{user?.first_name ? `, ${user.first_name}` : ''}!
          </h1>
          <p className="text-hint">Find your perfect teacher match</p>
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
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-hint">Matches</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-hint">Likes</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-hint">Views</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
