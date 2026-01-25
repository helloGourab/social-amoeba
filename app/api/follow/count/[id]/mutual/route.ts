// app/api/follow/count/[id]/mutual/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getMutualCount } from "../../../../../../services/follow.service";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: targetUserId } = await params;

    if (!targetUserId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    // Don't calculate mutuals with yourself
    if (currentUserId === targetUserId) {
      return NextResponse.json({ count: 0 });
    }

    const count = await getMutualCount(currentUserId, targetUserId);

    return NextResponse.json({ count });
  } catch (err: any) {
    console.error("GET /api/follow/count/mutual - Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
