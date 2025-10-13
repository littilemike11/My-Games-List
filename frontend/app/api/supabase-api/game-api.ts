import supabase from "@/supabase-client";
import { Game, GamePreview } from "@/app/types/models";

export async function upsertGame(igdbGame: Game | GamePreview) {
  if (!igdbGame || !igdbGame.slug || !igdbGame.id) {
    console.log(igdbGame);
    console.warn("Invalid IGDB game object.");
    return null;
  }
  //check if game already exists in supabase
  const { data: existingGame, error: fetchError } = await supabase
    .from("games")
    .select("id")
    .eq("slug", igdbGame.slug)
    .maybeSingle();

  if (fetchError) {
    console.error("Failed to fetch game from Supabase:", fetchError.message);
    return null;
  }

  if (existingGame) {
    return existingGame; // Game already exists, return it
  }
  //insert igdb game into supabase
  const { data: newGame, error: insertError } = await supabase
    .from("games")
    .insert([
      {
        name: igdbGame.name,
        slug: igdbGame.slug,
        igdb_id: igdbGame.id,
        cover: igdbGame.cover,
        rating: "rating" in igdbGame ? igdbGame.rating ?? 0 : 0,
        rating_count: "ratingCount" in igdbGame ? igdbGame.ratingCount ?? 0 : 0,
      },
    ])
    .select()
    .single();

  if (insertError) {
    console.error("Failed to insert game into Supabase:", insertError.message);
    return null;
  }
  return newGame;
}
