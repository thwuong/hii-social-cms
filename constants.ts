
import { ContentStatus, MediaType, SourceType, SourcePlatform, ContentItem, UserRole } from './types';

export const STATUS_COLORS: Record<ContentStatus, string> = {
  [ContentStatus.DRAFT]: 'bg-slate-100 text-slate-700 hover:bg-slate-100/80',
  [ContentStatus.PENDING_REVIEW]: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80',
  [ContentStatus.APPROVED]: 'bg-blue-100 text-blue-700 hover:bg-blue-100/80',
  [ContentStatus.SCHEDULED]: 'bg-purple-100 text-purple-700 hover:bg-purple-100/80',
  [ContentStatus.REJECTED]: 'bg-red-100 text-red-700 hover:bg-red-100/80',
  [ContentStatus.PUBLISHED]: 'bg-green-100 text-green-700 hover:bg-green-100/80',
  [ContentStatus.ARCHIVED]: 'bg-stone-100 text-stone-700 hover:bg-stone-100/80',
};

export const STATUS_LABELS: Record<ContentStatus, string> = {
  [ContentStatus.DRAFT]: 'Nháp',
  [ContentStatus.PENDING_REVIEW]: 'Chờ Duyệt',
  [ContentStatus.APPROVED]: 'Đã Duyệt',
  [ContentStatus.SCHEDULED]: 'Đã Lên Lịch',
  [ContentStatus.REJECTED]: 'Bị Từ Chối',
  [ContentStatus.PUBLISHED]: 'Đã Đăng',
  [ContentStatus.ARCHIVED]: 'Lưu Trữ',
};

export const MOCK_CATEGORIES = [
  'Thể thao', 'Ẩm thực', 'Tin tức & Chính trị', 'Tài chính', 'Đời sống', 'Giải trí', 'Công nghệ', 'Thời trang', 'Du lịch', 'Giáo dục'
];

export const MOCK_TAGS = [
  'Lan truyền', 'Xu hướng', 'Nóng', 'Gây tranh cãi', 'Giáo dục', 'Hài hước', 'Truyền cảm hứng', 'Review', 'Vlog'
];

const createPendingMock = (id: string, title: string, platform: SourcePlatform, category: string, author: string): ContentItem => ({
  content_id: id,
  title,
  short_description: `Nội dung có tương tác cao này từ ${author} trên ${platform} cần được xem xét chính sách và xác minh danh mục ngay lập tức cho bảng tin Hii Social.`,
  media_type: MediaType.VIDEO,
  media_url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
  source_type: SourceType.CRAWL,
  source_platform: platform,
  target_platforms: [platform, SourcePlatform.OTHER], // Mocking multiple distribution channels
  original_source_url: '',
  created_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
  created_by: author,
  status: ContentStatus.PENDING_REVIEW,
  category,
  tags: [category, 'Lan truyền'], // Use tags to store categories as per new requirement
  visibility: 'public',
  moderation_notes: ''
});

const createPublishedMock = (id: string, title: string, platform: SourcePlatform, category: string, daysAgo: number): ContentItem => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  // Add some random hours/minutes variance for more natural chart data
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  const dateStr = date.toISOString();

  // Determine target platforms - occasionally add a second platform to show distribution overlap
  const target_platforms = [platform];
  if (Math.random() > 0.7) {
    const others = Object.values(SourcePlatform).filter(p => p !== platform);
    target_platforms.push(others[Math.floor(Math.random() * others.length)]);
  }

  return {
    content_id: id,
    title,
    short_description: `Nội dung xu hướng thuộc danh mục ${category} đã được xuất bản tự động trên ${platform}.`,
    media_type: MediaType.VIDEO,
    media_url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    source_type: SourceType.CRAWL,
    source_platform: platform,
    target_platforms: target_platforms,
    original_source_url: '',
    created_at: dateStr, 
    published_at: dateStr,
    created_by: 'AutoPublisher',
    status: ContentStatus.PUBLISHED,
    category,
    tags: [category, 'Published', 'Trending'],
    visibility: 'public',
    moderation_notes: ''
  };
};

const publishedMocks = [
   createPublishedMock('PUB-001', 'Trend nhảy múa 2024', SourcePlatform.LALALA, 'Giải trí', 0),
   createPublishedMock('PUB-002', 'Review Cơm Tấm Sài Gòn', SourcePlatform.YAAH_CONNECT, 'Ẩm thực', 0),
   createPublishedMock('PUB-003', 'Mẹo vặt: Tẩy trắng áo', SourcePlatform.VOTEME, 'Đời sống', 0),
   createPublishedMock('PUB-004', 'Bản tin sáng 6h', SourcePlatform.OTHER, 'Tin tức & Chính trị', 1),
   createPublishedMock('PUB-005', 'Highlight: MU vs MC', SourcePlatform.LALALA, 'Thể thao', 1),
   createPublishedMock('PUB-006', 'Hướng dẫn kẻ mắt nước', SourcePlatform.YAAH_CONNECT, 'Thời trang', 1),
   createPublishedMock('PUB-007', 'Vlog: Một ngày ở Đà Lạt', SourcePlatform.VOTEME, 'Du lịch', 2),
   createPublishedMock('PUB-008', 'Thử thách không cười', SourcePlatform.LALALA, 'Giải trí', 2),
   createPublishedMock('PUB-009', 'Review iPhone 16 Concept', SourcePlatform.OTHER, 'Công nghệ', 2),
   createPublishedMock('PUB-010', 'Cover: Em của ngày hôm qua', SourcePlatform.YAAH_CONNECT, 'Giải trí', 3),
   createPublishedMock('PUB-011', 'Phim ngắn: Chuyện công sở', SourcePlatform.VOTEME, 'Đời sống', 3),
   createPublishedMock('PUB-012', 'ASMR: Ăn gà rán', SourcePlatform.LALALA, 'Ẩm thực', 3),
   createPublishedMock('PUB-013', 'Học từ vựng tiếng Anh', SourcePlatform.OTHER, 'Giáo dục', 4),
   createPublishedMock('PUB-014', 'Tin đồn Showbiz mới nhất', SourcePlatform.YAAH_CONNECT, 'Giải trí', 4),
   createPublishedMock('PUB-015', 'Cách chăm sóc Corgi', SourcePlatform.VOTEME, 'Đời sống', 5),
   createPublishedMock('PUB-016', 'DIY: Làm đèn ngủ', SourcePlatform.LALALA, 'Đời sống', 5),
   createPublishedMock('PUB-017', 'Podcast: Chữa lành', SourcePlatform.OTHER, 'Đời sống', 6),
   createPublishedMock('PUB-018', 'Nhảy hiện đại: Kpop Random', SourcePlatform.YAAH_CONNECT, 'Giải trí', 6),
   createPublishedMock('PUB-019', 'Review sách: Nhà Giả Kim', SourcePlatform.VOTEME, 'Giáo dục', 7),
   createPublishedMock('PUB-020', 'Công thức nấu Phở Bò', SourcePlatform.LALALA, 'Ẩm thực', 7),
   createPublishedMock('PUB-021', 'Báo cáo tài chính Q1', SourcePlatform.OTHER, 'Tài chính', 1),
   createPublishedMock('PUB-022', 'Outfit đi biển hè này', SourcePlatform.YAAH_CONNECT, 'Thời trang', 2),
   createPublishedMock('PUB-023', 'Top 5 địa điểm checkin', SourcePlatform.VOTEME, 'Du lịch', 0),
   createPublishedMock('PUB-024', 'Làm gốm Bát Tràng', SourcePlatform.LALALA, 'Đời sống', 4),
   createPublishedMock('PUB-025', 'Review Laptop Gaming', SourcePlatform.OTHER, 'Công nghệ', 5),
];

export const INITIAL_CONTENT: ContentItem[] = [
  ...publishedMocks,
  createPendingMock('P-101', 'Uốn Tóc Nam - Kiểu mới 2025', SourcePlatform.LALALA, 'Đời sống', 'tocnamdepbmt'),
  createPendingMock('P-102', 'Yoga buổi sáng tại Bali', SourcePlatform.VOTEME, 'Thể thao', 'wellness_jane'),
  createPendingMock('P-103', 'Ẩm thực đường phố: Tacos cay', SourcePlatform.YAAH_CONNECT, 'Ẩm thực', 'chef_diego'),
  createPendingMock('P-104', 'Phân tích sụp đổ thị trường Crypto', SourcePlatform.OTHER, 'Tài chính', 'investor_pro'),
  createPendingMock('P-105', 'Setup bàn làm việc tối giản', SourcePlatform.LALALA, 'Đời sống', 'tech_minimal'),
  createPendingMock('P-106', 'Mèo hài hước 2024', SourcePlatform.VOTEME, 'Giải trí', 'lol_central'),
  createPendingMock('P-107', 'Tin địa phương: Mở cửa lại công viên', SourcePlatform.YAAH_CONNECT, 'Tin tức & Chính trị', 'city_reporter'),
  createPendingMock('P-108', 'Trận đấu game kịch tính', SourcePlatform.OTHER, 'Giải trí', 'ninja_skills'),
  createPendingMock('P-109', 'Điểm nhấn Tuần lễ Thời trang', SourcePlatform.LALALA, 'Thời trang', 'vogue_vibes'),
  createPendingMock('P-110', 'Bài tập thể dục tốt nhất', SourcePlatform.VOTEME, 'Thể thao', 'fit_expert'),
  {
    content_id: 'C-001',
    title: 'Tiêu điểm Pickleball',
    short_description: 'Những khoảnh khắc đẹp nhất từ trận chung kết quốc gia.',
    media_type: MediaType.VIDEO,
    media_url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    source_type: SourceType.CRAWL,
    source_platform: SourcePlatform.YAAH_CONNECT,
    target_platforms: [SourcePlatform.YAAH_CONNECT, SourcePlatform.VOTEME],
    original_source_url: '',
    created_at: '2024-05-20T10:00:00Z',
    created_by: 'CrawlerBot',
    status: ContentStatus.DRAFT,
    category: 'Thể thao',
    tags: ['Thể thao', 'Xu hướng'],
    visibility: 'public',
    moderation_notes: ''
  },
  {
    content_id: 'C-003',
    title: 'Phân tích thị trường 2024',
    short_description: 'Những xu hướng mới nhất về cổ phiếu công nghệ.',
    media_type: MediaType.TEXT,
    media_url: '',
    source_type: SourceType.MANUAL,
    source_platform: SourcePlatform.VOTEME,
    target_platforms: [SourcePlatform.VOTEME],
    original_source_url: '',
    created_at: '2024-05-22T09:00:00Z',
    created_by: 'Editor John',
    status: ContentStatus.APPROVED,
    category: 'Tài chính',
    tags: ['Tài chính', 'Tin tức & Chính trị'],
    visibility: 'public',
    moderation_notes: ''
  }
];
