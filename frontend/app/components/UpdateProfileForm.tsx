"use client";
import { useState } from "react";
import { updateProfile } from "../api/supabase-api/profile-api";
const UpdateProfileForm: React.FC<{ userID: string; bio: string }> = ({
  userID,
  bio,
}) => {
  const [updatedBio, setUpdatedBio] = useState(bio);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    await updateProfile(userID, { bio: updatedBio });
    setLoading(false);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-base-200 border border-base-300 rounded-box p-5">
          <legend className="fieldset-legend text-lg font-semibold">
            Profile Settings
          </legend>

          <label className="fieldset-label">Bio</label>
          <div className="flex flex-col items-start gap-2">
            <textarea
              className="textarea textarea-bordered w-full"
              value={updatedBio}
              placeholder="Write something about yourself..."
              onChange={(e) => setUpdatedBio(e.target.value)}
            />
            <button type="submit" className="btn btn-primary h-auto">
              {loading ? "Saving ..." : "Save"}
            </button>
          </div>
        </fieldset>
      </form>
    </>
  );
};

export default UpdateProfileForm;
