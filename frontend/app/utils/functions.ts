import { Game } from "../types/models";
export const parseGame = (gameInfo: any): Game => {
  return {
    id: gameInfo.id,
    name: gameInfo.name,
    slug: gameInfo.slug,
    summary: gameInfo.summary,
    storyline: gameInfo.storyline,
    release_date: gameInfo.first_release_date,
    cover: gameInfo.cover ? gameInfo.cover.url : "",
    genres: gameInfo.genres?.map((genre: any) => ({ name: genre.name })) ?? [],
    platforms: gameInfo.platforms?.map((p: any) => ({ name: p.name })) ?? [],
    themes: gameInfo.themes?.map((t: any) => ({name: t.name })) ?? [],
  };
};

export function convertDate(timestamp: number): string {
  const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds → milliseconds
  return date.toUTCString(); // or use toLocaleString() for local time
}
