'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTelegram } from '@/lib/telegram/TelegramProvider';
import { Message, User } from '@/lib/db/types';
import Link from 'next/link';

interface MessageWithSender extends Message {
  sender_name: string;
  sender_photo: string | null;
}

interface MatchInfo {
  id: string;
  other_user: User;
}

export default function ChatPage({ params }: { params: { matchId: string } }) {
  const { dbUser, isLoading } = useTelegram();
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = useCallback(async () => {
    if (!dbUser?.id) return;
    
    try {
      const response = await fetch(
        `/api/messages?match_id=${params.matchId}&user_id=${dbUser.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [dbUser?.id, params.matchId]);

  const fetchMatchInfo = async () => {
    if (!dbUser?.id) return;
    
    try {
      const response = await fetch(`/api/matches?user_id=${dbUser.id}`);
      if (response.ok) {
        const matches = await response.json();
        const match = matches.find((m: any) => m.id === params.matchId);
        if (match) {
          setMatchInfo({
            id: match.id,
            other_user: match.other_user,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching match info:', error);
    }
  };

  useEffect(() => {
    if (dbUser?.id) {
      setIsLoadingMessages(true);
      Promise.all([fetchMessages(), fetchMatchInfo()]).finally(() => {
        setIsLoadingMessages(false);
      });

      pollingRef.current = setInterval(fetchMessages, 3000);

      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
      };
    }
  }, [dbUser?.id, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !dbUser?.id || isSending) return;

    setIsSending(true);
    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          match_id: params.matchId,
          sender_id: dbUser.id,
          content: messageContent,
        }),
      });

      if (response.ok) {
        await fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString();
  };

  const groupMessagesByDate = (msgs: MessageWithSender[]) => {
    const groups: { [key: string]: MessageWithSender[] } = {};
    msgs.forEach((msg) => {
      const date = formatDate(msg.created_at.toString());
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  if (isLoading || isLoadingMessages) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-hint">Loading chat...</p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center gap-3 p-4 border-b border-secondary bg-background">
        <Link href="/matches" className="p-2 -ml-2 hover:bg-secondary rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </Link>
        {matchInfo && (
          <>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              {matchInfo.other_user.photo_url ? (
                <img
                  src={matchInfo.other_user.photo_url}
                  alt={matchInfo.other_user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-primary">
                  {matchInfo.other_user.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">{matchInfo.other_user.name}</h2>
              <p className="text-xs text-hint">
                {matchInfo.other_user.user_role === 'teacher' ? 'Teacher' : 'Learner'}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Start the conversation!</h3>
            <p className="text-hint text-sm max-w-[200px]">
              Say hello to {matchInfo?.other_user.name || 'your match'}
            </p>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date}>
              <div className="text-center my-4">
                <span className="text-xs text-hint bg-secondary px-3 py-1 rounded-full">
                  {date}
                </span>
              </div>
              {msgs.map((message) => {
                const isOwn = message.sender_id === dbUser?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-primary text-primary-text rounded-br-sm'
                          : 'bg-secondary rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      <p className={`text-xs mt-1 ${isOwn ? 'text-primary-text/70' : 'text-hint'}`}>
                        {formatTime(message.created_at.toString())}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-secondary">
        <div className="max-w-lg mx-auto flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-secondary rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="w-12 h-12 rounded-full bg-primary text-primary-text flex items-center justify-center disabled:opacity-50 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
