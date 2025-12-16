"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { FollowButton } from "./follow-button";
import { UserPopover } from "./user-popover";
import { LikeButton } from "./like-button";
import { CommentButton } from "./comment-button";
import { CommentModal } from "./comment-modal";

interface Post {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onDeleteSuccess: (postId: string) => void;
  // NEW PROP: Function passed from PostList to notify of follow status changes
  onFollowUpdate: (targetUserId: string, newStatus: boolean) => void;
}

export function PostCard({
  post,
  onDeleteSuccess,
  onFollowUpdate,
}: PostCardProps) {
  const { userId, isSignedIn } = useAuth();
  const isOwner = userId === post.authorId;
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    setError(null);
    try {
      // DELETE /api/posts/:postId
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        onDeleteSuccess(post.id);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete post.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <UserPopover
            userId={post.authorId}
            username={post.authorId} // replace with real username if you have it
          />

          <div>
            <CardTitle className="text-lg">Post</CardTitle>
            <CardDescription>
              By <span className="font-medium">{post.authorId}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <LikeButton postId={post.id} />

          <FollowButton
            targetUserId={post.authorId}
            onActionSuccess={onFollowUpdate}
          />

          {isOwner && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Delete
            </Button>
          )}
        </div>

        <CommentButton onClick={() => setCommentsOpen(true)} />

        <CommentModal
          postId={post.id}
          open={commentsOpen}
          onOpenChange={setCommentsOpen}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
      </CardFooter>
    </Card>
  );
}
