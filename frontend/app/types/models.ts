export type Post = Review | Discussion;

export interface User {
  discussions: Discussion[];
  email: string;
  favorites: List;
  likes: List;
  id: string;
  followers: User[];
  following: User[];
  password: string;
  reviews: Review[];
  username: string;
  bio: string;
  lists: List[];
  played: List;
  playing: List;
  wishlist: List;
  avatar: string;
}
export interface Profile {
  username: String;
  avatar: String;
  bio?: String;
}

export interface Game {
  cover?: string;
  developers: string[];
  discussions?: Discussion[];
  franchise?: GamePreview[];
  genres: string[];
  id: number;
  liked?: number;
  name: string;
  platforms: string[];
  played?: number;
  publishers: string[];
  rating: number;
  ratingCount: number;
  release_date?: string;
  reviews?: Review[];
  screenshots: string[];
  similarGames: GamePreview[];
  slug: string;
  storyline: string;
  summary: string;
  themes: string[];
}

export interface GamePreview {
  id: number;
  cover?: string;
  name: string;
  slug: string;
}

export interface Review {
  comments?: string[];
  created_at?: Date;
  dislikes?: number;
  games?: GamePreview;
  profiles?: Profile;
  game_id?: number;
  id?: number;
  likes?: number;
  rating: number;
  content: string;
  title: string;
  user_id?: string;
  platform: string;
  hours_played: number;
}

export interface Discussion {
  comments?: string[];
  created_at: Date;
  dislikes: number;
  gameID?: string;
  id?: number;
  likes: number;
  tags?: string[];
  content: string;
  title: string;
  user_id?: string;
  profiles?: Profile;
}

export interface Comment {
  id: string;
  parentID: string;
  parentType: Review | Discussion;
  text: string;
  userID: string;
}
export interface List {
  id: number;
  created_at?: Date;
  user_id: string;
  title: string;
  tags: string[];
  type: ListType;
  visibility: ListVisibility;
  description?: string;
  profiles?: Profile;
  likes: number;
  dislikes: number;
}
export interface UserGameList {
  custom_lists: any;
  user_id: string;
  username: string;
  played: boolean;
  playing: boolean;
  favorite: boolean;
  wishlist: boolean;
  game_id: number;
  game_slug: string;
  game_cover: string | null;
  game_name: string;
}

export interface GameEntry {
  played: boolean;
  playing: boolean;
  wishlist: boolean;
  favorite: boolean;
  game: {
    id: number;
    name: string;
    slug: string;
    cover?: string;
  };
}

export interface List_Games {
  id: number;
  created_at?: Date;
  position: number;
  game_id: number;
  list_id: number;
}

export type ListVisibility = "private" | "public" | "friends";
export type ListType =
  | "custom"
  | "favorite"
  | "likes"
  | "played"
  | "playing"
  | "wishlist";
export type StatusKey = "played" | "playing" | "wishlist" | "favorite";
