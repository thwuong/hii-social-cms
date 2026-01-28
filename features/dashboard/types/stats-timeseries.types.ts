export type TimeseriesResponse = TimeseriesItem[];

export interface TimeseriesItem {
  timestamp: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  reels: number;
}
