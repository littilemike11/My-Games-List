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
      <div className="card bg-base-100 w-full rounded-lg border border-base-200 hover:shadow-lg shadow-sm transition-all duration-200">
        <div className="card-body space-y-2">
          {/* Title */}
          <div className="flex justify-between">
            <Link
              className="link link-hover decoration-primary"
              href={`/discussion/${discussion.id}`}
            >
              <h2 className="card-title text-primary line-clamp-2 font-bold">
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

          {/* Author info and date */}
          <div className="flex items-center justify-between text-sm ">
            <div className="flex items-center gap-3">
              <Link
                className="link link-hover"
                href={`/user/${discussion.profile?.username}`}
              >
                <figure>
                  <div className="avatar avatar-placeholder">
                    <div className="bg-neutral text-neutral-content w-8 rounded-full">
                      <span>
                        {discussion.profile?.username[0].toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <span className="ml-2 font-medium italic">
                    {discussion.profile?.username || "(deleted)"}
                  </span>
                </figure>
              </Link>
            </div>
            <time className="opacity-50">
              {formatDate(discussion.created_at)}
            </time>
          </div>

          {/* Content preview */}
          <div className="font-medium">
            <Paragraph text={discussion.content} />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {discussion.tags?.map((tag) => (
              <TagItem key={tag.id} tag={tag} />
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
          </div>
        </div>
      </div>
    </>
  );
};
export default DiscussionItem;
