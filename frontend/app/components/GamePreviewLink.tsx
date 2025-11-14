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
      className={`overflow-hidden block w-full h-full hover:scale-105 transition-transform duration-200 ${
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
    </Link>
  );
};

export default GamePreviewLink;
