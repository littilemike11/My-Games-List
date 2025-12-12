import TagItem from "../components/TagItem";
import FollowButton from "../components/FollowButton";
import Link from "next/link";
import FeatureSection from "../components/welcome/FeatureSection";
import PagesSection from "../components/welcome/PagesSection";
const page = () => {
  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-md line-clamp-2 text-balance">
            Welcome to{" "}
            <span className="italic text-primary">The Save Room</span>
          </h1>
          <p className="text-xl ">
            Your personal space to log, reflect, and discover games.
          </p>

          <p>
            Sign in or register to get started. We're your gamer's hub for
            tracking, rating, reviewing and discussing games, your codex of
            games to play, your source for lists and inspiration, and an
            activity stream of passionate game criticism, discussion and
            discovery.
          </p>

          <div className="my-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-2 text-secondary">
              Get Started Now
            </h2>
            <p>
              Follow{" "}
              <Link href={`/user/thesaveroom`}>
                <span className="italic text-primary link hover:link">
                  The Save Room
                </span>
              </Link>{" "}
              to keep in touch with the latest updates, announcements and
              changes.
            </p>
            <FollowButton playerID={"ef42b46a-9215-467d-8f4d-b741b8fe9301"} />
          </div>
        </section>
        {/* What You Can Do */}
        <FeatureSection />

        {/* How It Works */}
        {/* <section>
          <h2 className="text-2xl font-semibold mb-4">📖 How It Works</h2>
          <ul className="list-disc list-inside space-y-3">
            <li>
              <strong>Add Played Games:</strong> Visit the Popular section and
              start building your library.
            </li>
            <li>
              <strong>Use the Wishlist:</strong> Save games you want to try in
              the future.
            </li>
            <li>
              <strong>Browse by Taste:</strong> Use filters and hide watched to
              explore more tailored picks.
            </li>
            <li>
              <strong>Review Games:</strong> Leave your thoughts with optional
              spoilers and platform info.
            </li>
            <li>
              <strong>Follow Members:</strong> Build a feed full of great
              reviews and like-minded voices.
            </li>
            <li>
              <strong>Make Lists:</strong> Curate, rank, or collect games with
              context and commentary.
            </li>
            <li>
              <strong>Join the Forum:</strong> Dive into game-specific chats and
              current events.
            </li>
          </ul>
        </section> */}

        {/* Main Sections */}
        <PagesSection />

        {/* Tips & Tricks */}
        {/* <section>
          <h2 className="text-2xl font-semibold mb-4">💡 Tips & Tricks</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Use tags like “indie”, “backlog”, “co-op” to filter games.</li>
            <li>Lists can be private or collaborative.</li>
            <li>Click the 🎮 icon to mark a game as played instantly.</li>
          </ul>
        </section> */}

        {/* Discovery */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-2">🔍 Discover New Games</h2>
          <p className="">
            Use our recommendations, tags, and lists to find something new and
            exciting.
          </p>
        </section>
      </main>
    </>
  );
};

export default page;
