"use client";
import { Comment, contentType } from "../types/models";
import {
  getCommentsFromPost,
  createComment,
  getTopComment,
} from "../api/supabase-api/comment-api";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/auth-context";
import Reactions from "./Reactions";
import CreateComment from "./CreateComment";
const CommentItem: React.FC<{
  parentType: contentType;
  parentID: number;
}> = ({ parentType, parentID }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [topComment, setTopComment] = useState<Comment>();
  const [newComment, setNewComment] = useState("");
  const [replyBody, setReplyBody] = useState<{ [key: number]: string }>({});
  const { session, profile, loading } = useAuth();
  const userID = session?.user.id;
  // Fetch top-level comments with shallow replies
  const fetchComments = async () => {
    try {
      // const response = await getCommentsFromPost(parentType, parentID);
      // console.log(response);
      // setComments(response);
      const response = await getTopComment(parentType, parentID);
      console.log(response);
      setTopComment(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Add a reply to a comment
  const addReply = async (parentId: number) => {
    const body = replyBody[parentId];
    if (!body?.trim()) return;
    else {
      setReplyBody((prev) => ({ ...prev, [parentId]: "" }));
      fetchComments();
    }
  };

  return (
    <div className="space-y-6">
      {topComment && (
        <div className="bg-base-200 p-2 rounded-2xl shadow-md ">
          <div className="flex gap-4">
            <figure>
              <div className="avatar avatar-placeholder">
                <div className="bg-neutral text-neutral-content size-8 rounded-full">
                  <span>{topComment.profile?.username[0].toUpperCase()}</span>
                </div>
              </div>
            </figure>
            <div className="flex flex-col w-full gap-1">
              <div className="flex  items-center justify-start ">
                <span className="font-semibold italic text-gray-400">
                  @{topComment.profile?.username}
                </span>
              </div>
              <p className="font-medium">{topComment.body}</p>
              {/* Likes: {topComment.likes} | Dislikes: {topComment.dislikes} */}
              <div className="flex flex-wrap gap-2">
                <Reactions
                  likeCount={topComment.likes}
                  dislikeCount={topComment.dislikes}
                  commentCount={topComment.comment_count}
                />
                <CreateComment parentType="comment" parentID={topComment.id} />
              </div>
            </div>
          </div>
          {/* <CreateComment parentType="comment" parentID={topComment.id} /> */}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
