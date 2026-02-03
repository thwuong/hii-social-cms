export interface StatsContentResponse {
  total_videos: number;
  total_articles: number;
  total_scheduled: number;
  total_draft: number;
  total_published: number;
  total_rejected: number;
  total_pending: number;
  total_approved: number;
  average_video_duration: number;
  most_used_tags: MostUsedTag[];
}

export interface MostUsedTag {
  tag: string;
  count: number;
  growth_rate: number;
}
