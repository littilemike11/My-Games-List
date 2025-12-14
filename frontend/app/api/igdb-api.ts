// import axios from "axios";
// import { Game } from "../types/models";
// const getGames = async (body: string): Promise<Game[]> => {
//   try {
//     const response = await axios.post("http://localhost:3001/games", body, {
//       headers: {
//         "Content-Type": "text/plain", // ✅ IGDB requires raw text, not JSON
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("error fetching igdb games:" + error);
//     return [];
//   }
// };
// export default getGames;

// /app/api/igdb-api.ts
// Example in a server component
import axios from "axios";
import { Game } from "../types/models";

const CLIENT_ID = process.env.IGDB_CLIENT_ID!;
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN!;

const getGames = async (body: string): Promise<Game[]> => {
  try {
    const response = await axios.post("https://api.igdb.com/v4/games", body, {
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("error fetching igdb games:", error);
    return [];
  }
};

export default getGames;
