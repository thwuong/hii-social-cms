import { Typography } from '@/shared/ui';

function KPICard({
  count,
  subtext,
  onClick,
}: {
  count: number;
  subtext: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group hover:bg-background relative cursor-pointer overflow-hidden border border-white/10 bg-black p-6 transition-all duration-500"
    >
      {/* Hover Top Border Effect */}
      <div className="absolute top-0 left-0 h-[1px] w-full origin-left scale-x-0 transform bg-white transition-transform duration-500 group-hover:scale-x-100" />

      <Typography variant="small" className="mb-4 text-zinc-500 uppercase" as="p">
        {subtext}
      </Typography>

      <Typography variant="h2" className="mb-2 text-white">
        {count}
      </Typography>
    </div>
  );
}
export default KPICard;
