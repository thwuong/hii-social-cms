
import React from 'react';
import { ContentItem, MediaType } from '../types';
import { STATUS_LABELS } from '../constants';
import { Play, FileText } from 'lucide-react';

interface ContentGridProps {
  items: ContentItem[];
  onView: (id: string) => void;
}

const ContentGrid: React.FC<ContentGridProps> = ({ items, onView }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[2px] bg-white/10 border border-white/10 p-[1px]">
      {items.map((item) => {
        const isVideo = item.media_type === MediaType.VIDEO;
        
        return (
          <div 
            key={item.content_id} 
            onClick={() => onView(item.content_id)}
            className="group relative bg-black p-6 cursor-pointer overflow-hidden transition-colors hover:bg-[#111]"
          >
            {/* Hover Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20"></div>

            {/* Meta */}
            <div className="flex justify-between items-center mb-6 font-mono text-[10px] text-zinc-500">
                <span>ID: {item.content_id.split('-')[1] || item.content_id}</span>
                <span className="uppercase">{new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>

            {/* Image/Media */}
            <div className="aspect-[16/10] bg-[#111] mb-6 relative overflow-hidden border border-white/5 group-hover:border-zinc-600 transition-colors duration-500">
                {isVideo || item.media_type === MediaType.IMAGE ? (
                     <img 
                        src={`https://picsum.photos/seed/${item.content_id}/400/250`} 
                        alt={item.title} 
                        className="w-full h-full object-cover filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                     />
                ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                        <FileText className="text-zinc-600 group-hover:text-white transition-colors" size={32} />
                    </div>
                )}
                
                {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 bg-black/50 backdrop-blur border border-white/20 flex items-center justify-center rounded-none group-hover:bg-white/20 transition-all">
                             <Play size={12} className="text-white fill-white" />
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div>
               <h3 className="text-lg font-bold text-white leading-tight mb-2 line-clamp-2 group-hover:text-white transition-colors">
                  {item.title}
               </h3>
               <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-6 h-8">
                  {item.short_description}
               </p>
               
               <div className="inline-block px-2 py-1 border border-zinc-700 text-[10px] font-mono text-zinc-300 uppercase">
                  {STATUS_LABELS[item.status]} / {item.source_platform}
               </div>
            </div>
          </div>
        );
      })}
      {items.length === 0 && (
        <div className="col-span-full py-20 text-center bg-black">
          <p className="font-mono text-sm text-zinc-500 uppercase">KHÔNG TÌM THẤY TÍN HIỆU</p>
        </div>
      )}
    </div>
  );
};

export default ContentGrid;
