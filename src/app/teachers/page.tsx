'use client';

import { useState, useEffect } from 'react';
import { useTelegram } from '@/lib/telegram/TelegramProvider';
import { TeacherWithUser } from '@/lib/db/types';

const SUBJECTS = [
  'All',
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Korean',
  'Arabic',
];

export default function TeachersPage() {
  const { isLoading } = useTelegram();
  const [teachers, setTeachers] = useState<TeacherWithUser[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, [selectedSubject]);

  const fetchTeachers = async () => {
    setIsLoadingTeachers(true);
    try {
      const params = new URLSearchParams();
      if (selectedSubject !== 'All') {
        params.append('subject', selectedSubject);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/teachers?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTeachers();
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

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Browse Teachers</h1>

        <form onSubmit={handleSearch} className="relative mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-hint"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50"
          />
        </form>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {SUBJECTS.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedSubject === subject
                  ? 'bg-primary text-primary-text'
                  : 'bg-secondary text-foreground'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {isLoadingTeachers ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-hint">Loading teachers...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="card cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {teacher.photo_url ? (
                        <img src={teacher.photo_url} alt={teacher.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-primary">{teacher.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{teacher.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {teacher.native_languages?.slice(0, 2).map(lang => (
                          <span key={lang} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {lang}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center text-amber-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                          <span className="text-sm ml-1">{Number(teacher.rating).toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-hint">({teacher.reviews_count} reviews)</span>
                      </div>
                      {teacher.bio && (
                        <p className="text-sm text-hint mt-2 line-clamp-2">{teacher.bio}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-primary">${Number(teacher.hourly_rate).toFixed(0)}</p>
                      <p className="text-xs text-hint">/hour</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-hint"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">No teachers found</h3>
                <p className="text-hint text-sm">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
