import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, name, age, gender, interested_in, college, major, grad_year, bio, activities, study_spots } = body;

  if (!email || !password || !name || !age || !gender || !interested_in || !college || !major || !grad_year) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!email.endsWith("@andrew.cmu.edu")) {
    return NextResponse.json({ error: "Must use an @andrew.cmu.edu email" }, { status: 400 });
  }

  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const id = uuid();
  const passwordHash = bcrypt.hashSync(password, 10);

  db.prepare(`
    INSERT INTO users (id, email, password_hash, name, age, gender, interested_in, college, major, grad_year, bio, photo_url, activities, study_spots)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?, ?)
  `).run(id, email, passwordHash, name, age, gender, interested_in, college, major, grad_year, bio || "", JSON.stringify(activities || []), JSON.stringify(study_spots || []));

  const response = NextResponse.json({ success: true, userId: id });
  response.cookies.set("session_id", id, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  return response;
}
