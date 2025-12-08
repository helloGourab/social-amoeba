// components/post-list.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { PostCard } from "./post-card";
import { PostForm } from "./post-form";

interface Post {
  id: string;
  authorId: string; // Corrected field name to match your model
  content: string;
  createdAt: string;
}

interface PostListProps {
  apiPath: string; // e.g., /api/posts or /api/user/posts
  title: string;
}

export function PostList({ apiPath, title }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // NEW STATE: Key used to force a re-render/re-mount of PostCard children
  const [followUpdateKey, setFollowUpdateKey] = useState(0);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(apiPath, {
        method: "GET",
        // Next.js recommended way to prevent caching for dynamic data
        headers: { "Cache-Control": "no-cache" },
      });

      if (res.ok) {
        const data = await res.json();
        // Assuming your API returns an array of posts with 'authorId'
        setPosts(data);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to fetch posts.");
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching.");
    } finally {
      setIsLoading(false);
    }
  }, [apiPath]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostDeletion = (postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId)
    );
  };

  // NEW FUNCTION: Called when a follow/unfollow action is successful
  const handleFollowUpdate = (targetUserId: string, newStatus: boolean) => {
    // Increment the key to force all PostCard components to re-render,
    // which causes their FollowButton children to re-run their status checks.
    setFollowUpdateKey((prev) => prev + 1);
  };

  // For the main feed, we want the form, but not for the user's specific posts page
  const showForm = apiPath === "/api/posts";

  if (isLoading)
    return <div className="text-center py-8">Loading posts...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {showForm && <PostForm onPostCreated={fetchPosts} />}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts found.</p>
        ) : (
          posts.map((post) => (
            <PostCard
              // CRUCIAL: Combining the post ID with the update key forces a re-render
              // of this card and its children (FollowButton) when the follow status changes.
              key={`${post.id}-${followUpdateKey}`}
              post={post}
              onDeleteSuccess={handlePostDeletion}
              onFollowUpdate={handleFollowUpdate} // PASSING THE NEW CALLBACK
            />
          ))
        )}
      </div>
    </>
  );
}
