"use client";

import { useEffect, useState } from "react";
import { contentType, Comment } from "../types/models";
import { getCommentsFromPost } from "../api/supabase-api/comment-api";
import CommentItem from "./CommentItem";
import CreateComment from "./CreateComment";

interface CommentSectionProps {
  parentType: contentType;
  parentID: number;
}

export default function CommentSection({
  parentType,
  parentID,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    const response = await getCommentsFromPost(parentType, parentID);
    console.log(response);
    setComments(response);
    setLoading(false);
  };
  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <>
      <h2 className="text-2xl">Join the Conversation</h2>
      <div className="divider"></div>
      {/* Comments List */}
      <CreateComment
        parentType={parentType}
        parentID={parentID}
        onComment={fetchComments}
      />
      <ul className=" space-y-4 ">
        {loading ? (
          <div className="flex w-52 flex-col gap-4">
            <div className="skeleton h-40 w-full"></div>
            <div className="skeleton h-40 w-full"></div>
            <div className="skeleton h-40 w-full"></div>
          </div>
        ) : (
          comments.length > 0 &&
          comments.map((c) => (
            <li key={c.id} className="p-4 ">
              <CommentItem onComment={fetchComments} comment={c} />
            </li>
          ))
        )}
      </ul>
      {comments.length > 0 && (
        <CreateComment
          parentType={parentType}
          parentID={parentID}
          onComment={fetchComments}
        />
      )}
      {/* potential related / recommended content */}
      {/* other user reviews of same game? */}
      {/* other reviews from user? */}
    </>
  );
}
