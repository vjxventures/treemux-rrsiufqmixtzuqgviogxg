import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuid } from "uuid";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const matchId = req.nextUrl.searchParams.get("matchId");
  if (!matchId) {
    return NextResponse.json({ error: "matchId required" }, { status: 400 });
  }

  // Verify user is part of match
  const db = getDb();
  const match = db
    .prepare("SELECT * FROM matches WHERE id = ? AND (user1_id = ? OR user2_id = ?)")
    .get(matchId, user.id, user.id);
  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const messages = db
    .prepare("SELECT id, sender_id, content, created_at FROM messages WHERE match_id = ? ORDER BY created_at ASC")
    .all(matchId) as { id: string; sender_id: string; content: string; created_at: string }[];

  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m.id,
      senderId: m.sender_id,
      content: m.content,
      createdAt: m.created_at,
      isMe: m.sender_id === user.id,
    })),
  });
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { matchId, content } = await req.json();
  if (!matchId || !content?.trim()) {
    return NextResponse.json({ error: "matchId and content required" }, { status: 400 });
  }

  const db = getDb();
  const match = db
    .prepare("SELECT * FROM matches WHERE id = ? AND (user1_id = ? OR user2_id = ?)")
    .get(matchId, user.id, user.id);
  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const id = uuid();
  db.prepare("INSERT INTO messages (id, match_id, sender_id, content) VALUES (?, ?, ?, ?)").run(
    id,
    matchId,
    user.id,
    content.trim()
  );

  return NextResponse.json({
    message: { id, senderId: user.id, content: content.trim(), isMe: true, createdAt: new Date().toISOString() },
  });
}
