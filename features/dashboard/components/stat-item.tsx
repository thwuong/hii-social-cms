import { Typography } from '@/shared/ui';

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1 font-mono">
      <Typography variant="p" className="text-zinc-500 uppercase">
        {label}
      </Typography>
      <Typography variant="p" className="font-medium text-white">
        {value}
      </Typography>
    </div>
  );
}

export default StatItem;
