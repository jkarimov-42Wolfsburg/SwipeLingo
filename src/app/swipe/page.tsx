'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTelegram } from '@/lib/telegram/TelegramProvider';
import { User, TeacherWithUser } from '@/lib/db/types';

interface SwipeCandidate extends User {
  teacher?: {
    id: string;
    hourly_rate: number;
    bio: string | null;
    rating: number;
    reviews_count: number;
  };
}

export default function SwipePage() {
  const { dbUser, isLoading } = useTelegram();
  const [candidates, setCandidates] = useState<SwipeCandidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(true);
  const [swipeAnimation, setSwipeAnimation] = useState<'left' | 'right' | null>(null);
  const [showMatch, setShowMatch] = useState<SwipeCandidate | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (dbUser?.id) {
      fetchCandidates();
    }
  }, [dbUser?.id]);

  const fetchCandidates = async () => {
    setIsLoadingCandidates(true);
    try {
      const response = await fetch(`/api/swipe?user_id=${dbUser?.id}`);
      if (response.ok) {
        const data = await response.json();
        setCandidates(data);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setIsLoadingCandidates(false);
    }
  };

  const handleSwipe = useCallback(async (direction: 'like' | 'dislike') => {
    if (!dbUser?.id || !currentCandidate) return;

    setSwipeAnimation(direction === 'like' ? 'right' : 'left');

    try {
      const response = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          swiper_id: dbUser.id,
          target_id: currentCandidate.id,
          direction,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.isMatch) {
          setTimeout(() => {
            setShowMatch(currentCandidate);
          }, 300);
        }
      }
    } catch (error) {
      console.error('Error swiping:', error);
    }

    setTimeout(() => {
      setSwipeAnimation(null);
      setCurrentIndex(prev => prev + 1);
      setPosition({ x: 0, y: 0 });
    }, 300);
  }, [dbUser?.id, candidates, currentIndex]);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    setPosition({ x: deltaX, y: deltaY * 0.3 });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (position.x > 100) {
      handleSwipe('like');
    } else if (position.x < -100) {
      handleSwipe('dislike');
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const currentCandidate = candidates[currentIndex];

  if (isLoading || isLoadingCandidates) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-hint">Finding matches for you...</p>
        </div>
      </div>
    );
  }

  const rotation = position.x * 0.1;
  const cardStyle = {
    transform: swipeAnimation 
      ? `translateX(${swipeAnimation === 'right' ? '150%' : '-150%'}) rotate(${swipeAnimation === 'right' ? 30 : -30}deg)`
      : `translateX(${position.x}px) translateY(${position.y}px) rotate(${rotation}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
  };

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Find Teachers</h1>

        <div className="relative h-[60vh] max-h-[500px]">
          {currentCandidate ? (
            <div
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              style={cardStyle}
              onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
              onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchEnd={handleEnd}
            >
              <div className="h-full bg-secondary rounded-3xl overflow-hidden shadow-lg">
                <div className="h-1/2 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                  {currentCandidate.photo_url ? (
                    <img
                      src={currentCandidate.photo_url}
                      alt={currentCandidate.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary/30 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary">
                        {currentCandidate.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {currentCandidate.teacher && (
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      ${currentCandidate.teacher.hourly_rate}/hr
                    </div>
                  )}
                </div>
                
                <div className="p-6 h-1/2 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">{currentCandidate.name}</h2>
                    {currentCandidate.teacher && (
                      <div className="flex items-center text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span className="ml-1 text-sm">{currentCandidate.teacher.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-primary mb-2">
                    {currentCandidate.user_role === 'teacher' ? 'Teacher' : 'Learner'}
                  </p>
                  
                  {currentCandidate.teacher?.bio && (
                    <p className="text-hint text-sm mb-3">{currentCandidate.teacher.bio}</p>
                  )}
                  
                  {currentCandidate.native_languages.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-hint mb-1">Native in:</p>
                      <div className="flex flex-wrap gap-1">
                        {currentCandidate.native_languages.map(lang => (
                          <span key={lang} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentCandidate.learning_languages.length > 0 && (
                    <div>
                      <p className="text-xs text-hint mb-1">Learning:</p>
                      <div className="flex flex-wrap gap-1">
                        {currentCandidate.learning_languages.map(lang => (
                          <span key={lang} className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {position.x > 50 && (
                <div className="absolute top-8 left-8 border-4 border-success text-success px-4 py-2 rounded-lg font-bold text-2xl rotate-[-15deg] bg-white/90">
                  LIKE
                </div>
              )}
              {position.x < -50 && (
                <div className="absolute top-8 right-8 border-4 border-accent text-accent px-4 py-2 rounded-lg font-bold text-2xl rotate-[15deg] bg-white/90">
                  NOPE
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hint">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">No more profiles</h2>
              <p className="text-hint mb-6">Check back later for more teachers</p>
              <button onClick={fetchCandidates} className="btn-primary">
                Refresh
              </button>
            </div>
          )}
        </div>

        {currentCandidate && (
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => handleSwipe('dislike')}
              className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center active:scale-95 transition-transform border border-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <button
              onClick={() => handleSwipe('like')}
              className="w-16 h-16 rounded-full bg-success shadow-lg flex items-center justify-center active:scale-95 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        )}
      </div>

      {showMatch && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-bounce-in">
            <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-success mb-2">It's a Match!</h2>
            <p className="text-hint mb-6">You and {showMatch.name} liked each other</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowMatch(null)}
                className="flex-1 btn-secondary"
              >
                Keep Swiping
              </button>
              <a
                href="/matches"
                className="flex-1 btn-primary text-center"
              >
                Send Message
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
