// app/api/user/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getClerkUser } from "@/services/user.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Check if the requester is authenticated (Optional but recommended)
    const { userId: requesterId } = await auth();
    if (!requesterId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get the ID from the path variable
    const { id } = await params;

    // 3. Fetch from Clerk via service
    const user = await getClerkUser(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const minimalUser = {
      id: user.id,
      username: user.username,
      email: user.emailAddresses[0]?.emailAddress ?? null,
    };

    return NextResponse.json(minimalUser);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
