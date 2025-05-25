import getGames from "@/app/api";
import { Game } from "@/app/types/models";
import { parseGame } from "@/app/utils/functions";
interface Props {
  params: { slug: string };
}


export default async function GamePage({ params }: Props) {
    
    const query= `fields cover.url, first_release_date, genres.name, name, platforms.name, storyline, summary, themes.name; where slug = "${params.slug}";`
    const response = await getGames(query)
    console.log(response)
    const game= parseGame(response[0])
    console.log(game)
    
  return (
    <>
    <div className="flex px-4">
        <img src={game.cover} alt={`${game.name} cover art`} />
        <div>
             <h1 className=" text-3xl text-pretty lg:text-5xl font-bold">{game.name}</h1>
            <p>{game.storyline}</p>
            {/* <p>{game.summary}</p> */}
            <p>{}</p>
            <ul className="">
                {game.genres.map((genre,index)=>(
                <li className="badge" key={index}>{genre}</li>
            ))}
            </ul>
            <ul className="">
                {game.platforms.map((platform,index)=>(
                <li className="badge" key={index}>{platform}</li>
            ))}
            </ul>
            <ul className="">
                {game.themes.map((theme,index)=>(
                <li className="badge" key={index}>{theme}</li>
            ))}
            </ul>
            
        </div>
    </div>

    </>
    );
}
