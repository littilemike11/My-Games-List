import { EventDetails } from "../types/models";
import {
  FaYoutube,
  FaTwitch,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaDiscord,
  FaReddit,
  FaLinkedin,
} from "react-icons/fa";
import { FaThreads, FaBluesky } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
const EventShowcase: React.FC<{
  events: EventDetails[];
  title: string;
}> = ({ events, title }) => {
  if (events.length === 0) {
    return (
      <section>
        <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
        <p className="mt-4 opacity-60">Stay tuned for more events!</p>
      </section>
    );
  }

  interface Website {
    name: string;
    icon: any;
  }

  const parseLink = (link: string) => {
    const url = link.toLowerCase();

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return { name: "YouTube", icon: FaYoutube };
    }

    if (url.includes("twitch.tv")) {
      return { name: "Twitch", icon: FaTwitch };
    }

    if (url.includes("twitter.com") || url.includes("x.com")) {
      return { name: "Twitter", icon: FaTwitter };
    }

    if (url.includes("facebook.com") || url.includes("fb.com")) {
      return { name: "Facebook", icon: FaFacebook };
    }

    if (url.includes("instagram.com")) {
      return { name: "Instagram", icon: FaInstagram };
    }

    if (url.includes("tiktok.com")) {
      return { name: "TikTok", icon: FaTiktok };
    }

    if (url.includes("discord.com") || url.includes("discord.gg")) {
      return { name: "Discord", icon: FaDiscord };
    }

    if (url.includes("reddit.com")) {
      return { name: "Reddit", icon: FaReddit };
    }

    if (url.includes("linkedin.com")) {
      return { name: "LinkedIn", icon: FaLinkedin };
    }

    if (url.includes("threads.net")) {
      return { name: "Threads", icon: FaThreads };
    }

    if (url.includes("bsky.app")) {
      return { name: "Bluesky", icon: FaBluesky };
    }

    if (url.includes("mastodon")) {
      return { name: "mastodon", icon: FiExternalLink };
    }

    return { name: "Website", icon: FiExternalLink };
  };

  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-2xl">
        {events.map((event) => (
          <article
            key={event.id}
            className="card bg-base-100 shadow-sm h-full overflow-hidden"
          >
            {/* Logo */}
            <figure className="h-40 sm:h-48 bg-base-200">
              {event.event_logo ? (
                <img
                  src={event.event_logo}
                  alt={`${event.name} event logo`}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <span className="opacity-50">No event image</span>
                </div>
              )}
            </figure>

            {/* Content */}
            <div className="card-body flex flex-col">
              <h3 className="card-title line-clamp-2">{event.name}</h3>

              <p className="text-sm opacity-90 line-clamp-3">
                {event.description || "No description available."}
              </p>

              {/* Date */}
              <time className="text-sm opacity-50 mt-auto pt-4">
                {event.start_time}
              </time>

              {/* Actions */}
              <div className="card-actions justify-between items-center mt-2">
                <div className="flex flex-wrap gap-2">
                  {event.live_stream_url ? (
                    <a
                      href={event.live_stream_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Go Now
                    </a>
                  ) : (
                    <span className="btn btn-sm btn-disabled">
                      No Livestream
                    </span>
                  )}

                  {event.links?.map((link) => {
                    const { name, icon: Icon } = parseLink(link);

                    return (
                      <a
                        key={link}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                      >
                        <Icon size={16} />
                        {name}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default EventShowcase;
