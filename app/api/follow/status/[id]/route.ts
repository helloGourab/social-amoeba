// app/api/follow/status/[id]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isFollowing } from "../../../../../services/follow.service";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("GET /api/follow/status - Request received");

    const { userId } = await auth();
    if (!userId) {
      console.error("GET /api/follow/status - Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // FIX: Await params to ensure it's resolved before accessing 'id'.
    // Although the type signature ({ params: { id: string } }) suggests it's already unwrapped,
    // the runtime error indicates it's being treated as a Promise in this execution context.
    const resolvedParams = await params;
    const targetUserId = resolvedParams.id; // Access the ID from the resolved object

    if (!targetUserId) {
      console.error("GET /api/follow/status - Missing user ID param");
      return NextResponse.json(
        { error: "Missing target user ID" },
        { status: 400 }
      );
    }

    const following = await isFollowing(userId, targetUserId);

    console.log(
      `GET /api/follow/status - ${userId} is ${
        following ? "" : "not "
      }following ${targetUserId}`
    );

    return NextResponse.json({ following });
  } catch (err: any) {
    // If the promise error occurs, it will be caught here.
    console.error("GET /api/follow/status - Error:", err.message);
    // You might want to distinguish the error here, but handling it generally works.
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
