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
    null
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
        type === "like"
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
      <div className="flex gap-2 pr-4">
        <div className="flex items-center gap-1">
          <span>{likes} </span>
          <button
            className={`btn btn-ghost btn-square size-6 ${
              userReaction === "like" ? "bg-blue-600 text-blue-600" : ""
            }`}
            onClick={() => handleReaction("like")}
          >
            👍
          </button>
        </div>
        <div className="flex items-center gap-1">
          <span>{dislikes} </span>

          <button
            className={`btn btn-ghost btn-square size-6 ${
              userReaction === "dislike" ? "bg-error text-red-600" : ""
            }`}
            onClick={() => handleReaction("dislike")}
          >
            👎
          </button>
        </div>
        {/* go to post's og page */}
        <div className="flex items-center gap-1">
          <span>{commentCount} </span>
          {parent_type !== "comment" ? (
            <Link href={`/${parent_type}/${parent_id}`}>
              <button className="btn btn-ghost btn-square size-6 ">💬</button>
            </Link>
          ) : (
            <div>💬</div>
          )}
        </div>
        {/* only auth users can leave reactions */}
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    </>
  );
};

export default Reactions;
