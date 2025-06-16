type InfoProps = {
  genres: String[];
  platforms: String[];
  themes: String[];
  developers: String[];
  publishers: String[];
};
const Info: React.FC<InfoProps> = ({
  genres,
  platforms,
  themes,
  developers,
  publishers,
}) => {
  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col ">
          <h2 className="font-semibold text-gray-400 uppercase text-sm">
            Genres
          </h2>
          <ul className="flex flex-wrap gap-2">
            {genres.map((genre, index) => (
              <li className="badge badge-info" key={index}>
                {genre}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col">
          <h2 className="font-semibold text-gray-400 uppercase text-sm">
            Platforms
          </h2>
          <ul className="flex flex-wrap gap-2">
            {platforms.map((platform, index) => (
              <li className="badge badge-secondary " key={index}>
                {platform}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col">
          <h2 className="font-semibold text-gray-400 uppercase text-sm">
            Themes
          </h2>
          <ul className="flex flex-wrap gap-2">
            {themes.map((theme, index) => (
              <li className="badge badge-accent" key={index}>
                {theme}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <h2 className="font-semibold text-gray-400 uppercase text-sm">
            Developer(s)
          </h2>
          <ul className="flex flex-wrap gap-2">
            {developers.map((developer, index) => (
              <li className="badge badge-outline" key={index}>
                {developer}
              </li>
            ))}
          </ul>
        </div>
        {publishers && (
          <div className="flex flex-col">
            <h2 className="font-semibold text-gray-400 uppercase text-sm">
              Publisher(s)
            </h2>
            <ul className="flex flex-wrap gap-2">
              {publishers.map((publisher, index) => (
                <li className="badge" key={index}>
                  {publisher}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Info;
