import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const FIRST_NAMES = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
  'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Oliver', 'Amelia',
  'Benjamin', 'Harper', 'Elijah', 'Evelyn', 'Lucas', 'Abigail', 'Henry',
  'Emily', 'Alexander', 'Elizabeth', 'Michael', 'Sofia', 'Daniel', 'Avery',
  'Matthew', 'Ella', 'Aiden', 'Scarlett', 'Joseph', 'Grace', 'Jackson',
  'Chloe', 'Samuel', 'Victoria', 'Sebastian', 'Riley', 'David', 'Aria',
  'Carter', 'Lily', 'Wyatt', 'Aurora', 'Jayden', 'Zoey', 'John',
  'Yuki', 'Hiroshi', 'Sakura', 'Takeshi', 'Mei', 'Wei', 'Jin', 'Yuna',
  'Carlos', 'Maria', 'Diego', 'Ana', 'Pablo', 'Elena', 'Miguel', 'Carmen',
  'Pierre', 'Marie', 'Jean', 'Sophie', 'Louis', 'Claire', 'François', 'Julie',
  'Hans', 'Anna', 'Klaus', 'Greta', 'Friedrich', 'Helga', 'Wolfgang', 'Ingrid',
  'Ivan', 'Natasha', 'Dmitri', 'Olga', 'Sergei', 'Katya', 'Boris', 'Anya',
  'Ahmed', 'Fatima', 'Omar', 'Layla', 'Hassan', 'Noor', 'Ali', 'Sara',
  'Raj', 'Priya', 'Arjun', 'Ananya', 'Vikram', 'Deepa', 'Amit', 'Kavita'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
  'Tanaka', 'Yamamoto', 'Suzuki', 'Watanabe', 'Kim', 'Park', 'Chen',
  'Wang', 'Li', 'Zhang', 'Liu', 'Müller', 'Schmidt', 'Schneider',
  'Fischer', 'Weber', 'Meyer', 'Ivanov', 'Smirnov', 'Petrov', 'Volkov'
];

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi',
  'Dutch', 'Polish', 'Turkish', 'Swedish', 'Greek', 'Hebrew'
];

const TIMEZONES = [
  'America/New_York', 'America/Los_Angeles', 'America/Chicago',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow',
  'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Seoul', 'Asia/Dubai',
  'Australia/Sydney', 'Pacific/Auckland', 'America/Sao_Paulo'
];

const TEACHER_BIOS = [
  'Passionate about teaching languages with 5+ years of experience.',
  'Native speaker with a focus on conversational skills.',
  'Certified teacher with a degree in linguistics.',
  'Patient and encouraging teaching style for all levels.',
  'Specialized in business language and professional communication.',
  'Fun and interactive lessons that keep you engaged.',
  'Expert in exam preparation (TOEFL, IELTS, DELE, DELF).',
  'I help you speak with confidence from day one.',
  'Grammar nerd who makes learning rules fun and easy.',
  'Cultural immersion approach to language learning.',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems<T>(arr: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min: number, max: number, decimals: number = 2): number {
  const num = Math.random() * (max - min) + min;
  return parseFloat(num.toFixed(decimals));
}

async function seed() {
  console.log('Starting seed process...');
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('Clearing existing data...');
    await client.query('DELETE FROM messages');
    await client.query('DELETE FROM matches');
    await client.query('DELETE FROM swipes');
    await client.query('DELETE FROM teachers');
    await client.query('DELETE FROM users WHERE telegram_id > 1000000');

    console.log('Creating users...');
    const userIds: string[] = [];
    const teacherUserIds: string[] = [];

    for (let i = 0; i < 400; i++) {
      const isTeacher = i < 10;
      const firstName = randomItem(FIRST_NAMES);
      const lastName = randomItem(LAST_NAMES);
      const name = `${firstName} ${lastName}`;
      const telegramId = 1000000 + i;
      const nativeLanguages = randomItems(LANGUAGES, 1, 2);
      const remainingLanguages = LANGUAGES.filter(l => !nativeLanguages.includes(l));
      const learningLanguages = randomItems(remainingLanguages, 1, 3);
      const timezone = randomItem(TIMEZONES);
      const userRole = isTeacher ? 'teacher' : 'learner';

      const result = await client.query(
        `INSERT INTO users (telegram_id, name, native_languages, learning_languages, timezone, user_role)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [telegramId, name, nativeLanguages, learningLanguages, timezone, userRole]
      );

      const userId = result.rows[0].id;
      userIds.push(userId);

      if (isTeacher) {
        teacherUserIds.push(userId);
        const hourlyRate = randomNumber(2, 20);
        const bio = randomItem(TEACHER_BIOS);
        const rating = randomDecimal(3.5, 5.0, 2);
        const reviewsCount = randomNumber(5, 200);

        await client.query(
          `INSERT INTO teachers (user_id, hourly_rate, bio, rating, reviews_count)
           VALUES ($1, $2, $3, $4, $5)`,
          [userId, hourlyRate, bio, rating, reviewsCount]
        );
      }

      if ((i + 1) % 50 === 0) {
        console.log(`Created ${i + 1} users...`);
      }
    }

    console.log('Creating random swipes...');
    const swipeCount = 500;
    for (let i = 0; i < swipeCount; i++) {
      const swiperId = randomItem(userIds);
      let targetId = randomItem(userIds);
      
      while (targetId === swiperId) {
        targetId = randomItem(userIds);
      }

      const direction = Math.random() > 0.3 ? 'like' : 'dislike';

      try {
        await client.query(
          `INSERT INTO swipes (swiper_id, target_id, direction)
           VALUES ($1, $2, $3)
           ON CONFLICT (swiper_id, target_id) DO NOTHING`,
          [swiperId, targetId, direction]
        );
      } catch (e) {
      }

      if ((i + 1) % 100 === 0) {
        console.log(`Created ${i + 1} swipes...`);
      }
    }

    console.log('Creating matches from mutual likes...');
    const mutualLikes = await client.query(
      `SELECT s1.swiper_id as user1, s1.target_id as user2
       FROM swipes s1
       JOIN swipes s2 ON s1.swiper_id = s2.target_id AND s1.target_id = s2.swiper_id
       WHERE s1.direction = 'like' AND s2.direction = 'like'
         AND s1.swiper_id < s1.target_id`
    );

    let matchCount = 0;
    for (const row of mutualLikes.rows) {
      try {
        const matchResult = await client.query(
          `INSERT INTO matches (user1_id, user2_id)
           VALUES ($1, $2)
           ON CONFLICT (user1_id, user2_id) DO NOTHING
           RETURNING id`,
          [row.user1, row.user2]
        );

        if (matchResult.rows.length > 0 && Math.random() > 0.5) {
          const matchId = matchResult.rows[0].id;
          const messageCount = randomNumber(1, 10);
          
          for (let j = 0; j < messageCount; j++) {
            const senderId = Math.random() > 0.5 ? row.user1 : row.user2;
            const messages = [
              'Hi! Nice to meet you!',
              'Hello! How are you?',
              'Thanks for matching with me!',
              "I'd love to learn more about you.",
              'What languages are you interested in?',
              'When are you usually available for lessons?',
              'Great profile! Looking forward to chatting.',
              'Hi there! Ready to start learning?',
              'Hello! What are your learning goals?',
              "Nice to connect! Let's schedule a session."
            ];
            
            await client.query(
              `INSERT INTO messages (match_id, sender_id, content, created_at)
               VALUES ($1, $2, $3, NOW() - INTERVAL '${randomNumber(1, 168)} hours')`,
              [matchId, senderId, randomItem(messages)]
            );
          }
          matchCount++;
        }
      } catch (e) {
      }
    }

    console.log(`Created ${mutualLikes.rows.length} matches with ${matchCount} having messages.`);

    await client.query('COMMIT');
    console.log('Seed completed successfully!');
    console.log(`Total users: 400 (10 teachers, 390 learners)`);
    console.log(`Total swipes: ~${swipeCount}`);
    console.log(`Total matches: ${mutualLikes.rows.length}`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
