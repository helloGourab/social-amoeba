// components/post-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";

interface PostFormProps {
  onPostCreated: () => void;
}

export function PostForm({ onPostCreated }: PostFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !isSignedIn) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // POST /api/posts
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setContent("");
        onPostCreated(); // Refresh the list of posts
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create post.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <Card className="mb-8">
        <CardContent className="py-4 text-center text-gray-500">
          Sign in to create a new post.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>What's on your mind?</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="mb-8">
          <Textarea
            placeholder="Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            disabled={isSubmitting}
          />
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Posting..." : "Create Post"}
          </Button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardFooter>
      </form>
    </Card>
  );
}
