const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
dotenv.config();
const app = express();

const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.text());// this parses raw text bodies , needed for igdb

const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;
console.log("CLIENT_ID:" + CLIENT_ID);
console.log("ACCESS_TOKEN: " + ACCESS_TOKEN);
app.post("/games", async (req, res) => {
  try {
    const body = req.body
    const response = await axios.post(
      "https://api.igdb.com/v4/games", //url
      body, //body
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("error fetching igdb games:" + error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Express API started: http://localhost:${PORT}`);
});
