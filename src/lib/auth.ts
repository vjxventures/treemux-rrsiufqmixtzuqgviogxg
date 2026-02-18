import { cookies } from "next/headers";
import { getDb } from "./db";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  age: number;
  gender: string;
  interested_in: string;
  college: string;
  major: string;
  grad_year: number;
  bio: string;
  photo_url: string;
  activities: string[];
  study_spots: string[];
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  if (!sessionId) return null;

  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(sessionId) as Record<string, unknown> | undefined;
  if (!user) return null;

  return {
    id: user.id as string,
    email: user.email as string,
    name: user.name as string,
    age: user.age as number,
    gender: user.gender as string,
    interested_in: user.interested_in as string,
    college: user.college as string,
    major: user.major as string,
    grad_year: user.grad_year as number,
    bio: user.bio as string,
    photo_url: user.photo_url as string,
    activities: JSON.parse(user.activities as string),
    study_spots: JSON.parse(user.study_spots as string),
  };
}
