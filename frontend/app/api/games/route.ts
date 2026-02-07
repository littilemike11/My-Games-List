import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.IGDB_CLIENT_ID!;
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const res = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "text/plain",
        Accept: "application/json",
      },
      body,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("IGDB error:", errorText);
      return NextResponse.json(
        { error: "IGDB request failed" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("IGDB fetch error:", error);
    return NextResponse.json(
      { error: "Server error fetching IGDB data" },
      { status: 500 }
    );
  }
}
