"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

interface LikeButtonProps {
  postId: string;
}

const ENGAGEMENT_BASE_URL =
  process.env.NEXT_PUBLIC_ENGAGEMENT_SERVICE_BASE_URL;

export function LikeButton({ postId }: LikeButtonProps) {
  const { userId, isSignedIn } = useAuth();

  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchLikeState = async () => {
      try {
        const [checkRes, countRes] = await Promise.all([
          fetch(
            `${ENGAGEMENT_BASE_URL}/api/likes/check?userId=${userId}&postId=${postId}`
          ),
          fetch(`${ENGAGEMENT_BASE_URL}/api/likes/count/${postId}`),
        ]);

        if (!checkRes.ok || !countRes.ok) {
          throw new Error("Failed to fetch like data");
        }

        const checkData = await checkRes.json();
        const countData = await countRes.json();

        setLiked(checkData.liked);
        setCount(countData.count);
      } catch (err) {
        console.error("Error fetching like data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikeState();
  }, [userId, postId]);

  const toggleLike = async () => {
    if (!userId || !isSignedIn || mutating) return;

    setMutating(true);

    // optimistic update
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => (nextLiked ? c + 1 : c - 1));

    try {
      const res = await fetch(`${ENGAGEMENT_BASE_URL}/api/likes`, {
        method: nextLiked ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, postId }),
      });

      if (!res.ok) {
        throw new Error("Like mutation failed");
      }
    } catch (err) {
      console.error(err);
      // rollback
      setLiked(liked);
      setCount((c) => (liked ? c + 1 : c - 1));
    } finally {
      setMutating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Heart className="w-4 h-4" /> …
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLike}
      disabled={!isSignedIn || mutating}
      className="flex items-center gap-2"
    >
      <Heart
        className={`w-4 h-4 transition ${
          liked
            ? "fill-red-500 text-red-500"
            : "text-gray-500 hover:text-red-500"
        }`}
      />
      <span className="text-sm">{count}</span>
    </Button>
  );
}
