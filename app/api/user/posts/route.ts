// app/api/user/posts/route.ts
// GET /api/user/posts - Gets posts created by the authenticated user
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPostsByUser } from "@/services/post.service";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const posts = await getPostsByUser(userId);
    return NextResponse.json(posts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
