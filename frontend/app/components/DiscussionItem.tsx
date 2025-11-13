import { Discussion } from "../types/models";
import { formatDate } from "../utils/functions";
import Reactions from "./Reactions";
import CreateComment from "./CreateComment";
import CommentItem from "./CommentItem";
import Link from "next/link";
import TagItem from "./TagItem";
const DiscussionItem: React.FC<{ discussion: Discussion }> = ({
  discussion,
}) => {
  console.log(discussion.tags);
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

                  <span className="ml-2 italic">
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
          <p>{discussion.content}</p>

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
            {/* <CreateComment parentType="discussion" parentID={discussion.id} /> */}
          </div>
          {/* <CommentItem parentType="discussion" parentID={discussion.id} /> */}
        </div>
      </div>
    </>
  );
};
export default DiscussionItem;
