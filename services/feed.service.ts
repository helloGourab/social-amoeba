import { prisma } from "../lib/prisma";
import { getNeo4jSession } from "../lib/neo4j";

export async function getRelevantUserIds(userId: string): Promise<string[]> {
  const session = getNeo4jSession();

  console.log(`[NEO4J] Fetching up to 2-degree follows for user: ${userId}`);

  try {
    const result = await session.run(
      `
      MATCH (me:User {id: $userId})-[:FOLLOWS*1..2]->(other:User)
      WHERE me <> other
      RETURN DISTINCT other.id AS id
      `,
      { userId }
    );

    const ids = result.records.map((record) => record.get("id"));

    console.log(
      `[NEO4J] Found ${ids.length} users in 2-level feed scope for ${userId}`
    );

    return ids;
  } finally {
    await session.close();
  }
}

export async function getFeedPosts(userId: string) {
  // Step 1: get 1st & 2nd degree user IDs
  const userIds = await getRelevantUserIds(userId);

  // If nobody relevant, no feed
  if (userIds.length === 0) {
    console.log(`[FEED] Empty network for ${userId}, returning []`);
    return [];
  }

  console.log(`[FEED] Fetching posts for users:`, userIds);

  // Step 2: fetch posts from all relevant users
  const posts = await prisma.post.findMany({
    where: { authorId: { in: userIds } },
    orderBy: { createdAt: "desc" },
  });

  console.log(`[FEED] Returning ${posts.length} posts for ${userId}`);

  return posts;
}
