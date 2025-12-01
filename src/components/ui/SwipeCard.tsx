'use client';

import { useState } from 'react';

interface SwipeCardProps {
  id: string;
  name: string;
  age: number;
  bio: string;
  imageUrl?: string;
  onSwipeLeft: (id: string) => void;
  onSwipeRight: (id: string) => void;
}

export function SwipeCard({
  id,
  name,
  age,
  bio,
  imageUrl,
  onSwipeLeft,
  onSwipeRight,
}: SwipeCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

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
      onSwipeRight(id);
    } else if (position.x < -100) {
      onSwipeLeft(id);
    }

    setPosition({ x: 0, y: 0 });
  };

  const rotation = position.x * 0.1;
  const opacity = Math.max(0, 1 - Math.abs(position.x) / 300);

  return (
    <div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        transform: `translateX(${position.x}px) translateY(${position.y}px) rotate(${rotation}deg)`,
        opacity,
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      <div className="h-full bg-secondary rounded-3xl overflow-hidden shadow-lg">
        <div className="h-2/3 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-primary/30 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold">
            {name}, <span className="font-normal">{age}</span>
          </h2>
          <p className="text-hint mt-2 line-clamp-2">{bio}</p>
        </div>
      </div>

      {position.x > 50 && (
        <div className="absolute top-8 left-8 border-4 border-success text-success px-4 py-2 rounded-lg font-bold text-2xl rotate-[-15deg]">
          LIKE
        </div>
      )}
      {position.x < -50 && (
        <div className="absolute top-8 right-8 border-4 border-accent text-accent px-4 py-2 rounded-lg font-bold text-2xl rotate-[15deg]">
          NOPE
        </div>
      )}
    </div>
  );
}
