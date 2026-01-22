
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
  AuditLogEntry
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
  TrendingUp,
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
  Hash,
  Box,
  Play,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Info,
  Signal,
  Wifi,
  Battery,
  Music2,
  Home,
  Users,
  Eye,
  Bold,
  Italic,
  AlertTriangle
} from 'lucide-react';

// --- Sub-components to ensure Hook rules are followed ---

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative glass-card w-full max-w-lg rounded-[32px] p-8 shadow-2xl border-white/20 flex flex-col gap-6 bg-white/95">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-md">
            <AlertTriangle size={24} />
          </div>
          <div>
             <h3 className="text-xl font-black text-navy uppercase tracking-tight">Xác Nhận Từ Chối</h3>
             <p className="text-xs font-bold text-slate-500">Hành động này sẽ chuyển trạng thái về "Từ Chối"</p>
          </div>
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black text-navy/60 uppercase tracking-widest block">Lý do từ chối (Bắt buộc)</label>
           <textarea 
             value={reason}
             onChange={(e) => { setReason(e.target.value); setError(''); }}
             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium text-navy h-32 resize-none transition-all"
             placeholder="Nhập lý do chi tiết..."
             autoFocus
           />
           {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
           <button 
             onClick={onClose}
             className="px-6 py-3 rounded-xl text-xs font-black text-navy/60 hover:bg-slate-100 uppercase tracking-widest transition-all"
           >
             Hủy Bỏ
           </button>
           <button 
             onClick={handleSubmit}
             className="px-6 py-3 rounded-xl text-xs font-black text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30 uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
           >
             Xác Nhận Từ Chối
           </button>
        </div>
      </div>
    </div>
  );
};

const EditableDescription = ({ 
  value, 
  isEditable, 
  onSave,
  isAdmin 
}: { 
  value: string, 
  isEditable: boolean, 
  onSave: (val: string) => void,
  isAdmin: boolean
}) => {
  const [text, setText] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    setText(value);
  }, [value]);

  const handleFormat = (type: 'bold' | 'italic') => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = text.substring(start, end);
    
    if (!selectedText) return;

    let newText = text;
    const wrapper = type === 'bold' ? '**' : '*';
    
    // Check if already wrapped
    if (
      text.substring(start - wrapper.length, start) === wrapper &&
      text.substring(end, end + wrapper.length) === wrapper
    ) {
      // Unwrap
      newText = text.substring(0, start - wrapper.length) + selectedText + text.substring(end + wrapper.length);
    } else {
      // Wrap
      newText = text.substring(0, start) + `${wrapper}${selectedText}${wrapper}` + text.substring(end);
    }
    
    setText(newText);
    // Note: In a real app we'd need to restore cursor position/selection here
  };

  const renderFormattedText = (content: string) => {
    return (
      <div className="space-y-3 font-serif text-lg leading-relaxed text-navy/80 tracking-wide">
        {content.split('\n').map((line, i) => (
          <p key={i} className="min-h-[1em]">
            {line.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                return <strong key={j} className="font-black text-navy">{part.slice(2, -2)}</strong>;
              }
              if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                return <em key={j} className="italic text-navy-600 font-medium">{part.slice(1, -1)}</em>;
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        ))}
      </div>
    );
  };

  if (!isEditable) {
    return (
      <div className="bg-white/40 p-6 rounded-2xl border border-white/40 shadow-sm">
        {renderFormattedText(value)}
      </div>
    );
  }

  return (
    <div className="relative group flex flex-col gap-2">
       {isAdmin && (
         <div className="flex items-center gap-2 p-2 bg-white/60 rounded-xl border border-white/40 w-fit shadow-sm">
            <button 
              type="button"
              onClick={() => handleFormat('bold')}
              className="p-2 hover:bg-brand-blue/10 rounded-lg text-navy hover:text-brand-blue transition-colors"
              title="Bold (Selection)"
            >
              <Bold size={16} />
            </button>
            <button 
              type="button"
              onClick={() => handleFormat('italic')}
              className="p-2 hover:bg-brand-blue/10 rounded-lg text-navy hover:text-brand-blue transition-colors"
              title="Italic (Selection)"
            >
              <Italic size={16} />
            </button>
         </div>
       )}
       
       <textarea 
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
            if (text !== value) onSave(text);
        }}
        className="w-full bg-white/60 border-2 border-brand-blue/20 hover:border-brand-blue/50 focus:border-brand-blue rounded-2xl p-6 text-lg font-serif text-navy leading-relaxed outline-none resize-none transition-all shadow-inner min-h-[160px]"
        placeholder="Nhập mô tả bài viết..."
      />
      <div className="flex justify-between items-center px-2">
         <span className="text-[10px] text-navy/40 font-bold uppercase tracking-wider">
            {isAdmin ? 'Hỗ trợ Markdown: **Đậm**, *Nghiêng*' : 'Chế độ văn bản thường'}
         </span>
         <span className="text-[10px] text-brand-blue/60 font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 px-2 rounded-md">
           Tự động lưu khi click ra ngoài
         </span>
      </div>
    </div>
  );
};

const MediaPreviewModal = ({ item, isOpen, onClose }: { item: ContentItem; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-navy/80 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative glass-card w-full max-w-6xl aspect-video rounded-[40px] shadow-2xl overflow-hidden border-white/20 flex flex-col">
        <div className="absolute top-6 right-6 z-10">
          <button 
            onClick={onClose}
            className="p-3 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all shadow-lg backdrop-blur-md"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center bg-black/40">
          {item.media_type === MediaType.VIDEO ? (
            <video controls autoPlay className="max-h-full w-full object-contain">
              <source src={item.media_url} type="video/mp4" />
            </video>
          ) : (
            <div className="p-20 text-white font-black text-2xl uppercase tracking-widest text-center max-w-3xl">
              <p className="mb-6">{item.title}</p>
              <div className="text-sm font-medium text-off-white/70 bg-white/10 p-10 rounded-3xl border border-white/20 leading-relaxed italic">
                {item.short_description}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-navy/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between">
          <div>
            <h4 className="text-white font-black text-lg">{item.title}</h4>
            <p className="text-off-white/60 text-xs font-bold uppercase tracking-wider">{item.category} • {item.media_type}</p>
          </div>
          <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[item.status]}`}>
            {STATUS_LABELS[item.status]}
          </div>
        </div>
      </div>
    </div>
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
  if (!isOpen) return null;

  const logs = service.getAuditLogs().filter(log => log.content_id === item.content_id);
  const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const events = [
    {
      id: 'start',
      timestamp: item.created_at,
      action: item.source_type === SourceType.CRAWL ? 'Thu thập nội dung' : 'Tạo nội dung',
      user: item.created_by,
      status: ContentStatus.DRAFT,
      icon: item.source_type === SourceType.CRAWL ? <Zap size={14} /> : <FileText size={14} />,
      color: 'bg-brand-blue'
    },
    ...sortedLogs.map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      action: log.action,
      user: log.user,
      status: log.new_status,
      icon: log.new_status === ContentStatus.PUBLISHED ? <Check size={14} /> : 
            log.new_status === ContentStatus.PENDING_REVIEW ? <Clock size={14} /> : 
            log.new_status === ContentStatus.REJECTED ? <ShieldAlert size={14} /> : <ThumbsUp size={14} />,
      color: log.new_status === ContentStatus.PUBLISHED ? 'bg-green-500' :
             log.new_status === ContentStatus.REJECTED ? 'bg-red-500' :
             log.new_status === ContentStatus.PENDING_REVIEW ? 'bg-brand-orange' : 'bg-brand-blue'
    }))
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative glass-card w-full max-w-md rounded-[40px] shadow-2xl border-white/20 flex flex-col max-h-[80vh] overflow-hidden">
        <div className="p-8 border-b border-navy/10 flex items-center justify-between bg-white/20">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <History size={20} />
             </div>
             <div>
                <h3 className="text-sm font-black text-navy uppercase tracking-widest">Lịch sử Hoạt động</h3>
                <p className="text-[10px] font-bold text-brand-blue uppercase">{item.content_id}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/40 rounded-full transition-all text-navy/40 hover:text-navy">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white/5">
          <div className="relative space-y-6 pl-8">
            <div className="absolute left-[13px] top-2 bottom-2 w-px bg-navy/10 border-l border-dashed border-navy/20"></div>
            {events.map((event, idx) => (
              <div key={event.id} className="relative animate-in slide-in-from-left duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className={`absolute -left-[28px] top-1 w-6 h-6 rounded-full ${event.color} flex items-center justify-center text-white border-2 border-white shadow-md z-10`}>
                  {event.icon}
                </div>
                <div className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl border border-white/40 flex flex-col gap-1 shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest">{event.action}</span>
                    <span className="text-[8px] font-bold text-slate-400">{new Date(event.timestamp).toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-navy/10 flex items-center justify-center text-navy/60">
                       <UserCircle size={10} />
                    </div>
                    <p className="text-[10px] font-black text-navy leading-none">{event.user}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white/20 border-t border-white/20">
           <button onClick={onClose} className="w-full py-4 bg-navy text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-blue transition-all">Đóng Lịch Sử</button>
        </div>
      </div>
    </div>
  );
};

const WorkflowStepper = ({ 
  item, 
  activeStep, 
  setActiveStep, 
  onUpdateStatus, 
  canDo 
}: { 
  item: ContentItem; 
  activeStep: number; 
  setActiveStep: (idx: number) => void; 
  onUpdateStatus: (id: string, status: ContentStatus) => void;
  canDo: (target: ContentStatus) => boolean;
}) => {
  const steps = [
    { 
      id: 0, 
      label: 'Khởi Tạo', 
      statuses: [ContentStatus.DRAFT, ContentStatus.REJECTED], 
      icon: <Edit3 size={18} />,
      description: 'Giai đoạn soạn thảo ban đầu. Đảm bảo dữ liệu và phân loại chính xác.',
      primaryAction: { label: 'Gửi Duyệt', target: ContentStatus.PENDING_REVIEW, icon: <Send size={14} /> }
    },
    { 
      id: 1, 
      label: 'Kiểm Duyệt', 
      statuses: [ContentStatus.PENDING_REVIEW], 
      icon: <ShieldAlert size={18} />,
      description: 'Đánh giá tuân thủ và an toàn cộng đồng. Xác minh nội dung phù hợp.',
      secondaryAction: { label: 'Từ Chối', target: ContentStatus.REJECTED, icon: <X size={14} />, color: 'bg-red-500' },
      primaryAction: { label: 'Chấp Thuận', target: ContentStatus.APPROVED, icon: <Check size={14} />, color: 'bg-green-600' }
    },
    { 
      id: 2, 
      label: 'Lên Lịch', 
      statuses: [ContentStatus.APPROVED, ContentStatus.SCHEDULED], 
      icon: <Calendar size={18} />,
      description: 'Sẵn sàng phân phối. Chỉ định khung giờ hoặc kích hoạt phát hành ngay.',
      primaryAction: { label: 'Đăng Ngay', target: ContentStatus.PUBLISHED, icon: <Globe size={14} />, color: 'bg-brand-blue' }
    },
    { 
      id: 3, 
      label: 'Hoạt Động', 
      statuses: [ContentStatus.PUBLISHED], 
      icon: <CheckCircle2 size={18} />,
      description: 'Nội dung đã công khai trên Hii Social. Theo dõi tương tác hoặc lưu trữ.',
      primaryAction: { label: 'Lưu Trữ', target: ContentStatus.ARCHIVED, icon: <Box size={14} />, color: 'bg-navy' }
    }
  ];

  const currentStatusIdx = steps.findIndex(s => s.statuses.includes(item.status));
  const isSelectedActive = activeStep === currentStatusIdx;
  const isSelectedPrevious = activeStep < currentStatusIdx;
  const isSelectedFuture = activeStep > currentStatusIdx;

  return (
    <div className="space-y-6">
      {/* Horizontal Progress Bar */}
      <div className="relative flex items-center justify-between px-2">
        <div className="absolute left-6 right-6 h-1 bg-navy/10 top-4 -z-10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-blue transition-all duration-500 ease-out"
            style={{ width: `${(currentStatusIdx / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStatusIdx;
          const isCurrent = idx === currentStatusIdx;
          const isFocused = idx === activeStep;
          
          return (
            <div 
              key={step.id} 
              onClick={() => setActiveStep(idx)}
              className={`flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 ${isFocused ? 'scale-110' : 'opacity-80 hover:opacity-100'}`}
            >
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border-2 transition-all shadow-lg ${
                isFocused ? 'bg-brand-blue border-white text-white scale-110 ring-4 ring-brand-blue/20' : 
                isCompleted ? 'bg-green-500 border-green-200 text-white' : 
                isCurrent ? 'bg-white border-brand-blue text-brand-blue' : 
                'bg-white border-navy/10 text-navy/20'
              }`}>
                {isCompleted ? <Check size={18} /> : React.cloneElement(step.icon as React.ReactElement<any>, { size: 18 })}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${isFocused ? 'text-brand-blue' : 'text-navy/40'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Action Card */}
      <div className={`p-6 rounded-[32px] border transition-all duration-500 ${
        isSelectedActive ? 'bg-white border-brand-blue/20 shadow-xl' : 
        isSelectedPrevious ? 'bg-green-50/40 border-green-100' : 
        'bg-navy/5 border-transparent opacity-60'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
               <h4 className="text-navy font-black text-xs uppercase tracking-widest flex items-center gap-2">
                 {isSelectedPrevious && <CheckCircle2 size={14} className="text-green-500" />}
                 {isSelectedFuture && <Lock size={14} className="text-navy/20" />}
                 Giai đoạn {steps[activeStep].label}
               </h4>
               {isSelectedActive && <span className="px-2 py-0.5 bg-brand-blue text-white text-[8px] font-black rounded-lg animate-pulse uppercase">Nhiệm vụ hiện tại</span>}
            </div>
            <p className="text-[10px] text-navy/60 leading-relaxed font-medium">
              {steps[activeStep].description}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center text-navy/40">
               <Info size={14} />
            </div>
          </div>
        </div>

        {/* Buttons Group */}
        <div className="flex items-center justify-between pt-4 border-t border-navy/5">
          <div className="flex-1">
            {isSelectedPrevious && (
              <div className="flex items-center gap-2 text-green-600">
                <div className="px-3 py-1 bg-green-100 rounded-xl text-[9px] font-black uppercase tracking-widest">Đã Xác Thực</div>
                <span className="text-[10px] font-bold opacity-60">Giai đoạn hoàn tất</span>
              </div>
            )}
            {isSelectedFuture && (
              <div className="flex items-center gap-2 text-navy/30">
                <Lock size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">Giai đoạn bị khóa</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {isSelectedActive && (
              <>
                {steps[activeStep].secondaryAction && (
                  <button 
                    onClick={() => onUpdateStatus(item.content_id, steps[activeStep].secondaryAction!.target)}
                    className={`px-6 py-2.5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all hover:scale-105 shadow-lg flex items-center gap-2 ${steps[activeStep].secondaryAction!.color || 'bg-navy/40'}`}
                  >
                    {steps[activeStep].secondaryAction!.icon}
                    {steps[activeStep].secondaryAction!.label}
                  </button>
                )}
                {steps[activeStep].primaryAction && (
                  <button 
                    onClick={() => onUpdateStatus(item.content_id, steps[activeStep].primaryAction!.target)}
                    className={`px-8 py-2.5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all hover:scale-105 shadow-xl flex items-center gap-2 ${steps[activeStep].primaryAction!.color || 'bg-brand-blue'}`}
                  >
                    {steps[activeStep].primaryAction!.icon}
                    {steps[activeStep].primaryAction!.label}
                  </button>
                )}
              </>
            )}
            {!isSelectedActive && (
              <span className="text-[10px] font-black text-navy/30 uppercase tracking-widest italic flex items-center gap-2">
                <Eye size={12} /> Chỉ Xem
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
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

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto glass-card p-12 rounded-[48px] shadow-2xl border-white/40 space-y-10 animate-in fade-in duration-500">
      <div>
          <h2 className="text-3xl font-black text-navy mb-2">Thêm Nội Dung Mới</h2>
          <p className="text-brand-blue font-bold">Điền thông tin siêu dữ liệu để thêm nội dung thủ công.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <label className="text-[10px] font-black text-brand-blue uppercase tracking-widest block mb-2">Tiêu Đề Hiển Thị Nội Bộ</label>
          <input 
            required
            className="w-full p-4 bg-white/40 border border-white/40 rounded-2xl outline-none focus:ring-4 focus:ring-brand-blue/10 text-navy font-bold shadow-sm" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-[10px] font-black text-brand-blue uppercase tracking-widest block mb-2">Mô Tả / Trích Đoạn Nội Dung</label>
          <textarea 
            required
            className="w-full p-4 bg-white/40 border border-white/40 rounded-2xl outline-none h-32 text-navy font-medium shadow-sm" 
            value={formData.short_description}
            onChange={(e) => setFormData({...formData, short_description: e.target.value})}
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-brand-blue uppercase tracking-widest block mb-2">Định Dạng Media</label>
          <select className="w-full p-4 bg-white/40 border border-white/40 rounded-2xl font-bold text-navy shadow-sm outline-none" value={formData.media_type} onChange={(e) => setFormData({...formData, media_type: e.target.value})}>
            {Object.values(MediaType).map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-brand-blue uppercase tracking-widest block mb-2">Danh Mục Phân Loại</label>
          <select className="w-full p-4 bg-white/40 border border-white/40 rounded-2xl font-bold text-navy shadow-sm outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-5 pt-8 border-t border-white/20">
        <button type="button" onClick={onCancel} className="px-8 py-3 text-navy font-black uppercase tracking-wider hover:bg-white/20 rounded-2xl transition-all">Hủy Bỏ</button>
        {/* Updated text color to navy (black) for contrast on yellow */}
        <button type="submit" className="px-10 py-4 bg-brand-orange text-navy font-black rounded-[24px] hover:scale-105 transition-all shadow-xl shadow-brand-orange/30 uppercase tracking-widest">Lưu Nháp</button>
      </div>
    </form>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState({ name: 'Admin Moderator', role: UserRole.ADMIN });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [pendingRejectId, setPendingRejectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);
  
  const [service] = useState(() => new CMSService(INITIAL_CONTENT, MOCK_CATEGORIES, MOCK_TAGS));
  const [contentList, setContentList] = useState<ContentItem[]>(service.getContent());
  const [categories, setCategories] = useState<string[]>(service.getCategories());
  const [tags, setTags] = useState<string[]>(service.getTags());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  // New state for Source Filter (e.g. Crawled vs Manual)
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]); 
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>(MediaType.VIDEO);

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
      
      if (selectedContentId === id) {
        const updatedItem = service.getContentById(id);
        if (updatedItem) {
          syncWorkflowStep(updatedItem);
        }
      }
    }
  };

  const handleConfirmReject = (reason: string) => {
    if (pendingRejectId) {
      service.updateContent(pendingRejectId, { 
        status: ContentStatus.REJECTED,
        moderation_notes: reason 
      }, currentUser.name);
      refreshData();

      if (selectedContentId === pendingRejectId) {
        const updatedItem = service.getContentById(pendingRejectId);
        if (updatedItem) {
          syncWorkflowStep(updatedItem);
        }
      }
    }
    setIsRejectModalOpen(false);
    setPendingRejectId(null);
  };

  const syncWorkflowStep = (item: ContentItem) => {
    const stepsMapping = [
      [ContentStatus.DRAFT, ContentStatus.REJECTED],
      [ContentStatus.PENDING_REVIEW],
      [ContentStatus.APPROVED, ContentStatus.SCHEDULED],
      [ContentStatus.PUBLISHED]
    ];
    const idx = stepsMapping.findIndex(s => s.includes(item.status));
    setActiveWorkflowStep(idx === -1 ? 0 : idx);
  };

  const handleCreate = (data: Partial<ContentItem>) => {
    service.createContent(data as any, currentUser.name);
    refreshData();
    setActiveTab('content');
  };

  // Missing definitions implemented below
  
  const handleNavigateToDetail = (id: string) => {
    setSelectedContentId(id);
    setActiveTab('detail');
  };

  const toggleCategory = (cat: string) => {
    setCategoryFilters(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filteredContent = useMemo(() => {
    return contentList.filter(item => {
      // 1. Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!item.title.toLowerCase().includes(q) && !item.content_id.toLowerCase().includes(q)) {
          return false;
        }
      }
      
      // 2. Status
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }
      
      // 3. Source
      if (sourceFilter !== 'ALL') {
         if (Object.values(SourceType).includes(sourceFilter as SourceType)) {
            if (item.source_type !== sourceFilter) return false;
         } else {
             if (item.source_platform !== sourceFilter) return false;
         }
      }
      
      // 4. Platform
      if (platformFilter !== 'ALL') {
         if (item.source_platform !== platformFilter && !item.target_platforms?.includes(platformFilter as SourcePlatform)) {
             return false;
         }
      }
      
      // 5. Categories
      if (categoryFilters.length > 0) {
         const itemCats = [item.category, ...(item.tags || [])];
         if (!categoryFilters.some(c => itemCats.includes(c))) return false;
      }
      
      // 6. Type
      if (typeFilter) {
         if (item.media_type !== typeFilter) return false;
      }
      
      return true;
    });
  }, [contentList, searchQuery, statusFilter, sourceFilter, platformFilter, categoryFilters, typeFilter]);

  const handleDashboardNavigation = (filters: { status?: string; source?: string }) => {
     if (filters.status) setStatusFilter(filters.status);
     if (filters.source) setSourceFilter(filters.source);
     setActiveTab('content');
  };

  // Renamed from handleViewDetail to renderDetailContent to avoid naming conflict with the handler
  const renderDetailContent = () => {
    const item = contentList.find(i => i.content_id === selectedContentId);
    
    if (!item) {
       return (
         <div className="flex flex-col items-center justify-center h-96 text-navy/40">
           <AlertTriangle size={48} className="mb-4" />
           <p className="font-black uppercase tracking-widest">Không tìm thấy nội dung</p>
           <button onClick={() => setActiveTab('content')} className="mt-4 text-brand-blue font-bold hover:underline">Quay lại danh sách</button>
         </div>
       );
    }

    const canDo = (target: ContentStatus) => service.canTransition(item.status, target, currentUser.role);
    const isEditable = item.status === ContentStatus.DRAFT || currentUser.role === UserRole.ADMIN;

    return (
      <div className="animate-in slide-in-from-right duration-500 pb-20">
        <button 
          onClick={() => setActiveTab('content')}
          className="mb-6 flex items-center gap-2 text-navy/60 hover:text-navy font-black text-xs uppercase tracking-widest transition-colors group"
        >
          <div className="p-2 bg-white/40 rounded-full group-hover:bg-brand-blue group-hover:text-white transition-all">
            <ArrowLeft size={16} />
          </div>
          Quay lại danh sách
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Media & Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Main Card */}
            <div className="glass-card p-8 rounded-[40px] shadow-2xl border-white/40 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                 <h1 className="text-9xl font-black text-navy">{item.content_id.split('-')[1] || '00'}</h1>
               </div>

               <div className="relative z-10">
                 <div className="flex gap-3 mb-6">
                   <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${STATUS_COLORS[item.status]}`}>
                     {STATUS_LABELS[item.status]}
                   </span>
                   <span className="px-4 py-1.5 bg-white/40 rounded-xl text-[10px] font-black text-navy uppercase tracking-widest border border-white/50 flex items-center gap-2">
                      <Globe size={12} /> {item.source_platform}
                   </span>
                   <span className="px-4 py-1.5 bg-brand-blue/10 rounded-xl text-[10px] font-black text-brand-blue uppercase tracking-widest border border-brand-blue/20">
                      {item.category}
                   </span>
                 </div>

                 <h1 className="text-3xl md:text-4xl font-black text-navy mb-6 leading-tight tracking-tight">{item.title}</h1>

                 <div className="flex items-center gap-6 mb-8 text-xs font-bold text-navy/60">
                    <div className="flex items-center gap-2">
                       <UserCircle size={16} className="text-brand-blue" />
                       <span>Tác giả: {item.created_by}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Clock size={16} className="text-brand-blue" />
                       <span>Tạo lúc: {new Date(item.created_at).toLocaleString('vi-VN')}</span>
                    </div>
                 </div>

                 {/* Media Placeholder / Action */}
                 <div className="aspect-video bg-navy/5 rounded-3xl border-2 border-dashed border-navy/10 flex flex-col items-center justify-center gap-4 group hover:border-brand-blue/30 transition-all cursor-pointer" onClick={() => setIsPreviewOpen(true)}>
                    <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                       {item.media_type === MediaType.VIDEO ? <Play size={32} className="ml-1" /> : <Eye size={32} />}
                    </div>
                    <p className="text-xs font-black text-navy/40 uppercase tracking-widest group-hover:text-brand-blue">Nhấn để xem nội dung gốc</p>
                 </div>
               </div>
            </div>

            {/* Description Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                   <FileText size={18} /> Nội Dung / Mô Tả
                 </h3>
              </div>
              <EditableDescription 
                value={item.short_description} 
                isEditable={isEditable}
                onSave={(val) => {
                   service.updateContent(item.content_id, { short_description: val }, currentUser.name);
                   refreshData();
                }}
                isAdmin={currentUser.role === UserRole.ADMIN}
              />
            </div>

          </div>

          {/* Right Column: Workflow & Actions */}
          <div className="space-y-8">
             
             {/* Workflow Stepper */}
             <div className="glass-card p-6 rounded-[32px] shadow-xl border-white/40">
                <div className="mb-6 flex items-center justify-between">
                   <h3 className="text-xs font-black text-navy uppercase tracking-widest">Quy Trình Duyệt</h3>
                   <button 
                     onClick={() => setIsLogModalOpen(true)}
                     className="p-2 hover:bg-white/40 rounded-full text-navy/40 hover:text-navy transition-all"
                     title="Xem lịch sử"
                   >
                     <History size={18} />
                   </button>
                </div>
                <WorkflowStepper 
                  item={item} 
                  activeStep={activeWorkflowStep} 
                  setActiveStep={setActiveWorkflowStep}
                  onUpdateStatus={handleUpdateStatus}
                  canDo={canDo}
                />
             </div>

             {/* Nền tảng & Danh mục Panel (Replacing Metadata & Tags) */}
             <div className="glass-card p-6 rounded-[32px] shadow-xl border-white/40 space-y-6">
                <h3 className="text-xs font-black text-navy uppercase tracking-widest mb-4">Nền tảng & Danh mục</h3>
                
                {/* Platforms */}
                <div>
                   <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest block mb-3">Nền Tảng Phân Phối</label>
                   <div className="space-y-3">
                      {Object.values(SourcePlatform).filter(p => p !== SourcePlatform.OTHER).map(platform => {
                         const currentPlatforms = item.target_platforms || [];
                         const isSelected = currentPlatforms.includes(platform);
                         
                         return (
                            <div
                               key={platform}
                               onClick={() => {
                                  if (!isEditable) return;
                                  
                                  const updated = isSelected
                                     ? currentPlatforms.filter(p => p !== platform)
                                     : [...currentPlatforms, platform];
                                     
                                  service.updateContent(item.content_id, { target_platforms: updated }, currentUser.name);
                                  refreshData();
                               }}
                               className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                  isEditable ? 'cursor-pointer hover:bg-white/60' : 'cursor-not-allowed opacity-80'
                               } ${
                                  isSelected
                                     ? 'bg-brand-blue/10 border-brand-blue text-navy'
                                     : 'bg-white/40 border-transparent text-navy/40'
                               }`}
                            >
                               <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${isSelected ? 'bg-brand-blue border-brand-blue' : 'border-navy/20 bg-white'}`}>
                                     {isSelected && <Check size={12} className="text-white" />}
                                  </div>
                                  <span className="text-xs font-bold uppercase">{platform}</span>
                               </div>
                               {isSelected && <span className="text-[10px] font-black text-brand-blue">ACTIVE</span>}
                            </div>
                         )
                      })}
                   </div>
                </div>

                {/* Categories (Multi-select) */}
                <div>
                   <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest block mb-3">Phân Loại Danh Mục (Đa chọn)</label>
                   <div className="flex flex-wrap gap-2">
                      {categories.map(cat => {
                         const isPrimary = item.category === cat;
                         const isInTags = item.tags.includes(cat);
                         const isSelected = isPrimary || isInTags;

                         return (
                            <button
                               key={cat}
                               onClick={() => {
                                  if (!isEditable) return;

                                  let newCategory = item.category;
                                  let newTags = [...item.tags];

                                  if (isSelected) {
                                     if (isPrimary) {
                                        // Attempting to remove primary
                                        const nextPrimary = newTags.find(t => categories.includes(t));
                                        if (nextPrimary) {
                                           newCategory = nextPrimary;
                                           newTags = newTags.filter(t => t !== nextPrimary);
                                        } else {
                                           // Don't allow removing last category if strictly enforced, or set to empty if allowed
                                           // For this UI, we'll keep at least one category if possible, or allow deselect if user really wants to clear
                                           return; 
                                        }
                                     } else {
                                        // Remove from tags
                                        newTags = newTags.filter(t => t !== cat);
                                     }
                                  } else {
                                     // Adding
                                     if (!newCategory || !categories.includes(newCategory)) {
                                         newCategory = cat;
                                     } else {
                                         newTags.push(cat);
                                     }
                                  }
                                  
                                  service.updateContent(item.content_id, { category: newCategory, tags: newTags }, currentUser.name);
                                  refreshData();
                               }}
                               className={`px-3 py-2 rounded-lg text-[10px] font-bold border transition-all ${
                                  isSelected
                                     ? 'bg-navy text-white border-navy shadow-md transform scale-105'
                                     : 'bg-white/40 text-navy/60 border-white/40 hover:bg-white/80'
                               } ${!isEditable ? 'cursor-not-allowed opacity-80' : ''}`}
                            >
                               {cat} {isPrimary && '(Chính)'}
                            </button>
                         );
                      })}
                   </div>
                </div>
             </div>

             {/* Moderation Notes (if any) */}
             {(item.moderation_notes || item.status === ContentStatus.REJECTED) && (
               <div className="bg-red-50 p-6 rounded-[32px] border border-red-100 shadow-inner">
                  <h3 className="text-xs font-black text-red-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ShieldAlert size={16} /> Ghi Chú Kiểm Duyệt
                  </h3>
                  <p className="text-sm font-medium text-red-900/80 italic">
                    "{item.moderation_notes || 'Không có ghi chú chi tiết.'}"
                  </p>
               </div>
             )}

          </div>
        </div>
        
        {/* Modals */}
        <MediaPreviewModal item={item} isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
        <ActivityLogModal item={item} isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} service={service} />
        <RejectConfirmationModal 
          isOpen={isRejectModalOpen} 
          onClose={() => { setIsRejectModalOpen(false); setPendingRejectId(null); }} 
          onConfirm={handleConfirmReject} 
        />
      </div>
    );
  };

  const renderDetail = () => renderDetailContent();

  const renderContentList = () => {
    const statusTabs = [
      { id: 'ALL', label: 'Tất cả', icon: <Layers size={14} /> },
      { id: ContentStatus.DRAFT, label: 'Nháp', icon: <Zap size={14} /> },
      { id: ContentStatus.PENDING_REVIEW, label: 'Chờ Duyệt', icon: <Clock size={14} /> },
      { id: ContentStatus.APPROVED, label: 'Đã Duyệt', icon: <ThumbsUp size={14} /> },
      { id: ContentStatus.SCHEDULED, label: 'Đã Lên Lịch', icon: <Calendar size={14} /> },
      { id: ContentStatus.PUBLISHED, label: 'Đã Đăng', icon: <CheckCircle2 size={14} /> },
      { id: ContentStatus.REJECTED, label: 'Từ Chối', icon: <ShieldAlert size={14} /> },
    ];

    const platformTabs = [
      { id: 'ALL', label: 'Tất Cả Nền Tảng', icon: <Monitor size={14} /> },
      { id: SourcePlatform.YAAH_CONNECT, label: 'Yaah Connect', icon: <Globe size={14} /> },
      { id: SourcePlatform.LALALA, label: 'Lalala', icon: <Globe size={14} /> },
      { id: SourcePlatform.VOTEME, label: 'Voteme', icon: <Globe size={14} /> },
    ];

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
               <span className="text-[10px] font-black text-navy/40 uppercase tracking-widest px-2">Trạng Thái Kiểm Duyệt</span>
               {sourceFilter !== 'ALL' && (
                 <button 
                   onClick={() => setSourceFilter('ALL')}
                   className="text-[10px] font-black text-brand-orange uppercase tracking-widest px-2 hover:underline flex items-center gap-1"
                 >
                   <X size={10} /> Xóa lọc nguồn: {sourceFilter}
                 </button>
               )}
            </div>
            <div className="flex flex-wrap gap-2 p-2 glass-card rounded-3xl shadow-sm border-white/20">
              {statusTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    statusFilter === tab.id 
                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-105' 
                    : 'text-navy/60 hover:bg-white/40 hover:text-navy'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-navy/40 uppercase tracking-widest px-2">Bộ Lọc Nền Tảng</span>
            <div className="flex flex-wrap gap-2 p-2 glass-card rounded-3xl shadow-sm border-white/20">
              {platformTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPlatformFilter(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    platformFilter === tab.id 
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30 scale-105' 
                    : 'text-navy/60 hover:bg-white/40 hover:text-navy'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-navy/40 uppercase tracking-widest px-2">Danh Mục Phân Loại (Đa chọn)</span>
            <div className="flex flex-wrap gap-2 p-2 glass-card rounded-3xl shadow-sm border-white/20">
              <button
                onClick={() => setCategoryFilters([])}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  categoryFilters.length === 0 
                  ? 'bg-navy text-white shadow-lg' 
                  : 'text-navy/60 hover:bg-white/40 hover:text-navy'
                }`}
              >
                Tất Cả Danh Mục
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    categoryFilters.includes(cat) 
                    ? 'bg-navy text-white shadow-lg scale-105' 
                    : 'text-navy/60 hover:bg-white/40 hover:text-navy'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4 rounded-[32px] shadow-lg border-white/20">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue group-hover:scale-110 transition-transform" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tiêu đề hoặc ID hệ thống..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white/40 border border-white/40 rounded-2xl focus:ring-4 focus:ring-brand-blue/10 outline-none text-sm font-medium transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="bg-navy/10 p-1.5 rounded-2xl flex items-center shadow-inner border border-white/20">
              <button 
                onClick={() => setTypeFilter(MediaType.VIDEO)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  typeFilter === MediaType.VIDEO ? 'bg-navy text-white shadow-md' : 'text-navy/50 hover:text-navy'
                }`}
              >
                Video
              </button>
              <button 
                onClick={() => setTypeFilter(MediaType.TEXT)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  typeFilter === MediaType.TEXT ? 'bg-navy text-white shadow-md' : 'text-navy/50 hover:text-navy'
                }`}
              >
                Bài Viết
              </button>
            </div>

            <div className="bg-white/40 border border-white/40 p-1.5 rounded-2xl shadow-sm flex items-center">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-brand-blue text-white shadow-md' : 'text-navy hover:bg-white/40'}`}
                title="Dạng Lưới"
              >
                <LayoutGrid size={22} />
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-brand-blue text-white shadow-md' : 'text-navy hover:bg-white/40'}`}
                title="Dạng Bảng"
              >
                <Rows size={22} />
              </button>
            </div>
          </div>
        </div>
        
        {viewMode === 'table' ? (
          <div className="glass-card rounded-[32px] overflow-hidden shadow-2xl border-white/40">
            <ContentTable items={filteredContent} onView={handleNavigateToDetail} />
          </div>
        ) : (
          <ContentGrid items={filteredContent} onView={handleNavigateToDetail} />
        )}
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard items={contentList} onNavigate={handleDashboardNavigation} />;
      case 'content': return renderContentList();
      case 'detail': return renderDetail();
      case 'audit': return (
        <div className="glass-card rounded-[32px] overflow-hidden shadow-2xl border-white/40 animate-in fade-in duration-500">
           <ContentTable items={contentList} onView={handleNavigateToDetail} />
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
