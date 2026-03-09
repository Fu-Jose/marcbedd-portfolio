import React from "react";
import StemRow from "./StemRow";
import { useLanguage } from "../../lib/i18n";
import { useTheme } from "../../lib/theme";

type Stem = {
  id: string;
  label: string;
};

type StemState = {
  volume: number;
  muted: boolean;
};

type MixerPanelProps = {
  stems: Stem[];
  stemState: Record<string, StemState>;
  onToggleMute: (stemId: string) => void;
  onChangeVolume: (stemId: string, volume: number) => void;
};

const MixerPanel: React.FC<MixerPanelProps> = ({
  stems,
  stemState,
  onToggleMute,
  onChangeVolume,
}) => {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const accentClass = isDark ? "text-amber-400" : "text-orange-600";

  if (!stems.length) return null;

  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <div>
          <p
            className={[
              "text-[11px] font-semibold uppercase tracking-[0.24em]",
              accentClass,
            ].join(" ")}
          >
            {language === "it" ? "Stem mixer" : "Stem mixer"}
          </p>
          <p className="text-xs text-muted-foreground">
            {language === "it"
              ? "Attiva e disattiva dialoghi, FX, ambience e musica in tempo reale."
              : "Toggle dialogue, FX, ambience and music in real time."}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {stems.map((stem) => {
          const state = stemState[stem.id] ?? { volume: 1, muted: false };
          return (
            <StemRow
              key={stem.id}
              label={stem.label}
              volume={state.volume}
              muted={state.muted}
              onToggleMute={() => onToggleMute(stem.id)}
              onChangeVolume={(value) => onChangeVolume(stem.id, value)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MixerPanel;
