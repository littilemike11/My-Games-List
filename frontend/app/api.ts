import axios from "axios";
const getGames = async () => {
  try {
    const response = await axios.get("http://localhost:3001/games");
    return response.data;
  } catch (error) {
    console.error("error fetching igdb games:" + error);
  }
};
export default getGames;
