// export type Post = Review | Discussion | List;

export type contentType = "review" | "discussion" | "list" | "comment";

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
  total_xp: number;
  id: string;
  username: string;
  avatar: string;
  bio?: string;
}

export interface ProfilePreview {
  id: string;
  username: string;
  avatar: string;
}

export interface Game extends GamePreview {
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
  artwork?: string[];
  videos?: {
    name?: string;
    url: string;
  }[];
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
  game: GamePreview;
  profile: ProfilePreview;
  game_id?: number;
  id: number;
  likes?: number;
  rating: number;
  content: string;
  title: string;
  user_id?: string;
  platform: string;
  hours_played: number;
  comment_count?: number;
  tags?: Tag[];
}

export interface Discussion {
  comments?: string[];
  created_at: Date;
  dislikes: number;
  gameID?: string;
  id: number;
  likes: number;
  tags?: Tag[];
  content: string;
  title: string;
  user_id?: string;
  profile: ProfilePreview;
  comment_count: number;
}

export interface Comment {
  id: number;
  created_at: Date;
  parent_id?: number;
  content_id?: number;
  content_type?: contentType;
  body: string;
  profile: ProfilePreview;
  replies?: Comment[];
  likes: number;
  dislikes: number;
  comment_count: number;
}
export interface List {
  id: number;
  created_at?: Date;
  title: string;
  tags?: Tag[];
  type?: ListType;
  visibility?: ListVisibility;
  description?: string;
  games: GamePreview[];
  profile: ProfilePreview;
  likes: number;
  dislikes: number;
  comment_count: number;
}

export interface Tag {
  id: number;
  name: string;
  description?: string;
  type: tagType;
  owner_id?: string;
}

export interface Post {
  author_avatar: string;
  author_name: string;
  comment_count: number;
  content: string;
  created_at: Date; // ISO timestamp
  dislikes: number;
  game_cover?: string;
  game_id?: number;
  game_name?: string;
  game_slug?: string;
  games: GamePreview[];
  hours_played?: number;
  likes: number;
  parent_id: number;
  parent_type: taggableContent;
  platform?: string;
  rating?: number;
  tag_id?: number;
  tags: Tag[];
  title: string;
  user_id: string;
  visibility: ListVisibility;
}

export type tagType = "community" | "official" | "restricted";
export type taggableContent = "review" | "discussion" | "list";
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
export interface CustomList {
  game_id: number;
  game_slug: string;
  game_name: string;
  game_cover: string;
  list_id: number;
  list_title: string;
  list_tags: string[];
  list_description: string;
  list_likes: number;
  list_dislikes: number;
  list_comment_count: number;
  username: string;
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

export type ListVisibility = "private" | "public" | "friends";
export type ListType =
  | "custom"
  | "favorite"
  | "likes"
  | "played"
  | "playing"
  | "wishlist";
export type StatusKey = "played" | "playing" | "wishlist" | "favorite";
