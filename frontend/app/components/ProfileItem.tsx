import { Profile, UserGameList } from "../types/models";
import Link from "next/link";
import FollowButton from "./FollowButton";
import { getLevel, getLevelProgress } from "../utils/functions";
import ListItem from "./ListItem";
export const ProfileItem: React.FC<{
  profile: Profile;
  featureList?: any;
}> = ({ profile, featureList }) => {
  return (
    <>
      <div>
        <div className="card py-2 w-48 shadow-sm bg-gradient-to-b from-base-200 to-base-100 hover:scale-[1.02] hover:shadow-xl transition-all duration-200">
          <figure>
            <div
              className="radial-progress text-accent"
              style={
                {
                  "--value": getLevelProgress(profile.total_xp), // % toward next level
                  "--size": "5rem",
                  "--thickness": "6px",
                } as React.CSSProperties
              }
            >
              <div className="avatar  avatar-placeholder">
                <span className="badge badge-primary badge-sm absolute right-0">
                  Lvl {getLevel(profile.total_xp)}
                </span>
                <div className="bg-neutral text-neutral-content size-16 rounded-full">
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
                className="italic capitalize link link-hover"
                href={`/user/${profile.username}`}
              >
                {profile.username}
              </Link>
            </h2>
            {/* bio */}
            {profile.bio && <p className="line-clamp-2">{profile.bio}</p>}

            <div className="card-actions">
              <FollowButton playerID={profile.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
