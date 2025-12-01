import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { User } from '@/lib/db/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { telegram_id, name, photo_url } = body;

    if (!telegram_id || !name) {
      return NextResponse.json(
        { error: 'telegram_id and name are required' },
        { status: 400 }
      );
    }

    const existingUser = await queryOne<User>(
      'SELECT * FROM users WHERE telegram_id = $1',
      [telegram_id]
    );

    if (existingUser) {
      const updatedUser = await queryOne<User>(
        `UPDATE users 
         SET name = $1, photo_url = $2, updated_at = NOW() 
         WHERE telegram_id = $3 
         RETURNING *`,
        [name, photo_url || null, telegram_id]
      );
      return NextResponse.json(updatedUser);
    }

    const newUser = await queryOne<User>(
      `INSERT INTO users (telegram_id, name, photo_url) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [telegram_id, name, photo_url || null]
    );

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get('telegram_id');

    if (!telegramId) {
      return NextResponse.json(
        { error: 'telegram_id is required' },
        { status: 400 }
      );
    }

    const user = await queryOne<User>(
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
       WHERE u.telegram_id = $1`,
      [parseInt(telegramId)]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
