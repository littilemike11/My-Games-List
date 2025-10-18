"use client";
import { useEffect, useState } from "react";
import {
  getTag,
  isFollowingTag,
  followTag,
  unFollowTag,
} from "@/app/api/supabase-api/tag-api";
import { useAuth } from "../auth/auth-context";

const FollowTagButton: React.FC<{ TagID: number }> = ({ TagID }) => {
  const { session, profile } = useAuth();
  const [loading, setloading] = useState(true);
  const [isFollowing, setIsFollowing] = useState<boolean>();
  const userID = session?.user.id;

  useEffect(() => {
    if (!userID) return;
    const fetchTags = async () => {
      if (userID) {
        try {
          const response = await isFollowingTag(userID, TagID);
          setIsFollowing(response);
        } catch (error) {
          console.error("Error checking follow:", error);
        }
      }
      setloading(false);
    };
    fetchTags();
  }, [userID]);

  const handleSubmit = async () => {
    if (!userID) return;
    try {
      if (isFollowing) {
        await unFollowTag(userID, TagID);
        setIsFollowing(false);
      } else {
        await followTag(userID, TagID);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("error :", error);
    }
  };
  return (
    <>
      <button
        onClick={handleSubmit}
        className={`btn btn-xs ${
          loading ? " btn-neutral" : isFollowing ? "btn-error" : "btn-error"
        }`}
      >
        {loading ? "loading..." : isFollowing ? "Unfollow" : "Follow"}
      </button>
    </>
  );
};

export default FollowTagButton;
