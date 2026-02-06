// /app/api/games/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const CLIENT_ID = process.env.IGDB_CLIENT_ID!;
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    // Read the raw text body from the request
    const body = await req.text();

    const response = await axios.post("https://api.igdb.com/v4/games", body, {
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "text/plain",
        Accept: "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("IGDB fetch error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
