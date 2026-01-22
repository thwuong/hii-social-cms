
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import ContentTable from './components/ContentTable';
import ContentGrid from './components/ContentGrid';
import Dashboard from './components/Dashboard';
import { 
  UserRole, 
  ContentItem, 
  ContentStatus, 
  MediaType, 
  SourceType, 
  SourcePlatform,
} from './types';
import { CMSService } from './services/cmsService';
import { INITIAL_CONTENT, MOCK_CATEGORIES, MOCK_TAGS, STATUS_COLORS, STATUS_LABELS } from './constants';
import { 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Send, 
  ArrowLeft,
  Search,
  Globe,
  UserCircle,
  History,
  X,
  LayoutGrid,
  Rows,
  Zap,
  Check,
  FileText,
  Lock,
  Edit3,
  ThumbsUp,
  Layers,
  Calendar,
  Monitor,
  Box,
  Play,
  Eye,
  Bold,
  Italic,
  AlertTriangle,
  MoreVertical,
  Filter,
  Hash,
  ListVideo
} from 'lucide-react';
import { 
  Button, 
  Input, 
  Select, 
  Badge, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Textarea
} from './components/ui/primitives';

// --- Components ---

const RejectConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do từ chối.');
      return;
    }
    onConfirm(reason);
    setReason('');
    setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle size={20} /> Xác Nhận Từ Chối
        </DialogTitle>
      </DialogHeader>
      <div className="py-4 space-y-4">
        <p className="text-sm font-mono text-muted-foreground">Hành động này sẽ chuyển trạng thái bài viết về "Từ Chối" và yêu cầu chỉnh sửa.</p>
        <div className="space-y-2">
           <label className="text-xs font-mono uppercase font-medium">Lý do từ chối</label>
           <Textarea 
             value={reason}
             onChange={(e) => { setReason(e.target.value); setError(''); }}
             placeholder="Nhập lý do chi tiết..."
             className="h-24 font-mono text-sm"
           />
           {error && <p className="text-destructive text-xs font-mono">{error}</p>}
        </div>
      </div>
      <DialogFooter>
         <Button variant="outline" onClick={onClose}>Hủy Bỏ</Button>
         <Button variant="destructive" onClick={handleSubmit}>Xác Nhận Từ Chối</Button>
      </DialogFooter>
    </Dialog>
  );
};

const ActivityLogModal = ({ 
  item, 
  isOpen, 
  onClose,
  service 
}: { 
  item: ContentItem; 
  isOpen: boolean; 
  onClose: () => void;
  service: CMSService;
}) => {
  const logs = service.getAuditLogs().filter(log => log.content_id === item.content_id);
  const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogHeader>
        <DialogTitle>NHẬT_KÝ_HỆ_THỐNG :: {item.content_id}</DialogTitle>
      </DialogHeader>
      <div className="max-h-[60vh] overflow-y-auto space-y-0 py-4 border-t border-b border-white/10 my-4">
         {/* Initial Event */}
         <div className="flex gap-4 py-3 border-l-2 border-primary pl-4 relative">
            <div className="flex-1">
                <div className="text-xs font-mono font-bold text-white uppercase">KHỞI_TẠO</div>
                <div className="text-[10px] font-mono text-zinc-500">{new Date(item.created_at).toLocaleString('vi-VN')}</div>
            </div>
            <div className="flex-1 text-right">
                <div className="text-xs font-mono text-zinc-400">USER: {item.created_by}</div>
            </div>
         </div>

         {sortedLogs.map((log) => (
            <div key={log.id} className={`flex gap-4 py-3 border-l-2 pl-4 relative ${
                   log.new_status === ContentStatus.REJECTED ? 'border-destructive' : 'border-white/20'
               }`}>
               <div className="flex-1">
                   <div className="text-xs font-mono font-bold text-white uppercase">{log.action}</div>
                   <div className="text-[10px] font-mono text-zinc-500">{new Date(log.timestamp).toLocaleString('vi-VN')}</div>
               </div>
               <div className="flex-1 text-right">
                   <div className="text-xs font-mono text-zinc-400">USER: {log.user}</div>
               </div>
            </div>
         ))}
      </div>
      <DialogFooter>
         <Button onClick={onClose} className="w-full">ĐÓNG CỬA SỔ</Button>
      </DialogFooter>
    </Dialog>
  );
};

const CreateContentForm = ({ categories, onCancel, onSubmit }: { categories: string[], onCancel: () => void, onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState<any>({
    title: '',
    short_description: '',
    media_type: MediaType.VIDEO,
    media_url: '',
    source_type: SourceType.MANUAL,
    source_platform: SourcePlatform.OTHER,
    target_platforms: [SourcePlatform.OTHER],
    original_source_url: '',
    category: categories[0] || 'Thể thao',
    tags: [],
    visibility: 'public',
    moderation_notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const mediaTypeLabels: Record<string, string> = {
    [MediaType.VIDEO]: 'Video',
    [MediaType.TEXT]: 'Bài viết',
    [MediaType.IMAGE]: 'Hình ảnh',
    [MediaType.LINK]: 'Liên kết'
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>GIAO_THỨC_TÀI_NGUYÊN_MỚI</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-xs font-mono uppercase text-zinc-500">Tiêu đề</label>
                <Input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Nhập tiêu đề..."
                />
              </div>
              
              <div className="grid gap-2">
                <label className="text-xs font-mono uppercase text-zinc-500">Mô tả</label>
                <Textarea 
                  required
                  className="h-32"
                  value={formData.short_description}
                  onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                  placeholder="Tóm tắt nội dung..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <label className="text-xs font-mono uppercase text-zinc-500">Định dạng</label>
                    <Select value={formData.media_type} onChange={(e) => setFormData({...formData, media_type: e.target.value})}>
                      {Object.values(MediaType).map(v => <option key={v} value={v}>{mediaTypeLabels[v] || v}</option>)}
                    </Select>
                 </div>
                 <div className="grid gap-2">
                    <label className="text-xs font-mono uppercase text-zinc-500">Danh mục</label>
                    <Select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </Select>
                 </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-white/10 mt-6">
              <Button type="button" variant="ghost" onClick={onCancel}>HỦY</Button>
              <Button type="submit">KHỞI TẠO</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState({ name: 'Admin Moderator', role: UserRole.ADMIN });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [pendingRejectId, setPendingRejectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  
  const [service] = useState(() => new CMSService(INITIAL_CONTENT, MOCK_CATEGORIES, MOCK_TAGS));
  const [contentList, setContentList] = useState<ContentItem[]>(service.getContent());
  const [categories, setCategories] = useState<string[]>(service.getCategories());
  const [tags, setTags] = useState<string[]>(service.getTags());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]); 
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');

  const refreshData = () => {
    setContentList(service.getContent());
    setCategories(service.getCategories());
    setTags(service.getTags());
  };

  const handleUpdateStatus = (id: string, nextStatus: ContentStatus) => {
    if (nextStatus === ContentStatus.REJECTED) {
      setPendingRejectId(id);
      setIsRejectModalOpen(true);
    } else {
      service.updateContent(id, { status: nextStatus }, currentUser.name);
      refreshData();
    }
  };

  const handleConfirmReject = (reason: string) => {
    if (pendingRejectId) {
      service.updateContent(pendingRejectId, { 
        status: ContentStatus.REJECTED,
        moderation_notes: reason 
      }, currentUser.name);
      refreshData();
    }
    setIsRejectModalOpen(false);
    setPendingRejectId(null);
  };

  const handleCreate = (data: Partial<ContentItem>) => {
    service.createContent(data as any, currentUser.name);
    refreshData();
    setActiveTab('content');
  };
  
  const handleNavigateToDetail = (id: string) => {
    setSelectedContentId(id);
    setActiveTab('detail');
  };

  // --- Batch Selection Handlers ---
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = (visibleItems: ContentItem[]) => {
    const visibleIds = visibleItems.map(i => i.content_id);
    if (visibleIds.every(id => selectedIds.includes(id))) {
       // Deselect all visible
       setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
       // Select all visible (preserving other selections not currently visible if any)
       const newSelection = new Set([...selectedIds, ...visibleIds]);
       setSelectedIds(Array.from(newSelection));
    }
  };

  const handleBatchApprove = () => {
    // Get all selected items that are eligible for approval (Pending Review)
    const eligibleApprovals = contentList.filter(item => 
      selectedIds.includes(item.content_id) && 
      item.status === ContentStatus.PENDING_REVIEW
    );
    
    if (eligibleApprovals.length === 0) return;

    eligibleApprovals.forEach(item => {
      service.updateContent(item.content_id, { status: ContentStatus.APPROVED }, currentUser.name);
    });
    
    refreshData();
    setSelectedIds([]);
  };

  const toggleCategory = (cat: string) => {
    setCategoryFilters(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filteredContent = useMemo(() => {
    return contentList.filter(item => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!item.title.toLowerCase().includes(q) && !item.content_id.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (sourceFilter !== 'ALL') {
         if (Object.values(SourceType).includes(sourceFilter as SourceType)) {
            if (item.source_type !== sourceFilter) return false;
         } else {
             if (item.source_platform !== sourceFilter) return false;
         }
      }
      if (platformFilter !== 'ALL') {
         if (item.source_platform !== platformFilter && !item.target_platforms?.includes(platformFilter as SourcePlatform)) {
             return false;
         }
      }
      if (categoryFilters.length > 0 && !categoryFilters.includes(item.category)) {
          return false;
      }
      return true;
    });
  }, [contentList, searchQuery, statusFilter, sourceFilter, platformFilter, categoryFilters]);

  const handleDashboardNavigation = (filters: { status?: string; source?: string }) => {
     if (filters.status) setStatusFilter(filters.status);
     if (filters.source) setSourceFilter(filters.source);
     setActiveTab('content');
  };

  const renderDetailContent = () => {
    const item = contentList.find(i => i.content_id === selectedContentId);
    
    if (!item) {
       return (
         <div className="flex flex-col items-center justify-center h-full text-zinc-500 font-mono uppercase">
           <AlertTriangle size={48} className="mb-4 opacity-50" />
           <p className="font-semibold">KHÔNG TÌM THẤY TÀI NGUYÊN</p>
           <Button variant="link" onClick={() => setActiveTab('content')}>QUAY LẠI DANH SÁCH</Button>
         </div>
       );
    }

    const isEditable = item.status === ContentStatus.DRAFT || currentUser.role === UserRole.ADMIN;

    // Filter related videos by status
    const queueItems = contentList.filter(i => i.status === item.status);

    // Workflow Stages Definition
    const workflowSteps = [
      { id: ContentStatus.DRAFT, label: 'K.TẠO' },
      { id: ContentStatus.PENDING_REVIEW, label: 'DUYỆT' },
      { id: ContentStatus.APPROVED, label: 'XONG' },
      { id: ContentStatus.SCHEDULED, label: 'CHỜ' },
      { id: ContentStatus.PUBLISHED, label: 'ĐĂNG' },
    ];

    const currentStepIndex = workflowSteps.findIndex(s => s.id === item.status);
    const isRejected = item.status === ContentStatus.REJECTED;
    const isArchived = item.status === ContentStatus.ARCHIVED;

    // Determine visual state for progress bar
    let activeIndex = currentStepIndex;
    if (isRejected) activeIndex = 1; // Stuck at review if rejected
    if (isArchived) activeIndex = 5; // Past live

    return (
      <div className="detail-layout animate-in fade-in duration-300">
        
        {/* LEFT: QUEUE SIDEBAR */}
        <aside className="queue-sidebar">
           <div className="queue-header flex items-center gap-2">
              <ListVideo size={12} />
              <span>HÀNG ĐỢI // {STATUS_LABELS[item.status]}</span>
              <span className="ml-auto opacity-50">{queueItems.length}</span>
           </div>
           <div className="queue-list custom-scrollbar">
              {queueItems.map(qItem => (
                  <div 
                    key={qItem.content_id} 
                    className={`queue-item ${qItem.content_id === item.content_id ? 'active' : ''}`}
                    onClick={() => setSelectedContentId(qItem.content_id)}
                  >
                     <img 
                        src={`https://picsum.photos/seed/${qItem.content_id}/200/300`} 
                        className="queue-thumb" 
                        alt="thumb" 
                     />
                     <div className="queue-info">
                         <div className="font-bold text-[11px] text-white line-clamp-2 leading-tight">{qItem.title}</div>
                         <div className="font-mono text-[9px] text-zinc-500">{qItem.content_id}</div>
                         <div className="font-mono text-[9px] text-zinc-600 mt-1 uppercase">{qItem.category}</div>
                     </div>
                  </div>
              ))}
           </div>
        </aside>

        {/* CENTER: VIEWPORT SECTION */}
        <section className="viewport-container group">
           {/* Kinetic Readouts REMOVED */}

           {/* Main Shutter Frame */}
           <div className="shutter-frame">
              <div className="shutter-blade shutter-top"></div>
              <div className="shutter-blade shutter-bottom"></div>

              {/* UI Overlay */}
              <div className="ui-overlay">
                 <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_10px_#00ff66] animate-pulse"></span> GHI</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                 </div>
                 <div className="scanline"></div>
                 <div className="text-right">
                    <span>{item.media_type.toUpperCase()} // HD</span><br/>
                    <span>BITRATE: 45MBPS</span>
                 </div>
              </div>

              {/* Media Content - No Grayscale */}
              {item.media_type === MediaType.VIDEO ? (
                  <img 
                    src={`https://picsum.photos/seed/${item.content_id}/450/800`} 
                    className="video-mock" 
                    alt="Preview" 
                  />
               ) : (
                  <div className="video-mock bg-zinc-900 flex items-center justify-center">
                      <FileText size={64} className="text-zinc-600" />
                  </div>
               )}
           </div>

           {/* Bottom Data REMOVED */}

           {/* Close Button */}
           <Button 
               variant="ghost" 
               className="absolute top-4 right-4 z-40 text-zinc-500 hover:text-white"
               onClick={() => setActiveTab('content')}
           >
               <X size={20} />
           </Button>
        </section>

        {/* RIGHT: INSPECTOR SECTION */}
        <aside className="inspector">
           
           {/* ENTRY ID REMOVED */}

           {/* AUTHOR REMOVED */}

           {/* DESCRIPTION (Editable) */}
           <div className="meta-group">
               <span className="label">NHẬT_KÝ_PHIÊN_DỊCH</span>
               {isEditable ? (
                  <Textarea 
                      value={item.short_description}
                      onChange={(e) => {
                          service.updateContent(item.content_id, { short_description: e.target.value }, currentUser.name);
                          refreshData();
                      }}
                      className="readout bg-transparent border border-white/10 p-2 h-32 resize-none focus:border-white transition-colors"
                  />
               ) : (
                  <p className="readout border border-transparent p-2">
                      "{item.short_description}"
                  </p>
               )}
           </div>

           {/* DISTRIBUTION NETWORKS */}
           <div className="meta-group">
               <span className="label">MẠNG_LƯỚI_PHÂN_PHỐI</span>
               <div className="tag-container">
                   {item.target_platforms?.map(platform => (
                       <div key={platform} className="tag text-zinc-300 border-zinc-700 bg-zinc-900/50 flex items-center gap-2">
                          <Globe size={10} />
                          {platform}
                       </div>
                   ))}
               </div>
           </div>

           {/* TAGS */}
           <div className="meta-group">
               <span className="label">THẺ_PHÂN_LOẠI</span>
               <div className="tag-container">
                   <div className="tag text-white border-white">{item.category}</div>
                   {item.tags.map(tag => (
                       <div key={tag} className="tag">#{tag}</div>
                   ))}
               </div>
           </div>

           {/* ENGAGEMENT REMOVED */}
           
           {/* WORKFLOW STATUS PROGRESS */}
           <div className="meta-group mt-6">
              <span className="label">TRẠNG_THÁI // QUY_TRÌNH</span>
              
              {isRejected && (
                  <div className="mb-2 p-2 border border-red-500/50 bg-red-950/20 text-red-400 font-mono text-[10px] uppercase">
                     ⚠ Nội dung bị từ chối: {item.moderation_notes || "Phát hiện vi phạm"}
                  </div>
              )}

              <div className="relative mt-4 mb-2 select-none">
                 {/* Steps */}
                 <div className="flex justify-between items-center relative z-10">
                    {workflowSteps.map((step, index) => {
                       let stateClass = "bg-[#1a1a1a] border-zinc-700 text-zinc-600"; // Future
                       if (index < activeIndex) stateClass = "bg-white border-white text-white"; // Completed
                       if (index === activeIndex) {
                          if (isRejected) stateClass = "bg-red-500 border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
                          else stateClass = "bg-[#00ff66] border-[#00ff66] text-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.5)]";
                       }
                       if (isRejected && index === 1) stateClass = "bg-red-500 border-red-500 text-red-500"; // Highlight Review as fail point

                       return (
                          <div key={step.id} className="flex flex-col items-center gap-2">
                             <div className={`w-2 h-2 border transform rotate-45 transition-colors duration-500 ${stateClass.split(' ')[0]} ${stateClass.split(' ')[1]}`}></div>
                             <span className={`text-[9px] font-mono font-bold tracking-widest transition-colors duration-500 ${index <= activeIndex ? (isRejected && index === activeIndex ? 'text-red-500' : 'text-white') : 'text-zinc-700'}`}>
                                {step.label}
                             </span>
                          </div>
                       );
                    })}
                 </div>
                 
                 {/* Track Line */}
                 <div className="absolute top-1 left-0 w-full h-[1px] bg-[#1a1a1a] -z-0"></div>
                 
                 {/* Progress Fill */}
                 <div 
                    className={`absolute top-1 left-0 h-[1px] transition-all duration-700 -z-0 ${isRejected ? 'bg-red-900' : 'bg-white'}`}
                    style={{ width: `${(activeIndex / (workflowSteps.length - 1)) * 100}%` }}
                 ></div>
              </div>
           </div>

           {/* ACTIONS */}
           <div className="actions">
               <button 
                  onClick={() => handleUpdateStatus(item.content_id, ContentStatus.REJECTED)}
                  className="btn-kinetic btn-reject"
                  disabled={isRejected}
               >
                  TỪ CHỐI
               </button>
               <button 
                  onClick={() => handleUpdateStatus(item.content_id, ContentStatus.APPROVED)}
                  className="btn-kinetic"
                  disabled={item.status === ContentStatus.APPROVED || item.status === ContentStatus.PUBLISHED}
               >
                  DUYỆT
               </button>
           </div>
        </aside>

        {/* Floating Modals */}
        <ActivityLogModal item={item} isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} service={service} />
        <RejectConfirmationModal 
          isOpen={isRejectModalOpen} 
          onClose={() => { setIsRejectModalOpen(false); setPendingRejectId(null); }} 
          onConfirm={handleConfirmReject} 
        />
      </div>
    );
  };

  const renderContentList = () => {
    const statusTabs = [
      { id: 'ALL', label: 'Tất cả', icon: Layers },
      { id: ContentStatus.DRAFT, label: 'Nháp', icon: Zap },
      { id: ContentStatus.PENDING_REVIEW, label: 'Chờ duyệt', icon: Clock },
      { id: ContentStatus.APPROVED, label: 'Đã duyệt', icon: ThumbsUp },
      { id: ContentStatus.SCHEDULED, label: 'Đã lên lịch', icon: Calendar },
      { id: ContentStatus.PUBLISHED, label: 'Đã đăng', icon: CheckCircle2 },
      { id: ContentStatus.REJECTED, label: 'Từ chối', icon: ShieldAlert },
    ];

    const platformTabs = [
      { id: 'ALL', label: 'Tất cả nền tảng' },
      { id: SourcePlatform.YAAH_CONNECT, label: 'Yaah Connect' },
      { id: SourcePlatform.LALALA, label: 'Lalala' },
      { id: SourcePlatform.VOTEME, label: 'Voteme' },
    ];

    const batchActionableCount = contentList.filter(i => selectedIds.includes(i.content_id) && i.status === ContentStatus.PENDING_REVIEW).length;

    return (
      <div className="space-y-8 relative">
        <div className="flex flex-col gap-6">
           {/* Status Filter */}
           <div className="space-y-3">
              <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-2">
                  <Filter size={10} /> Lọc Trạng Thái
              </label>
              <div className="flex flex-wrap gap-1">
                 {statusTabs.map(tab => (
                    <button 
                       key={tab.id}
                       onClick={() => setStatusFilter(tab.id)}
                       className={`flex items-center gap-2 px-4 py-2 text-[10px] font-mono uppercase border transition-all ${
                           statusFilter === tab.id 
                           ? 'bg-white text-black border-white' 
                           : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-zinc-300'
                       }`}
                    >
                       <tab.icon size={12} /> {tab.label}
                    </button>
                 ))}
              </div>
           </div>

           {/* Category Filter */}
           <div className="space-y-3">
              <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-2">
                  <Hash size={10} /> Lọc Danh Mục
              </label>
              <div className="flex flex-wrap gap-1">
                 <button 
                     onClick={() => setCategoryFilters([])}
                     className={`px-3 py-1 text-[10px] font-mono uppercase border transition-all ${
                         categoryFilters.length === 0
                         ? 'bg-white text-black border-white' 
                         : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-zinc-300'
                     }`}
                 >
                     TẤT CẢ
                 </button>
                 {categories.map(cat => (
                    <button 
                       key={cat}
                       onClick={() => toggleCategory(cat)}
                       className={`px-3 py-1 text-[10px] font-mono uppercase border transition-all ${
                           categoryFilters.includes(cat)
                           ? 'bg-white text-black border-white' 
                           : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-zinc-300'
                       }`}
                    >
                       {cat}
                    </button>
                 ))}
              </div>
           </div>
           
           <div className="flex flex-col md:flex-row gap-4 border-t border-white/10 pt-6">
              <div className="flex-1">
                 <div className="relative group">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-600 group-hover:text-white transition-colors" />
                    <Input 
                      placeholder="TÌM_KIẾM_CƠ_SỞ_DỮ_LIỆU..." 
                      className="pl-10 h-10 bg-black border-white/10 focus:border-white text-white font-mono uppercase text-xs" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-48">
                    <Select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
                        {platformTabs.map(p => <option key={p.id} value={p.id} className="bg-black text-white">{p.label}</option>)}
                    </Select>
                 </div>
                 <div className="border border-white/10 flex p-1 bg-black">
                    <button 
                        className={`h-8 w-8 flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid size={16} />
                    </button>
                    <button 
                        className={`h-8 w-8 flex items-center justify-center transition-colors ${viewMode === 'table' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                        onClick={() => setViewMode('table')}
                    >
                        <Rows size={16} />
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {viewMode === 'table' ? (
           <ContentTable 
             items={filteredContent} 
             onView={handleNavigateToDetail}
             selectedIds={selectedIds}
             onToggleSelect={handleToggleSelect}
             onToggleAll={() => handleSelectAll(filteredContent)}
           />
        ) : (
           <ContentGrid items={filteredContent} onView={handleNavigateToDetail} />
        )}

        {/* Floating Batch Action Bar */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-zinc-900 border border-white/20 p-2 pl-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in">
              <span className="font-mono text-xs text-white uppercase">{selectedIds.length} ĐÃ CHỌN</span>
              <div className="h-4 w-[1px] bg-white/20"></div>
              <Button 
                variant="default" 
                className="bg-white text-black hover:bg-zinc-200 h-8"
                onClick={handleBatchApprove}
                disabled={batchActionableCount === 0}
              >
                DUYỆT HÀNG LOẠT ({batchActionableCount})
              </Button>
               <Button 
                variant="ghost" 
                className="h-8 text-zinc-400 hover:text-white"
                onClick={() => setSelectedIds([])}
              >
                HỦY
              </Button>
          </div>
        )}
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard items={contentList} onNavigate={handleDashboardNavigation} />;
      case 'content': return renderContentList();
      case 'detail': return renderDetailContent();
      case 'audit': return (
        <div className="animate-in fade-in">
           <ContentTable 
             items={contentList} 
             onView={handleNavigateToDetail}
             selectedIds={selectedIds}
             onToggleSelect={handleToggleSelect}
             onToggleAll={() => handleSelectAll(contentList)} 
           />
        </div>
      );
      case 'create': return <CreateContentForm categories={categories} onCancel={() => setActiveTab('content')} onSubmit={handleCreate} />;
      default: return <Dashboard items={contentList} onNavigate={handleDashboardNavigation} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      currentUser={currentUser} 
      setCurrentUser={setCurrentUser}
    >
      {renderActiveTab()}
    </Layout>
  );
};

export default App;
