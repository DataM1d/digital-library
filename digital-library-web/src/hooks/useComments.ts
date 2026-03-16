import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { PostComment } from "@/types";

export function useComments(postSlug: string) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!postSlug) return;
    try {
      setIsLoading(true);
      const data = await api.comments.getByPost(postSlug);
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [postSlug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async (content: string, parentId?: number) => {
    setIsSubmitting(true);
    try {
      await api.comments.create(postSlug, content, parentId);
      await fetchComments();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
        setIsSubmitting(false);
    }
  };

  return {
    comments,
    isLoading,
    isSubmitting,
    addComment,
    };
 }