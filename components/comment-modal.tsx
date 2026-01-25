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
// Import the hook

interface CommentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommentModal({
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
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />

        <CommentList key={refreshKey} />
      </DialogContent>
    </Dialog>
  );
}