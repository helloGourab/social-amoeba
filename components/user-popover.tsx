"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, User } from "lucide-react";

interface UserPopoverProps {
  userId: string;
  username: string;
}

export function UserPopover({ userId, username }: UserPopoverProps) {
  const [open, setOpen] = useState(false);
  const [followers, setFollowers] = useState<number | null>(null);
  const [following, setFollowing] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchCounts = async () => {
      setLoading(true);
      try {
        const [followersRes, followingRes] = await Promise.all([
          fetch(`/api/follow/count/${userId}/follower`),
          fetch(`/api/follow/count/${userId}/following`),
        ]);

        const followersData = await followersRes.json();
        const followingData = await followingRes.json();

        setFollowers(followersData.count);
        setFollowing(followingData.count);
      } catch (err) {
        console.error("Failed to fetch follow counts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [open, userId]);

  return (
    <>
      {/* Clickable fake avatar */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white hover:opacity-80 transition"
      >
        <User className="w-5 h-5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle className="text-center">@{username}</DialogTitle>
          </DialogHeader>

          <div className="flex justify-around mt-4 text-center">
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              <>
                <div>
                  <p className="text-xl font-bold">{followers ?? "-"}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>

                <div>
                  <p className="text-xl font-bold">{following ?? "-"}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
