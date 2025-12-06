"use client";
import { FaEllipsis } from "react-icons/fa6";
import { taggableContent } from "../types/models";
import { useAuth } from "../auth/auth-context";
import { getPostByID } from "../api/supabase-api/post-api";
import Link from "next/link";
const PostOptions: React.FC<{
  postType: taggableContent;
  postID: number;
  ownerID: string;
  ownerName: string;
}> = ({ postType, postID, ownerID, ownerName }) => {
  const { session } = useAuth();
  const userID = session?.user.id;
  console.log(ownerID);
  return (
    <>
      <details className="dropdown dropdown-end">
        <summary className="btn btn-ghost btn-sm ">
          <FaEllipsis />
        </summary>
        <ul className="menu dropdown-content bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
          {/* check if current user is owner */}
          {userID == ownerID ? (
            <>
              <li>
                <Link href={`/profile/${postType}/${postID}/edit`}>Edit</Link>
              </li>
              {/* delete modal */}
              <li>
                <a>Delete</a>
              </li>
            </>
          ) : (
            <li>Report</li>
          )}
        </ul>
      </details>
    </>
  );
};

export default PostOptions;
