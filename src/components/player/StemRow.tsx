import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '@/lib/theme';

type StemRowProps = {
  label: string;
  volume: number;
  muted: boolean;
  onToggleMute: () => void;
  onChangeVolume: (value: number) => void;
};

const StemRow: React.FC<StemRowProps> = ({
  label,
  volume,
  muted,
  onToggleMute,
  onChangeVolume,
}) => {
  const displayVolume = muted ? 0 : volume;
  const { isDark } = useTheme();

  const accentClass = isDark ? 'text-white' : 'text-black';
  const borderClass = isDark ? 'border-white' : 'border-white';

  return (
    <div className='flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2.5 text-xs ring-1 ring-border/70'>
      <button
        type='button'
        onClick={onToggleMute}
        className={[
          'inline-flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-semibold uppercase tracking-[0.16em] transition',
          muted
            ? 'border-border/80 bg-background/70 text-muted-foreground hover:border-primary/50 hover:text-primary'
            : 'border-primary bg-primary/15 text-primary hover:bg-primary/25',
        ].join(' ')}
      >
        {muted ? (
          <VolumeX className='h-3.5 w-3.5' />
        ) : (
          <Volume2 className='h-3.5 w-3.5' />
        )}
      </button>

      <div className='min-w-0 flex-1 space-y-1'>
        <p
          className={[
            'truncate text-[11px] font-medium uppercase tracking-[0.18em]',
            accentClass,
          ].join(' ')}
        >
          {label}
        </p>
        <input
          type='range'
          min={0}
          max={1}
          step={0.01}
          value={displayVolume}
          onChange={(event) => onChangeVolume(Number(event.target.value))}
          className={`h-1.5 w-full cursor-pointer appearance-none rounded-full bg-linear-to-r from-primary/20 via-primary to-primary accent-primary 
    /* Webkit (Chrome, Safari, Edge) */
    [&::-webkit-slider-thumb]:h-4 
    [&::-webkit-slider-thumb]:w-4 
    [&::-webkit-slider-thumb]:appearance-none 
    [&::-webkit-slider-thumb]:rounded-full 
    [&::-webkit-slider-thumb]:bg-primary-foreground 
    [&::-webkit-slider-thumb]:border 
    [&::-webkit-slider-thumb]:${borderClass}
    
    /* Firefox */
    [&::-moz-range-thumb]:h-4 
    [&::-moz-range-thumb]:w-4 
    [&::-moz-range-thumb]:rounded-full 
    [&::-moz-range-thumb]:bg-primary-foreground 
    [&::-moz-range-thumb]:border 
    [&::-moz-range-thumb]:${borderClass}`}
        />
      </div>

      <div className='w-10 text-right text-[10px] font-medium tabular-nums text-muted-foreground'>
        {Math.round(displayVolume * 100)}%
      </div>
    </div>
  );
};

export default StemRow;
