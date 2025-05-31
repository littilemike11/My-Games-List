export type Post = Review | Discussion;

export interface User {
  discussion: Discussion[];
  email: string;
  favorites: string[];
  id: string;
  password: string;
  reviews: Review[];
  username: string;
}

export interface Game {
  cover?: string;
  developers: string[];
  franchise?:GamePreview[]
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

export interface GamePreview{
  id:number,
  cover?:string,
  name:string,
  slug:string,
}

export interface Review {
  comments?: string[];
  date: Date;
  dislikes: number;
  gameID: string;
  id: string;
  likes: number;
  rating: number;
  text: string;
  title: string;
  userID: string;
}

export interface Discussion {
  comments?: string[];
  date: Date;
  dislikes: number;
  gameID?: string;
  id: string;
  likes: number;
  tags?: string[];
  text: string;
  title: string;
  userID: string;
}

export interface Comment {
  id: string;
  parentID: string;
  parentType: Review | Discussion;
  text: string;
  userID: string;
}
