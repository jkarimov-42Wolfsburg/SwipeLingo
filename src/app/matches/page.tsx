'use client';

import { useState } from 'react';
import { MatchCard } from '@/components/ui/MatchCard';

interface Match {
  id: string;
  name: string;
  photoUrl?: string;
  lastMessage?: string;
  timestamp?: string;
  unread?: boolean;
}

const mockMatches: Match[] = [
  {
    id: '1',
    name: 'Sarah',
    lastMessage: "Hi! I'd love to help you with English!",
    timestamp: '2m ago',
    unread: true,
  },
  {
    id: '2',
    name: 'Michael',
    lastMessage: 'When would you like to schedule our first lesson?',
    timestamp: '1h ago',
    unread: false,
  },
  {
    id: '3',
    name: 'Emily',
    lastMessage: 'Great progress today! See you next week.',
    timestamp: 'Yesterday',
    unread: false,
  },
];

export default function MatchesPage() {
  const [matches] = useState<Match[]>(mockMatches);
  const [activeTab, setActiveTab] = useState<'messages' | 'new'>('messages');

  const newMatches = matches.filter((m) => !m.lastMessage);
  const messageMatches = matches.filter((m) => m.lastMessage);

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
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
              activeTab === 'new'
                ? 'bg-primary text-primary-text'
                : 'bg-secondary text-foreground'
            }`}
          >
            New Matches
          </button>
        </div>

        {activeTab === 'messages' ? (
          <div className="space-y-3">
            {messageMatches.length > 0 ? (
              messageMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  {...match}
                  onClick={() => console.log('Open chat:', match.id)}
                />
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
                  <div
                    key={match.id}
                    className="text-center cursor-pointer"
                    onClick={() => console.log('View match:', match.id)}
                  >
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                      {match.photoUrl ? (
                        <img
                          src={match.photoUrl}
                          alt={match.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-primary">
                          {match.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">{match.name}</p>
                  </div>
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
