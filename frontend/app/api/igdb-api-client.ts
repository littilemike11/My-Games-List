import { Game } from "../types/models";
const getGames = async (body: string): Promise<Game[]> => {
  try {
    const res = await fetch("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body,
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("error fetching igdb games:", error);
    return [];
  }
};

export default getGames;
