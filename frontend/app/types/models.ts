export type Post = Review | Discussion;

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
