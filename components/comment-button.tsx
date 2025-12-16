"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommentButtonProps {
  onClick: () => void;
}

export function CommentButton({ onClick }: CommentButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2"
    >
      <MessageCircle className="w-4 h-4" />
      Comments
    </Button>
  );
}
