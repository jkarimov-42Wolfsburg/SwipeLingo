'use client';

import { useState } from 'react';
import { SwipeCard } from '@/components/ui/SwipeCard';

interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  imageUrl?: string;
}

const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Sarah',
    age: 28,
    bio: 'English teacher with 5 years of experience. I love helping students achieve their language goals!',
  },
  {
    id: '2',
    name: 'Michael',
    age: 32,
    bio: 'Mathematics tutor specializing in calculus and algebra. Patient and thorough teaching approach.',
  },
  {
    id: '3',
    name: 'Emily',
    age: 25,
    bio: 'Spanish and French teacher. Native speaker with passion for language and culture exchange.',
  },
  {
    id: '4',
    name: 'David',
    age: 35,
    bio: 'Physics and Chemistry teacher. PhD in Physics. Making complex concepts simple and fun.',
  },
];

export default function SwipePage() {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipeLeft = (id: string) => {
    console.log('Passed on:', id);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSwipeRight = (id: string) => {
    console.log('Liked:', id);
    setCurrentIndex((prev) => prev + 1);
  };

  const currentProfile = profiles[currentIndex];

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Find Teachers</h1>

        <div className="relative h-[60vh] max-h-[500px]">
          {currentProfile ? (
            <SwipeCard
              key={currentProfile.id}
              {...currentProfile}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
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
              <p className="text-hint">Check back later for more teachers</p>
              <button
                onClick={() => setCurrentIndex(0)}
                className="btn-primary mt-6"
              >
                Start Over
              </button>
            </div>
          )}
        </div>

        {currentProfile && (
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => handleSwipeLeft(currentProfile.id)}
              className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <button
              onClick={() => handleSwipeRight(currentProfile.id)}
              className="w-16 h-16 rounded-full bg-success flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
