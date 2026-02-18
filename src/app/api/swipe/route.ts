import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { targetId, direction } = await req.json();
  if (!targetId || !["like", "pass"].includes(direction)) {
    return NextResponse.json({ error: "Invalid swipe" }, { status: 400 });
  }

  const db = getDb();

  // Record swipe
  db.prepare("INSERT OR REPLACE INTO swipes (id, swiper_id, swiped_id, direction) VALUES (?, ?, ?, ?)").run(
    uuid(),
    user.id,
    targetId,
    direction
  );

  // Check for mutual match
  let matched = false;
  if (direction === "like") {
    const reciprocal = db
      .prepare("SELECT id FROM swipes WHERE swiper_id = ? AND swiped_id = ? AND direction = 'like'")
      .get(targetId, user.id);

    if (reciprocal) {
      // Create match (smaller id first for uniqueness)
      const [u1, u2] = [user.id, targetId].sort();
      const existing = db.prepare("SELECT id FROM matches WHERE user1_id = ? AND user2_id = ?").get(u1, u2);
      if (!existing) {
        db.prepare("INSERT INTO matches (id, user1_id, user2_id) VALUES (?, ?, ?)").run(uuid(), u1, u2);
      }
      matched = true;
    }
  }

  return NextResponse.json({ success: true, matched });
}
