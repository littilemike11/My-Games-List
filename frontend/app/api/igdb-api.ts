import axios from "axios";
import { Game } from "../types/models";
const getGames = async (body: string): Promise<Game[]> => {
  try {
    const response = await axios.post("http://localhost:3001/games", body, {
      headers: {
        "Content-Type": "text/plain", // ✅ IGDB requires raw text, not JSON
      },
    });
    return response.data;
  } catch (error) {
    console.error("error fetching igdb games:" + error);
    return [];
  }
};
export default getGames;
