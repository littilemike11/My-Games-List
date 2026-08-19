import Link from "next/link";
import { GamePreview } from "../types/models";

type Props = {
  game: GamePreview;
  height?: number;
  isRound?: boolean;
};

const GamePreviewLink: React.FC<Props> = ({ game, isRound = true }) => {
  return (
    <>
      <Link
        className={`overflow-hidden aspect-[3/4] block w-full h-full hover:scale-105 transition-transform duration-200 relative ${
          isRound && "rounded-2xl "
        }`}
        title={game?.name}
        href={`/game/${game?.slug}`}
      >
        <img
          className="w-full h-full"
          src={game?.cover}
          alt={`${game?.name} cover`}
        />
        <p className="absolute bottom-0 z-10 left-0 right-0 bg-black text-xs text-white text-center truncate px-1 py-0.5">
          {game?.name}
        </p>
      </Link>
    </>
  );
};

export default GamePreviewLink;
