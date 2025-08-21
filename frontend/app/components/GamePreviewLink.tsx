import Link from "next/link";
import { GamePreview } from "../types/models";

type Props = {
  game: GamePreview;
  height?: number;
};

const GamePreviewLink: React.FC<Props> = ({ game, height = 56 }) => {
  return (
    <div className={`overflow-hidden rounded-2xl h-${height}`}>
      <Link
        className="block w-full h-full hover:scale-105 transition-transform duration-200"
        title={game?.name}
        href={`/game/${game?.slug}`}
      >
        <img
          className="w-full h-full object-cover rounded-2xl"
          src={game?.cover}
          alt={`${game?.name} cover`}
        />
      </Link>
    </div>
  );
};

export default GamePreviewLink;
