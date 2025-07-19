const page = () => {
  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl text-pretty font-bold">
            Welcome to <span className="italic">The Save Room</span>
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
        </section>

        {/* What You Can Do */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">
            🧭 What You Can Do Here
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h3 className="card-title">📚 Track Your Games</h3>
                <p>
                  Mark what you’ve played, are playing, or want to play. Build a
                  gaming timeline that grows with you.
                </p>
                <p>
                  One of our most-loved features, the playlist, lets you keep a
                  list of games you want to play. Start in Most Anticipated and
                  mark a few games you want to see.
                </p>
                <p>
                  Start your time in the Save Room by visiting our Popular
                  section and marking a few games you’ve played.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h3 className="card-title">⭐ Rate & Review</h3>
                <p>
                  Write reviews and give star ratings. Tell us your experience
                  playing; note hours played, pros/cons, and platform(s) you
                  played on.
                </p>
                <p> Note: Content revealing spoilers are hidden by default</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h3 className="card-title">📃 Create and Share Lists</h3>
                <p>
                  {" "}
                  Lists are a great way to share a collection of related games,
                  or to rank the games of your favorite genre, platform,
                  developer or franchise. It’s fun to welcome suggestions for
                  your lists from other members. Start a list on your Lists tab,
                  then add games on the ‘Edit’ screen (or from the ‘more
                  options’ menu on a cover). The first time you make a list
                  public, it’s shared with your followers. Create your
                  personalized list from tens of thousands of titles on the
                  world’s largest game database.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h3 className="card-title">💬 Join the Community</h3>
                <p>
                  Participate in discussions, follow other players, and keep up
                  the latest with gaming news and opinions.
                </p>
                <p>
                  The best way to find members to follow is by reading reviews
                  of games you like, to identify the voices and opinions you
                  dig. Our Members page lists popular accounts. As you follow
                  more people, we create a personalized Activity stream full of
                  reviews and recommendations from these members
                </p>
                <p>
                  Our forums are the best place to discuss your favorite
                  franchises and keep up to date with gaming news and trends.
                </p>
                {/* <p>
                  Connect with millions of fans from over 200 countries
                  worldwide in our active online community of over half a
                  million users a day!
                </p> */}
              </div>
            </div>

            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h3 className="card-title">📈 Your Profile & Stats</h3>
                <p>
                  View your play history, ratings, reviews, list count, favorite
                  genres, and more.
                </p>
                <p>
                  Click your username (at the top of each page) for shortcuts to
                  the main sections of your account. Your Profile, games,
                  playlist and other pages are here. You can customize your
                  name, location, website, bio and favorite games in Settings.
                  Note: your profile (and any other content you publish, with
                  the exception of private lists) is visible to others, and to
                  search engines.
                </p>
                <p>
                  Now that you’ve added some games, you can find them in the
                  games tab of your profile. As you add more content, your
                  profile starts to reflect your taste. You can also browse the
                  games of other members, or the community, with Hide watched
                  games activated to find more great games to watch.{" "}
                </p>
              </div>
            </div>
          </div>
        </section>

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
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            🧩 Main Sections of the Site
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body">
                <h4 className="card-title">🏠 Homepage</h4>
                <p>
                  If your signed in, you'll see your personalized feed of games,
                  reviews, discussions, and lists from other Save Room members.
                  As you follow more people, we personalize this page to show
                  what's popular in your network.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body">
                <h4 className="card-title">🎮 Games</h4>
                <p>
                  Browse games our members are playing and talking about the
                  most. Browse all games by rating, genre, release, platform,
                  and more.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body">
                <h4 className="card-title">⭐ Reviews</h4>
                <p>
                  Read or create reviews and ratings made by fellow save room
                  members.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body">
                <h4 className="card-title">💬 Discussions</h4>
                <p>
                  Talk about games, genres, platforms, franchises, industry
                  news, and all things gaming. This is an open forum to all
                  players.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body">
                <h4 className="card-title">📜 Lists</h4>
                <p>
                  See our most popular lists, trending, and user-submitted lists
                  of games. From here you can create a list of your own, browse
                  more popular lists, or browse by the tags applied to each
                  creator.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body">
                <h4 className="card-title">👥 Members</h4>
                <p>
                  Explore top contributors, reviewers, and active community
                  voices. Follow and connect with them to stay up to date with
                  their latest topics.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body">
                <h4 className="card-title">📰 Press</h4>
                <p>
                  Read articles, analysis, and think pieces from around the
                  gaming world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips & Tricks */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">💡 Tips & Tricks</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Use tags like “indie”, “backlog”, “co-op” to filter games.</li>
            <li>Lists can be private or collaborative.</li>
            <li>Click the 🎮 icon to mark a game as played instantly.</li>
          </ul>
        </section>

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
