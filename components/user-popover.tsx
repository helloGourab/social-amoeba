"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, User, Users } from "lucide-react";

interface UserPopoverProps {
  userId: string;
  username: string;
}

export function UserPopover({ userId, username }: UserPopoverProps) {
  const [open, setOpen] = useState(false);
  const [followers, setFollowers] = useState<number | null>(null);
  const [following, setFollowing] = useState<number | null>(null);
  const [mutuals, setMutuals] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchCounts = async () => {
      setLoading(true);
      try {
        const [followersRes, followingRes, mutualsRes] = await Promise.all([
          fetch(`/api/follow/count/${userId}/follower`),
          fetch(`/api/follow/count/${userId}/following`),
          fetch(`/api/follow/count/${userId}/mutual`),
        ]);

        const followersData = await followersRes.json();
        const followingData = await followingRes.json();
        const mutualsData = await mutualsRes.json();

        setFollowers(followersData.count);
        setFollowing(followingData.count);
        setMutuals(mutualsData.count);
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
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:ring-2 hover:ring-offset-2 hover:ring-primary transition-all"
      >
        <User className="w-5 h-5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[320px] p-6">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-center text-lg font-bold">
              @{username}
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6 pt-4">
              {/* Primary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-2 rounded-lg bg-secondary/50">
                  <p className="text-xl font-bold">{followers ?? 0}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Followers
                  </p>
                </div>
                <div className="text-center p-2 rounded-lg bg-secondary/50">
                  <p className="text-xl font-bold">{following ?? 0}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Following
                  </p>
                </div>
              </div>

              {/* Mutuals Section */}
              <div className="flex items-center justify-center gap-2 pt-2 border-t">
                <Users className="w-4 h-4 text-blue-500" />
                <p className="text-sm font-medium">
                  <span className="font-bold">{mutuals ?? 0}</span> Mutual
                  Friends
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
