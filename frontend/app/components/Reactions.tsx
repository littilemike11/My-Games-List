"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { contentType } from "../types/models";
import { useAuth } from "../auth/auth-context";

import {
  addReaction,
  removeReaction,
  getUserReactions,
} from "../api/supabase-api/reaction-api";
import AuthModal from "./AuthModal";

type ReactionProps = {
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  parent_type: contentType;
  parent_id: number;
};

const Reactions: React.FC<ReactionProps> = ({
  likeCount,
  dislikeCount,
  commentCount,
  parent_type,
  parent_id,
}) => {
  const [userReaction, setUserReaction] = useState<"like" | "dislike" | null>(
    null,
  );
  const [likes, setLikes] = useState(likeCount);
  const [dislikes, setDislikes] = useState(dislikeCount);

  const [reactionId, setReactionId] = useState<number | null>(null); // needed for deletion

  const { session } = useAuth();
  const userID = session?.user.id;
  const [showAuth, setShowAuth] = useState(false);

  async function handleReaction(type: "like" | "dislike") {
    try {
      if (!userID) {
        setShowAuth(true);
        return;
      }

      // removing existing reaction
      if (userReaction === type && reactionId) {
        await removeReaction(userID, reactionId);

        if (type === "like") setLikes((l) => l - 1);
        if (type === "dislike") setDislikes((d) => d - 1);

        setUserReaction(null);
        setReactionId(null);
        return;
      }

      // switching reaction
      if (userReaction && userReaction !== type) {
        if (userReaction === "like") setLikes((l) => l - 1);
        if (userReaction === "dislike") setDislikes((d) => d - 1);
      }

      const newReaction = await addReaction(
        userID,
        parent_type,
        parent_id,
        type === "like",
      );

      if (type === "like") setLikes((l) => l + 1);
      if (type === "dislike") setDislikes((d) => d + 1);

      setUserReaction(type);
      setReactionId(newReaction.id);
    } catch (err) {
      console.error("Failed to update reaction:", err);
    }
  }

  useEffect(() => {
    const getReaction = async () => {
      if (userID) {
        const response = await getUserReactions(userID, parent_type, parent_id);
        if (response) {
          setUserReaction(response.is_like ? "like" : "dislike");
          setReactionId(response.id);
        }
      }
    };
    getReaction();
  }, [userID]);

  return (
    <>
      <div className="flex gap-2 pr-4 text-sm">
        <div className="flex items-center gap-1">
          <span aria-label={`${likes} likes`}>{likes}</span>
          <button
            type="button"
            aria-label="Like"
            aria-pressed={userReaction === "like"}
            className={`btn btn-ghost btn-square size-6 ${
              userReaction === "like" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => handleReaction("like")}
          >
            <span aria-hidden="true">👍</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <span aria-label={`${dislikes} dislikes`}>{dislikes}</span>
          <button
            type="button"
            aria-label="Dislike"
            aria-pressed={userReaction === "dislike"}
            className={`btn btn-ghost btn-square size-6 ${
              userReaction === "dislike" ? "bg-error text-white" : ""
            }`}
            onClick={() => handleReaction("dislike")}
          >
            <span aria-hidden="true">👎</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <span aria-label={`${commentCount} comments`}>{commentCount}</span>

          {parent_type !== "comment" ? (
            <Link
              href={`/${parent_type}/${parent_id}`}
              aria-label={`View ${commentCount} comments`}
              className="btn btn-ghost btn-square size-6"
            >
              <span aria-hidden="true">💬</span>
            </Link>
          ) : (
            <span aria-hidden="true">💬</span>
          )}
        </div>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Reactions;
