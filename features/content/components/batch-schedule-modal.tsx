import { cn } from '@/lib/utils';
import {
  Button,
  Calendar,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Typography,
} from '@/shared/ui';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, Clock, X } from 'lucide-react';
import { useState } from 'react';

interface BatchScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (scheduledTime: string) => void;
  selectedCount: number;
}

/**
 * Batch Schedule Modal Component
 *
 * Modal để chọn thời gian lên lịch publish nhiều content cùng lúc
 * Style: Carbon Kinetic
 */
export function BatchScheduleModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
}: BatchScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');

  if (!isOpen) return null;

  // Get minimum datetime (current time)
  const now = new Date();
  const minTime = now.toTimeString().slice(0, 5);

  const handleClose = () => {
    setSelectedDate(undefined);
    setSelectedTime('');
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    const [hours, minutes] = selectedTime.split(':');
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    // Validate future time
    if (scheduledDateTime <= now) {
      return;
    }

    const scheduledTimestamp = scheduledDateTime.toISOString();
    onConfirm(scheduledTimestamp);
    handleClose();
  };

  const getScheduledDateTime = () => {
    if (!selectedDate || !selectedTime) return null;
    const [hours, minutes] = selectedTime.split(':');
    const dateTime = new Date(selectedDate);
    dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return dateTime;
  };

  const scheduledDateTime = getScheduledDateTime();
  const isValidSchedule = scheduledDateTime ? scheduledDateTime > now : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-white/20 bg-black p-8 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-500 transition-colors hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <Typography variant="h3" className="mb-6 font-bold text-white uppercase">
          LÊN LỊCH ĐĂNG NHIỀU VIDEO
        </Typography>

        {/* Selection Info */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <Typography variant="small" className="mb-2 text-zinc-400">
            Số lượng video đã chọn:
          </Typography>
          <Typography variant="h4" className="text-white">
            {selectedCount} video
          </Typography>
          <Typography variant="tiny" className="mt-2 text-zinc-500">
            Tất cả video sẽ được lên lịch đăng cùng thời điểm
          </Typography>
        </div>

        {/* Date & Time Selection */}
        <div className="space-y-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Typography variant="tiny" className="block font-mono text-zinc-400 uppercase">
              <CalendarIcon className="mr-1 inline-block h-3 w-3" />
              Ngày Đăng
            </Typography>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start border-white/20 bg-black/50 text-left font-mono text-white hover:bg-white/5 hover:text-white',
                    !selectedDate && 'text-zinc-500'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, 'PPP', { locale: vi })
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto border-white/20 bg-black/95 p-0 backdrop-blur-md">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="border-0"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Input */}
          <div className="space-y-2">
            <label
              htmlFor="batch-schedule-time"
              className="block font-mono text-xs text-zinc-400 uppercase"
            >
              <Clock className="mr-1 inline-block h-3 w-3" />
              Giờ Đăng
            </label>
            <Input
              id="batch-schedule-time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              min={
                selectedDate && selectedDate.toDateString() === now.toDateString()
                  ? minTime
                  : undefined
              }
              className="w-full border-white/20 bg-black/50 font-mono text-white"
            />
          </div>

          {/* Preview */}
          {scheduledDateTime && (
            <div className="border-l-2 border-white/20 bg-white/5 p-3">
              <Typography variant="tiny" className="mb-1 text-zinc-500">
                THỜI GIAN ĐÃ CHỌN:
              </Typography>
              <Typography variant="small" className="font-mono text-white">
                {format(scheduledDateTime, "EEEE, d MMMM yyyy, HH:mm 'giờ'", {
                  locale: vi,
                })}
              </Typography>
              {!isValidSchedule && (
                <Typography variant="tiny" className="mt-2 text-red-400">
                  ⚠ Thời gian phải ở tương lai
                </Typography>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="flex-1 border border-white/20 text-white hover:bg-white/10"
          >
            HỦY
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={!isValidSchedule}
            className="flex-1 bg-white text-black hover:bg-zinc-200 disabled:opacity-50"
          >
            XÁC NHẬN LÊN LỊCH
          </Button>
        </div>

        {/* Info */}
        <div className="mt-4 border-t border-white/10 pt-4">
          <Typography variant="tiny" className="text-zinc-600">
            💡 {selectedCount} video sẽ được tự động đăng vào thời gian đã chọn
          </Typography>
        </div>
      </div>
    </div>
  );
}
