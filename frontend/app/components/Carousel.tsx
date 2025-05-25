import Link from "next/link";
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
                
                <Link className=" px-2 hover:scale-105 transition-200 carousel-item " title={game.name} href={`/game/${game.slug}`} key={game.id}>   
                        <img
                        src={game.cover}
                        alt={`${game.name} cover`}
                        />
                </Link>  
            ))}
            
        </div>
        </>
    )
}
export default Carousel;