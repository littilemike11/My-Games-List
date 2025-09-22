import { getReviews } from "../api/supabase-api/review-api";
import { getDiscussions } from "../api/supabase-api/discussion-api";
import { getLists } from "../api/supabase-api/list-api";
const ExplorePage = () => {
  return (
    <>
      <header>
        <div className="flex flex-col space-y-2 pt-4">
          <h1 className="text-4xl text-pretty text-center font-bold">
            Welcome to <span className="italic">The Save Room</span>
          </h1>
          <h2 className="text-xl text-center ">
            A community hub for gamers by gamers.
          </h2>
        </div>
      </header>

      <main>
        <div className="flex flex-col h-96 space-y-4 pt-20 items-center  w-full">
          <input
            type="text"
            placeholder="Search anything gaming related"
            className="input input-bordered w-full "
          />
          <div className="flex gap-10 ">
            <button title="See what's trending" className="btn btn-primary">
              What's Meta?
            </button>
            <button
              title="See what we think you'll like"
              className="btn btn-primary"
            >
              For You
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default ExplorePage;
