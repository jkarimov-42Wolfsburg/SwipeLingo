import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { User, Swipe, Match } from '@/lib/db/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { swiper_id, target_id, direction } = body;

    if (!swiper_id || !target_id || !direction) {
      return NextResponse.json(
        { error: 'swiper_id, target_id, and direction are required' },
        { status: 400 }
      );
    }

    if (!['like', 'dislike'].includes(direction)) {
      return NextResponse.json(
        { error: 'direction must be "like" or "dislike"' },
        { status: 400 }
      );
    }

    const swipe = await queryOne<Swipe>(
      `INSERT INTO swipes (swiper_id, target_id, direction) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (swiper_id, target_id) 
       DO UPDATE SET direction = $3, created_at = NOW()
       RETURNING *`,
      [swiper_id, target_id, direction]
    );

    let match: Match | null = null;

    if (direction === 'like') {
      const reverseSwipe = await queryOne<Swipe>(
        `SELECT * FROM swipes 
         WHERE swiper_id = $1 AND target_id = $2 AND direction = 'like'`,
        [target_id, swiper_id]
      );

      if (reverseSwipe) {
        const existingMatch = await queryOne<Match>(
          `SELECT * FROM matches 
           WHERE (user1_id = $1 AND user2_id = $2) 
              OR (user1_id = $2 AND user2_id = $1)`,
          [swiper_id, target_id]
        );

        if (!existingMatch) {
          match = await queryOne<Match>(
            `INSERT INTO matches (user1_id, user2_id) 
             VALUES ($1, $2) 
             RETURNING *`,
            [swiper_id, target_id]
          );
        }
      }
    }

    return NextResponse.json({ swipe, match, isMatch: !!match });
  } catch (error) {
    console.error('Error creating swipe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const languages = searchParams.get('languages');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    let languageFilter = '';
    const params: any[] = [userId, userId];

    if (languages) {
      const langArray = languages.split(',');
      languageFilter = `AND (u.native_languages && $3 OR u.learning_languages && $3)`;
      params.push(langArray);
    }

    const users = await query<User>(
      `SELECT u.*, 
        CASE WHEN t.id IS NOT NULL THEN 
          json_build_object(
            'id', t.id,
            'hourly_rate', t.hourly_rate,
            'bio', t.bio,
            'rating', t.rating,
            'reviews_count', t.reviews_count
          )
        ELSE NULL END as teacher
       FROM users u
       LEFT JOIN teachers t ON u.id = t.user_id
       WHERE u.id != $1
         AND u.id NOT IN (
           SELECT target_id FROM swipes WHERE swiper_id = $2
         )
         ${languageFilter}
       ORDER BY RANDOM()
       LIMIT 20`,
      params
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching swipe candidates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
