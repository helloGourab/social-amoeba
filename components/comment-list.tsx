"use client";

import { useEffect, useState } from "react";
import { CommentItem } from "./comment-item";
import { usePostScope } from "@/components/providers/post-scope-provider";

const ENGAGEMENT_BASE_URL =
  process.env.NEXT_PUBLIC_ENGAGEMENT_SERVICE_URL || "http://localhost:4001";

interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export function CommentList() {
  const { postId } = usePostScope(); // Pull from context
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${ENGAGEMENT_BASE_URL}/api/comments/${postId}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch comments (${res.status})`);
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setComments(data);
        } else {
          setComments([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load comments");
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleDelete = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdate = (updated: Comment) => {
    setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading comments…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {comments.length === 0 && (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      )}

      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
}
