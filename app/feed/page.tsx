import { PostList } from "@/components/post-list";
import { ListIcon } from "lucide-react";

// This page renders the personalized feed based on user followings.
export default function UserFeedPage() {
  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center space-x-3">
        <ListIcon className="w-8 h-8 text-blue-600" />
        <span>Your Personalized Feed</span>
      </h1>
      <p className="text-gray-600 mb-6">Posts from people you follow.</p>

      {/* The PostList component is reused, pointing to the new API endpoint: /api/feed.
        The PostList component handles the client-side fetching and state management.
      */}
      <PostList apiPath="/api/feed" title="Recent Activity" />
    </main>
  );
}
