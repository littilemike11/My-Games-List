import Link from "next/link";
import { GamePreview } from "../types/models";

type Props = {
  game: GamePreview;
  height?: number;
  isRound?: boolean;
};

const GamePreviewLink: React.FC<Props> = ({ game, isRound = true }) => {
  return (
    <Link
      className={`
        relative
        block
        h-full
        w-full
        overflow-hidden
        aspect-[3/4]
        transition-transform
        duration-200
        hover:scale-105
        ${isRound ? "rounded-2xl" : ""}
      `}
      title={game?.name}
      href={`/game/${game?.slug}`}
    >
      <img
        className="h-full w-full object-cover"
        src={game?.cover}
        alt={`${game?.name} cover`}
      />

      <p className="absolute bottom-0 left-0 right-0 z-10 truncate bg-black/80 px-1 py-0.5 text-center text-xs text-white">
        {game?.name}
      </p>
    </Link>
  );
};

export default GamePreviewLink;
