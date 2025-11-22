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
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {features.map((feature, index) => (
          <Link key={index} href={"/welcome"}>
            <div className="flex bg-base-300 shadow-md rounded-2xl p-2 min-h-24">
              <div className="text-xl">{feature.icon}</div>
              <div>
                <p>{feature.text}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
};

export default WhyUsSection;
