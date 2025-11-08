import { Profile, UserGameList } from "../types/models";
import Link from "next/link";
import FollowButton from "./FollowButton";
import {
  addRecentSearch,
  getLevel,
  getLevelProgress,
} from "../utils/functions";
import ListItem from "./ListItem";
export const ProfileItem: React.FC<{
  profile: Profile;
  featureList?: any;
}> = ({ profile, featureList }) => {
  return (
    <>
      <div>
        <div className="card bg-base-100 w-96 shadow-sm">
          <figure className="flex flex-col">
            <div
              className="radial-progress text-accent"
              style={
                {
                  "--value": getLevelProgress(profile.total_xp), // % toward next level
                  "--size": "7rem",
                  "--thickness": "8px",
                } as React.CSSProperties
              }
            >
              <div className="avatar avatar-placeholder">
                <span className="badge badge-primary absolute right-0">
                  Lvl {getLevel(profile.total_xp)}
                </span>
                <div className="bg-neutral text-neutral-content w-24 rounded-full">
                  <span className="text-3xl">
                    {profile.username[0].toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </figure>

          <div className="card-body items-center text-center">
            <h2 className="card-title">
              <Link
                className="italic link link-hover"
                href={`/user/${profile.username}`}
                onClick={() =>
                  addRecentSearch(profile.username, `/user/${profile.username}`)
                }
              >
                {profile.username}
              </Link>
            </h2>
            {/* bio */}
            <p className="line-clamp-2">
              A card component has a figure, a body part, and inside body there
              are title and actions parts
            </p>
            <div className="card-actions">
              <FollowButton playerID={profile.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
