const PagesSection = () => {
  const MAIN_SECTIONS = [
    {
      title: "🏠 Homepage",
      description:
        "If you're signed in, you'll see your personalized feed of games, reviews, discussions, and lists from other Save Room members. As you follow more people, we personalize this page to show what's popular in your network.",
    },
    // {
    //   title: "🎮 Games",
    //   description:
    //     "Browse games our members are playing and talking about the most. Browse all games by rating, genre, release, platform, and more.",
    // },
    {
      title: "✨ Popular",
      description:
        "What's the meta? See all the popular, trending or latest content that the site has to offer. See reviews, discussions, lists, users, tags and games that make the front page.",
    },
    {
      title: "🔎 Search",
      description:
        "Cant find what you're looking for? Go to the dedicated search page or search bar at the top navbar to find any games or content created on the site.",
    },
    {
      title: "⭐ Reviews",
      description:
        "Read or create reviews and ratings made by fellow Save Room members.",
    },
    {
      title: "💬 Discussions",
      description:
        "Talk about games, genres, platforms, franchises, industry news, and all things gaming. This is an open forum to all players.",
    },
    {
      title: "📜 Lists",
      description:
        "See our most popular lists, trending lists, and user-submitted collections. Create your own or browse by tags.",
    },
    {
      title: "👥 Members",
      description:
        "Explore top contributors, reviewers, and active community voices. Follow and connect with them to stay up to date with their latest topics.",
    },
    {
      title: "🏷️ Tags",
      description:
        "Discover community created and created tags sued to label their posts. Follow yor favorites to personalize your own feed. ",
    },
    {
      title: "📰 News",
      description:
        "Read articles, analysis, and think pieces from around the gaming world.",
    },
  ];

  return (
    <>
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          🧩 Main Sections of the Site
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MAIN_SECTIONS.map((item, idx) => (
            <div
              key={idx}
              className="card bg-base-100 border border-base-300 shadow-sm"
            >
              <div className="card-body">
                <h4 className="card-title">{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default PagesSection;
