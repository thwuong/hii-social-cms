import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Typography, Button } from '../ui';

function DisplayError({ error, resetErrorBoundary }: FallbackProps) {
  const handleGoBack = () => {
    resetErrorBoundary();
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Main Card */}
      <div className="relative border border-white/10 bg-black p-12 shadow-2xl">
        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-white" />
        <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-white" />
        <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-white" />
        <div className="absolute right-0 bottom-0 h-4 w-4 border-r-2 border-b-2 border-white" />

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <AlertTriangle className="h-24 w-24 text-red-500" strokeWidth={1.5} />
              <div className="absolute inset-0 animate-ping">
                <AlertTriangle className="h-24 w-24 text-red-500 opacity-20" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Title */}
          <Typography
            variant="h2"
            className="mb-4 font-mono text-2xl font-bold tracking-wider text-white uppercase"
          >
            Đã xảy ra lỗi
          </Typography>

          {/* Description */}
          <Typography className="mb-12 font-mono text-zinc-400">
            Đã xảy ra lỗi không xác định.
            <br />
            Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu lỗi vẫn tiếp tục xảy ra.
          </Typography>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/">
              <Button
                size="lg"
                className="group min-w-[200px] border-2 border-white bg-white font-mono font-bold tracking-wider text-black uppercase transition-all hover:bg-black hover:text-white"
              >
                <Home className="mr-2 h-5 w-5" />
                TRANG CHỦ
              </Button>
            </Link>

            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={handleGoBack}
              className="group min-w-[200px] border-2 border-white/20 bg-transparent font-mono font-bold tracking-wider text-white uppercase transition-all hover:border-white hover:bg-white hover:text-black"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              QUAY LẠI
            </Button>
          </div>

          {/* Error Code */}
          <div className="mt-12 border-t border-white/10 pt-6">
            <Typography variant="tiny" className="font-mono text-[9px] text-zinc-700 uppercase">
              ERROR_CODE :: 404_PAGE_NOT_FOUND :: HII_SOCIAL_SYSTEM
            </Typography>
          </div>
        </div>

        {/* Scanline Effect */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,transparent_50%,rgba(255,255,255,0.03)_50%)] bg-[length:100%_4px]" />
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-center">
        <Typography variant="small" className="font-mono text-xs text-zinc-600">
          Nếu bạn nghĩ đây là lỗi hệ thống, vui lòng liên hệ với quản trị viên.
        </Typography>
      </div>
    </div>
  );
}

export default DisplayError;
