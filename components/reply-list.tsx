"use client";

import { useEffect, useState } from "react";

const ENGAGEMENT_BASE_URL =
  process.env.NEXT_PUBLIC_ENGAGEMENT_SERVICE_URL || "http://localhost:4001";

interface Reply {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

interface ReplyListProps {
  commentId: string;
}

export function ReplyList({ commentId }: ReplyListProps) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchReplies = async () => {
    if (loaded) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${ENGAGEMENT_BASE_URL}/api/comments/replies/${commentId}`
      );

      if (!res.ok) throw new Error("Failed to fetch replies");

      const data = await res.json();
      setReplies(Array.isArray(data) ? data : []);
      setLoaded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pl-4 border-l space-y-3">
      <button
        onClick={fetchReplies}
        className="text-sm text-muted-foreground hover:underline"
      >
        {loaded ? "Replies" : "View replies"}
      </button>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading replies…</p>
      )}

      {loaded &&
        replies.map((reply) => (
          <div key={reply.id} className="rounded-md bg-muted p-2">
            <p className="text-sm font-medium">{reply.userId}</p>
            <p className="text-sm">{reply.content}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(reply.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

      {loaded && replies.length === 0 && (
        <p className="text-sm text-muted-foreground">No replies yet.</p>
      )}
    </div>
  );
}
