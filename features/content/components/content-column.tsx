import React from 'react';

type ContentColumnProps = {
  allSelected: boolean;
  onToggleAll?: () => void;
};
function ContentColumn({ allSelected, onToggleAll }: ContentColumnProps) {
  return (
    <tr className="border-b border-white/10">
      {onToggleAll && (
        <th className="h-10 w-[50px] px-6 text-left align-middle">
          {onToggleAll ? (
            <input
              type="checkbox"
              className="h-3 w-3 cursor-pointer rounded-none border-zinc-700 bg-transparent accent-white"
              checked={allSelected}
              onChange={onToggleAll}
            />
          ) : (
            <div className="h-3 w-3" />
          )}
        </th>
      )}
      <th className="h-10 px-6 text-left align-middle font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
        Tài Nguyên
      </th>
      <th className="h-10 px-6 text-left align-middle font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
        Loại
      </th>
      <th className="h-10 px-6 text-left align-middle font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
        Nguồn
      </th>
      <th className="h-10 px-6 text-left align-middle font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
        Trạng Thái
      </th>
      <th className="h-10 px-6 text-right align-middle font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
        Thao Tác
      </th>
    </tr>
  );
}

export default ContentColumn;
