import { GamePreview } from "../types/models";
import GamePreviewLink from "./GamePreviewLink";
type CarouselProps = {
  title?: string;
  games: GamePreview[];
};
const Carousel: React.FC<CarouselProps> = ({ title, games }) => {
  return (
    <>
      {title && (
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-2">
          {title}
        </h2>
      )}
      <div className="overflow-x-auto w-full py-2 mb-4">
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
