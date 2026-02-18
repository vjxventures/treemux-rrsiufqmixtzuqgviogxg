import Database from "better-sqlite3";
import path from "path";
import { v4 as uuid } from "uuid";

const DB_PATH = path.join(process.cwd(), "tartanmatch.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    initDb(_db);
  }
  return _db;
}

function initDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      interested_in TEXT NOT NULL,
      college TEXT NOT NULL,
      major TEXT NOT NULL,
      grad_year INTEGER NOT NULL,
      bio TEXT DEFAULT '',
      photo_url TEXT DEFAULT '',
      activities TEXT DEFAULT '[]',
      study_spots TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS swipes (
      id TEXT PRIMARY KEY,
      swiper_id TEXT NOT NULL,
      swiped_id TEXT NOT NULL,
      direction TEXT NOT NULL CHECK(direction IN ('like', 'pass')),
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (swiper_id) REFERENCES users(id),
      FOREIGN KEY (swiped_id) REFERENCES users(id),
      UNIQUE(swiper_id, swiped_id)
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      user1_id TEXT NOT NULL,
      user2_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user1_id) REFERENCES users(id),
      FOREIGN KEY (user2_id) REFERENCES users(id),
      UNIQUE(user1_id, user2_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      match_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (match_id) REFERENCES matches(id),
      FOREIGN KEY (sender_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON swipes(swiper_id);
    CREATE INDEX IF NOT EXISTS idx_swipes_swiped ON swipes(swiped_id);
    CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches(user1_id);
    CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches(user2_id);
    CREATE INDEX IF NOT EXISTS idx_messages_match ON messages(match_id);
  `);

  // Seed demo profiles if empty
  const count = db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number };
  if (count.c === 0) {
    seedDemoProfiles(db);
  }
}

function seedDemoProfiles(db: Database.Database) {
  const bcrypt = require("bcryptjs");
  const profiles = [
    {
      name: "Alex Chen",
      age: 20,
      gender: "male",
      interested_in: "female",
      college: "School of Computer Science",
      major: "Computer Science",
      grad_year: 2027,
      bio: "Building the next great startup between problem sets. Love hiking Frick Park and late-night Eat'n Park runs.",
      photo_url: "/avatars/alex.jpg",
      activities: JSON.stringify(["ScottyLabs", "Competitive Programming", "Hiking Club"]),
      study_spots: JSON.stringify(["Gates Hillman", "Hunt Library", "Tepper Quad"]),
    },
    {
      name: "Maya Patel",
      age: 21,
      gender: "female",
      interested_in: "male",
      college: "College of Engineering",
      major: "Electrical & Computer Engineering",
      grad_year: 2026,
      bio: "Hardware nerd by day, amateur chef by night. If you can't handle me at my 3am lab session, you don't deserve me at my best.",
      photo_url: "/avatars/maya.jpg",
      activities: JSON.stringify(["IEEE", "Women in ECE", "Cooking Club"]),
      study_spots: JSON.stringify(["Hamerschlag Hall", "Sorrells Library", "CFA Lawn"]),
    },
    {
      name: "Jordan Kim",
      age: 19,
      gender: "non-binary",
      interested_in: "everyone",
      college: "Dietrich College",
      major: "Psychology",
      grad_year: 2028,
      bio: "I'll psychoanalyze your Spotify playlists. Love board games, matcha, and debating whether the Fence counts as art.",
      photo_url: "/avatars/jordan.jpg",
      activities: JSON.stringify(["AB Films", "Board Game Club", "The Tartan"]),
      study_spots: JSON.stringify(["Baker Hall", "Maggie Murph Cafe", "The Cut"]),
    },
    {
      name: "Sophie Williams",
      age: 20,
      gender: "female",
      interested_in: "everyone",
      college: "College of Fine Arts",
      major: "Architecture",
      grad_year: 2027,
      bio: "I spend more time in studio than my apartment. Looking for someone who appreciates brutalist architecture and good coffee.",
      photo_url: "/avatars/sophie.jpg",
      activities: JSON.stringify(["AIAS", "Sustainable Design Club", "Yoga"]),
      study_spots: JSON.stringify(["CFA", "Entropy+", "Margaret Morrison"]),
    },
    {
      name: "Marcus Johnson",
      age: 22,
      gender: "male",
      interested_in: "female",
      college: "Tepper School of Business",
      major: "Business Administration",
      grad_year: 2026,
      bio: "Future CEO, current Tepper Quad regular. I like pitch decks, pickup basketball, and people who don't take themselves too seriously.",
      photo_url: "/avatars/marcus.jpg",
      activities: JSON.stringify(["Entrepreneurship Club", "Varsity Basketball", "Finance Club"]),
      study_spots: JSON.stringify(["Tepper Quad", "Posner Hall", "Gates Cafe"]),
    },
    {
      name: "Priya Sharma",
      age: 20,
      gender: "female",
      interested_in: "male",
      college: "School of Computer Science",
      major: "Artificial Intelligence",
      grad_year: 2027,
      bio: "Training neural nets and my patience. Dog person, bubble tea enthusiast, and I promise I won't talk about gradient descent on our first date.",
      photo_url: "/avatars/priya.jpg",
      activities: JSON.stringify(["AI Club", "WiCS", "Dance Marathon"]),
      study_spots: JSON.stringify(["Gates Hillman", "NSH", "Rashid Auditorium"]),
    },
    {
      name: "Ethan Brooks",
      age: 21,
      gender: "male",
      interested_in: "everyone",
      college: "Mellon College of Science",
      major: "Physics",
      grad_year: 2026,
      bio: "Quantum mechanics has me questioning reality. Looking for someone who's both a wave and a particle — complex and real.",
      photo_url: "/avatars/ethan.jpg",
      activities: JSON.stringify(["Society of Physics Students", "Astronomy Club", "Climbing Wall"]),
      study_spots: JSON.stringify(["Wean Hall", "Doherty Hall", "Entropy+"]),
    },
    {
      name: "Lily Zhang",
      age: 19,
      gender: "female",
      interested_in: "female",
      college: "College of Fine Arts",
      major: "Drama",
      grad_year: 2028,
      bio: "Main character energy on and off stage. Catch me at the Purnell Center or anywhere there's live music.",
      photo_url: "/avatars/lily.jpg",
      activities: JSON.stringify(["Scotch'n'Soda", "Allies", "Improv Club"]),
      study_spots: JSON.stringify(["Purnell Center", "Maggie Murph Cafe", "The Cut"]),
    },
    {
      name: "Ryan O'Connor",
      age: 20,
      gender: "male",
      interested_in: "female",
      college: "School of Computer Science",
      major: "Information Systems",
      grad_year: 2027,
      bio: "Half SCS, half Dietrich — I contain multitudes. Into vinyl records, ramen, and making things look pretty on screens.",
      photo_url: "/avatars/ryan.jpg",
      activities: JSON.stringify(["Design Club", "WRCT Radio", "Ping Pong Club"]),
      study_spots: JSON.stringify(["Hunt Library", "Gates Cafe", "CUC"]),
    },
    {
      name: "Aria Nakamura",
      age: 21,
      gender: "female",
      interested_in: "male",
      college: "College of Engineering",
      major: "Mechanical Engineering",
      grad_year: 2026,
      bio: "I build robots and break stereotypes. Let's grab Razzy Fresh and talk about anything except thermodynamics.",
      photo_url: "/avatars/aria.jpg",
      activities: JSON.stringify(["Robotics Club", "SWE", "Kiltie Band"]),
      study_spots: JSON.stringify(["Scaife Hall", "Hamerschlag Hall", "Entropy+"]),
    },
  ];

  const insert = db.prepare(`
    INSERT INTO users (id, email, password_hash, name, age, gender, interested_in, college, major, grad_year, bio, photo_url, activities, study_spots)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const hash = bcrypt.hashSync("demo123", 10);
  for (const p of profiles) {
    const id = uuid();
    const email = p.name.toLowerCase().replace(/[^a-z]/g, "") + "@andrew.cmu.edu";
    insert.run(id, email, hash, p.name, p.age, p.gender, p.interested_in, p.college, p.major, p.grad_year, p.bio, p.photo_url, p.activities, p.study_spots);
  }
}
