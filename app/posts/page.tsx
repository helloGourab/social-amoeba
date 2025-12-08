// app/posts/page.tsx (Path: /posts)
import { PostList } from "@/components/post-list";

// Simple wrapper component to handle client-side fetching and state for the feed
const Feed = () => {
  // Client component for data fetching and state management
  // The PostList component handles the GET /api/posts request
  return <PostList apiPath="/api/posts" title="Global Feed" />;
};

export default function PostsHomePage() {
  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Social Feed</h1>
      <Feed />
    </main>
  );
}
