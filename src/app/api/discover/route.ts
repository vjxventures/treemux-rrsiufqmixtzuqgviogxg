import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDiscoverProfiles } from "@/lib/matching";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const profiles = getDiscoverProfiles(user);
  return NextResponse.json({ profiles });
}
