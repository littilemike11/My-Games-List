import axios from "axios";
import { Game } from "../types/models";

const getGames = async (body: string): Promise<Game[]> => {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const response = await axios.post(`${BASE_URL}/api/games`, body, {
      headers: {
        "Content-Type": "text/plain", // IMPORTANT
      },
    });

    return response.data;
  } catch (error) {
    console.error("error fetching igdb games:", error);
    return [];
  }
};

export default getGames;
