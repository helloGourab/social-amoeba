import { getNeo4jSession } from "../lib/neo4j";

export async function getFollowerCount(userId: string) {
  const session = getNeo4jSession();

  try {
    const result = await session.run(
      `
      MATCH (:User)-[r:FOLLOWS]->(u:User {id: $userId})
      RETURN COUNT(r) AS count
      `,
      { userId }
    );

    return result.records[0].get("count").toNumber();
  } finally {
    await session.close();
  }
}

export async function getFollowingCount(userId: string) {
  const session = getNeo4jSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[r:FOLLOWS]->(:User)
      RETURN COUNT(r) AS count
      `,
      { userId }
    );

    return result.records[0].get("count").toNumber();
  } finally {
    await session.close();
  }
}


export async function isFollowing(followerId: string, followeeId: string) {
  const session = getNeo4jSession();

  try {
    const result = await session.run(
      `
      MATCH (a:User {id: $followerId})-[r:FOLLOWS]->(b:User {id: $followeeId})
      RETURN COUNT(r) AS count
      `,
      { followerId, followeeId }
    );

    const count = result.records[0].get("count").toNumber();
    return count > 0;
  } finally {
    await session.close();
  }
}

export async function followUser(followerId: string, followeeId: string) {
  if (followerId === followeeId) throw new Error("You can't follow yourself");

  const alreadyFollowing = await isFollowing(followerId, followeeId);
  if (alreadyFollowing) {
    throw new Error("Already following");
  }

  const session = getNeo4jSession();

  try {
    await session.run(
      `
      MERGE (a:User {id: $followerId})
      MERGE (b:User {id: $followeeId})
      MERGE (a)-[:FOLLOWS]->(b)
      `,
      { followerId, followeeId }
    );

    return { success: true, action: "followed" };
  } finally {
    await session.close();
  }
}

export async function unfollowUser(followerId: string, followeeId: string) {
  if (followerId === followeeId) throw new Error("You can't unfollow yourself");

  const alreadyFollowing = await isFollowing(followerId, followeeId);
  if (!alreadyFollowing) {
    throw new Error("Not following");
  }

  const session = getNeo4jSession();

  try {
    await session.run(
      `
      MATCH (a:User {id: $followerId})-[r:FOLLOWS]->(b:User {id: $followeeId})
      DELETE r
      `,
      { followerId, followeeId }
    );

    return { success: true, action: "unfollowed" };
  } finally {
    await session.close();
  }
}
