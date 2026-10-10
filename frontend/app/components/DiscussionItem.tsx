import { Discussion } from "../types/models";
import { formatDate } from "../utils/functions";
import Reactions from "./Reactions";
import Link from "next/link";
import TagItem from "./TagItem";
import Paragraph from "./Paragraph";
import PostOptions from "./PostOptions";
const DiscussionItem: React.FC<{ discussion: Discussion }> = ({
  discussion,
}) => {
  return (
    <>
      <article className="w-full overflow-hidden rounded-lg border border-base-200 bg-base-100 shadow-sm transition-shadow hover:shadow-md">
        {/* Header */}
        <div className="p-3 sm:p-4">
          {/* Title + options */}
          <div className="flex items-start gap-2">
            <Link
              href={`/discussion/${discussion.id}`}
              className="min-w-0 flex-1"
            >
              <h2 className="text-base font-bold leading-tight text-primary sm:text-lg line-clamp-2 link link-hover decoration-primary">
                {discussion.title}
              </h2>
            </Link>

            <PostOptions
              postType="discussion"
              postID={discussion.id}
              ownerID={discussion.profile.id}
              ownerName={discussion.profile.username}
            />
          </div>

          {/* Author + date */}
          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs sm:text-sm opacity-70">
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-6 rounded-full">
                <span>{discussion.profile?.username[0].toUpperCase()}</span>
              </div>
            </div>
            <Link
              href={`/user/${discussion.profile?.username}`}
              className="font-medium hover:underline"
            >
              @{discussion.profile?.username || "deleted"}
            </Link>

            <span>·</span>

            <time>{formatDate(discussion.created_at)}</time>
          </div>
        </div>

        {/* Content */}
        <div className="border-t border-base-200 px-3 pb-3 sm:px-4 sm:pb-4">
          <div className="text-sm leading-relaxed sm:text-base">
            <Paragraph text={discussion.content} />
          </div>

          {/* Tags */}
          {discussion.tags && discussion.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {discussion.tags.map((tag) => (
                <TagItem key={tag.id} tag={tag} />
              ))}
            </div>
          )}

          {/* Reactions */}
          <div className="mt-3 flex items-center">
            <Reactions
              likeCount={discussion.likes}
              dislikeCount={discussion.dislikes}
              commentCount={discussion.comment_count}
              parent_type="discussion"
              parent_id={discussion.id}
            />
          </div>
        </div>
      </article>
    </>
  );
};
export default DiscussionItem;
