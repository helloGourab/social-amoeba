"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { CommentCreate } from "./comment-create";
import { ReplyList } from "./reply-list";
import { usePostScope } from "@/components/providers/post-scope-provider";

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
  comment: Comment;
  onDelete: (id: string) => void;
  onUpdate: (comment: Comment) => void;
}

export function CommentItem({ comment, onDelete, onUpdate }: Props) {
  const { userId } = useAuth();
  const { authorId } = usePostScope();

  const isOwner = userId === comment.userId;
  const isOP = comment.userId === authorId;

  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  // State for username fetch
  const [username, setUsername] = useState<string>("...");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
        } else {
          setUsername("Unknown User");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUsername("Error");
      }
    };

    fetchUserData();
  }, [comment.userId]);

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
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">@{username}</p>
        {isOP && (
          <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase">
            OP
          </span>
        )}
      </div>

      {/* CONTENT */}
      {!editing ? (
        <p className="text-sm">{comment.content}</p>
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
            parentId={comment.id}
            onSuccess={() => {
              setReplying(false);
              setShowReplies(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
