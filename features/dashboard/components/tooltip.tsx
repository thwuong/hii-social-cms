import { Typography } from '@/shared/ui';

function Tooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col gap-1 border border-white/10 bg-black p-2 shadow-none">
        <Typography variant="tiny" className="text-zinc-500 uppercase">
          {label}
        </Typography>
        <Typography variant="small" className="text-foreground font-mono">
          {payload[0].value} ĐƠN VỊ
        </Typography>
      </div>
    );
  }
  return null;
}

export default Tooltip;
