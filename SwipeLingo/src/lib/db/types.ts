export type UserRole = 'learner' | 'teacher';
export type SwipeDirection = 'like' | 'dislike';

export interface User {
  id: string;
  telegram_id: number;
  name: string;
  photo_url: string | null;
  native_languages: string[];
  learning_languages: string[];
  timezone: string | null;
  user_role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface Swipe {
  id: string;
  swiper_id: string;
  target_id: string;
  direction: SwipeDirection;
  created_at: Date;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  matched_at: Date;
}

export interface Teacher {
  id: string;
  user_id: string;
  hourly_rate: number;
  bio: string | null;
  rating: number;
  reviews_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: Date;
  read_at: Date | null;
}

export interface TeacherWithUser extends Teacher {
  name: string;
  photo_url: string | null;
  native_languages: string[];
  learning_languages: string[];
}

export interface UserWithTeacher extends User {
  teacher?: Teacher;
}

export interface MatchWithUser extends Match {
  other_user: User;
  last_message?: Message;
  unread_count: number;
}
