// app/api/feed/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getFeedPosts } from "../../../services/feed.service";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    console.log(`[API] GET /api/feed requested by ${userId}`);

    const feed = await getFeedPosts(userId);
    return NextResponse.json(feed);
  } catch (err: any) {
    console.error(`[API ERROR] GET /api/feed`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
