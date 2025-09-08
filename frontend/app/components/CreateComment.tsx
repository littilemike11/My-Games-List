"use client";

import { useState, useRef } from "react";
import { contentType } from "../types/models";
import { createComment } from "../api/supabase-api/comment-api";
import { useAuth } from "../auth/auth-context";

const CreateComment: React.FC<{
  parentType: contentType;
  parentID: number;
}> = ({ parentType, parentID }) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuth();
  const userID = session?.user.id;

  const addComment = async () => {
    if (!newComment.trim() || !userID) return;
    setIsSubmitting(true);
    try {
      await createComment(newComment, userID, parentType, parentID);
      setNewComment("");
      setIsCommenting(false);
    } catch (error) {
      console.error(error);
      // optionally show toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isCommenting ? (
        <div className="flex flex-col space-y-2 w-full">
          <textarea
            className="textarea textarea-bordered w-full rounded-xl"
            placeholder={
              parentType === "comment" ? "Add a reply..." : "Add a comment..."
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addComment();
              }
            }}
          />
          <div className="flex gap-2 self-end">
            <button
              className="btn btn-ghost"
              onClick={() => setIsCommenting(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={addComment}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Posting..."
                : parentType === "comment"
                ? "Reply"
                : "Comment"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsCommenting(true)}
          className="btn btn-ghost self-start"
        >
          {parentType === "comment" ? "Reply" : "Add a comment"}
        </button>
      )}
    </>
  );
};

export default CreateComment;
