import { prisma } from "../lib/prisma";

export async function createPost(
  authorId: string,
  authorName: string | null,
  content: string
) {
  if (!content || content.trim().length === 0) {
    throw new Error("Post content cannot be empty");
  }

  return prisma.post.create({
    data: {
      authorId,
      authorName,
      content,
    },
  });
}

export async function getAllPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostsByUser(userId: string) {
  return prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deletePost(postId: string, authorId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) throw new Error("Post not found");
  if (post.authorId !== authorId) throw new Error("Unauthorized");

  await prisma.post.delete({ where: { id: postId } });

  return { success: true };
}
