'use client';

import { useState } from 'react';
import { TeacherCard } from '@/components/ui/TeacherCard';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  rating: number;
  reviews: number;
  photoUrl?: string;
  hourlyRate?: number;
}

const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    subject: 'English Language',
    rating: 4.9,
    reviews: 128,
    hourlyRate: 35,
  },
  {
    id: '2',
    name: 'Michael Chen',
    subject: 'Mathematics',
    rating: 4.8,
    reviews: 96,
    hourlyRate: 40,
  },
  {
    id: '3',
    name: 'Emily Garcia',
    subject: 'Spanish & French',
    rating: 5.0,
    reviews: 74,
    hourlyRate: 30,
  },
  {
    id: '4',
    name: 'David Kim',
    subject: 'Physics & Chemistry',
    rating: 4.7,
    reviews: 112,
    hourlyRate: 45,
  },
  {
    id: '5',
    name: 'Anna Wilson',
    subject: 'Music & Piano',
    rating: 4.9,
    reviews: 89,
    hourlyRate: 50,
  },
  {
    id: '6',
    name: 'James Brown',
    subject: 'Programming & CS',
    rating: 4.8,
    reviews: 156,
    hourlyRate: 55,
  },
];

const subjects = [
  'All',
  'English',
  'Mathematics',
  'Languages',
  'Science',
  'Music',
  'Technology',
];

export default function TeachersPage() {
  const [teachers] = useState<Teacher[]>(mockTeachers);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = teacher.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubject === 'All' ||
      teacher.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Browse Teachers</h1>

        <div className="relative mb-4">
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
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {subjects.map((subject) => (
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

        <div className="space-y-3">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                {...teacher}
                onClick={() => console.log('View teacher:', teacher.id)}
              />
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
      </div>
    </div>
  );
}
