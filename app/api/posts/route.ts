// app/api/posts/route.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createPost, getAllPosts } from "../../../services/post.service";

// create new post
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Fetch full user object to get the username
    const user = await currentUser();
    const username = user?.username || "Anon";

    const { content } = await req.json();

    // Pass the username to your service
    const post = await createPost(userId, username, content);

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// fetch all posts
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
