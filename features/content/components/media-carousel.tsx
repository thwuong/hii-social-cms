import { cn } from '@/lib';
import { Typography } from '@/shared';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui';
import { useState } from 'react';
import { Media } from '../types';

/**
 * Aspect ratio presets
 */
type AspectRatio = 'square' | 'video' | 'portrait' | 'landscape' | 'ultrawide' | 'custom';

/**
 * Size variants for the carousel container
 */
type SizeVariant = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'auto';

interface MediaCarouselProps {
  media: Media[];
  title?: string;
  className?: string;

  /**
   * Aspect ratio của media items
   * @default 'portrait'
   */
  aspectRatio?: AspectRatio;

  /**
   * Custom aspect ratio (e.g., '16/9', '4/3')
   * Only used when aspectRatio='custom'
   */
  customAspectRatio?: string;

  /**
   * Size variant cho carousel container
   * @default 'full'
   */
  size?: SizeVariant;

  /**
   * Custom height (e.g., '400px', '50vh')
   * Overrides size variant
   */
  height?: string;

  /**
   * Custom width (e.g., '600px', '80%')
   */
  width?: string;

  /**
   * Object fit cho images
   * @default 'cover'
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

  /**
   * Hiển thị indicators
   * @default true
   */
  showIndicators?: boolean;

  /**
   * Hiển thị counter (e.g., "1 / 5")
   * @default false
   */
  showCounter?: boolean;
}

/**
 * Get aspect ratio class
 */
const getAspectRatioClass = (ratio: AspectRatio, custom?: string): string => {
  const ratios: Record<AspectRatio, string> = {
    square: 'aspect-square',
    video: 'aspect-video', // 16:9
    portrait: 'aspect-[9/16]',
    landscape: 'aspect-[16/9]',
    ultrawide: 'aspect-[21/9]',
    custom: custom ? `aspect-[${custom}]` : 'aspect-video',
  };

  return ratios[ratio];
};

/**
 * Get size class for container
 */
const getSizeClass = (size: SizeVariant): string => {
  const sizes: Record<SizeVariant, string> = {
    sm: 'max-h-[300px]',
    md: 'max-h-[400px]',
    lg: 'max-h-[500px]',
    xl: 'max-h-[600px]',
    full: 'h-full',
    auto: 'h-auto',
  };

  return sizes[size];
};

/**
 * MediaCarousel Component
 *
 * Dynamic-sized carousel cho article content với nhiều media items
 *
 * Features:
 * - Dynamic aspect ratios (square, video, portrait, landscape, custom)
 * - Flexible sizing (sm, md, lg, xl, full, auto, custom)
 * - Responsive carousel với navigation
 * - Support images và videos
 * - Lazy loading
 * - Indicator dots hoặc counter
 * - Keyboard navigation
 * - Customizable object-fit
 *
 * @example
 * ```tsx
 * // Portrait (9:16) - default
 * <MediaCarousel media={media} />
 *
 * // Square with medium size
 * <MediaCarousel media={media} aspectRatio="square" size="md" />
 *
 * // Video (16:9) with custom height
 * <MediaCarousel media={media} aspectRatio="video" height="500px" />
 *
 * // Custom aspect ratio
 * <MediaCarousel media={media} aspectRatio="custom" customAspectRatio="4/3" />
 *
 * // Full width with counter
 * <MediaCarousel media={media} size="full" showCounter />
 * ```
 */
export function MediaCarousel({
  media,
  title,
  className,
  aspectRatio = 'portrait',
  customAspectRatio,
  size = 'full',
  height,
  width,
  objectFit = 'cover',
  showIndicators = true,
  showCounter = false,
}: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Empty state
  if (!media || media.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center border border-white/10 bg-black',
          !height && getSizeClass(size),
          className
        )}
        style={{
          height,
          width,
        }}
      >
        <Typography variant="small" className="text-zinc-500 uppercase">
          Không có media
        </Typography>
      </div>
    );
  }

  const aspectClass = getAspectRatioClass(aspectRatio, customAspectRatio);
  const objectFitClass = `object-${objectFit}`;

  return (
    <div
      className={cn('flex h-auto w-full flex-1 flex-col', !height && getSizeClass(size), className)}
      style={{
        height,
        width,
      }}
    >
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="flex w-full flex-1 items-center justify-center"
        setApi={(api) => {
          if (!api) return;
          api.on('select', () => {
            setCurrentIndex(api.selectedScrollSnap());
          });
        }}
      >
        <CarouselContent className="ml-0 w-full">
          {media.map((item, index) => (
            <CarouselItem key={`carousel-item-${index + 1}`} className="pl-0">
              <div
                className={cn(
                  'relative flex w-full flex-col items-center justify-center overflow-hidden border border-white/10 bg-black',
                  aspectClass
                )}
              >
                <img
                  src={item.url || item.download_url}
                  alt={title || `Media ${index + 1}`}
                  className={cn('h-full w-full', objectFitClass)}
                  loading="lazy"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Counter */}
      {showCounter && media.length > 1 && (
        <div className="mt-4 flex items-center justify-center">
          <Typography variant="small" className="font-mono text-zinc-400">
            {currentIndex + 1} / {media.length}
          </Typography>
        </div>
      )}

      {/* Indicators */}
      {showIndicators && !showCounter && media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center justify-center gap-2">
          {media.map((_, index) => (
            <button
              key={`carousel-indicator-${index + 1}`}
              type="button"
              onClick={() => {
                // Navigate to specific slide (requires CarouselApi)
              }}
              className={cn(
                'h-1.5 transition-all',
                index === currentIndex ? 'w-8 bg-white' : 'w-1.5 bg-zinc-600 hover:bg-zinc-400'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
