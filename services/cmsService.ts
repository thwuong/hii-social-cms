import { AuditLogEntry, ContentItem, ContentStatus, UserRole } from '@/shared/types';

export class CMSService {
  private content: ContentItem[] = [];

  private auditLogs: AuditLogEntry[] = [];

  private categories: string[] = [];

  private tags: string[] = [];

  constructor(initialContent: ContentItem[], initialCategories: string[], initialTags: string[]) {
    this.content = [...initialContent];
    this.categories = [...initialCategories];
    this.tags = [...initialTags];
  }

  getContent() {
    return [...this.content].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getAuditLogs() {
    return [...this.auditLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getCategories() {
    return this.categories;
  }

  getTags() {
    return this.tags;
  }

  getContentById(id: string) {
    return this.content.find((c) => c.content_id === id);
  }

  createContent(item: Omit<ContentItem, 'content_id' | 'created_at' | 'status'>, user: string) {
    const newItem: ContentItem = {
      ...item,
      content_id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      status: ContentStatus.DRAFT,
      created_by: user,
    };
    this.content.push(newItem);
    this.logAction(newItem.content_id, 'Đã tạo', undefined, ContentStatus.DRAFT, user);
    return newItem;
  }

  updateContent(id: string, updates: Partial<ContentItem>, user: string) {
    const index = this.content.findIndex((c) => c.content_id === id);
    if (index === -1) return null;

    const oldItem = this.content[index];
    const newItem = { ...oldItem, ...updates };
    this.content[index] = newItem;

    if (updates.status && updates.status !== oldItem.status) {
      this.logAction(
        id,
        `Trạng thái đổi thành ${updates.status}`,
        oldItem.status,
        updates.status,
        user
      );
    } else {
      this.logAction(id, 'Cập nhật thông tin', oldItem.status, oldItem.status, user);
    }

    return newItem;
  }

  addCategory(name: string) {
    if (!this.categories.includes(name)) this.categories.push(name);
  }

  removeCategory(name: string) {
    this.categories = this.categories.filter((c) => c !== name);
  }

  addTag(name: string) {
    if (!this.tags.includes(name)) this.tags.push(name);
  }

  removeTag(name: string) {
    this.tags = this.tags.filter((t) => t !== name);
  }

  private logAction(
    content_id: string,
    action: string,
    prev: ContentStatus | undefined,
    next: ContentStatus,
    user: string
  ) {
    const entry: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      content_id,
      action,
      previous_status: prev,
      new_status: next,
      user,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.push(entry);
  }

  canTransition(current: ContentStatus, target: ContentStatus, role: UserRole): boolean {
    if (role === UserRole.ADMIN) return true;

    const transitions: Record<ContentStatus, ContentStatus[]> = {
      [ContentStatus.ALL]: [], // ALL is a filter status, not a content state
      [ContentStatus.DRAFT]: [ContentStatus.PENDING_REVIEW],
      [ContentStatus.PENDING_REVIEW]: [ContentStatus.APPROVED, ContentStatus.REJECTED],
      [ContentStatus.APPROVED]: [
        ContentStatus.SCHEDULED,
        ContentStatus.PUBLISHED,
        ContentStatus.PENDING_REVIEW,
      ],
      [ContentStatus.SCHEDULED]: [ContentStatus.PUBLISHED, ContentStatus.DRAFT],
      [ContentStatus.REJECTED]: [ContentStatus.DRAFT],
      [ContentStatus.PUBLISHED]: [ContentStatus.ARCHIVED],
      [ContentStatus.ARCHIVED]: [ContentStatus.DRAFT],
      [ContentStatus.PRIVATE]: [ContentStatus.DRAFT, ContentStatus.PENDING_REVIEW],
    };

    const allowedRoles: Record<ContentStatus, UserRole[]> = {
      [ContentStatus.ALL]: [], // ALL is a filter status, not a content state
      [ContentStatus.DRAFT]: [UserRole.REVIEWER],
      [ContentStatus.PENDING_REVIEW]: [UserRole.REVIEWER],
      [ContentStatus.APPROVED]: [UserRole.REVIEWER],
      [ContentStatus.SCHEDULED]: [UserRole.REVIEWER],
      [ContentStatus.REJECTED]: [UserRole.REVIEWER],
      [ContentStatus.PUBLISHED]: [UserRole.REVIEWER],
      [ContentStatus.ARCHIVED]: [UserRole.REVIEWER],
      [ContentStatus.PRIVATE]: [UserRole.REVIEWER],
    };

    // Check if transition exists
    if (!transitions[current]?.includes(target)) return false;

    // Check if role is allowed to trigger the target status
    if (!allowedRoles[target]?.includes(role)) return false;

    return true;
  }
}
