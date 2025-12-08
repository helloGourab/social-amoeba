// app/api/follow/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { followUser, unfollowUser } from "../../../services/follow.service";

export async function POST(req: Request) {
  try {
    console.log("POST /api/follow - Request received");

    const { userId } = await auth();
    if (!userId) {
      console.error("POST /api/follow - Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      console.error("POST /api/follow - Missing targetUserId in request body");
      return NextResponse.json(
        { error: "Missing targetUserId" },
        { status: 400 }
      );
    }

    console.log(
      `POST /api/follow - User ${userId} attempting to follow ${targetUserId}`
    );
    const result = await followUser(userId, targetUserId);
    console.log(
      `POST /api/follow - User ${userId} successfully followed ${targetUserId}`
    );
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("POST /api/follow - Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    console.log("DELETE /api/follow - Request received");

    const { userId } = await auth();
    if (!userId) {
      console.error("DELETE /api/follow - Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      console.error(
        "DELETE /api/follow - Missing targetUserId in request body"
      );
      return NextResponse.json(
        { error: "Missing targetUserId" },
        { status: 400 }
      );
    }

    console.log(
      `DELETE /api/follow - User ${userId} attempting to unfollow ${targetUserId}`
    );
    const result = await unfollowUser(userId, targetUserId);
    console.log(
      `DELETE /api/follow - User ${userId} successfully unfollowed ${targetUserId}`
    );
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("DELETE /api/follow - Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
