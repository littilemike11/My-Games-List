"use client";
import { FaEllipsis } from "react-icons/fa6";
import { taggableContent } from "../types/models";
import { useAuth } from "../auth/auth-context";
import { deleteDiscussion } from "../api/supabase-api/discussion-api";
import { deleteList } from "../api/supabase-api/list-api";
import { deleteReview } from "../api/supabase-api/review-api";
import Link from "next/link";
import DeletePostModal from "./DeletePostModal";
import { useRouter, usePathname } from "next/navigation";

import { useState } from "react";
const PostOptions: React.FC<{
  postType: taggableContent;
  postID: number;
  ownerID: string;
  ownerName: string;
}> = ({ postType, postID, ownerID, ownerName }) => {
  const { session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // current page url
  const deletePost = async () => {
    try {
      if (postType === "list") await deleteList(postID, ownerID);
      if (postType === "review") await deleteReview(postID, ownerID);
      if (postType === "discussion") await deleteDiscussion(postID, ownerID);

      setIsOpen(false);

      // Is the user currently on this post page?
      const viewingThisPost = pathname.includes(`/${postType}/${postID}`);

      if (viewingThisPost) {
        // redirect away
        router.push(`/user/${ownerName}/${postType}s`);
      } else {
        // just refresh the current page (list, profile, homepage)
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const userID = session?.user.id;
  return (
    <>
      <DeletePostModal
        postType={postType}
        postID={postID}
        ownerID={ownerID}
        isOpen={isOpen}
        deletePost={deletePost}
        onClose={() => setIsOpen(false)}
      />
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn m-1">
          <FaEllipsis />
        </div>
        <ul
          tabIndex={-1}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
        >
          {userID == ownerID ? (
            <>
              <li>
                <Link href={`/profile/${postType}/${postID}/edit`}>Edit</Link>
              </li>
              {/* delete modal */}
              <li>
                <button onClick={() => setIsOpen(true)}>Delete</button>
              </li>
            </>
          ) : (
            <li>Report</li>
          )}
        </ul>
      </div>
      {/* <details className="dropdown dropdown-end">
        <summary className="btn btn-ghost btn-sm "></summary>
        <ul className="menu dropdown-content bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
          {userID == ownerID ? (
            <>
              <li>
                <Link href={`/profile/${postType}/${postID}/edit`}>Edit</Link>
              </li>
              <li>
                <button onClick={() => setIsOpen(true)}>delete</button>
              </li>
            </>
          ) : (
            <li>Report</li>
          )}
        </ul>
      </details> */}
    </>
  );
};

export default PostOptions;
