"use client";
import { useEffect, useState } from "react";
import CreateComment from "./CreateComment";
import { contentType } from "../types/models";
import { useAuth } from "../auth/auth-context";
import {
  addReaction,
  removeReaction,
  getUserReactions,
} from "../api/supabase-api/reaction-api";

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
  const [reactionId, setReactionId] = useState<number | null>(null); // needed for deletion

  const { session } = useAuth();
  const userID = session?.user.id;
  async function handleReaction(type: "like" | "dislike") {
    if (!userID) return; // must be logged in
    try {
      if (userReaction === type && reactionId) {
        // remove reaction
        await removeReaction(userID, reactionId);
        setUserReaction(null);
        setReactionId(null);
      } else {
        // add or switch reaction
        const newReaction = await addReaction(
          userID,
          parent_type,
          parent_id,
          type === "like"
        );
        setUserReaction(type);
        setReactionId(newReaction.id);
      }
    } catch (err) {
      console.error("Failed to update reaction:", err);
    }
  }

  useEffect(() => {
    const getReaction = async () => {
      if (userID) {
        console.log("userid", userID);
        console.log("parenttype", parent_type);
        console.log("parentid", parent_id);

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
          <span>{likeCount} </span>
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
          <span>{dislikeCount} </span>

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
          <button className="btn btn-ghost btn-square size-6 ">💬</button>
        </div>
      </div>
    </>
  );
};

export default Reactions;
