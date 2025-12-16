"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { CommentCreate } from "./comment-create";
import { ReplyList } from "./reply-list";

const ENGAGEMENT_BASE_URL =
  process.env.NEXT_PUBLIC_ENGAGEMENT_SERVICE_BASE_URL ||
  "http://localhost:4001";

interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

interface Props {
  postId: string;
  comment: Comment;
  onDelete: (id: string) => void;
  onUpdate: (comment: Comment) => void;
}

export function CommentItem({ postId, comment, onDelete, onUpdate }: Props) {
  const { userId } = useAuth();
  const isOwner = userId === comment.userId;

  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${ENGAGEMENT_BASE_URL}/api/comments/${comment.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      onUpdate(updated);
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete this comment?")) return;

    try {
      await fetch(`${ENGAGEMENT_BASE_URL}/api/comments/${comment.id}`, {
        method: "DELETE",
      });
      onDelete(comment.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="border rounded-md p-3 space-y-3">
      <p className="text-sm font-medium">{comment.userId}</p>

      {/* CONTENT */}
      {!editing ? (
        <p>{comment.content}</p>
      ) : (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      )}

      {/* ACTIONS */}
      <div className="flex gap-2 text-sm">
        {!editing && isOwner && (
          <>
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button size="sm" variant="ghost" onClick={remove}>
              Delete
            </Button>
          </>
        )}

        {!editing && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setReplying((v) => !v);
                setShowReplies(false);
              }}
            >
              Reply
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowReplies((v) => !v);
                setReplying(false);
              }}
            >
              {showReplies ? "Hide replies" : "View replies"}
            </Button>
          </>
        )}

        {editing && (
          <>
            <Button size="sm" onClick={save} disabled={loading}>
              {loading ? "Saving…" : "Save"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditing(false);
                setContent(comment.content);
              }}
            >
              Cancel
            </Button>
          </>
        )}
      </div>

      {/* REPLIES */}
      {showReplies && <ReplyList commentId={comment.id} />}

      {replying && (
        <div className="pl-4 border-l space-y-2">
          <CommentCreate
            postId={postId}
            parentId={comment.id}
            onSuccess={() => setReplying(false)}
          />
        </div>
      )}
    </div>
  );
}
