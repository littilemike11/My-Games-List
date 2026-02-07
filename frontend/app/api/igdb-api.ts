// import { Game } from "../types/models";

// const getGames = async (body: string): Promise<Game[]> => {
//   const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000/";
//   try {
//     const res = await fetch(`${BASE_URL}/api/games`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "text/plain",
//       },
//       body,
//     });

//     if (!res.ok) {
//       throw new Error(`Request failed: ${res.status}`);
//     }

//     return res.json();
//   } catch (error) {
//     console.error("error fetching igdb games:", error);
//     return [];
//   }
// };

// export default getGames;

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
