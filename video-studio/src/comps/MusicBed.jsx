import {Audio, staticFile, interpolate, useVideoConfig} from 'remotion';

// Lizenzfreies Marken-Musikbett (selbst synthetisiert, public/music/brand-bed.wav).
// Dezent unter den Motion-Graphics; Fade in/out, Lautstandard ~0.26.
export const MusicBed = ({volume = 0.5}) => {
  const {durationInFrames} = useVideoConfig();
  const fadeOut = Math.max(16, durationInFrames - 22);
  return (
    <Audio
      src={staticFile('music/brand-bed.wav')}
      volume={(f) =>
        interpolate(f, [0, 16, fadeOut, durationInFrames], [0, volume, volume, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      }
    />
  );
};
