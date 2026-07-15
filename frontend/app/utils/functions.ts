import { Game, GamePreview, Filters } from "../types/models";
export const parseGame = (gameInfo: any): Game => {
  return {
    id: gameInfo.id,
    name: gameInfo.name,
    slug: gameInfo.slug,
    summary: gameInfo.summary,
    storyline: gameInfo.storyline,
    developers:
      gameInfo.involved_companies
        ?.filter((c: any) => c.developer && c.company)
        .map((c: any) => c.company.name) || [],
    publishers:
      gameInfo.involved_companies
        ?.filter((c: any) => c.publisher && c.company)
        .map((c: any) => c.company.name) || [],
    screenshots:
      gameInfo.screenshots?.map((screenshot: any) =>
        screenshot.url.replace("t_thumb", "t_cover_big"),
      ) ?? [],
    release_date: convertDate(gameInfo.first_release_date),
    rating: gameInfo.rating,
    liked: gameInfo.hypes,
    ratingCount: gameInfo.rating_count,
    franchise:
      gameInfo.franchises?.flatMap((franchise: any) =>
        franchise.games.map((game: any) => parseGamePreview(game)),
      ) ?? [],
    similarGames:
      gameInfo.similar_games?.map((game: any) => parseGamePreview(game)) ?? [],
    cover: gameInfo.cover
      ? gameInfo.cover.url.replace("t_thumb", "t_cover_big")
      : "",
    genres: gameInfo.genres?.map((genre: any) => genre.name) ?? [],
    platforms: gameInfo.platforms?.map((platform: any) => platform.name) ?? [],
    themes: gameInfo.themes?.map((t: any) => t.name) ?? [],
    artwork:
      gameInfo.artworks?.map((art: any) =>
        art.url.replace("t_thumb", "t_original"),
      ) ?? [],
    videos: gameInfo.videos?.map((vid: any) => ({
      name: vid.name,
      url: vid.video_id,
    })),
  };
};

export const parseGamePreview = (gameInfo: any): GamePreview => {
  return {
    id: gameInfo.id,
    name: gameInfo.name,
    slug: gameInfo.slug,
    cover: gameInfo.cover
      ? gameInfo.cover.url.replace("t_thumb", "t_cover_big")
      : "",
  };
};

export function convertDate(timestamp: number): string {
  const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds → milliseconds
  // return date.toUTCString(); // or use toLocaleString() for local time
  // return date.toLocaleDateString();
  return date.toLocaleDateString();
}

export function formatDate(date: Date) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    dateStyle: "medium",
  });
  return formattedDate;
}

export function getLevel(xp: number) {
  return Math.floor(Math.cbrt(xp / 3));
}

export function getLevelProgress(xp: number) {
  //ex)50
  const currLevel = Math.floor(Math.cbrt(xp / 3)); //2
  const nextLevel = currLevel + 1; //3
  const currLvlThreshold = Math.pow(currLevel, 3) * 3; //24
  const nextLvlThreshold = Math.pow(nextLevel, 3) * 3; //81
  const xpPast = xp - currLvlThreshold;
  const xpNeeded = nextLvlThreshold - currLvlThreshold;
  return (xpPast / xpNeeded) * 100;
  //26 xp past prev level
  //need 31 xp
  //find percent complete
  //diff btwn curr and next lvl= 57
}

export function parseFilters(segments: string[] | string = []): Filters {
  const filters: Filters = {};

  for (let i = 0; i < segments.length; i += 2) {
    const key = segments[i];
    let value = segments[i + 1];

    if (!value) continue;
    value = decodeURIComponent(value); // see + in uri

    switch (key) {
      case "platform":
        filters.platform = value.split("+");
        break;
      case "year":
        filters.year = value.split("+");
        break;
      case "decade":
        filters.decade = value.split("+");
        break;
      case "genre":
        filters.genre = value.split("+");
        break;
      case "theme":
        filters.theme = value.split("+");
      case "rating":
        filters.rating = value.split(" ");
        break;
      case "hype":
        filters.hype = value.split(" ");
        break;
      case "sort":
        filters.sort = value.split(" ");
    }
  }

  return filters;
}
