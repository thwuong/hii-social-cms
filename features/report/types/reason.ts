export interface ReportReason {
  created_at: string;
  description: string;
  id: string;
  is_active: boolean;
  title: string;
  updated_at: string;
}
export interface ReportReasonsPayload {
  limit?: number;
  cursor?: string;
  is_active?: boolean;
}

export interface ReportReasonsResponse {
  has_next: boolean;
  next_cursor: string;
  number_of_items: number;
  reasons: ReportReason[];
  total: number;
}
