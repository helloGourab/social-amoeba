"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CommentList } from "./comment-list";
import { CommentCreate } from "./comment-create";

interface CommentModalProps {
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommentModal({
  postId,
  open,
  onOpenChange,
}: CommentModalProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl space-y-4">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

        <CommentCreate
          postId={postId}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />

        <CommentList postId={postId} key={refreshKey} />
      </DialogContent>
    </Dialog>
  );
}
