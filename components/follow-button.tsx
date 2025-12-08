"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UserCheck, UserPlus } from "lucide-react";

interface FollowButtonProps {
  targetUserId: string;
  // NEW PROP: Callback to notify parent of a successful follow/unfollow action
  onActionSuccess: (targetUserId: string, newStatus: boolean) => void;
}

export function FollowButton({
  targetUserId,
  onActionSuccess,
}: FollowButtonProps) {
  const { userId, isSignedIn } = useAuth();
  const isCurrentUser = userId === targetUserId;

  // 1. STATE DECLARATIONS
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Initial Follow Status Check ---
  const checkFollowStatus = useCallback(async () => {
    // Bail out early if we don't need to check status (fixes "Missing ID" error)
    if (!isSignedIn || isCurrentUser || !targetUserId) {
      setIsLoadingStatus(false);
      return;
    }

    setIsLoadingStatus(true);
    setError(null);
    try {
      // GET /api/follow/status/[id]
      const res = await fetch(`/api/follow/status/${targetUserId}`);

      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.following);
      } else if (res.status !== 401) {
        const data = await res.json();
        setError(data.error || "Failed to check follow status.");
      }
    } catch (err) {
      setError("Network error while checking status.");
    } finally {
      setIsLoadingStatus(false);
    }
  }, [targetUserId, isSignedIn, isCurrentUser]);

  // --- useEffect to run status check ---
  // Runs on mount and whenever targetUserId or auth state changes
  useEffect(() => {
    checkFollowStatus();
  }, [checkFollowStatus]);

  // --- Follow/Unfollow Handler ---
  const handleAction = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    setError(null);

    const method = isFollowing ? "DELETE" : "POST";
    const actionText = isFollowing ? "unfollow" : "follow";

    try {
      const res = await fetch("/api/follow", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });

      if (res.ok) {
        const newStatus = !isFollowing;
        setIsFollowing(newStatus);

        // CRUCIAL: Notify the parent component of the change
        onActionSuccess(targetUserId, newStatus);
      } else {
        const data = await res.json();
        setError(data.error || `Failed to ${actionText}.`);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 2. CONDITIONAL EARLY RETURN
  if (isCurrentUser || !isSignedIn || !targetUserId) {
    return null;
  }

  // 3. Render logic: Loading State
  if (isLoadingStatus) {
    return (
      <Button variant="outline" size="sm" disabled>
        Loading...
      </Button>
    );
  }

  // 4. Render logic: Functional Follow/Unfollow Button
  return (
    <div className="flex flex-col items-start">
      <Button
        // When FOLLOWING, use 'outline' to show the current status and that clicking will UNFOLLOW
        variant={isFollowing ? "outline" : "default"}
        size="sm"
        onClick={handleAction}
        disabled={isUpdating}
        className="flex items-center space-x-1"
      >
        {isFollowing ? (
          <>
            <UserCheck className="w-4 h-4" />
            {isUpdating ? "Unfollowing..." : "Following"}
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            {isUpdating ? "Following..." : "Follow"}
          </>
        )}
      </Button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
