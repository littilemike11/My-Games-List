"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaPlay,
  FaTwitch,
} from "react-icons/fa";
import { GamePreview, StreamDetails, VideoDetails } from "../types/models";
import GamePreviewLink from "./GamePreviewLink";

export type TrendingGameHighlight = {
  game: GamePreview;
  streams: StreamDetails[];
  videos: VideoDetails[];
};

interface TrendingGameShowcaseProps {
  highlights: TrendingGameHighlight[];
  title?: string;
}

const getThumbnail = (thumbnail?: string, isStream: boolean = true) => {
  if (!thumbnail) return null;
  if (isStream) return thumbnail.replace("{width}x{height}", "1280x720");
  else return thumbnail.replace("%{width}x%{height}", "1280x720");
};
const TwitchEmbed: React.FC<{
  channel: string;
}> = ({ channel }) => {
  const parent =
    typeof window !== "undefined" ? window.location.hostname : "localhost";

  return (
    <iframe
      src={`https://player.twitch.tv/?channel=${encodeURIComponent(
        channel,
      )}&parent=${encodeURIComponent(parent)}&muted=true`}
      className="absolute inset-0 w-full h-full"
      allowFullScreen
      title={`${channel} Twitch stream`}
    />
  );
};

const TrendingGameShowcase: React.FC<TrendingGameShowcaseProps> = ({
  highlights,
  title = "Whats the Meta?",
}) => {
  const [activeIndex, setActiveIndex] = useState(0); //index on carousel
  const [playing, setPlaying] = useState(false);

  //   shouldnt ever happen
  if (highlights.length === 0) {
    return (
      <section>
        <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>

        <p className="mt-3 text-sm opacity-60">
          Stay tuned for what's trending!
        </p>
      </section>
    );
  }

  const current = highlights[activeIndex];

  const { game, streams, videos } = current;

  //   max 1 live stream + 3 vids or  1 feat vod + 3 vods or
  const hasLiveStream = streams.length > 0;

  const featuredStream = streams[0];
  const featuredVideo = videos[0];

  const featuredMedia = hasLiveStream ? featuredStream : featuredVideo;

  const remainingVideos = hasLiveStream ? videos : videos.slice(1);

  const nextSlide = () => {
    setPlaying(false);

    setActiveIndex((current) =>
      current === highlights.length - 1 ? 0 : current + 1,
    );
  };

  const previousSlide = () => {
    setPlaying(false);

    setActiveIndex((current) =>
      current === 0 ? highlights.length - 1 : current - 1,
    );
  };

  const selectSlide = (index: number) => {
    setPlaying(false);
    setActiveIndex(index);
  };

  const gameCover = game.cover
    ? game.cover.replace(/t_thumb/g, "t_cover_big")
    : null;

  const thumbnail = getThumbnail(featuredMedia?.thumbnail);
  console.log("thumbnail", thumbnail);
  return (
    <section className=" w-full ">
      {/* Section heading */}
      <div className="flex items-start justify-between gap-4 mb-4 ">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>

          <p className="text-sm opacity-60 mt-1">
            See what games people are playing.
          </p>
        </div>

        <FaTwitch className="text-xl opacity-60 shrink-0 mt-1" />
      </div>
      {/* Carousel controls */}
      {highlights.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            type="button"
            onClick={previousSlide}
            className="btn btn-circle btn-sm btn-ghost"
            aria-label="Previous trending game"
          >
            <FaArrowLeft />
          </button>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3 py-3">
            {" "}
            {highlights.map((highlight, index) => (
              <button
                key={highlight.game.id}
                onClick={() => selectSlide(index)}
                className={`
        group flex-none hover:cursor-pointer
        ${index === activeIndex ? "opacity-100" : "opacity-60"}
      `}
              >
                <div
                  className={`
          aspect-[3/4] overflow-hidden rounded-box
          ${index === activeIndex ? "ring-2 ring-primary" : ""}
        `}
                >
                  <img
                    className="hover:scale-105"
                    src={highlight.game.cover}
                    alt={`${highlight.game.name}'s cover`}
                  />
                </div>

                <p className="text-xs font-medium mt-1 line-clamp-1">
                  {highlight.game.name}
                </p>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            className="btn btn-circle btn-sm btn-ghost"
            aria-label="Next trending game"
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      {/* Main showcase */}
      <article className="card bg-base-100 shadow-md overflow-hidden">
        <div className="grid lg:grid-cols-[200px_1fr] xl:grid-cols-[1fr_4fr]">
          {/* Game identity */}
          <div className="bg-base-200 p-5 flex flex-col">
            <div className="aspect-[3/4] overflow-hidden rounded-box bg-base-300 hidden lg:block">
              <GamePreviewLink game={game} />
            </div>

            <div className="mt-4 text-center lg:text-left">
              <h3 className="font-bold text-lg line-clamp-2 hover:link">
                <Link href={`/game/${game.slug}`}>{game.name}</Link>
              </h3>

              {hasLiveStream ? (
                <div className="mt-2 flex items-center justify-center lg:justify-start gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                  <span className="text-error font-medium">Live now</span>
                </div>
              ) : (
                <p className="mt-2 text-sm opacity-60">Recent videos</p>
              )}
            </div>
          </div>

          {/* Featured media */}
          <div className="relative aspect-video w-full h-full bg-base-300">
            {hasLiveStream ? (
              <>
                {playing ? (
                  <TwitchEmbed channel={featuredStream.username} />
                ) : (
                  <>
                    <img
                      src={thumbnail ?? ""}
                      alt={featuredStream.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setPlaying(true)}
                        className="btn btn-circle btn-primary btn-lg"
                      >
                        <FaPlay />
                      </button>
                    </div>

                    <span className="absolute top-3 right-3 badge bg-red-500 text-white">
                      LIVE
                    </span>

                    <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 text-white text-xs">
                      <FaEye className="inline mr-1" />
                      {featuredStream.views}
                    </span>
                  </>
                )}
              </>
            ) : featuredVideo ? (
              <>
                <img
                  src={getThumbnail(featuredVideo.thumbnail, false) ?? ""}
                  alt={featuredVideo.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  {featuredVideo.url && (
                    <a
                      href={featuredVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-circle btn-primary btn-lg"
                    >
                      <FaPlay />
                    </a>
                  )}
                </div>

                <span className="absolute top-3 left-3 badge">VOD</span>

                <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 text-white text-xs">
                  <FaEye className="inline mr-1" />
                  {featuredVideo.views}
                </span>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="opacity-50">
                  No streams or videos available
                </span>
              </div>
            )}
          </div>
          {hasLiveStream ? (
            <>
              <p className="text-sm opacity-60">
                <FaTwitch className="inline mr-1" />
                <a
                  className="hover:link"
                  href={`https://www.twitch.tv/${featuredStream.username}`}
                >
                  @{featuredStream.username}
                </a>
              </p>

              <h3 className="font-semibold text-lg sm:text-xl line-clamp-2 mt-1">
                {featuredStream.title}
              </h3>

              <div className="text-xs opacity-50 mt-2">
                {featuredStream.views} viewers
              </div>

              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="btn btn-primary btn-sm mt-4"
                disabled={playing}
              >
                <FaTwitch />
                {playing ? "Watching Live" : "Watch Live"}
              </button>
            </>
          ) : featuredVideo ? (
            <>
              <p className="text-sm opacity-60">@{featuredVideo.username}</p>

              <h3 className="font-semibold text-lg sm:text-xl line-clamp-2 mt-1">
                {featuredVideo.title}
              </h3>

              <div className="flex flex-wrap gap-3 text-xs opacity-50 mt-2">
                <span>{featuredVideo.views} views</span>
                <span>{featuredVideo.duration}</span>
                <time>{featuredVideo.date}</time>
              </div>

              {featuredVideo.url && (
                <a
                  href={featuredVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm mt-4"
                >
                  <FaPlay />
                  Watch VOD
                </a>
              )}
            </>
          ) : null}
        </div>

        {/* More videos */}
        {remainingVideos.length > 0 && (
          <div className="border-t border-base-300 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">More from {game.name}</h3>

              <span className="text-xs opacity-50">
                {remainingVideos.length} videos
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
              {remainingVideos.map((video) => {
                const videoThumbnail = getThumbnail(video.thumbnail, false);

                return (
                  <a
                    key={video.id}
                    href={video.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex-none w-52 sm:w-60 snap-start"
                  >
                    <div className="relative aspect-video rounded-box overflow-hidden bg-base-200">
                      {videoThumbnail ? (
                        <img
                          src={videoThumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaPlay className="opacity-30" />
                        </div>
                      )}

                      <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 text-white text-xs">
                        {video.duration}
                      </div>
                    </div>

                    <p className="text-xs opacity-60 mt-2">@{video.username}</p>

                    <h4 className="text-sm font-medium line-clamp-2 mt-0.5">
                      {video.title}
                    </h4>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </article>

      {/* Carousel controls */}
      {highlights.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            type="button"
            onClick={previousSlide}
            className="btn btn-circle btn-sm btn-ghost"
            aria-label="Previous trending game"
          >
            <FaArrowLeft />
          </button>

          <div className="flex items-center gap-2">
            {highlights.map((highlight, index) => (
              <button
                key={highlight.game.id}
                type="button"
                onClick={() => selectSlide(index)}
                aria-label={`Show ${highlight.game.name}`}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-6 bg-primary"
                    : "w-2 bg-base-content/20"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            className="btn btn-circle btn-sm btn-ghost"
            aria-label="Next trending game"
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </section>
  );
};

export default TrendingGameShowcase;
