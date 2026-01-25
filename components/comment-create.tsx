"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { usePostScope } from "@/components/providers/post-scope-provider";

const ENGAGEMENT_BASE_URL =
  process.env.NEXT_PUBLIC_ENGAGEMENT_SERVICE_BASE_URL ||
  "http://localhost:4001";

interface CommentCreateProps {
  // postId REMOVED
  parentId?: string | null;
  onSuccess: (comment: any) => void;
}

export function CommentCreate({ parentId, onSuccess }: CommentCreateProps) {
  const { userId, isSignedIn } = useAuth();
  const { postId } = usePostScope(); // Grabbed from Context

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!content.trim() || !userId) return;

    setLoading(true);
    try {
      const res = await fetch(`${ENGAGEMENT_BASE_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId, // Using postId from context
          userId,
          content,
          parentId: parentId ?? null,
        }),
      });

      if (!res.ok) throw new Error("Failed to create comment");

      const comment = await res.json();
      setContent("");
      onSuccess(comment);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) return null;

  return (
    <div className="space-y-2">
      <Textarea
        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button onClick={submit} disabled={loading || !content.trim()}>
        {loading ? "Posting..." : parentId ? "Reply" : "Post comment"}
      </Button>
    </div>
  );
}
