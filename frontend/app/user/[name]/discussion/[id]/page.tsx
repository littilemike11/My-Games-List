"use client";
import DiscussionItem from "@/app/components/DiscussionItem";
import { useParams, usePathname } from "next/navigation";
import { getDiscussionByID } from "@/app/api/supabase-api/discussion-api";
import { useEffect, useState } from "react";
import { Discussion } from "@/app/types/models";
import CommentSection from "@/app/components/CommentSection";
const DiscussionPage = () => {
  const { name, id } = useParams<{ name: string; id: string }>();
  const [discussion, setDiscussion] = useState<Discussion | null>();

  const fetchDiscussion = async (id: number) => {
    try {
      const response = await getDiscussionByID(id);
      console.log(response);
      setDiscussion(response);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchDiscussion(+id); // convert id to number
  }, []);

  return (
    <>
      {discussion ? (
        <div>
          <DiscussionItem discussion={discussion} />
          {/* comments of disscussion */}
          <CommentSection parentType={"discussion"} parentID={+id} />
        </div>
      ) : (
        <p className="text-lg text-error">Discussion doesn't exist</p>
      )}
    </>
  );
};

export default DiscussionPage;
