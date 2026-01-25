// components/providers/post-scope-provider.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";

interface PostScope {
  postId: string;
  authorId: string;
  authorName: string;
}

const PostScopeContext = createContext<PostScope | undefined>(undefined);

export function PostScopeProvider({ value, children }: { value: PostScope; children: ReactNode }) {
  return (
    <PostScopeContext.Provider value={value}>
      {children}
    </PostScopeContext.Provider>
  );
}

export function usePostScope() {
  const context = useContext(PostScopeContext);
  if (!context) {
    throw new Error("usePostScope must be used within a PostScopeProvider");
  }
  return context;
}