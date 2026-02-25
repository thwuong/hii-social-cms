import { Toaster as SonnerToaster } from 'sonner';

/**
 * Carbon Kinetic Toast Component
 *
 * Sử dụng Sonner với custom style
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors={false}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'group toast border border-white/10 bg-black/95 backdrop-blur-md font-mono text-sm text-white shadow-2xl',
          title: 'font-mono text-xs uppercase tracking-wider',
          description: 'font-mono text-[10px] text-zinc-400',
          actionButton: 'bg-white text-black font-mono text-xs uppercase hover:bg-zinc-200',
          cancelButton:
            'bg-transparent border border-white/20 text-white font-mono text-xs uppercase',
          closeButton: 'bg-transparent border border-white/20 text-white hover:bg-white/10',
          success: 'border-[#00ff66] bg-black/95',
          error: 'border-[#ff3e3e] bg-black/95',
          warning: 'border-yellow-500 bg-black/95',
          info: 'border-white/20 bg-black/95',
        },
      }}
    />
  );
}
