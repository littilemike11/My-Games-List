import { Discussion } from "../types/models";
import { formatDate } from "../utils/functions";
import Reactions from "./Reactions";
import CreateComment from "./CreateComment";
import CommentItem from "./CommentItem";
import Link from "next/link";
const DiscussionItem: React.FC<{ discussion: Discussion }> = ({
  discussion,
}) => {
  return (
    <>
      <div className="card bg-base-100 w-full rounded-lg shadow-sm">
        <div className="card-body space-y-4">
          {/* Title */}
          <Link
            className="link link-hover"
            href={`/user/${discussion.profile?.username}/discussion/${discussion.id}`}
          >
            <h2 className="card-title  line-clamp-2 font-semibold">
              {discussion.title}
            </h2>
          </Link>

          {/* Author info and date */}
          <div className="flex items-center justify-between text-sm ">
            <div className="flex items-center gap-3">
              <img
                src="https://img.daisyui.com/images/profile/demo/1@94.webp"
                alt={`Profile of ${
                  discussion.profile?.username || "Deleted User"
                }`}
                className="w-8 h-8 rounded-full object-cover"
                loading="lazy"
              />
              <Link
                className="link link-hover"
                href={`/user/${discussion.profile?.username}`}
              >
                <span className="italic">
                  {discussion.profile?.username || "(deleted)"}
                </span>
              </Link>
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
            <Reactions
              likeCount={discussion.likes}
              dislikeCount={discussion.dislikes}
              commentCount={discussion.comment_count}
              parent_type="discussion"
              parent_id={discussion.id}
            />
            {/* <CreateComment parentType="discussion" parentID={discussion.id} /> */}
          </div>
          {/* <CommentItem parentType="discussion" parentID={discussion.id} /> */}
        </div>
      </div>
    </>
  );
};
export default DiscussionItem;
