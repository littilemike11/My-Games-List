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

  const fetchComments = async () => {
    const response = await getCommentsFromPost(parentType, parentID);
    console.log(response);
    setComments(response);
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
        {comments.length > 0 &&
          comments.map((c) => (
            <li key={c.id} className="p-4 ">
              <CommentItem onComment={fetchComments} comment={c} />
            </li>
          ))}
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
