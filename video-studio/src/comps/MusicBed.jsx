import {Audio, staticFile, interpolate, useVideoConfig} from 'remotion';

// Lizenzfreies Marken-Musikbett (selbst synthetisiert, public/music/brand-bed.wav).
// Dezent unter den Motion-Graphics; Fade in/out, Lautstandard ~0.26.
// `file` nur setzen, wenn das Video länger als 30 s ist — dann 'music/brand-bed-long.wav'
// (70 s). <Audio> hat in Remotion 4.0.290 kein loop-Prop, ein längeres Bett ist die
// saubere Lösung. Neue Längen erzeugen: node make-music.mjs <sekunden> <dateiname>
export const MusicBed = ({volume = 0.5, file = 'music/brand-bed.wav'}) => {
  const {durationInFrames} = useVideoConfig();
  const fadeOut = Math.max(16, durationInFrames - 22);
  return (
    <Audio
      src={staticFile(file)}
      volume={(f) =>
        interpolate(f, [0, 16, fadeOut, durationInFrames], [0, volume, volume, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      }
    />
  );
};
