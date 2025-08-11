import Link from "next/link";
import { GamePreview } from "../types/models";

type Props = {
  game: GamePreview;
};

const GamePreviewLink: React.FC<Props> = ({ game }) => {
  console.log(game);
  return (
    <Link
      className="px-2  hover:scale-105 transition-200 "
      title={game?.name}
      href={`/game/${game?.slug}`}
    >
      <img
        className="h-full w-full rounded-2xl object-cover"
        src={game?.cover}
        alt={`${game?.name} cover`}
      />
    </Link>
  );
};

export default GamePreviewLink;
