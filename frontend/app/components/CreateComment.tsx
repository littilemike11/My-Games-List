"use client";

import { useState, useRef } from "react";
import { contentType } from "../types/models";
import { createComment } from "../api/supabase-api/comment-api";
import { useAuth } from "../auth/auth-context";
import AuthModal from "./AuthModal";
const CreateComment: React.FC<{
  parentType: contentType;
  parentID: number;
  onComment: Function;
}> = ({ parentType, parentID, onComment }) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { session } = useAuth();
  const userID = session?.user.id;

  const handleComment = () => {
    if (userID) {
      setIsCommenting(true);
    } else {
      setShowAuth(true);
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !userID) return;
    setIsSubmitting(true);
    try {
      if (parentType === "comment") {
        await createComment(newComment, userID, parentType, parentID, parentID);
      } else {
        await createComment(newComment, userID, parentType, parentID);
      }
      onComment(); // get new comments
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
        <div>
          <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

          <button
            onClick={handleComment}
            className="btn btn-primary self-start"
          >
            {parentType === "comment" ? "Reply" : "Add a comment"}
          </button>
        </div>
      )}
    </>
  );
};

export default CreateComment;
