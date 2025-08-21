import { Profile } from "../types/models";
import Link from "next/link";
export const ProfileItem: React.FC<{ profile: Profile }> = ({ profile }) => {
  return (
    <>
      <div>
        <div className="card bg-base-100 w-96 shadow-sm">
          <figure>
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-24 rounded-full">
                <span className="text-3xl">
                  {profile.username[0].toUpperCase()}
                </span>
              </div>
            </div>
          </figure>

          <div className="card-body items-center text-center">
            <h2 className="card-title">
              <Link
                className="link link-hover"
                href={`/user/${profile.username}`}
              >
                {profile.username}
              </Link>
            </h2>
            <p>
              A card component has a figure, a body part, and inside body there
              are title and actions parts
            </p>
            <div className="card-actions">
              <button className="btn btn-primary">Follow</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
