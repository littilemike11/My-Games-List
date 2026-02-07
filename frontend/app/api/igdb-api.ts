import { Game } from "../types/models";

const getGames = async (body: string): Promise<Game[]> => {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000/";
  try {
    const res = await fetch(`${BASE_URL}/api/games`, {
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
