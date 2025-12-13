import Link from "next/link";

const WhyUsSection = () => {
  const features = [
    {
      icon: "🎮",
      text: "Keep track of every game you've played",
    },
    {
      icon: "👍",
      text: `Show love for your games and posts with a "like"`,
    },
    {
      icon: "👥",
      text: "Get curated content based on your follows",
    },
    {
      icon: "⭐",
      text: "Rate and review the games you love",
    },
    {
      icon: "💬",
      text: "Start discussions on any topic gaming adjacent",
    },
    {
      icon: "📜",
      text: "Create and share lists of games on any topic",
    },
  ];
  //   keep up with the latest gaming news and trends
  //
  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-4">
        At <span className="italic text-primary">The Save Room</span>, you
        can...
      </h2>

      <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {features.map((feature, index) => (
          <Link key={index} href="/welcome">
            <div
              className="
          group flex flex-col items-center text-center
          bg-base-200 hover:bg-base-300 transition-all duration-200
          rounded-2xl p-4 shadow-md hover:shadow-lg
          border border-transparent hover:border-primary/40
           h-full
        "
            >
              {/* Icon */}
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>

              {/* Text */}
              <p className="text-sm sm:text-base font-medium opacity-90 group-hover:opacity-100">
                {feature.text}
              </p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
};

export default WhyUsSection;
