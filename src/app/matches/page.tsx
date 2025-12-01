'use client';

import { useState, useEffect } from 'react';
import { useTelegram } from '@/lib/telegram/TelegramProvider';
import { MatchWithUser } from '@/lib/db/types';
import Link from 'next/link';

export default function MatchesPage() {
  const { dbUser, isLoading } = useTelegram();
  const [matches, setMatches] = useState<MatchWithUser[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [activeTab, setActiveTab] = useState<'messages' | 'new'>('messages');

  useEffect(() => {
    if (dbUser?.id) {
      fetchMatches();
    }
  }, [dbUser?.id]);

  const fetchMatches = async () => {
    setIsLoadingMatches(true);
    try {
      const response = await fetch(`/api/matches?user_id=${dbUser?.id}`);
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  if (isLoading || isLoadingMatches) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-hint">Loading matches...</p>
        </div>
      </div>
    );
  }

  const newMatches = matches.filter((m) => !m.last_message);
  const messageMatches = matches.filter((m) => m.last_message);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Matches</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
              activeTab === 'messages'
                ? 'bg-primary text-primary-text'
                : 'bg-secondary text-foreground'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors relative ${
              activeTab === 'new'
                ? 'bg-primary text-primary-text'
                : 'bg-secondary text-foreground'
            }`}
          >
            New Matches
            {newMatches.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                {newMatches.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'messages' ? (
          <div className="space-y-3">
            {messageMatches.length > 0 ? (
              messageMatches.map((match) => (
                <Link
                  key={match.id}
                  href={`/chat/${match.id}`}
                  className="card flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                      {match.other_user.photo_url ? (
                        <img
                          src={match.other_user.photo_url}
                          alt={match.other_user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-primary">
                          {match.other_user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    {match.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                        {match.unread_count}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold truncate ${match.unread_count > 0 ? 'text-foreground' : ''}`}>
                        {match.other_user.name}
                      </h3>
                      {match.last_message && (
                        <span className="text-xs text-hint flex-shrink-0 ml-2">
                          {formatTime(String(match.last_message.created_at))}
                        </span>
                      )}
                    </div>
                    {match.last_message && (
                      <p className={`text-sm truncate ${match.unread_count > 0 ? 'text-foreground font-medium' : 'text-hint'}`}>
                        {match.last_message.sender_id === dbUser?.id ? 'You: ' : ''}
                        {match.last_message.content}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">No messages yet</h3>
                <p className="text-hint text-sm">
                  Start a conversation with your matches!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {newMatches.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {newMatches.map((match) => (
                  <Link
                    key={match.id}
                    href={`/chat/${match.id}`}
                    className="text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2 overflow-hidden ring-2 ring-primary ring-offset-2">
                      {match.other_user.photo_url ? (
                        <img
                          src={match.other_user.photo_url}
                          alt={match.other_user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-primary">
                          {match.other_user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">{match.other_user.name}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">No new matches</h3>
                <p className="text-hint text-sm">
                  Keep swiping to find more teachers!
                </p>
                <Link href="/swipe" className="btn-primary inline-block mt-4">
                  Start Swiping
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
