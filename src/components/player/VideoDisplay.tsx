import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import { useLanguage } from "../../lib/i18n";

type VideoDisplayProps = {
  src: string;
  title: string;
  onPlay: () => void;
  onPause: () => void;
  onTimeUpdate: () => void;
  onSeeking: () => void;
  onSeeked: () => void;
  onRateChange: () => void;
};

const VideoDisplay = forwardRef<HTMLVideoElement, VideoDisplayProps>(
  (
    {
      src,
      title,
      onPlay,
      onPause,
      onTimeUpdate,
      onSeeking,
      onSeeked,
      onRateChange,
    },
    ref: ForwardedRef<HTMLVideoElement>,
  ) => {
    const { language } = useLanguage();

    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/90 ring-1 ring-border/60">
        <video
          ref={ref}
          className="h-full w-full object-cover"
          src={src}
          controls
          playsInline
          onPlay={onPlay}
          onPause={onPause}
          onTimeUpdate={onTimeUpdate}
          onSeeking={onSeeking}
          onSeeked={onSeeked}
          onRateChange={onRateChange}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/40 to-transparent p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
            {language === "it" ? "Sound design cinematografico" : "Cinematic sound design"}
          </p>
          <h1 className="mt-1 text-sm font-medium text-white/90 sm:text-base">
            {title}
          </h1>
        </div>
      </div>
    );
  },
);

VideoDisplay.displayName = "VideoDisplay";

export default VideoDisplay;
