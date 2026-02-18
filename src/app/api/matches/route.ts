import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const db = getDb();
  const matches = db
    .prepare(`
      SELECT m.id as match_id, m.created_at as matched_at,
        CASE WHEN m.user1_id = ? THEN m.user2_id ELSE m.user1_id END as other_user_id
      FROM matches m
      WHERE m.user1_id = ? OR m.user2_id = ?
      ORDER BY m.created_at DESC
    `)
    .all(user.id, user.id, user.id) as { match_id: string; matched_at: string; other_user_id: string }[];

  const result = matches.map((m) => {
    const other = db.prepare("SELECT id, name, college, major, grad_year, photo_url, bio FROM users WHERE id = ?").get(m.other_user_id) as Record<string, unknown>;
    const lastMsg = db
      .prepare("SELECT content, sender_id, created_at FROM messages WHERE match_id = ? ORDER BY created_at DESC LIMIT 1")
      .get(m.match_id) as { content: string; sender_id: string; created_at: string } | undefined;

    return {
      matchId: m.match_id,
      matchedAt: m.matched_at,
      user: {
        id: other.id,
        name: other.name,
        college: other.college,
        major: other.major,
        grad_year: other.grad_year,
        photo_url: other.photo_url,
        bio: other.bio,
      },
      lastMessage: lastMsg
        ? { content: lastMsg.content, isMe: lastMsg.sender_id === user.id, time: lastMsg.created_at }
        : null,
    };
  });

  return NextResponse.json({ matches: result });
}
