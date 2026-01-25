// services/user.service.ts
import { createClerkClient } from "@clerk/nextjs/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function getClerkUser(clerkUserId: string) {
  try {
    const user = await clerkClient.users.getUser(clerkUserId);
    return user;
  } catch (error: any) {
    if (error.status === 404) return null;
    throw new Error(`Failed to fetch user from Clerk: ${error.message}`);
  }
}
