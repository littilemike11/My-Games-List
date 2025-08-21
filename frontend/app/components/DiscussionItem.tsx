"use client"; // needed for usestate
import { useState } from "react";
import { Discussion } from "../types/models";
import { formatDate } from "../utils/functions";
const DiscussionItem: React.FC<{ discussion: Discussion }> = ({
  discussion,
}) => {
  const [showComment, setShowComment] = useState(false);
  return (
    <>
      <div className="card bg-base-100 w-full rounded-lg shadow-sm">
        <div className="card-body space-y-4">
          {/* Title */}
          <h2 className="card-title  line-clamp-2 font-semibold">
            {discussion.title}
          </h2>

          {/* Author info and date */}
          <div className="flex items-center justify-between text-sm ">
            <div className="flex items-center gap-3">
              <img
                src="https://img.daisyui.com/images/profile/demo/1@94.webp"
                alt={`Profile of ${
                  discussion.profiles?.username || "Deleted User"
                }`}
                className="w-8 h-8 rounded-full object-cover"
                loading="lazy"
              />
              <span className="italic">
                {discussion.profiles?.username || "(deleted)"}
              </span>
            </div>
            <time className="opacity-50">
              {formatDate(discussion.created_at)}
            </time>
          </div>

          {/* Content preview */}
          <p>{discussion.content}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {discussion.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="badge badge-outline cursor-pointer select-none"
                aria-label={`Tag: ${tag}`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="card-actions flex items-center gap-6 text-sm">
            {/* Likes */}
            <button
              aria-label="Like"
              className="btn btn-ghost btn-square w-8 h-8 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
              type="button"
            >
              👍
            </button>
            <span>{discussion.likes}</span>

            {/* Dislikes */}
            <button
              aria-label="Dislike"
              className="btn btn-ghost btn-square w-8 h-8 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
              type="button"
            >
              👎
            </button>
            <span>{discussion.dislikes}</span>

            {/* Comments */}
            <button
              aria-controls={`comments-${discussion.id}`}
              className="btn btn-ghost btn-square w-10 h-10 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded flex items-center justify-center gap-1"
              type="button"
            >
              💬
              <span>{discussion.comments?.length || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default DiscussionItem;
