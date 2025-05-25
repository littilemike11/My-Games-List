export type Post = Review | Discussion;

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  favorites: string[];
  reviews: Review[];
  discussion: Discussion[];
}

export interface Game {
  id: string;
  name: string;
  slug:string;
  release_date?: Date;
  cover?:string;
  genres:string[];
  platforms:string[];
  storyline:string;
  summary:string;
  themes:string[];
  publisher?: string;
  studio?: string;
  reviews?: Review[];
  played?: number;
  liked?: number;
}

export interface Review {
  id: string;
  userID: string;
  title: string;
  text: string;
  rating: number;
  gameID: string;
  comments?: string[];
  date: Date;
  likes: number;
  dislikes: number;
}
export interface Discussion {
  id: string;
  userID: string;
  title: string;
  text: string;
  tags?: string[];
  gameID?: string;
  comments?: string[];
  date: Date;
  likes: number;
  dislikes: number;
}

export interface Comment {
  id: string;
  parentID: string;
  parentType: Review | Discussion;
  text: string;
  userID: string;
}
