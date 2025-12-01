import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { MatchWithUser } from '@/lib/db/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    const matches = await query<MatchWithUser>(
      `SELECT 
        m.id,
        m.user1_id,
        m.user2_id,
        m.matched_at,
        json_build_object(
          'id', other_user.id,
          'telegram_id', other_user.telegram_id,
          'name', other_user.name,
          'photo_url', other_user.photo_url,
          'native_languages', other_user.native_languages,
          'learning_languages', other_user.learning_languages,
          'user_role', other_user.user_role
        ) as other_user,
        (
          SELECT json_build_object(
            'id', msg.id,
            'content', msg.content,
            'sender_id', msg.sender_id,
            'created_at', msg.created_at
          )
          FROM messages msg
          WHERE msg.match_id = m.id
          ORDER BY msg.created_at DESC
          LIMIT 1
        ) as last_message,
        (
          SELECT COUNT(*)::int
          FROM messages msg
          WHERE msg.match_id = m.id
            AND msg.sender_id != $1
            AND msg.read_at IS NULL
        ) as unread_count
       FROM matches m
       JOIN users other_user ON 
         CASE 
           WHEN m.user1_id = $1 THEN other_user.id = m.user2_id
           ELSE other_user.id = m.user1_id
         END
       WHERE m.user1_id = $1 OR m.user2_id = $1
       ORDER BY 
         COALESCE(
           (SELECT MAX(created_at) FROM messages WHERE match_id = m.id),
           m.matched_at
         ) DESC`,
      [userId]
    );

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
