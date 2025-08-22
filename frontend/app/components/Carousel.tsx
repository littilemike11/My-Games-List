import { GamePreview } from "../types/models";
import GamePreviewLink from "./GamePreviewLink";
type CarouselProps = {
  title: string;
  games: GamePreview[];
};
const Carousel: React.FC<CarouselProps> = ({ title, games }) => {
  return (
    <>
      <h2 className="text-xl font-medium text-left">{title}</h2>
      <div className="overflow-x-auto w-full py-2">
        <div className="flex gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="flex-shrink-0 w-40 h-56" // each card has fixed size
            >
              <GamePreviewLink game={game} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Carousel;
