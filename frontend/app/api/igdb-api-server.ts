import axios from "axios";
import {
  EventDetails,
  Game,
  StreamDetails,
  VideoDetails,
} from "../types/models";

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

export const getEvents = async (body: string): Promise<EventDetails[]> => {
  try {
    const response = await axios.post("https://api.igdb.com/v4/events", body, {
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("error fetching igdb events:", error);
    return [];
  }
};

export const getStreams = async (
  gameID: number,
  period: string = "week",
  sort: string = "views",
  length: number = 3,
): Promise<StreamDetails[]> => {
  try {
    const response = await axios.get(
      `https://api.twitch.tv/helix/streams?game_id=${gameID}&period=${period}&sort=${sort}&first=${length}`,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("error fetching twitch Streams:", error);
    return [];
  }
};
export const getVideos = async (
  gameID: number,
  period: string = "week",
  sort: string = "views",
  length: number = 4,
): Promise<VideoDetails[]> => {
  try {
    const response = await axios.get(
      `https://api.twitch.tv/helix/videos?game_id=${gameID}&period=${period}&sort=${sort}&first=${length}`,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("error fetching twitch vids:", error);
    return [];
  }
};

export const getTwitchGames = async (gameIDs: number[]): Promise<any[]> => {
  try {
    let games = "";
    gameIDs.map((game) => (games += `igdb_id=${game}&`));
    console.log("games", games.slice(0, -1));
    const response = await axios.get(
      `https://api.twitch.tv/helix/games?${games.slice(0, -1)}`,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("error fetching twitch vids:", error);
    return [];
  }
};
export default getGames;
