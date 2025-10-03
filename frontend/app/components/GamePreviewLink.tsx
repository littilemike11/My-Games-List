import Link from "next/link";
import { GamePreview } from "../types/models";

type Props = {
  game: GamePreview;
  height?: number;
  isRound?: boolean;
};

const GamePreviewLink: React.FC<Props> = ({
  game,
  height = 56,
  isRound = true,
}) => {
  return (
    <div
      className={`overflow-hidden ${
        isRound && "rounded-2xl "
      } h-${height} w-40`}
    >
      <Link
        className="block w-full h-full hover:scale-105 transition-transform duration-200"
        title={game?.name}
        href={`/game/${game?.slug}`}
      >
        <img
          className="w-full h-full object-cover"
          src={game?.cover}
          alt={`${game?.name} cover`}
        />
      </Link>
    </div>
  );
};

export default GamePreviewLink;
