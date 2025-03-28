export interface Song {
  id: string;
  title: string;
  author: string;
  year: string;
  tags?: string[];
  key?: string;
  verses: {
    content: string;
  }[];
}

export interface SongSearchParams {
  query?: string;
  category?: string;
  tags?: string[];
} 