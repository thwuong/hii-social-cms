import { ContentItem, STATUS_LABELS } from '@/shared';
import { Typography } from '@/shared/ui';
import { AlertTriangle } from 'lucide-react';

type WorkflowStepsProps = {
  isRejected: boolean;
  item: ContentItem;
  workflowSteps: any[];
  activeIndex: number;
};
function WorkflowSteps({ isRejected, item, workflowSteps, activeIndex }: WorkflowStepsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Typography variant="small" className="text-muted-foreground font-medium">
        TRẠNG THÁI // QUY TRÌNH
      </Typography>

      {isRejected && (
        <div className="flex items-center gap-2 border border-red-500/50 bg-red-950/20 p-2 font-mono text-xs text-red-400">
          <AlertTriangle size={16} /> Nội dung bị từ chối:{' '}
          {item.moderation_notes || 'Phát hiện vi phạm'}
        </div>
      )}

      <div className="relative mt-4 mb-2 select-none">
        <div className="relative z-10 flex items-center justify-between">
          {workflowSteps.map((step, index) => {
            let stateClass = 'bg-[#1a1a1a] border-zinc-700 text-zinc-600';
            if (index < activeIndex) stateClass = 'bg-white border-white text-white';
            if (index === activeIndex) {
              if (isRejected)
                stateClass =
                  'bg-red-500 border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
              else
                stateClass =
                  'bg-[#00ff66] border-[#00ff66] text-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.5)]';
            }
            if (isRejected && index === 1) stateClass = 'bg-red-500 border-red-500 text-red-500';

            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div
                  className={`h-2 w-2 rotate-45 transform border transition-colors duration-500 ${
                    stateClass.split(' ')[0]
                  } ${stateClass.split(' ')[1]}`}
                />
                <span
                  className={`text-xs tracking-widest transition-colors duration-500 ${
                    index <= activeIndex
                      ? isRejected && index === activeIndex
                        ? 'text-red-500'
                        : 'text-white'
                      : 'text-zinc-700'
                  }`}
                >
                  {isRejected && activeIndex === index ? STATUS_LABELS.rejected : step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="absolute top-1 left-0 -z-0 h-[1px] w-full bg-[#1a1a1a]" />
        <div
          className={`absolute top-1 left-0 -z-0 h-[1px] transition-all duration-700 ${
            isRejected ? 'bg-red-900' : 'bg-white'
          }`}
          style={{ width: `${(activeIndex / (workflowSteps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default WorkflowSteps;
