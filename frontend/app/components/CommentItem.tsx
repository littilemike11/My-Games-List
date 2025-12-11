import { Comment } from "../types/models";
import Reactions from "./Reactions";
import CreateComment from "./CreateComment";
import { formatDate } from "../utils/functions";
const CommentItem: React.FC<{
  comment: Comment;
  onComment: Function;
}> = ({ comment, onComment }) => {
  // for scale would probably need to fetch each replies individually based on which comment, the user is interested in
  const sortedReplies = comment.replies
    ? [...comment.replies].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    : [];
  return (
    <div className="space-y-6">
      <div className="bg-base-200 p-4 rounded-2xl shadow-md ">
        <div className="flex gap-4">
          <figure>
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content size-8 rounded-full">
                <span>{comment.profile.username[0].toUpperCase()}</span>
              </div>
            </div>
          </figure>
          <div className="flex flex-col w-full gap-1">
            <div className="flex  items-center justify-between ">
              <span className="font-semibold italic text-gray-400">
                {comment.profile?.username}
              </span>
              <time className="opacity-50">
                {formatDate(comment.created_at)}
              </time>
            </div>
            <p className="font-medium">{comment.body}</p>
            {/* Likes: {comment.likes} | Dislikes: {comment.dislikes} */}
            <div className="flex flex-wrap justify-between gap-2">
              <Reactions
                likeCount={comment.likes}
                dislikeCount={comment.dislikes}
                commentCount={comment.comment_count}
                parent_type="comment"
                parent_id={comment.id}
              />
              {comment.replies && (
                <CreateComment
                  parentType="comment"
                  parentID={comment.id}
                  onComment={onComment}
                />
              )}
            </div>
          </div>
        </div>
        {comment.replies && (
          <ul className="space-y-4 ml-10 ">
            {sortedReplies.map((reply) => (
              <li className="border-l-2 border-gray-500" key={reply.id}>
                <CommentItem onComment={onComment} comment={reply} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
