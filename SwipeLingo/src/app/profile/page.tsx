'use client';

import { useState } from 'react';
import { useTelegram } from '@/lib/telegram/TelegramProvider';

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
  'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi'
];

export default function ProfilePage() {
  const { telegramUser, dbUser, isLoading, refreshUser } = useTelegram();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    native_languages: dbUser?.native_languages || [],
    learning_languages: dbUser?.learning_languages || [],
    timezone: dbUser?.timezone || '',
    user_role: dbUser?.user_role || 'learner',
  });

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

  const fullName = dbUser?.name || 
    (telegramUser ? `${telegramUser.first_name}${telegramUser.last_name ? ` ${telegramUser.last_name}` : ''}` : 'Guest User');

  const toggleLanguage = (lang: string, type: 'native' | 'learning') => {
    const key = type === 'native' ? 'native_languages' : 'learning_languages';
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].includes(lang)
        ? prev[key].filter(l => l !== lang)
        : [...prev[key], lang],
    }));
  };

  const handleSave = async () => {
    if (!dbUser?.id) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/users/${dbUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await refreshUser();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBecomeTeacher = async () => {
    if (!dbUser?.id) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: dbUser.id,
          hourly_rate: 10,
          bio: '',
        }),
      });

      if (response.ok) {
        await refreshUser();
      }
    } catch (error) {
      console.error('Error becoming teacher:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              {dbUser?.photo_url ? (
                <img
                  src={dbUser.photo_url}
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
              {telegramUser?.username && (
                <p className="text-hint">@{telegramUser.username}</p>
              )}
              <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                dbUser?.user_role === 'teacher' 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-secondary text-hint'
              }`}>
                {dbUser?.user_role === 'teacher' ? 'Teacher' : 'Learner'}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="btn-secondary w-full"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing && (
          <div className="card mb-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">I speak (native languages)</h3>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang, 'native')}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      formData.native_languages.includes(lang)
                        ? 'bg-primary text-primary-text'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">I'm learning</h3>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang, 'learning')}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      formData.learning_languages.includes(lang)
                        ? 'bg-accent text-white'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary w-full"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {dbUser?.user_role !== 'teacher' && (
          <div className="card mb-6 bg-gradient-to-br from-primary/10 to-accent/10">
            <h3 className="font-semibold mb-2">Become a Teacher</h3>
            <p className="text-sm text-hint mb-4">
              Share your knowledge and earn money by teaching others!
            </p>
            <button
              onClick={handleBecomeTeacher}
              disabled={isSaving}
              className="btn-primary w-full"
            >
              {isSaving ? 'Processing...' : 'Become a Teacher'}
            </button>
          </div>
        )}

        <div className="space-y-3">
          <div className="card">
            <h3 className="font-semibold mb-3">Languages</h3>
            {dbUser?.native_languages && dbUser.native_languages.length > 0 ? (
              <div className="mb-3">
                <p className="text-xs text-hint mb-1">Native</p>
                <div className="flex flex-wrap gap-1">
                  {dbUser.native_languages.map(lang => (
                    <span key={lang} className="px-2 py-0.5 bg-primary/10 text-primary text-sm rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {dbUser?.learning_languages && dbUser.learning_languages.length > 0 ? (
              <div>
                <p className="text-xs text-hint mb-1">Learning</p>
                <div className="flex flex-wrap gap-1">
                  {dbUser.learning_languages.map(lang => (
                    <span key={lang} className="px-2 py-0.5 bg-accent/10 text-accent text-sm rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {(!dbUser?.native_languages?.length && !dbUser?.learning_languages?.length) && (
              <p className="text-hint text-sm">No languages set. Edit your profile to add languages.</p>
            )}
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">Account Settings</h3>
            <div className="space-y-2">
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

          <p className="text-center text-hint text-sm pt-4">
            Version 1.0.0 | Telegram ID: {telegramUser?.id || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
