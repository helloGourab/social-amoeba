// app/posts/my-posts/page.tsx (Path: /posts/my-posts)
import { PostList } from "@/components/post-list";

export default function MyPostsPage() {
  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Your Posts</h1>
      {/* The PostList component handles the GET /api/user/posts request */}
      <PostList apiPath="/api/user/posts" title="Your Content" />
    </main>
  );
}
