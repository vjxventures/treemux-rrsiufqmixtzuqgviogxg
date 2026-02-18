import { getDb } from "./db";
import type { SessionUser } from "./auth";

export interface ProfileCard {
  id: string;
  name: string;
  age: number;
  gender: string;
  college: string;
  major: string;
  grad_year: number;
  bio: string;
  photo_url: string;
  activities: string[];
  study_spots: string[];
  compatibility: number;
}

function computeCompatibility(user: SessionUser, candidate: Record<string, unknown>): number {
  let score = 0;
  const maxScore = 100;

  // Same college boost
  if (user.college === candidate.college) score += 15;

  // Close graduation year
  const yearDiff = Math.abs(user.grad_year - (candidate.grad_year as number));
  if (yearDiff === 0) score += 20;
  else if (yearDiff === 1) score += 15;
  else if (yearDiff === 2) score += 5;

  // Shared activities
  const candidateActivities: string[] = JSON.parse(candidate.activities as string);
  const sharedActivities = user.activities.filter((a) => candidateActivities.includes(a));
  score += Math.min(sharedActivities.length * 10, 30);

  // Shared study spots
  const candidateSpots: string[] = JSON.parse(candidate.study_spots as string);
  const sharedSpots = user.study_spots.filter((s) => candidateSpots.includes(s));
  score += Math.min(sharedSpots.length * 10, 20);

  // Base compatibility for being on the platform
  score += 15;

  return Math.min(Math.round(score), maxScore);
}

export function getDiscoverProfiles(user: SessionUser): ProfileCard[] {
  const db = getDb();

  // Get IDs already swiped
  const swiped = db
    .prepare("SELECT swiped_id FROM swipes WHERE swiper_id = ?")
    .all(user.id) as { swiped_id: string }[];
  const swipedIds = new Set(swiped.map((s) => s.swiped_id));

  // Gender filter
  let candidates: Record<string, unknown>[];
  if (user.interested_in === "everyone") {
    candidates = db.prepare("SELECT * FROM users WHERE id != ?").all(user.id) as Record<string, unknown>[];
  } else {
    candidates = db
      .prepare("SELECT * FROM users WHERE id != ? AND gender = ?")
      .all(user.id, user.interested_in) as Record<string, unknown>[];
  }

  // Filter already swiped and compute compatibility
  const profiles: ProfileCard[] = candidates
    .filter((c) => !swipedIds.has(c.id as string))
    .map((c) => ({
      id: c.id as string,
      name: c.name as string,
      age: c.age as number,
      gender: c.gender as string,
      college: c.college as string,
      major: c.major as string,
      grad_year: c.grad_year as number,
      bio: c.bio as string,
      photo_url: c.photo_url as string,
      activities: JSON.parse(c.activities as string),
      study_spots: JSON.parse(c.study_spots as string),
      compatibility: computeCompatibility(user, c),
    }));

  // Sort by compatibility descending
  profiles.sort((a, b) => b.compatibility - a.compatibility);

  return profiles;
}
