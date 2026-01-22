const MarketTable = () => {
  const MARKET_ROWS = [
    {
      medium: "Movies",
      consume: {
        name: "Netflix",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg",
      },
      community: {
        name: "Letterboxd",
        logo: "https://a.ltrbxd.com/logos/letterboxd-mac-icon.png",
      },
    },
    {
      medium: "Books",
      consume: {
        name: "Amazon",
        logo: "https://1000logos.net/wp-content/uploads/2016/10/Amazon-logo-meaning.jpg",
      },
      community: {
        name: "Good Reads",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Goodreads_%27g%27_logo.png",
      },
    },
    {
      medium: "Anime",
      consume: {
        name: "Crunchyroll",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Crunchyroll_Logo.png",
      },
      community: {
        name: "MyAnimeList",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png",
      },
    },
    {
      medium: "Games",
      consume: {
        name: "Steam",
        logo: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
      },
      community: {
        name: "The Save Room",
        logo: "/images/favicon-32x32.png",
      },
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6">Where We Fit</h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Medium</th>
              <th>Consume</th>
              <th>Community</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {MARKET_ROWS.map((media) => (
              <tr key={media.medium}>
                {/* media name */}
                <th>{media.medium}</th>
                {/* comsume website */}
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={media.consume.logo}
                          alt={`${media.consume.name} logo`}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{media.consume.name}</div>
                    </div>
                  </div>
                </td>
                {/* community website */}
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={media.community.logo}
                          alt={`${media.community.name} logo`}
                        />
                      </div>
                    </div>
                    <div>
                      <div
                        className={`font-bold  ${
                          media.medium === "Games" && "text-primary"
                        }`}
                      >
                        {media.community.name}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th>Medium</th>
              <th>Consume</th>
              <th>Community</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};

export default MarketTable;
