import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { TeacherWithUser, Teacher } from '@/lib/db/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const minRate = searchParams.get('min_rate');
    const maxRate = searchParams.get('max_rate');
    const search = searchParams.get('search');

    let whereConditions: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (subject) {
      whereConditions.push(`(u.native_languages @> ARRAY[$${paramCount}]::text[] OR u.learning_languages @> ARRAY[$${paramCount}]::text[])`);
      params.push(subject);
      paramCount++;
    }

    if (minRate) {
      whereConditions.push(`t.hourly_rate >= $${paramCount}`);
      params.push(parseFloat(minRate));
      paramCount++;
    }

    if (maxRate) {
      whereConditions.push(`t.hourly_rate <= $${paramCount}`);
      params.push(parseFloat(maxRate));
      paramCount++;
    }

    if (search) {
      whereConditions.push(`(u.name ILIKE $${paramCount} OR t.bio ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    const teachers = await query<TeacherWithUser>(
      `SELECT 
        t.id,
        t.user_id,
        t.hourly_rate,
        t.bio,
        t.rating,
        t.reviews_count,
        t.created_at,
        t.updated_at,
        u.name,
        u.photo_url,
        u.native_languages,
        u.learning_languages
       FROM teachers t
       JOIN users u ON t.user_id = u.id
       ${whereClause}
       ORDER BY t.rating DESC, t.reviews_count DESC
       LIMIT 50`,
      params
    );

    return NextResponse.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, hourly_rate, bio } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE users SET user_role = 'teacher' WHERE id = $1`,
      [user_id]
    );

    const teacher = await queryOne<Teacher>(
      `INSERT INTO teachers (user_id, hourly_rate, bio) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id) 
       DO UPDATE SET hourly_rate = $2, bio = $3, updated_at = NOW()
       RETURNING *`,
      [user_id, hourly_rate || 0, bio || null]
    );

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error('Error creating teacher:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
