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
      <div className="carousel">
        {games.map((game) => (
          <div key={game.id} className="carousel-item h-56">
            <div className="px-2">
              <GamePreviewLink game={game} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default Carousel;
