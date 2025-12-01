import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { Message, Match } from '@/lib/db/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { match_id, sender_id, content } = body;

    if (!match_id || !sender_id || !content) {
      return NextResponse.json(
        { error: 'match_id, sender_id, and content are required' },
        { status: 400 }
      );
    }

    const match = await queryOne<Match>(
      `SELECT * FROM matches 
       WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
      [match_id, sender_id]
    );

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found or user is not part of this match' },
        { status: 403 }
      );
    }

    const message = await queryOne<Message>(
      `INSERT INTO messages (match_id, sender_id, content) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [match_id, sender_id, content]
    );

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('match_id');
    const userId = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!matchId || !userId) {
      return NextResponse.json(
        { error: 'match_id and user_id are required' },
        { status: 400 }
      );
    }

    const match = await queryOne<Match>(
      `SELECT * FROM matches 
       WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
      [matchId, userId]
    );

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found or user is not part of this match' },
        { status: 403 }
      );
    }

    await query(
      `UPDATE messages 
       SET read_at = NOW() 
       WHERE match_id = $1 AND sender_id != $2 AND read_at IS NULL`,
      [matchId, userId]
    );

    const messages = await query<Message>(
      `SELECT m.*, u.name as sender_name, u.photo_url as sender_photo
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.match_id = $1
       ORDER BY m.created_at ASC
       LIMIT $2 OFFSET $3`,
      [matchId, limit, offset]
    );

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
