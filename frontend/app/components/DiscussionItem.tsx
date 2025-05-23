"use client"; // needed for usestate
import { useState } from "react";
import { Discussion } from "../types/models";

const DiscussionItem: React.FC<{ discussion: Discussion }> = ({
  discussion,
}) => {
  const [showComment, setShowComment] = useState(false);
  const formattedDate = new Date(discussion.date).toLocaleDateString();
  return (
    <>
      <div className="card ">
        <div className="card-body">
          <div className="flex justify-between items-center mb-2">
            <h2 className="card-title text-lg font-semibold">
              {discussion.title}
            </h2>
            <span className="text-sm opacity-50">{formattedDate}</span>
          </div>
          <div className="flex gap-3">
            {discussion.tags?.map((tag, index) => (
              <div key={index} className="badge badge-outline">
                {tag}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-start gap-3">
            <img
              className="size-8 rounded-box "
              src="https://img.daisyui.com/images/profile/demo/1@94.webp"
            />
            <span>{discussion.userID}</span>
            {/* <span className="font-semibold">{review.gameID}</span> */}
          </div>
          <p>{discussion.text}</p>
          <div className="card-actions">
            <div className="flex items-center gap-4 text-sm ">
              <div className="flex items-center gap-1">
                <button className="btn btn-ghost btn-square size-8">👍</button>
                <span>{discussion.likes}</span>
              </div>

              <div className="flex items-center gap-1">
                <button className="btn btn-ghost btn-square size-8">👎</button>
                <span>{discussion.dislikes}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowComment(!showComment)}
                  className="btn btn-ghost btn-square size-10"
                >
                  💬<span>{discussion.comments?.length}</span>
                </button>

                {showComment && discussion.comments && (
                  <div className="flex flex-col">
                    {discussion.comments.map((comment, index) => (
                      <p key={index}>{comment}</p>
                    ))}
                  </div>
                )}
              </div>
              {/* <button className="btn btn-primary">Listen</button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DiscussionItem;
