// app/api/follow/count/[id]/follower/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getFollowingCount } from "../../../../../../services/follow.service";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("GET /api/follow/count - Request received");

    const { userId } = await auth();
    if (!userId) {
      console.error("GET /api/follow/count - Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const targetUserId = resolvedParams.id;

    if (!targetUserId) {
      console.error("GET /api/follow/count - Missing user ID param");
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const count = await getFollowingCount(targetUserId);

    console.log(
      `GET /api/follow/count - Requested by ${userId}, target ${targetUserId}, total users: ${count}`
    );

    return NextResponse.json({ count });
  } catch (err: any) {
    console.error("GET /api/follow/count - Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
