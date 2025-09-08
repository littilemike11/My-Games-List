"use client";
import { useState } from "react";
import CreateComment from "./CreateComment";
import { contentType } from "../types/models";

type ReactionProps = {
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
};

const Reactions: React.FC<ReactionProps> = ({
  likeCount,
  dislikeCount,
  commentCount,
}) => {
  const [userReaction, setUserReaction] = useState<"like" | "dislike" | null>(
    null
  );
  function handleReaction(type: "like" | "dislike") {
    if (userReaction === type) {
      setUserReaction(null); // remove reaction
    } else {
      setUserReaction(type); // switch or add
    }
  }

  return (
    <>
      <div className="flex gap-2 pr-4">
        <div className="flex items-center gap-1">
          <span>{likeCount + (userReaction == "like" ? 1 : 0)} </span>
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
          <span>{dislikeCount + (userReaction == "dislike" ? 1 : 0)} </span>

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
