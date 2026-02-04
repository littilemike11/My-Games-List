"use client";
import { GamePreview } from "../types/models";
import GamePreviewLink from "./GamePreviewLink";
import { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

type CarouselProps = {
  title?: string;
  games: GamePreview[];
  isList?: boolean;
};

const CARD_WIDTH = 160 + 16; // width + gap

const Carousel: React.FC<CarouselProps> = ({
  title,
  games,
  isList = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -CARD_WIDTH * 2 : CARD_WIDTH * 2,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full space-y-2">
      {title && <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>}

      <div className="relative group">
        {/* LEFT ARROW (desktop only) */}
        <button
          onClick={() => scroll("left")}
          className="
            hidden md:flex
            absolute left-0 top-1/2 -translate-y-1/2 z-10
            btn btn-circle 
            bg-base-100/80 backdrop-blur
            shadow
            hover:bg-base-300
            hover:scale-105
            active:scale-95
            group-hover:opacity-100
            opacity-0 transition
          "
        >
          <FaArrowLeft size={18} />
        </button>

        {/* SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          className="
            flex gap-4
            overflow-x-auto overflow-y-hidden
            scroll-smooth
            snap-x snap-mandatory
            px-1
            py-2
          "
        >
          {games.map((game) => (
            <div
              key={game.id}
              className={`
                snap-start
                flex-shrink-0
                 ${isList ? "h-44" : "h-56"}
              `}
            >
              <GamePreviewLink game={game} />
            </div>
          ))}
        </div>

        {/* RIGHT ARROW (desktop only) */}
        <button
          onClick={() => scroll("right")}
          className="
            hidden md:flex
            absolute right-0 top-1/2 -translate-y-1/2 z-10
            btn btn-circle 
            bg-base-100/80 backdrop-blur
            shadow
            group-hover:opacity-100
            hover:bg-base-300
            hover:scale-105
            active:scale-95
            opacity-0 transition
          "
        >
          <FaArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default Carousel;
