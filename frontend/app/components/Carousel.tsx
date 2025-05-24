import { Game } from "../types/models";
type CarouselProps ={
    title:string;
    games: Game[];
}
const Carousel:React.FC<CarouselProps>= ({title, games})=>{
    return(
        <>
        <h2 className="text-xl font-medium text-left">{title}</h2>
        <div className="carousel h-56 rounded-box">
            {games.map((game)=>(
                <div className="carousel-item " key={game.id}>
                    <img
                    src={game.cover?.replace("t_thumb", "t_cover_big")}// makes cover clearer
                    alt={`${game.name} cover`} />
                </div>
            ))}
            
        </div>
        </>
    )
}
export default Carousel;