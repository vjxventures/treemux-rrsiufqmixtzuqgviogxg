import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { bio, interested_in, activities, study_spots } = body;

  const db = getDb();
  db.prepare(`
    UPDATE users SET bio = ?, interested_in = ?, activities = ?, study_spots = ?
    WHERE id = ?
  `).run(
    bio ?? user.bio,
    interested_in ?? user.interested_in,
    JSON.stringify(activities ?? user.activities),
    JSON.stringify(study_spots ?? user.study_spots),
    user.id
  );

  return NextResponse.json({ success: true });
}
