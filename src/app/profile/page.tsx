'use client';

import { useTelegram } from '@/lib/telegram/TelegramProvider';

export default function ProfilePage() {
  const { user, isReady } = useTelegram();

  if (!isReady) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="animate-pulse text-hint">Loading...</div>
      </div>
    );
  }

  const fullName = user
    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`
    : 'Guest User';

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              {user?.photo_url ? (
                <img
                  src={user.photo_url}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-primary">
                  {fullName.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{fullName}</h2>
              {user?.username && (
                <p className="text-hint">@{user.username}</p>
              )}
            </div>
          </div>
          <button className="btn-secondary w-full">Edit Profile</button>
        </div>

        <div className="space-y-3">
          <div className="card">
            <h3 className="font-semibold mb-3">Account Settings</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between py-3 border-b border-secondary last:border-0">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Location</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              <button className="w-full flex items-center justify-between py-3 border-b border-secondary last:border-0">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <span>Notifications</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              <button className="w-full flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span>Privacy</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">Support</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between py-3 border-b border-secondary">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span>Help Center</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              <button className="w-full flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <span>Contact Us</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <p className="text-center text-hint text-sm pt-4">
            Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
