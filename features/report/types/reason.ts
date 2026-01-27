interface ReportReason {
  created_at: string;
  description: string;
  id: string;
  is_active: boolean;
  title: string;
  updated_at: string;
}
interface ReportReasonsPayload {
  limit?: number;
  cursor?: string;
  is_active?: boolean;
}

interface ReportReasonsResponse {
  has_next: boolean;
  next_cursor: string;
  number_of_items: number;
  reasons: ReportReason[];
  total: number;
}

export type { ReportReason, ReportReasonsPayload, ReportReasonsResponse };
