"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/auth-context";
import AuthModal from "./AuthModal";
import {
  checkFollowing,
  followUser,
  unfollowUser,
} from "../api/supabase-api/profile-api";

const FollowButton: React.FC<{ playerID: string }> = ({ playerID }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  const { session, profile } = useAuth();
  const userID = session?.user.id;
  const isOwnProfile = session && userID === playerID;

  useEffect(() => {
    const checkIsFollowing = async () => {
      if (userID) {
        try {
          const response = await checkFollowing(userID, playerID);
          setIsFollowing(response);
        } catch (error) {
          console.error("Error checking follow:", error);
        }
      }
      setLoading(false);
    };

    checkIsFollowing();
  }, [userID, playerID]);

  const toggleFollow = async () => {
    if (!userID) {
      setShowAuth(true);
      return;
    }

    try {
      if (isFollowing) {
        await unfollowUser(userID, playerID);
        setIsFollowing(false);
      } else {
        await followUser(userID, playerID);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  if (isOwnProfile) {
    return (
      <button className="btn btn-disabled">
        It's a Me, {profile?.username}
      </button>
    );
  }

  if (loading) {
    return (
      <button disabled className="btn btn-outline">
        Loading...
      </button>
    );
  }

  return isFollowing ? (
    <button onClick={toggleFollow} className="btn btn-secondary">
      Unfollow
    </button>
  ) : (
    <div>
      <button onClick={toggleFollow} className="btn btn-primary">
        Follow
      </button>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
};

export default FollowButton;
