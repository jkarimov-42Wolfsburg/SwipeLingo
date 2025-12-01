import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { User } from '@/lib/db/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, photo_url, native_languages, learning_languages, timezone, user_role } = body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (photo_url !== undefined) {
      updates.push(`photo_url = $${paramCount++}`);
      values.push(photo_url);
    }
    if (native_languages !== undefined) {
      updates.push(`native_languages = $${paramCount++}`);
      values.push(native_languages);
    }
    if (learning_languages !== undefined) {
      updates.push(`learning_languages = $${paramCount++}`);
      values.push(learning_languages);
    }
    if (timezone !== undefined) {
      updates.push(`timezone = $${paramCount++}`);
      values.push(timezone);
    }
    if (user_role !== undefined) {
      updates.push(`user_role = $${paramCount++}`);
      values.push(user_role);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(params.id);

    const user = await queryOne<User>(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramCount} 
       RETURNING *`,
      values
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
       WHERE u.id = $1`,
      [params.id]
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
