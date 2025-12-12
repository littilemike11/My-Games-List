import Link from "next/link";
import Image from "next/image";
const FeatureSection = () => {
  const FEATURES = [
    {
      title: "🎮 Track Your Games",
      content: [
        "Mark what you’ve played, are playing, or want to play.",
        "Use the wishlist to keep track of games you want to play.",
        "Visit the Popular section to see trending games",
      ],
      image: "/images/welcome/tsr_game_status.webp",
    },
    {
      title: "⭐ Rate & Review",
      content: [
        "Write reviews and give star ratings.",
        "Share your pros, cons, and platform details.",
        "Spoilers are hidden by default.",
      ],
      image: "/images/welcome/tsr_review.webp",
    },
    {
      title: "📃 Create & Share Lists",
      content: [
        "Create ranked or themed lists of your favorite games.",
        "Add games through the Edit screen or from game pages.",
        "Your first public list is shared with your followers.",
      ],
      image: "/images/welcome/tsr_list.webp",
    },
    {
      title: "💬 Join the Community",
      content: [
        "Participate in discussions and follow other players.",
        "Discover members by reading posts you enjoy.",
        "Stay updated on gaming news and trends.",
      ],
      image: "/images/welcome/tsr_discussion.webp",
    },
    {
      title: "📈 Your Profile & Stats",
      content: [
        "See your play history, ratings, reviews, and stats.",
        "Customize your profile and share your favorite games.",
        // "Browse community profiles to find more games.",
      ],
      image: "/images/welcome/tsr_profile_nav.webp",
    },
    {
      title: "🔎 Search Everything",
      content: [
        "Find games, users, reviews, lists, discussions and tags instantly.",
        "Search by title or browse categories easily.",
      ],
      image: "/images/welcome/tsr_search.webp",
    },
    {
      title: "📝 Create Posts",
      content: [
        "Share your thoughts with the community.",
        "Write posts, share lists, and start conversations.",
      ],
      image: "/images/welcome/tsr_create_post.webp",
    },
    {
      title: "🎨 Personalize",
      content: [
        "Browse trending topics and active discussions.",
        "Discover what the community is currently playing and reviewing.",
        "Keep track of the users and tags you follow",
      ],
      image: "/images/welcome/tsr_community.webp",
    },
  ];

  return (
    <>
      <section>
        <h2 className="text-2xl font-semibold mb-6">🧭 What You Can Do Here</h2>

        <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((item, idx) => (
            <div
              key={idx}
              //   className={`
              //   flex flex-col gap-6
              //   md:items-center
              //   md:gap-10
              //   ${idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}
              // `}
            >
              {/* IMAGE */}
              {/* <div className="relative w-full md:w-2/3 h-64">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center"
                  loading="lazy"
                />
              </div> */}

              {/* CARD */}
              <div className="card bg-base-200 shadow-md h-full ">
                <div className="card-body">
                  <h3 className="card-title">{item.title}</h3>
                  {item.content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* <section>
        <h2 className="text-2xl font-semibold mb-6">🧭 What You Can Do Here</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative w-full h-64">
            <Image
              src="/images/welcome/tsr_game_status.webp"
              alt="game status image"
              fill
              className=" object-contain"
              loading="lazy"
            />
          </div>

          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h3 className="card-title">🎮 Track Your Games</h3>
              <p>Mark what you’ve played, are playing, or want to play.</p>
              <p>
                One of our most-loved features, the wishlist, lets you keep a
                list of games you want to play. Start in Most Anticipated and
                mark a few games you want to see.
              </p>
              <p>
                Start your time in the Save Room by visiting our{" "}
                <Link href={"/popular"}>
                  <span className="text-primary link italic ">Popular</span>
                </Link>{" "}
                section and marking a few games you’ve played.
              </p>
            </div>
          </div>
          <div className="relative w-full h-full">
            <Image
              src="/images/welcome/tsr_game_status.webp"
              alt="game status image"
              fill
              className=" object-contain"
              loading="lazy"
            />
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
          <div className="relative w-full h-full">
            <Image
              src="/images/welcome/tsr_game_status.webp"
              alt="game status image"
              fill
              className=" object-contain"
              loading="lazy"
            />
          </div>
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h3 className="card-title">📃 Create and Share Lists</h3>
              <p>
                {" "}
                Lists are a great way to share a collection of related games, or
                to rank the games of your favorite genre, platform, developer or
                franchise. It’s fun to welcome suggestions for your lists from
                other members. Start a list on your Lists tab, then add games on
                the ‘Edit’ screen (or from the ‘more options’ menu on a cover).
                The first time you make a list public, it’s shared with your
                followers. Create your personalized list from tens of thousands
                of titles on the world’s largest game database.
              </p>
            </div>
          </div>
          <div className="relative w-full h-full">
            <Image
              src="/images/welcome/tsr_game_status.webp"
              alt="game status image"
              fill
              className=" object-contain"
              loading="lazy"
            />
          </div>

          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h3 className="card-title">💬 Join the Community</h3>
              <p>
                Participate in discussions, follow other players, and keep up
                the latest with gaming news and opinions.
              </p>
              <p>
                The best way to find members to follow is by reading reviews of
                games you like, to identify the voices and opinions you dig. Our
                Members page lists popular accounts. As you follow more people,
                we create a personalized Activity stream full of reviews and
                recommendations from these members
              </p>
              <p>
                Our forums are the best place to discuss your favorite
                franchises and keep up to date with gaming news and trends.
              </p>
              {/* <p>
                  Connect with millions of fans from over 200 countries
                  worldwide in our active online community of over half a
                  million users a day!
                </p> 
            </div>
          </div>
          <div className="relative w-full h-full">
            <Image
              src="/images/welcome/tsr_game_status.webp"
              alt="game status image"
              fill
              className=" object-contain"
              loading="lazy"
            />
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
                the main sections of your account. Your Profile, games, playlist
                and other pages are here. You can customize your name, location,
                website, bio and favorite games in Settings. Note: your profile
                (and any other content you publish, with the exception of
                private lists) is visible to others, and to search engines.
              </p>
              <p>
                Now that you’ve added some games, you can find them in the games
                tab of your profile. As you add more content, your profile
                starts to reflect your taste. You can also browse the games of
                other members, or the community, with Hide watched games
                activated to find more great games to watch.{" "}
              </p>
            </div>
          </div>
          <div className="relative w-full h-full">
            <Image
              src="/images/welcome/tsr_game_status.webp"
              alt="game status image"
              fill
              className=" object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </section> */}
    </>
  );
};

export default FeatureSection;
